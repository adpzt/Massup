-- ═══════════════════════════════════════════════════════════
-- MODULE POLITIQUE — Schéma Supabase (idempotent — safe to re-run)
-- À coller dans : Supabase Dashboard → SQL Editor → Run
--
-- ⚠️  ISOLATION TOTALE : toutes les tables sont préfixées « pol_ ».
--     Aucune jointure avec les tables muscu. Le module peut être
--     supprimé sans toucher au reste (voir bloc DROP en bas).
-- ═══════════════════════════════════════════════════════════

-- 1. Sessions de quiz (une par passage)
create table if not exists public.pol_quiz_sessions (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references auth.users(id) on delete cascade not null,
  created_at     timestamptz default now(),
  completed_at   timestamptz,
  total_answered int default 0
);
alter table public.pol_quiz_sessions enable row level security;
do $$ begin
  create policy "own" on public.pol_quiz_sessions
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- 2. Réponses individuelles (autosave à chaque réponse)
create table if not exists public.pol_answers (
  id             uuid default gen_random_uuid() primary key,
  session_id     uuid references public.pol_quiz_sessions(id) on delete cascade not null,
  question_index int not null,            -- index 0-99
  option_index   int not null,            -- index de l'option choisie
  score_value    numeric not null,        -- valeur de l'option (0-10)
  personal_note  text,                    -- note libre (jamais analysée, juste stockée)
  answered_at    timestamptz default now(),
  unique(session_id, question_index)
);
alter table public.pol_answers enable row level security;
-- RLS via la session parente (qui appartient à l'utilisateur)
do $$ begin
  create policy "own" on public.pol_answers
    for all using (
      exists (select 1 from public.pol_quiz_sessions s
              where s.id = pol_answers.session_id and s.user_id = auth.uid())
    ) with check (
      exists (select 1 from public.pol_quiz_sessions s
              where s.id = pol_answers.session_id and s.user_id = auth.uid())
    );
exception when duplicate_object then null;
end $$;

-- 3. Résultats consolidés (un par session complétée — historique conservé)
create table if not exists public.pol_results (
  id                 uuid default gen_random_uuid() primary key,
  session_id         uuid references public.pol_quiz_sessions(id) on delete cascade not null,
  user_id            uuid references auth.users(id) on delete cascade not null,
  -- scores par thème (0.0 à 10.0 ; null si thème non répondu)
  score_eco          numeric,
  score_social       numeric,
  score_immigration  numeric,
  score_securite     numeric,
  score_env          numeric,
  score_europe       numeric,
  score_institutions numeric,
  score_societal     numeric,
  score_education    numeric,
  -- top candidats triés par correspondance desc : [{name, party, match_pct}, ...]
  candidate_matches  jsonb,
  -- position globale
  global_position    varchar(30),         -- ex : "Centre-gauche"
  global_score       numeric,             -- moyenne des thèmes répondus
  created_at         timestamptz default now()
);
alter table public.pol_results enable row level security;
do $$ begin
  create policy "own" on public.pol_results
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

create index if not exists pol_results_user_idx on public.pol_results(user_id, created_at desc);
create index if not exists pol_answers_session_idx on public.pol_answers(session_id);

-- ═══════════════════════════════════════════════════════════
-- SUPPRESSION COMPLÈTE DU MODULE (décommenter pour tout effacer)
-- N'affecte AUCUNE table muscu.
-- ═══════════════════════════════════════════════════════════
-- drop table if exists public.pol_answers cascade;
-- drop table if exists public.pol_results cascade;
-- drop table if exists public.pol_quiz_sessions cascade;
