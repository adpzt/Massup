-- MASSUP — chrono de repos : notification à l'heure (07/10/2026)
-- À exécuter UNE fois dans Supabase › SQL Editor, APRÈS push_setup.sql, push_timer_setup.sql
-- et les secrets Vault décrits dans PUSH_SETUP.md (massup_push_dispatch_url / massup_push_cron_token).
--
-- Pourquoi : le Cron « massup-push-dispatch » ne tourne qu'une fois par minute. Un repos qui finit
-- juste après un passage attendait jusqu'à 60 s, et si l'app était rouverte entre-temps le rappel
-- était annulé avant d'être envoyé. Ici :
--   ① un job toutes les 5 s qui n'appelle Vercel QUE s'il y a un chrono dû (coût quasi nul sinon) ;
--   ② les chronos sont réclamés 4 s avant l'échéance pour compenser Vercel → Apple → iPhone ;
--   ③ une fonction schedule_push_timer : annule + programme en UNE requête (moins de risque que
--      l'iPhone fige l'app entre deux requêtes quand on verrouille l'écran juste après une série).

-- ① Réclamation des chronos avec avance (remplace la version sans paramètre)
drop function if exists public.claim_due_push_timer_events();
create or replace function public.claim_due_push_timer_events(lead_seconds integer default 4)
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
      and e.due_at <= now() + make_interval(secs => greatest(0, least(lead_seconds, 20)))
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

revoke all on function public.claim_due_push_timer_events(integer) from public, anon, authenticated;
grant execute on function public.claim_due_push_timer_events(integer) to service_role;

-- ③ Programmer / annuler le chrono de CET appareil en une seule requête (appelée par l'app)
create or replace function public.schedule_push_timer(
  p_endpoint text,
  p_due_at timestamptz default null,
  p_title text default null,
  p_body text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if not exists (
    select 1 from public.push_subscriptions s
    where s.endpoint = p_endpoint and s.user_id = uid
  ) then
    raise exception 'unknown push subscription' using errcode = '42501';
  end if;
  -- Deux appels quasi simultanés (série validée + app mise en arrière-plan) ne créent jamais deux rappels
  perform pg_advisory_xact_lock(hashtextextended(p_endpoint, 0));

  -- On n'annule que les rappels FUTURS : un repos déjà fini part quand même, même si l'app est rouverte.
  update public.push_timer_events
  set status = 'cancelled'
  where user_id = uid
    and subscription_endpoint = p_endpoint
    and timer_key = 'workout'
    and status = 'pending'
    and due_at > now();

  if p_due_at is null then
    return;
  end if;
  if p_due_at < now() - interval '30 seconds' or p_due_at > now() + interval '3 hours' then
    raise exception 'due_at out of range' using errcode = '22023';
  end if;

  insert into public.push_timer_events (user_id, subscription_endpoint, timer_key, due_at, title, body)
  values (
    uid,
    p_endpoint,
    'workout',
    p_due_at,
    left(coalesce(nullif(p_title, ''), 'Repos terminé'), 60),
    left(coalesce(nullif(p_body, ''), 'Lance ta prochaine série !'), 180)
  );
end;
$$;

revoke all on function public.schedule_push_timer(text, timestamptz, text, text) from public, anon;
grant execute on function public.schedule_push_timer(text, timestamptz, text, text) to authenticated;

-- ② Déclencheur rapide : toutes les 5 s, n'appelle le dispatcher que si un chrono arrive à échéance
select cron.unschedule(jobid) from cron.job where jobname = 'massup-push-timers';
select cron.schedule(
  'massup-push-timers',
  '5 seconds',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'massup_push_dispatch_url'),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'massup_push_cron_token'),
      'Content-Type', 'application/json'
    ),
    body := '{"mode":"timers"}'::jsonb,
    timeout_milliseconds := 10000
  )
  where exists (
    select 1 from public.push_timer_events
    where status = 'pending'
      and attempt_count < 3
      and due_at <= now() + interval '4 seconds'
  );
  $$
);

-- Le job ci-dessus écrit une ligne d'historique toutes les 5 s : on purge l'historique Cron chaque nuit.
select cron.unschedule(jobid) from cron.job where jobname = 'massup-cron-history-cleanup';
select cron.schedule(
  'massup-cron-history-cleanup',
  '17 3 * * *',
  $$ delete from cron.job_run_details where end_time < now() - interval '2 days' $$
);

-- PostgREST doit voir les nouvelles fonctions tout de suite
notify pgrst, 'reload schema';
