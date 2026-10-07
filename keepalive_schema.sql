-- ─────────────────────────────────────────────────────────────
-- KEEP-ALIVE — table dédiée pour générer un vrai WRITE quotidien
-- qui maintient le projet Supabase free éveillé (anti-pause 7j).
--
-- À exécuter UNE FOIS dans Supabase → SQL Editor → New query → Run.
-- Sans danger : table isolée, une seule ligne, aucune donnée perso.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.keepalive (
  id         int primary key default 1,
  last_ping  timestamptz not null default now(),
  constraint keepalive_single_row check (id = 1)
);

-- garantit l'existence de la ligne unique (id = 1)
insert into public.keepalive (id) values (1) on conflict (id) do nothing;

alter table public.keepalive enable row level security;

-- autorise la clé anon à mettre à jour la ligne (= activité write réelle)
drop policy if exists "anon update keepalive" on public.keepalive;
create policy "anon update keepalive" on public.keepalive
  for update using (true) with check (true);

-- lecture libre (facultatif, utile pour debug)
drop policy if exists "anon select keepalive" on public.keepalive;
create policy "anon select keepalive" on public.keepalive
  for select using (true);
