// ─────────────────────────────────────────────────────────────
// 👟 /api/health?t=CODE — reçoit les pas / l'activité envoyés par le Raccourci iOS « MASSUP Santé »
// (29/09/2026). Corps accepté, au plus simple pour Raccourcis :
//   · du TEXTE, une ligne par jour et par mesure :  2026-09-28;steps;8 123
//     (séparateur ; ou tabulation · mesure steps|kcal|km|exo|floors ou steps_h00…steps_h23)
//   · ou du JSON : {"rows":[{"d":"2026-09-28","k":"steps_h09","v":"8123"}]}
// Le code (t) identifie le compte : health_push() (health.sql) n'écrit QUE chez lui.
// Aucune clé secrète ici : la clé anon suffit, c'est la fonction SQL qui vérifie le code.
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://xtcmvbzjcpewivhnvvwz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y212YnpqY3Bld2l2aG52dnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzA1MjYsImV4cCI6MjA5MjEwNjUyNn0.axsQZ8vxLaO_6LXlgVjaQSK8qGjHfu5f7MqOG7bgWgc';
const KEYS = { steps: 'steps', pas: 'steps', kcal: 'kcal', energie: 'kcal', km: 'km', distance: 'km', exo: 'exo', exercice: 'exo', floors: 'floors', etages: 'floors' };
function measureKey(value) {
  const key = String(value || '').toLowerCase();
  if (KEYS[key]) return KEYS[key];
  return /^steps_h(?:[01]\d|2[0-3])$/.test(key) ? key : null;
}

// Le corps BRUT d'abord (sans toucher req.body, que Vercel ne découpe qu'à la lecture) — sinon repli sur req.body
function readRaw(req) {
  return new Promise(function (resolve) {
    let data = '', done = false;
    function fallback() {
      if (done) return; done = true;
      try {
        const b = req.body;
        if (b == null) return resolve('');
        if (typeof b === 'string') return resolve(b);
        if (Buffer.isBuffer(b)) return resolve(b.toString('utf8'));
        return resolve(b);
      } catch (e) { return resolve(''); }
    }
    if (req.readableEnded || typeof req.on !== 'function') return fallback();
    req.on('data', function (c) { data += c; });
    req.on('end', function () { if (done) return; if (data) { done = true; resolve(data); } else fallback(); });
    req.on('error', fallback);
    setTimeout(function () { if (!data) fallback(); }, 1500);
  });
}
function isoDate(s) {
  s = String(s || '').trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[1] + '-' + m[2] + '-' + m[3];
  m = s.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})/);
  if (m) return m[3] + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
  return null;
}
function parseRows(body) {
  if (body && typeof body === 'object') {
    if (Array.isArray(body)) return body;
    if (body.rows || body.p_rows) return body.rows || body.p_rows;
    // corps envoyé en « formulaire » (Vercel l'a déjà découpé en clés) → on reconstitue le texte
    body = Object.keys(body).map(function (k) { return body[k] ? k + '=' + body[k] : k; }).join('\n');
  }
  const txt = String(body || '').trim();
  if (!txt) return [];
  if (txt[0] === '{' || txt[0] === '[') {
    try { const j = JSON.parse(txt); return Array.isArray(j) ? j : (j.rows || j.p_rows || []); } catch (e) { /* on tente le texte */ }
  }
  const rows = [];
  txt.split(/\r?\n|\u2028/).forEach(function (line) {
    const p = line.split(/;|\t/).map(function (x) { return x.trim(); });
    if (p.length < 2) return;
    let d, k, v;
    if (p.length >= 3) { d = p[0]; k = p[1]; v = p[2]; } else { d = p[0]; k = 'steps'; v = p[1]; }
    const dd = isoDate(d);
    const kk = measureKey(k);
    if (!dd || !kk || !v) return;
    rows.push({ d: dd, k: kk, v: String(v) });
  });
  return rows;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const token = String((req.query && req.query.t) || '').trim();
  if (!token) return res.status(400).json({ ok: false, error: 'code manquant (?t=...)' });
  const method = String(req.method || '').toUpperCase();
  if (method === 'GET') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'envoie les données en POST' });
  }
  if (method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'méthode non autorisée' });
  }
  try {
    const rows = parseRows(await readRaw(req)).slice(0, 5000);
    if (!rows.length) return res.status(400).json({ ok: false, saved: 0, error: 'aucune ligne lisible' });
    const r = await fetch(SUPABASE_URL + '/rest/v1/rpc/health_push', {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_token: token, p_rows: rows })
    });
    const out = await r.text();
    if (!r.ok) return res.status(502).json({ ok: false, error: out.slice(0, 200) });
    const saved = parseInt(out, 10) || 0;
    if (!saved) return res.status(422).json({ ok: false, received: rows.length, saved: 0, error: 'aucune ligne valide enregistrée' });
    return res.status(200).json({ ok: true, received: rows.length, saved: saved });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};
