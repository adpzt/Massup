-- Idempotency ledger for recurring hydration, workout, bedtime and sleep reminders.
-- Run once in Supabase SQL Editor after push_setup.sql.

create table if not exists public.push_schedule_deliveries (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind = 'scheduled'),
  local_date date not null,
  slot text not null check (slot ~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$'),
  created_at timestamptz not null default now(),
  primary key (user_id, kind, local_date, slot)
);

create index if not exists push_schedule_deliveries_created_idx
  on public.push_schedule_deliveries (created_at);

alter table public.push_schedule_deliveries enable row level security;
revoke all on public.push_schedule_deliveries from anon, authenticated;
grant select, insert, delete on public.push_schedule_deliveries to service_role;
