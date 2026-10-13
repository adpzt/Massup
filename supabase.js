var SUPABASE_URL = 'https://xtcmvbzjcpewivhnvvwz.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y212YnpqY3Bld2l2aG52dnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzA1MjYsImV4cCI6MjA5MjEwNjUyNn0.axsQZ8vxLaO_6LXlgVjaQSK8qGjHfu5f7MqOG7bgWgc';

// (07/10) CDN Supabase injoignable (salle sans réseau, script pas en cache) : l'app démarre en local
// au lieu de rester sur un écran vide — même comportement que Melati. La synchro reprend au prochain lancement.
var sbClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
var appInitialized = false;

// ─────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────
// (Fix 11/08 : l'ancien initAuth affichait l'app sans JAMAIS vérifier la session.
// Si Safari purgeait le stockage du site — session comprise — l'app repartait sur
// la base d'usine, déconnectée et sans synchro, sans le dire. Désormais : session
// valide → app + sync ; pas de session → écran de connexion magic link.)
function initAuth() {
  if (!sbClient) {
    appInitialized = true;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = '';
    document.getElementById('main-nav').style.display = '';
    bootApp();
    return;
  }
  // Le retour du magic link (token dans l'URL) déclenche SIGNED_IN via detectSessionInUrl
  sbClient.auth.onAuthStateChange(function(event, session) {
    if (event === 'SIGNED_IN' && session && !appInitialized) startApp();
  });
  sbClient.auth.getSession().then(function(res) {
    var session = res.data && res.data.session;
    if (session) startApp();
    else {
      // Petit délai : laisse detectSessionInUrl finir de traiter un éventuel token magic link
      setTimeout(function() { if (!appInitialized) showLogin(); }, 800);
    }
  });
}

function showLogin() {
  document.getElementById('login-screen').style.display = '';
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('main-nav').style.display = 'none';
}

function startApp() {
  if (appInitialized) return;
  appInitialized = true;
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('main-app').style.display = '';
  document.getElementById('main-nav').style.display = '';
  bootWithSync();
}

function bootWithSync() {
  var done = false;
  var timeout = setTimeout(function() {
    if (!done) { done = true; bootApp(); }
  }, 4000);

  syncFromSupabase().then(function() {
    clearTimeout(timeout);
    if (!done) { done = true; bootApp(); }
    // L'app avait déjà booté (timeout) pendant que le cloud restaurait une base
    // vierge → l'UI affiche encore la base d'usine : on recharge sur les vraies données.
    else if (_stateAdopted) { location.reload(); }
  });
}
var _stateAdopted = false; // true si un snapshot cloud a été adopté en bloc (base locale vierge)

// (13/10) Repère de synchro de CE stockage (Safari et l'icône ont chacun le leur) — voir state_sync.js
var SYNC_META_KEY = 'massup_sync';
function _localRev() { return (DB.profile && DB.profile.rev) || 0; }
// Écrit un snapshot cloud dans le stockage local. Son compteur repart AU-DESSUS du compteur local :
// la garde anti-onglet périmé (_flushSaveDB) recharge alors au lieu de réécrire l'ancien état.
function _adoptCloudSnapshot(data) {
  if (!data.profile) data.profile = {};
  data.profile.rev = Math.max(_localRev(), data.profile.rev || 0) + 1;
  try { localStorage.setItem('massup_db', JSON.stringify(data)); return true; }
  catch(e) {
    console.warn('[MASSUP] Adoption du cloud impossible (stockage local) :', e && e.message);
    try { showToast('⚠️ Stockage du téléphone plein : la version du cloud n’a pas pu être reprise.'); } catch(_e) {}
    return false;
  }
}

function bootApp() {
  try { init(); } catch(e) {
    document.getElementById('main-app').style.display = 'block';
    document.querySelector('.app').innerHTML =
      '<div style="padding:2rem;color:#ff6b6b;font-family:monospace;font-size:.8rem;background:#0e1220;border-radius:12px;border:1px solid #ff6b6b33"><strong>Erreur JS :</strong><br>' +
      e.message + '<br><br>' + (e.stack || '') + '</div>';
  }
}

