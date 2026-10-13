-- ═══════════════════════════════════════════════════════════
-- MASSUP + Melati — user_state : écriture conditionnelle (13/10/2026)
-- Avant : chaque appareil tenait son propre compteur (profile.rev / rev) et faisait un upsert
-- aveugle → une copie périmée (Safari vs icône, Mac) pouvait écraser le snapshot cloud.
-- Maintenant : le SERVEUR numérote chaque version (colonne rev). Un appareil n'écrit que s'il
-- part de la dernière version qu'il a vue (user_state_put(data, base_rev)) ; sinon il reçoit
-- « conflit », relit le cloud, fusionne, et renvoie.
-- Idempotent. Appliqué par Claude via le MCP Supabase.
-- ═══════════════════════════════════════════════════════════

-- Copie de sécurité des snapshots avant la bascule (une seule fois)
create table if not exists public.user_state_backup_20261013 as
  select user_id, data, updated_at, now() as copied_at from public.user_state;
alter table public.user_state_backup_20261013 enable row level security;
revoke all on public.user_state_backup_20261013 from anon, authenticated;

alter table public.user_state add column if not exists rev bigint not null default 0;

-- Une écriture qui ne passe pas par user_state_put (ancienne version de l'app encore ouverte)
-- fait quand même avancer rev : les autres appareils voient que le cloud a changé.
create or replace function public.user_state_bump_rev()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and new.rev is not distinct from old.rev then
    new.rev := old.rev + 1;
  end if;
  return new;
end $$;

drop trigger if exists user_state_bump_rev on public.user_state;
create trigger user_state_bump_rev before update on public.user_state
  for each row execute function public.user_state_bump_rev();

-- Écriture conditionnelle : {ok:true, rev} si p_base_rev est la version actuelle (ou si la
-- ligne n'existe pas encore), sinon {ok:false, rev:<version actuelle>} sans rien écrire.
-- security invoker : la RLS « own » de user_state s'applique (chacun sa ligne).
create or replace function public.user_state_put(p_data jsonb, p_base_rev bigint)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  uid uuid := auth.uid();
  new_rev bigint;
  cur_rev bigint;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if p_data is null or jsonb_typeof(p_data) <> 'object' then
    raise exception 'invalid snapshot' using errcode = '22023';
  end if;
  update public.user_state
     set data = p_data, rev = rev + 1, updated_at = now()
   where user_id = uid and rev = coalesce(p_base_rev, -1)
  returning rev into new_rev;
  if new_rev is not null then
    return jsonb_build_object('ok', true, 'rev', new_rev);
  end if;
  select rev into cur_rev from public.user_state where user_id = uid;
  if cur_rev is null then
    insert into public.user_state (user_id, data, rev, updated_at)
    values (uid, p_data, 1, now())
    on conflict (user_id) do nothing
    returning rev into new_rev;
    if new_rev is not null then
      return jsonb_build_object('ok', true, 'rev', new_rev);
    end if;
    select rev into cur_rev from public.user_state where user_id = uid;
  end if;
  return jsonb_build_object('ok', false, 'rev', cur_rev);
end $$;

revoke all on function public.user_state_put(jsonb, bigint) from public, anon;
grant execute on function public.user_state_put(jsonb, bigint) to authenticated;

-- Contrôle :
-- select user_id, rev, updated_at from public.user_state;
-- select count(*) from public.user_state_backup_20261013;
