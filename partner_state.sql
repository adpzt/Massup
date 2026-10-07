-- ═══════════════════════════════════════════════════════════════
-- MASSUP — partner_state : « Nous deux 💞 » (26/08/2026)
-- Chaque compte (Adrien = app 'adrien', Melati = app 'melati') pousse ici un
-- RÉSUMÉ en lecture seule de sa progression (compteurs de la semaine, jours du
-- calendrier, bilans de séance/mobilité) + le petit mot laissé à l'autre.
-- L'autre compte le LIT (mode observation) mais ne peut JAMAIS l'écrire :
--   · SELECT : tout utilisateur connecté (il n'y a que nos deux comptes)
--   · INSERT / UPDATE / DELETE : uniquement sa propre ligne (auth.uid())
-- Les vraies données restent dans user_state (privé, RLS « own »).
-- À coller dans : Supabase Dashboard → SQL Editor → Run (idempotent)
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.partner_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  app        text not null,
  data       jsonb not null,
  updated_at timestamptz default now()
);
alter table public.partner_state enable row level security;

do $$ begin
  create policy "partner read" on public.partner_state
    for select using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "partner write own" on public.partner_state
    for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "partner update own" on public.partner_state
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "partner delete own" on public.partner_state
    for delete using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Vérification (doit retourner 1 ligne) :
-- select table_name from information_schema.tables where table_name = 'partner_state';
-- Après un premier passage de chacun dans son app : select app, updated_at from public.partner_state;