function sendMagicLink() {
  var email = document.getElementById('login-email').value.trim();
  if (!email) { document.getElementById('login-email').focus(); return; }
  var btn = document.getElementById('login-btn');
  btn.textContent = 'Envoi en cours...';
  btn.disabled = true;
  sbClient.auth.signInWithOtp({
    email: email,
    options: { emailRedirectTo: window.location.origin + window.location.pathname }
  }).then(function(result) {
    if (result.error) {
      btn.textContent = 'Erreur \u2014 r\u00e9essaie';
      btn.disabled = false;
    } else {
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('login-sent').style.display = 'block';
    }
  });
}

// Connexion email + mot de passe (11/08, demande Adrien — le magic link reste en secours).
// Le mot de passe du compte se pose via SQL : update auth.users set encrypted_password = ...
function signInPassword() {
  var email = document.getElementById('login-email').value.trim();
  var pw = document.getElementById('login-password').value;
  var err = document.getElementById('login-err');
  err.style.display = 'none';
  if (!email) { document.getElementById('login-email').focus(); return; }
  if (!pw) { document.getElementById('login-password').focus(); return; }
  var btn = document.getElementById('login-btn');
  btn.textContent = 'Connexion...';
  btn.disabled = true;
  sbClient.auth.signInWithPassword({ email: email, password: pw }).then(function(res) {
    if (res.error) {
      btn.textContent = 'Se connecter →';
      btn.disabled = false;
      err.textContent = 'Email ou mot de passe incorrect.';
      err.style.display = '';
    }
    // Succès : onAuthStateChange (SIGNED_IN) déclenche startApp()
  });
}

function signOut() {
  if (!sbClient) return;
  sbClient.auth.signOut().then(function() { location.reload(); });
}

function loginOnEnter(e) {
  if (e.key === 'Enter') signInPassword();
}

// ─────────────────────────────────────────────────
// SYNC : Supabase → localStorage → app
// ─────────────────────────────────────────────────
// Garde-fou (11/08) : true seulement après un pull cloud complet et réussi.
// Tant que c'est false, AUCUNE suppression côté Supabase — un état local vide
// (stockage purgé par Safari) ne doit jamais pouvoir effacer le cloud.
var _cloudPullOk = false;

