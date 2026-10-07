-- MASSUP Web Push: subscriptions are owned by each signed-in user.
-- Run this once in the Supabase SQL Editor. The cron setup is documented in PUSH_SETUP.md.

create table if not exists public.push_subscriptions (
  endpoint  text primary key,
  user_id   uuid not null references auth.users(id) on delete cascade,
  p256dh    text not null,
  auth      text not null,
  time_zone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
grant select, insert, update, delete on public.push_subscriptions to authenticated;
drop policy if exists "push subscriptions own" on public.push_subscriptions;
create policy "push subscriptions own" on public.push_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.push_deliveries (
  user_id    uuid not null references auth.users(id) on delete cascade,
  kind       text not null check (kind in ('session', 'inactivity')),
  local_date date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, local_date)
);
alter table public.push_deliveries enable row level security;
revoke all on public.push_deliveries from anon, authenticated;
grant select, insert, delete on public.push_deliveries to service_role;
grant select, insert, update, delete on public.push_subscriptions to service_role;

-- Required for the minute scheduler described in PUSH_SETUP.md.
create extension if not exists pg_cron;
create extension if not exists pg_net;
create extension if not exists supabase_vault with schema vault;
