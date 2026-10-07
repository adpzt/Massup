-- ============================================================
-- QUIZ POLITIQUE — sauvegarde cloud des réponses (table unique)
-- À coller UNE FOIS dans Supabase → SQL Editor → Run. Idempotent.
--
-- Principe : une ligne par profil (clé texte), tout le contenu en JSON.
-- Pas de compte utilisateur : la ligne n'est lisible / modifiable que si
-- la requête porte l'en-tête HTTP `x-pol-key` égal à la clé de la ligne
-- (le navigateur l'envoie automatiquement, voir politique/cloud.js).
-- Totalement indépendant des tables muscu (préfixe pol_).
-- ============================================================

create table if not exists public.pol_store (
  key         text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.pol_store enable row level security;

drop policy if exists "pol_store_select" on public.pol_store;
drop policy if exists "pol_store_insert" on public.pol_store;
drop policy if exists "pol_store_update" on public.pol_store;

create policy "pol_store_select" on public.pol_store
  for select to anon, authenticated
  using (key = current_setting('request.headers', true)::json->>'x-pol-key');

create policy "pol_store_insert" on public.pol_store
  for insert to anon, authenticated
  with check (key = current_setting('request.headers', true)::json->>'x-pol-key');

create policy "pol_store_update" on public.pol_store
  for update to anon, authenticated
  using (key = current_setting('request.headers', true)::json->>'x-pol-key')
  with check (key = current_setting('request.headers', true)::json->>'x-pol-key');

grant select, insert, update on public.pol_store to anon, authenticated;

-- Vérification : doit renvoyer 0 ligne (sans en-tête x-pol-key, rien n'est visible)
-- select * from public.pol_store;

-- Suppression propre du module (décommenter si besoin) :
-- drop table if exists public.pol_store;