async function syncFromSupabase() {
  if (!sbClient) return;
  try {
    var userRes = await sbClient.auth.getUser();
    var userId = userRes.data && userRes.data.user && userRes.data.user.id;
    if (!userId) return;

    loadDB(); // charge localStorage dans DB avant de comparer

    var results = await Promise.all([
      sbClient.from('weight_history')
        .select('exercise_id,weight,recorded_at')
        .eq('user_id', userId)
        .order('recorded_at'),
      sbClient.from('workout_sessions')
        .select('id,date,time,sessions,comment,feeling,energy,duration_min,live')
        .eq('user_id', userId)
        .order('date', { ascending: false }),
      sbClient.from('body_weight')
        .select('date,weight_kg,note')
        .eq('user_id', userId)
        .order('date'),
      // Snapshot complet de la base (user_state.sql — 11/08). Erreur tolérée tant
      // que la table n'existe pas : le sync des 3 tables historiques continue.
      // select('*') : lit aussi la colonne rev quand elle existe (user_state_cas.sql), sans casser avant
      sbClient.from('user_state')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
    ]);

    // (07/10) supabase-js ne lève pas d'exception : une erreur arrive dans r.error. Sans ce contrôle,
    // un SELECT raté passait pour réussi et rouvrait les suppressions cloud sur une base locale incomplète.
    var failed = results.filter(function(r) { return !r || r.error; });
    if (failed.length) {
      console.warn('[MASSUP] Pull cloud incomplet, synchro en lecture seule :', failed.map(function(r) { return r && r.error && r.error.message; }).join(' | '));
      return;
    }

    var wData = results[0].data;
    var sData = results[1].data;
    var bwData = results[2].data;
    var stateRow = results[3] && results[3].data;

    // ── user_state d'abord : couvre TOUT (profil, poignet, nutrition, rank,
    // templates, détente...) — ce que les 3 tables historiques ne portent pas.
    // (13/10) Version SERVEUR du snapshot (null tant que user_state_cas.sql n'est pas appliqué)
    var serverRev = stateRow && typeof stateRow.rev === 'number' ? stateRow.rev : null;
    var meta = STATE_SYNC.metaFor(SYNC_META_KEY, userId);
    if (stateRow && stateRow.data && stateRow.data.app !== 'melati' && typeof mergeBackupIntoDB === 'function') {
      // (13/10) Le serveur dit si le cloud a bougé depuis NOTRE dernière synchro (STATE_SYNC.plan) :
      // cloud plus récent et rien de non envoyé ici → adoption en bloc ; les deux ont bougé → fusion
      // non destructive (le local gagne à clé égale) puis envoi conditionnel ; cloud inchangé → rien.
      var action = STATE_SYNC.plan({
        virgin: typeof isLocalDBVirgin === 'function' && isLocalDBVirgin(),
        meta: meta, cloudRev: serverRev, localRev: _localRev(),
        legacyCloudRev: (stateRow.data.profile && stateRow.data.profile.rev) || 0
      });
      if (action === 'adopt' && _adoptCloudSnapshot(stateRow.data)) {
        loadDB();
        _stateAdopted = true;
        if (serverRev !== null) STATE_SYNC.writeMeta(SYNC_META_KEY, { uid: userId, base: serverRev, lrev: _localRev() });
      } else {
        if (action !== 'keep') mergeBackupIntoDB(stateRow.data);
        // Fusion = des modifs locales à envoyer (lrev -1 force l'envoi) ; « keep » garde le repère tel quel
        if (serverRev !== null) STATE_SYNC.writeMeta(SYNC_META_KEY, { uid: userId, base: serverRev, lrev: action === 'keep' && meta ? meta.lrev : -1 });
      }
    } else if (!stateRow && results[3] && !results[3].error) {
      // Pas encore de ligne : le 1er envoi la crée (base 0)
      STATE_SYNC.writeMeta(SYNC_META_KEY, { uid: userId, base: 0, lrev: -1 });
    }

    // ── Merge strategy : localStorage = source primaire, Supabase comble les trous ──
    // Local wins on conflict (même date/ID). Supabase fournit les entrées absentes en local.

    if (wData && wData.length > 0) {
      // Construire map depuis Supabase
      var sbWeights = {};
      wData.forEach(function(r) {
        var d = r.recorded_at ? String(r.recorded_at).substring(0,10) : '';
        if (!d) return;
        if (!sbWeights[r.exercise_id]) sbWeights[r.exercise_id] = {};
        sbWeights[r.exercise_id][d] = parseFloat(r.weight);
      });
      // Partir des données Supabase, puis écraser avec les données locales
      var merged = {};
      Object.keys(sbWeights).forEach(function(exoId) {
        merged[exoId] = [];
        Object.keys(sbWeights[exoId]).forEach(function(date) {
          merged[exoId].push({ date: date, val: sbWeights[exoId][date] });
        });
      });
      // Données locales écrasent / ajoutent (local gagne)
      var localW = DB.weights || {};
      Object.keys(localW).forEach(function(exoId) {
        if (!merged[exoId]) merged[exoId] = [];
        localW[exoId].forEach(function(entry) {
          var idx = -1;
          for (var i = 0; i < merged[exoId].length; i++) {
            if (merged[exoId][i].date === entry.date) { idx = i; break; }
          }
          if (idx >= 0) merged[exoId][idx].val = entry.val;
          else merged[exoId].push({ date: entry.date, val: entry.val });
        });
      });
      // Retirer les entrées supprimées localement
      if (DB.deletedWeights) {
        Object.keys(DB.deletedWeights).forEach(function(key) {
          var del = DB.deletedWeights[key] || [];
          if (del.length && merged[key]) {
            merged[key] = merged[key].filter(function(e) { return del.indexOf(e.date) < 0; });
          }
        });
      }
      // Trier par date
      Object.keys(merged).forEach(function(k) {
        merged[k].sort(function(a, b) { return a.date < b.date ? -1 : 1; });
        if (!merged[k].length) delete merged[k];
      });
      var mergedDates = {};
      Object.keys(merged).forEach(function(k) {
        mergedDates[k] = merged[k][merged[k].length - 1].date;
      });
      DB.weights = merged;
      DB.weightSetDate = mergedDates;
    }

    if (sData && sData.length > 0) {
      var logsMap = {};
      var delLogs = DB.deletedLogs || [];
      // Base Supabase — en ignorant les séances supprimées localement (tombstones 12/08)
      sData.forEach(function(s) {
        if (delLogs.indexOf(String(s.id)) >= 0) return;
        logsMap[s.id] = { id: s.id, date: s.date, time: s.time || '', sessions: s.sessions || [],
          comment: s.comment || '', feeling: s.feeling || null, energy: s.energy || null,
          duration_min: s.duration_min || null };
        if (s.live) logsMap[s.id].live = s.live; // détail série par série (backup cloud depuis le 02/08)
      });
      // Local écrase (local gagne) — mais un log local SANS live récupère le live du cloud
      (DB.logs || []).forEach(function(l) {
        var cloud = logsMap[l.id];
        if (cloud && cloud.live && !l.live) l.live = cloud.live;
        logsMap[l.id] = l;
      });
      DB.logs = Object.keys(logsMap).map(function(k) { return logsMap[k]; });
      DB.logs.sort(function(a, b) { return b.date.localeCompare(a.date); });
    }

    if (bwData && bwData.length > 0) {
      var bwMap = {};
      var delBW = DB.deletedBW || [];
      // En ignorant les pesées supprimées localement (tombstones 12/08)
      bwData.forEach(function(b) { if (delBW.indexOf(b.date) >= 0) return; bwMap[b.date] = { date: b.date, weight_kg: parseFloat(b.weight_kg), note: b.note || '' }; });
      (DB.bodyWeight || []).forEach(function(b) { bwMap[b.date] = b; });
      DB.bodyWeight = Object.keys(bwMap).map(function(k) { return bwMap[k]; });
      DB.bodyWeight.sort(function(a, b) { return a.date.localeCompare(b.date); });
    }

    // Les 3 SELECT ont réussi et le merge est fait → les suppressions redeviennent légitimes
    _cloudPullOk = true;

    // Sauvegarder le résultat mergé localement et pousser vers Supabase
    try { localStorage.setItem('massup_db', JSON.stringify(DB)); }
    catch(e) { console.warn('[MASSUP] Sauvegarde locale après synchro impossible :', e && e.message); }
    // (13/10) Snapshot renvoyé seulement s'il y a du neuf ici : renvoyer une copie identique ferait
    // croire aux autres appareils que le cloud a changé. Les 3 tables historiques, elles, repartent.
    var metaAfter = STATE_SYNC.metaFor(SYNC_META_KEY, userId);
    if (!metaAfter || STATE_SYNC.isDirty(metaAfter, _localRev())) _doSyncToSupabase(userId);
    else _pushTables(userId);
    // « Nous deux » (26/08) : lecture du résumé de Melati (partner_state) — jamais bloquant
    try { if (typeof PV !== 'undefined') PV.pull(true); } catch(e) {}
  } catch(e) {
    console.warn('[MASSUP] syncFromSupabase failed, localStorage used:', e.message);
  }
}

