-- ═══════════════════════════════════════════════════════════
-- MASSUP — user_state : snapshot cloud COMPLET de la base locale (11/08/2026)
-- Suite à l'incident du 11/08 (Safari a purgé la localStorage) : tout ce qui
-- ne vivait qu'en local (profil, journal poignet, nutrition, déclarations
-- hebdo du rank, pauses, templates, détente...) est désormais poussé dans
-- cette table à chaque sauvegarde. N'importe quel navigateur connecté
-- récupère TOUT.
-- À coller dans : Supabase Dashboard → SQL Editor → Run (idempotent)
-- ═══════════════════════════════════════════════════════════

create table if not exists public.user_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz default now()
);
alter table public.user_state enable row level security;
do $$ begin
  create policy "own" on public.user_state
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- Vérification (doit retourner 1 ligne) :
-- select table_name from information_schema.tables where table_name = 'user_state';
