// ─────────────────────────────────────────────────────────────
// KEEP-ALIVE — empêche la mise en pause du projet Supabase (plan
// gratuit) en générant une activité DB quotidienne.
// Déclenché par le cron Vercel (vercel.json) ET par un pinger
// externe (UptimeRobot / cron-job.org) en filet de sécurité.
//
// Fait DEUX choses pour une activité indiscutable :
//   1. READ  — SELECT sur weight_history (table muscu, priorité muscu)
//   2. WRITE — PATCH sur la table dédiée `keepalive` (vrai write)
// Le write est ce qui compte le plus : Supabase voit une écriture
// réelle, pas juste une lecture filtrée par RLS.
//
// ⚠️ Le write nécessite d'avoir exécuté `keepalive_schema.sql` dans
// Supabase. Tant que ce n'est pas fait, write_status sera 404 mais
// le read continue de tenir le projet éveillé.
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://xtcmvbzjcpewivhnvvwz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y212YnpqY3Bld2l2aG52dnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzA1MjYsImV4cCI6MjA5MjEwNjUyNn0.axsQZ8vxLaO_6LXlgVjaQSK8qGjHfu5f7MqOG7bgWgc';

const H = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: 'Bearer ' + SUPABASE_ANON_KEY
};

module.exports = async function handler(req, res) {
  const out = { ok: false, pinged_at: new Date().toISOString() };
  try {
    // 1) READ — lecture (RLS renvoie 0 ligne en anon, mais touche Postgres)
    const rd = await fetch(SUPABASE_URL + '/rest/v1/weight_history?select=id&limit=1', {
      method: 'GET',
      headers: H
    });
    out.read_status = rd.status;

    // 2) WRITE — vrai write sur la ligne unique de `keepalive`
    const wr = await fetch(SUPABASE_URL + '/rest/v1/keepalive?id=eq.1', {
      method: 'PATCH',
      headers: { ...H, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ last_ping: out.pinged_at })
    });
    out.write_status = wr.status; // 204 = write OK ; 404 = table pas encore créée

    // ok dès que le read tient ; write_status à surveiller jusqu'à exécution du SQL
    out.ok = rd.ok;
    out.write_ok = wr.status === 204 || wr.ok;
    return res.status(200).json(out);
  } catch (e) {
    out.error = e.message;
    return res.status(200).json(out);
  }
};