// ─────────────────────────────────────────────────
// SYNC : localStorage → Supabase (debounced)
// ─────────────────────────────────────────────────
var _syncTimer = null;
function syncToSupabase() {
  if (!appInitialized || !sbClient) return;
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(function() {
    _syncTimer = null; // (07/10) sinon le contrôle cloud au retour au premier plan ne tournait plus jamais
    sbClient.auth.getUser().then(function(res) {
      var userId = res.data && res.data.user && res.data.user.id;
      if (userId) _doSyncToSupabase(userId);
    });
  }, 1500);
}

function _doSyncToSupabase(userId) {
  // (13/10) Avec un pull réussi, le snapshot passe EN PREMIER par l'écriture conditionnelle : tant
  // qu'il est refusé (un autre appareil a écrit), rien d'autre n'est envoyé — surtout pas le
  // nettoyage des séances cloud absentes d'ici, qui effacerait celles de l'autre appareil.
  if (_cloudPullOk) { _pushSnapshot(userId); return; }
  _pushTables(userId);
}

function _pushTables(userId) {
  // ── Poids par exercice ──
  var wRows = [];
  Object.keys(DB.weights).forEach(function(exoId) {
    DB.weights[exoId].forEach(function(entry) {
      wRows.push({
        user_id: userId,
        exercise_id: exoId,
        weight: entry.val,
        recorded_at: entry.date
      });
    });
  });
  if (wRows.length) {
    sbClient.from('weight_history')
      .upsert(wRows, { onConflict: 'user_id,exercise_id,recorded_at' })
      .then(function() {})
      .catch(function(e) { console.warn('[MASSUP] weights upsert:', e.message); });
  }

  // ── Séances ──
  if (DB.logs.length) {
    var sRows = DB.logs.map(function(l) {
      return {
        id: l.id,
        user_id: userId,
        date: l.date,
        time: l.time || null,
        sessions: l.sessions || [],
        comment: l.comment || null,
        feeling: l.feeling || null,
        energy: l.energy || null,
        duration_min: l.duration_min || null,
        live: l.live || null // détail complet des séances LiveUp — nécessite la colonne (live_column.sql)
      };
    });
    sbClient.from('workout_sessions')
      .upsert(sRows, { onConflict: 'id' })
      .then(function(r) {
        if (r && r.error) { console.warn('[MASSUP] sessions upsert:', r.error.message); return; }
        // Supprimer les séances effacées localement — UNIQUEMENT si un pull cloud
        // a réussi cette session (sinon un local incomplet effacerait le cloud)
        if (!_cloudPullOk) return;
        var ids = DB.logs.map(function(l) { return l.id; });
        sbClient.from('workout_sessions')
          .delete()
          .eq('user_id', userId)
          .not('id', 'in', '(' + ids.join(',') + ')')
          .then(function() {})
          .catch(function() {});
      })
      .catch(function(e) { console.warn('[MASSUP] sessions upsert:', e.message); });
  }
  // (11/08) Branche « logs vide → tout supprimer côté Supabase » RETIRÉE : c'est elle
  // qui aurait effacé 6 mois de cloud si l'app avait poussé après une purge Safari.
  // Coût accepté : supprimer sa toute dernière séance ne se propage pas au cloud.

  // ── Poids corporel ──
  var bwData = DB.bodyWeight || [];
  if (bwData.length) {
    var bwRows = bwData.map(function(e) {
      return { user_id: userId, date: e.date, weight_kg: e.weight_kg, note: e.note || null };
    });
    sbClient.from('body_weight')
      .upsert(bwRows, { onConflict: 'user_id,date' })
      .then(function() {})
      .catch(function(e) { console.warn('[MASSUP] body_weight upsert:', e.message); });
  }

  // ── Propagation des SUPPRESSIONS au cloud (tombstones 12/08) ──
  // Une suppression locale doit effacer la ligne cloud, sinon elle ressuscite au boot suivant.
  var delBW2 = DB.deletedBW || [];
  if (delBW2.length) {
    sbClient.from('body_weight')
      .delete().eq('user_id', userId).in('date', delBW2)
      .then(function() {})
      .catch(function(e) { console.warn('[MASSUP] body_weight tombstones:', e.message); });
  }
  var delLogs2 = DB.deletedLogs || [];
  if (delLogs2.length) {
    sbClient.from('workout_sessions')
      .delete().eq('user_id', userId).in('id', delLogs2)
      .then(function() {})
      .catch(function(e) { console.warn('[MASSUP] sessions tombstones:', e.message); });
  }
  var delW2 = DB.deletedWeights || {};
  Object.keys(delW2).forEach(function(exoId) {
    var dates = delW2[exoId] || [];
    if (!dates.length) return;
    sbClient.from('weight_history')
      .delete().eq('user_id', userId).eq('exercise_id', exoId).in('recorded_at', dates)
      .then(function() {})
      .catch(function(e) { console.warn('[MASSUP] weights tombstones:', e.message); });
  });

  // « Nous deux » (26/08) : MA ligne partner_state = résumé lecture seule pour Melati
  // (compteurs, jours, bilans, petit mot). Dérivé de DB, jamais l'inverse.
  if (_cloudPullOk) { try { if (typeof PV !== 'undefined') PV.push(); } catch(e) {} }
}

