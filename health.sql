-- ─────────────────────────────────────────────────────────────
-- 👟 PAS & ACTIVITÉ (29/09/2026) — données de l'app Santé d'Apple, envoyées par un Raccourci iOS.
-- Installation / mise à jour : Supabase → SQL Editor → New query → coller → Run. Sans danger, rejouable.
--
-- Principe : chaque compte (Adrien, Melati) a un CODE secret (health_tokens), créé par l'app.
-- Pour le détail horaire, le Raccourci peut aussi envoyer 24 lignes par jour avec k=steps_h00…steps_h23.
-- Réexécuter ce script après une mise à jour : health_push() accepte alors ces nouvelles mesures.
-- Le Raccourci appelle https://massup-five.vercel.app/api/health?t=CODE, qui appelle health_push()
-- → la fonction ne peut écrire QUE dans les jours du compte à qui appartient le code.
-- Lecture : chacun ne lit que ses propres jours (RLS).
-- ─────────────────────────────────────────────────────────────

create table if not exists public.health_tokens (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  token      text unique not null,
  app        text,
  created_at timestamptz not null default now()
);
alter table public.health_tokens enable row level security;
drop policy if exists "health_tokens own" on public.health_tokens;
create policy "health_tokens own" on public.health_tokens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.health_days (
  user_id    uuid not null references auth.users(id) on delete cascade,
  d          date not null,
  k          text not null,          -- steps · steps_h00…steps_h23 · kcal · km · exo · floors
  v          numeric not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, d, k)
);
alter table public.health_days enable row level security;
drop policy if exists "health_days own read" on public.health_days;
create policy "health_days own read" on public.health_days
  for select using (auth.uid() = user_id);

-- Écriture par code (appelée par /api/health avec la clé anon). Valeurs reçues en TEXTE et nettoyées ici
-- (« 8 123 », « 8123,0 », « 4,2 km »… : on garde chiffres, virgule, point).
create or replace function public.health_push(p_token text, p_rows jsonb)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid; n int := 0; r jsonb; dd date; kk text; raw text; vv numeric;
begin
  select user_id into uid from public.health_tokens where token = p_token;
  if uid is null then raise exception 'code inconnu'; end if;
  for r in select * from jsonb_array_elements(coalesce(p_rows, '[]'::jsonb)) loop
    begin
      dd  := left(r->>'d', 10)::date;
      kk  := lower(coalesce(nullif(r->>'k', ''), 'steps'));
      if kk not in ('steps','kcal','km','exo','floors') and kk !~ '^steps_h([01][0-9]|2[0-3])$' then continue; end if;
      raw := replace(regexp_replace(coalesce(r->>'v', ''), '[^0-9,.]', '', 'g'), ',', '.');
      if raw = '' then continue; end if;
      vv  := raw::numeric;
      if dd > current_date + 1 or dd < date '2020-01-01' or vv < 0 then continue; end if;
      insert into public.health_days (user_id, d, k, v, updated_at)
        values (uid, dd, kk, vv, now())
        on conflict (user_id, d, k) do update set v = excluded.v, updated_at = now();
      n := n + 1;
    exception when others then
      null; -- une ligne illisible ne bloque pas les autres
    end;
  end loop;
  return n;
end $$;

revoke all on function public.health_push(text, jsonb) from public;
grant execute on function public.health_push(text, jsonb) to anon, authenticated;

-- Vérif : select k, count(*), max(d) from public.health_days group by k;
