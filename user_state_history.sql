-- ═══════════════════════════════════════════════════════════
-- MASSUP + Melati — user_state_history : filet de sécurité côté serveur (02/11/2026)
-- Avant chaque écrasement du snapshot (user_state), le serveur garde une copie de l'ANCIENNE
-- version : au plus une par heure et par compte, et TOUJOURS si la nouvelle version est
-- nettement plus petite (moins de 60 % de l'ancienne = suspicion de perte de données).
-- Conservation : tout sur 7 jours, puis une copie par jour jusqu'à 60 jours.
-- Les apps ne lisent ni n'écrivent cette table (aucun accès anon / authenticated) : elle sert
-- seulement à restaurer à la main (Claude via le MCP) après un incident.
-- Une erreur ici ne bloque JAMAIS la sauvegarde (exception attrapée → warning).
-- Idempotent. Appliqué par Adrien le 02/11/2026 ; copie « initial » des 2 comptes ajoutée par Claude via le MCP le même jour.
-- ═══════════════════════════════════════════════════════════

create table if not exists public.user_state_history (
  id bigserial primary key,
  user_id uuid not null,
  rev bigint,
  data jsonb not null,
  data_updated_at timestamptz,
  saved_at timestamptz not null default now(),
  reason text
);
create index if not exists user_state_history_user_saved on public.user_state_history (user_id, saved_at desc);
alter table public.user_state_history enable row level security;
revoke all on public.user_state_history from anon, authenticated;

create or replace function public.user_state_keep_history()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  last_at timestamptz;
  old_sz int;
  new_sz int;
  why text;
begin
  begin
    if old.data is null or old.data is not distinct from new.data then
      return new;
    end if;
    old_sz := length(old.data::text);
    new_sz := length(new.data::text);
    select max(saved_at) into last_at from public.user_state_history where user_id = old.user_id;
    if new_sz < old_sz * 0.6 then
      why := 'shrink';
    elsif last_at is null or last_at < now() - interval '1 hour' then
      why := 'hourly';
    end if;
    if why is not null then
      insert into public.user_state_history (user_id, rev, data, data_updated_at, reason)
      values (old.user_id, old.rev, old.data, old.updated_at, why);
      -- Ménage : > 60 jours supprimé ; entre 7 et 60 jours, une seule copie par jour (la plus récente)
      delete from public.user_state_history h
       where h.user_id = old.user_id and h.saved_at < now() - interval '60 days';
      delete from public.user_state_history h
       where h.user_id = old.user_id
         and h.saved_at < now() - interval '7 days'
         and exists (select 1 from public.user_state_history k
                      where k.user_id = h.user_id
                        and k.saved_at::date = h.saved_at::date
                        and k.saved_at > h.saved_at);
    end if;
  exception when others then
    raise warning 'user_state_keep_history: %', sqlerrm;
  end;
  return new;
end $$;

revoke all on function public.user_state_keep_history() from public, anon, authenticated;

create or replace trigger user_state_keep_history before update on public.user_state
  for each row execute function public.user_state_keep_history();

-- Contrôle :
-- select user_id, count(*), max(saved_at), pg_size_pretty(sum(pg_column_size(data))::bigint)
--   from public.user_state_history group by user_id;
-- Restauration (à la main, après accord) : relire la copie voulue, puis la réécrire via
-- user_state_put ou un update ciblé de user_state.data.