// ── Snapshot complet (user_state — 11/08) : TOUTE la base, c'est ce qui rend l'app multi-navigateur.
// Envoyé seulement après un pull réussi (_cloudPullOk). (13/10) Écriture CONDITIONNELLE :
// user_state_put(DB, base) n'écrit que si le cloud est encore à la version « base » vue par ce
// stockage ; sinon _resolveCloudConflict relit, fusionne, et un nouvel envoi part.
var _casConflicts = 0, _casInFlight = false, _casAgain = false;
function _pushSnapshot(userId) {
  var meta = STATE_SYNC.metaFor(SYNC_META_KEY, userId);
  if (!meta) { _legacySnapshotUpsert(userId); return; } // serveur sans colonne rev : ancien mode
  // Un envoi à la fois : deux envois partis de la même base se refuseraient l'un l'autre
  if (_casInFlight) { _casAgain = true; return; }
  if (!STATE_SYNC.isDirty(meta, _localRev())) { _pushTables(userId); return; } // rien de neuf à écrire
  _casInFlight = true;
  var sentRev = _localRev();
  STATE_SYNC.put(sbClient, DB, meta.base).then(function(res) {
    if (res.legacy) { _legacySnapshotUpsert(userId); return; }
    if (res.ok) {
      _casConflicts = 0;
      STATE_SYNC.writeMeta(SYNC_META_KEY, { uid: userId, base: res.rev, lrev: sentRev });
      _pushTables(userId);
      return;
    }
    // Refusé : un autre appareil a écrit la version res.rev
    if (++_casConflicts > 3) {
      console.warn('[MASSUP] user_state : conflits répétés, envoi suspendu jusqu’à la prochaine modif');
      _casConflicts = 0;
      return;
    }
    return _resolveCloudConflict(userId);
  }).catch(function(e) { console.warn('[MASSUP] user_state_put :', e && e.message); })
  .then(function() {
    _casInFlight = false;
    if (_casAgain) { _casAgain = false; _pushSnapshot(userId); }
  });
}
function _legacySnapshotUpsert(userId) {
  sbClient.from('user_state')
    .upsert({ user_id: userId, data: DB, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    .then(function(r) {
      if (r && r.error) { console.warn('[MASSUP] user_state upsert:', r.error.message); return; }
      _pushTables(userId);
    })
    .catch(function(e) { console.warn('[MASSUP] user_state upsert:', e.message); });
}
// Conflit : relire le cloud, y ajouter ce qui manque ici (fusion non destructive, tombstones locales
// respectées ; une suppression faite sur l'autre appareil peut revenir — jamais l'inverse), retenir sa version comme nouvelle base, puis sauvegarder → nouvel envoi conditionnel.
function _resolveCloudConflict(userId) {
  return sbClient.from('user_state').select('*').eq('user_id', userId).maybeSingle().then(function(r) {
    var row = r && r.data;
    if (r.error || !row || !row.data || typeof row.rev !== 'number') {
      console.warn('[MASSUP] Conflit de synchro : relecture du cloud impossible', r && r.error && r.error.message);
      return;
    }
    if (row.data.app === 'melati') { console.warn('[MASSUP] Ligne user_state Melati : jamais fusionnée ici'); return; }
    var meta = STATE_SYNC.metaFor(SYNC_META_KEY, userId);
    mergeBackupIntoDB(row.data);
    STATE_SYNC.writeMeta(SYNC_META_KEY, { uid: userId, base: row.rev, lrev: meta ? meta.lrev : -1 });
    saveDB(); // compteur local +1 → toujours « à envoyer » → syncToSupabase repart avec la bonne base
    try { if (typeof refreshAfterCloudMerge === 'function') refreshAfterCloudMerge(); } catch(e) {}
  });
}

// ─────────────────────────────────────────────────
// (27/08) RELECTURE CLOUD AU RETOUR AU PREMIER PLAN
// ─────────────────────────────────────────────────
// Sur iPhone, l'app épinglée sur l'écran d'accueil et Safari ont chacun LEUR stockage : quand
// Adrien alterne, la copie qu'il rouvre doit relire le cloud pour voir ce que l'autre a poussé.
// Léger et sans risque : une seule lecture de user_state, adoption UNIQUEMENT si le cloud est
// strictement plus récent (profile.rev) — jamais de merge, jamais pendant une séance LiveUp,
// jamais avec une écriture locale ou un push cloud en attente. Adoption = reload (UI propre).
var _fgHiddenAt = 0;
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') { _fgHiddenAt = Date.now(); return; }
  if (!_fgHiddenAt || Date.now() - _fgHiddenAt < 15000) return; // < 15 s caché : rien n'a pu bouger ailleurs
  _fgHiddenAt = 0;
  fgCloudCheck();
});
function fgCloudCheck() {
  if (!appInitialized || !sbClient || !_cloudPullOk || navigator.onLine === false) return;
  if (typeof AS !== 'undefined' && AS) return;                        // séance en cours
  if (typeof _saveDBTimer !== 'undefined' && _saveDBTimer) return;   // sauvegarde locale en attente
  if (_syncTimer) return;                                             // push cloud en attente
  sbClient.auth.getUser().then(function(res) {
    var userId = res.data && res.data.user && res.data.user.id;
    if (!userId) return;
    return sbClient.from('user_state').select('*').eq('user_id', userId).maybeSingle().then(function(r) {
      var row = r && r.data;
      if (r.error || !row || !row.data || row.data.app === 'melati') return;
      var serverRev = typeof row.rev === 'number' ? row.rev : null;
      var meta = STATE_SYNC.metaFor(SYNC_META_KEY, userId);
      if (serverRev !== null && meta) {
        // (13/10) Repère serveur : le cloud a-t-il bougé depuis notre dernière synchro ?
        if (serverRev <= meta.base) return;
        // Modifs locales pas encore envoyées → l'envoi conditionnel sera refusé puis fusionnera
        if (STATE_SYNC.isDirty(meta, _localRev())) { _doSyncToSupabase(userId); return; }
      } else {
        var cloudRev = (row.data.profile && row.data.profile.rev) || 0;
        if (cloudRev <= _localRev()) return;
      }
      if (!_adoptCloudSnapshot(row.data)) return;
      if (serverRev !== null) STATE_SYNC.writeMeta(SYNC_META_KEY, { uid: userId, base: serverRev, lrev: row.data.profile.rev });
      location.reload();
    });
  }).catch(function(e) { console.warn('[MASSUP] fgCloudCheck:', e && e.message); });
}

