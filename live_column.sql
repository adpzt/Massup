-- MASSUP — sauvegarde cloud du détail des séances LiveUp (02/08/2026)
-- À exécuter UNE FOIS dans Supabase : Dashboard → SQL Editor → New query → coller → Run.
-- Tant que ce n'est pas fait, l'app fonctionne normalement (le sync du détail échoue en silence).

alter table public.workout_sessions
  add column if not exists live jsonb;

-- Vérification (doit retourner la colonne "live") :
-- select column_name from information_schema.columns
-- where table_name = 'workout_sessions' and column_name = 'live';
