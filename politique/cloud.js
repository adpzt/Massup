/* ============================================================
   MODULE POLITIQUE — sauvegarde cloud (window.POLC)
   Une seule table Supabase `pol_store` (clé texte → JSON), sans compte ni
   login : la ligne n'est visible qu'avec l'en-tête `x-pol-key` correspondant
   (politique RLS, voir pol_store.sql). Aucune dépendance au code muscu :
   les constantes sont dupliquées volontairement (module isolé).
   Rôle : transport uniquement. La fusion (jamais perdre une réponse) est
   faite par quiz.js (mergeStates) — ici on lit / on écrit, c'est tout.
   ============================================================ */
(function () {
  'use strict';
  var URL = 'https://xtcmvbzjcpewivhnvvwz.supabase.co';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y212YnpqY3Bld2l2aG52dnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzA1MjYsImV4cCI6MjA5MjEwNjUyNn0.axsQZ8vxLaO_6LXlgVjaQSK8qGjHfu5f7MqOG7bgWgc';
  var TABLE = 'pol_store';

  function headers(key, extra) {
    var h = { apikey: ANON, Authorization: 'Bearer ' + ANON, 'Content-Type': 'application/json', 'x-pol-key': key };
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }
  function missingTable(status, txt) {
    return status === 404 || /PGRST205|Could not find the table|does not exist/i.test(txt || '');
  }
  function withTimeout(p, ms) {
    return new Promise(function (res, rej) {
      var t = setTimeout(function () { rej(new Error('timeout')); }, ms);
      p.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); });
    });
  }

  // → { row: {key,data,updated_at} | null } · { missing: true } si la table n'existe pas encore
  function load(key) {
    var req = fetch(URL + '/rest/v1/' + TABLE + '?key=eq.' + encodeURIComponent(key) + '&select=key,data,updated_at', { headers: headers(key) })
      .then(function (r) {
        if (r.ok) return r.json().then(function (rows) { return { row: rows && rows[0] ? rows[0] : null }; });
        return r.text().then(function (t) {
          if (missingTable(r.status, t)) return { missing: true };
          throw new Error('HTTP ' + r.status + ' ' + t.slice(0, 120));
        });
      });
    return withTimeout(req, 9000);
  }

  // upsert (insert ou update) de la ligne complète. keepalive=true pour un envoi au moment où la page se ferme.
  function save(key, data, keepalive) {
    var body = JSON.stringify({ key: key, data: data, updated_at: new Date().toISOString() });
    if (keepalive && body.length > 60000) keepalive = false; // limite navigateur pour keepalive (~64 Ko)
    var req = fetch(URL + '/rest/v1/' + TABLE + '?on_conflict=key', {
      method: 'POST', keepalive: !!keepalive,
      headers: headers(key, { Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: body
    }).then(function (r) {
      if (r.ok) return { ok: true };
      return r.text().then(function (t) {
        if (missingTable(r.status, t)) return { missing: true };
        throw new Error('HTTP ' + r.status + ' ' + t.slice(0, 120));
      });
    });
    return withTimeout(req, 12000);
  }

  window.POLC = { load: load, save: save, TABLE: TABLE, URL: URL };
})();