// ─────────────────────────────────────────────────
// (27/08) COMPTE : définir / changer le mot de passe depuis Paramètres
// ─────────────────────────────────────────────────
// Le compte d'Adrien a été créé par lien magique → aucun mot de passe. Depuis une session
// ouverte, updateUser pose le mot de passe (Supabase exige 6 caractères minimum côté API).
function fillAccountEmail() {
  var el = document.getElementById('acctEmail'); if (!el || !sbClient) return;
  sbClient.auth.getUser().then(function(res) {
    var u = res.data && res.data.user;
    el.textContent = u && u.email ? '· ' + u.email : '';
  }).catch(function(){});
}
function setAccountPassword() {
  var inp = document.getElementById('acctPw'), msg = document.getElementById('acctMsg');
  var pw = inp ? inp.value : '';
  function say(t, ok) { msg.textContent = t; msg.style.color = ok ? 'var(--acc)' : '#ff6b6b'; msg.style.display = ''; }
  if (!pw) { inp.focus(); return; }
  if (!sbClient) { say('Hors ligne : réessaie avec du réseau.'); return; }
  if (pw.length < 6) { say('Supabase impose 6 caractères minimum (côté serveur, pas contournable ici).'); return; }
  say('Enregistrement…', true);
  sbClient.auth.updateUser({ password: pw }).then(function(res) {
    if (res.error) { say('Refusé : ' + res.error.message); return; }
    inp.value = '';
    say('✓ Mot de passe enregistré — il marche tout de suite, dans Safari comme dans l’icône.', true);
    try { showToast('🔑 Mot de passe défini'); } catch(e) {}
  }).catch(function(e) { say('Erreur : ' + (e && e.message)); });
}
