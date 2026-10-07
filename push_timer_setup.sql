-- Add-on for server-delivered workout timer notifications.
-- Run once in the Supabase SQL Editor after push_setup.sql has been applied.

create table if not exists public.push_timer_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_endpoint text not null references public.push_subscriptions(endpoint) on delete cascade,
  timer_key text not null check (timer_key = 'workout'),
  due_at timestamptz not null,
  title text not null check (length(title) between 1 and 60),
  body text not null check (length(body) between 1 and 180),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'sent', 'cancelled', 'failed')),
  attempt_count integer not null default 0 check (attempt_count between 0 and 3),
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists push_timer_events_due_idx
  on public.push_timer_events (due_at)
  where status = 'pending';

alter table public.push_timer_events enable row level security;
revoke all on public.push_timer_events from anon, authenticated;
grant select, insert, update on public.push_timer_events to authenticated;
grant select, insert, update, delete on public.push_timer_events to service_role;

drop policy if exists "push timer events own read" on public.push_timer_events;
create policy "push timer events own read" on public.push_timer_events
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "push timer events own create" on public.push_timer_events;
create policy "push timer events own create" on public.push_timer_events
  for insert to authenticated
  with check (auth.uid() = user_id and status = 'pending' and attempt_count = 0 and claimed_at is null);

drop policy if exists "push timer events own cancel" on public.push_timer_events;
create policy "push timer events own cancel" on public.push_timer_events
  for update to authenticated
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'cancelled');

create or replace function public.claim_due_push_timer_events()
returns table (
  id uuid,
  subscription_endpoint text,
  due_at timestamptz,
  title text,
  body text,
  attempt_count integer
)
language sql
security definer
set search_path = ''
as $$
  with stale as (
    update public.push_timer_events
    set status = case when attempt_count >= 3 then 'failed' else 'pending' end,
        claimed_at = null
    where status = 'processing'
      and claimed_at < now() - interval '5 minutes'
    returning id
  ),
  exhausted as (
    update public.push_timer_events
    set status = 'failed'
    where status = 'pending'
      and attempt_count >= 3
    returning id
  ),
  cleanup as (
    delete from public.push_timer_events
    where status in ('sent', 'cancelled', 'failed')
      and created_at < now() - interval '30 days'
    returning id
  ),
  due as (
    select e.id
    from public.push_timer_events e
    where e.status = 'pending'
      and e.due_at <= now()
      and e.attempt_count < 3
    order by e.due_at
    for update skip locked
    limit 100
  )
  update public.push_timer_events e
  set status = 'processing',
      claimed_at = now(),
      attempt_count = e.attempt_count + 1
  from due
  where e.id = due.id
  returning e.id, e.subscription_endpoint, e.due_at, e.title, e.body, e.attempt_count;
$$;

revoke all on function public.claim_due_push_timer_events() from public, anon, authenticated;
grant execute on function public.claim_due_push_timer_events() to service_role;
