-- ═══════════════════════════════════════════════════════════
-- MASSUP — Schéma Supabase (idempotent — safe to re-run)
-- À coller dans : Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════

-- 1. Historique des poids par exercice
create table if not exists public.weight_history (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  exercise_id text not null,
  weight      numeric not null,
  recorded_at date not null,
  created_at  timestamptz default now(),
  unique(user_id, exercise_id, recorded_at)
);
alter table public.weight_history enable row level security;
do $$ begin
  create policy "own" on public.weight_history
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- 2. Séances enregistrées
create table if not exists public.workout_sessions (
  id         bigint primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  date       date not null,
  time       text,
  sessions   text[] default '{}',
  comment    text,
  created_at timestamptz default now()
);
alter table public.workout_sessions enable row level security;
do $$ begin
  create policy "own" on public.workout_sessions
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- 3. Poids corporel (Phase 4.1)
create table if not exists public.body_weight (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  date       date not null,
  weight_kg  numeric not null,
  note       text,
  created_at timestamptz default now(),
  unique(user_id, date)
);
alter table public.body_weight enable row level security;
do $$ begin
  create policy "own" on public.body_weight
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- 4. Champs log amélioré (Phase 4.3)
alter table public.workout_sessions add column if not exists feeling smallint;
alter table public.workout_sessions add column if not exists energy smallint;
alter table public.workout_sessions add column if not exists duration_min smallint;
