/* ============================================================
   MODULE POLITIQUE — logique applicative (isolée du module muscu)
   Vanilla JS, pas de build. Tout vit dans la closure POLQ.

   PERSISTANCE « ne jamais perdre une réponse » (août 2026) — 4 couches :
     1. localStorage (brouillon, écrit à CHAQUE clic)             → instantané
     2. archive locale (instantanés horodatés, jamais effacée par « Refaire ») → anti-bêtise
     3. cloud Supabase `pol_store` (fusion par réponse, la plus récente gagne,
        JAMAIS d'écrasement d'un côté plein par un côté vide)        → anti-Safari*
     4. fichier .json exporté par l'utilisateur                     → anti-tout
   * Safari efface le stockage d'un site après 7 jours sans visite : c'est très
     probablement ce qui a fait « disparaître » les réponses par le passé.
   ============================================================ */
(function () {
  'use strict';

  var POL = window.POL;
  var V = window.POLV;
  var CLOUD = window.__POL_NO_CLOUD ? null : window.POLC; // __POL_NO_CLOUD : page de test locale, jamais de réseau
  var Q = POL.QUESTIONS;
  var APP_VERSION = '2026-09-01';

  // ── Version publique vs version privée (01/09) ──
  // Le site partagé est ANONYME : tout visiteur est « invité » (réponses uniquement sur
  // son appareil, AUCUN cloud, aucun prénom affiché). La version privée (profils +
  // cloud pol_store + notes) ne s'active que par le lien ?acces=adrien (une fois,
  // mémorisé sur l'appareil) — ?acces=off pour revenir à la version publique.
  var LS_OWNER = 'pol_owner';
  function isOwner() { try { return localStorage.getItem(LS_OWNER) === '1'; } catch (e) { return false; } }
  (function ownerBoot() {
    try {
      var loc = (location.search || '') + (location.hash || '');
      if (/[?#&]acces=adrien\b/.test(loc)) { localStorage.setItem(LS_OWNER, '1'); history.replaceState(null, '', location.pathname); }
      else if (/[?#&]acces=off\b/.test(loc)) { localStorage.removeItem(LS_OWNER); history.replaceState(null, '', location.pathname); }
      // migration : les appareils qui utilisaient déjà le site avant la version publique
      // (des réponses existent sous les clés historiques) restent en version privée
      if (localStorage.getItem(LS_OWNER) == null) {
        var da = JSON.parse(localStorage.getItem('pol_draft') || 'null');
        var dm = JSON.parse(localStorage.getItem('pol_draft_melati') || 'null');
        if ((da && da.answers && Object.keys(da.answers).length >= 5) || (dm && dm.answers && Object.keys(dm.answers).length >= 5)) localStorage.setItem(LS_OWNER, '1');
      }
    } catch (e) {}
  })();

  // ── Profils ──
  var LS_PROFILE = 'pol_profile';
  function getProfile() {
    if (!isOwner()) return 'invite';
    try { var p = localStorage.getItem(LS_PROFILE) || 'adrien'; return PROFILE_LABELS[p] ? p : 'adrien'; } catch (e) { return 'adrien'; }
  }
  var PROFILE_LABELS = { adrien: 'Adrien', melati: 'Melati', invite: 'Invité' };
  // ── Thème clair / sombre (réglage global de l'appareil, pas par profil) ──
  var LS_THEME = 'pol_theme';
  function getTheme() { try { return localStorage.getItem(LS_THEME) || 'auto'; } catch (e) { return 'auto'; } }
  function isDark() { var t = getTheme(); if (t === 'dark') return true; if (t === 'light') return false; try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { return false; } }
  function applyTheme(mode) {
    if (mode) { try { if (mode === 'auto') localStorage.removeItem(LS_THEME); else localStorage.setItem(LS_THEME, mode); } catch (e) {} }
    var t = getTheme(), root = document.documentElement;
    if (t === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
    var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', isDark() ? '#0B1020' : '#FFFFFF');
    var b = el('polTheme');
    if (b) {
      b.innerHTML = isDark()
        ? '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="4" stroke="currentColor" stroke-width="1.75" fill="none"></circle><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M13 3l-1.4 1.4M4.4 11.6 3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>'
        : '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>';
      b.title = isDark() ? 'Passer en clair' : 'Passer en sombre';
    }
  }
  function toggleTheme() { applyTheme(isDark() ? 'light' : 'dark'); }
  function setTheme(mode) { applyTheme(mode); var pr = el('polProfile'); if (state.profileTab === 'save' && pr && !pr.classList.contains('pol-hidden')) renderProfile(); }

  // ── État ──
  var state = {
    profile: getProfile(),
    answers: {},        // { qid: { optIdx, score, t } }  t = horodatage ms (pour la fusion cloud)
    notes: {},          // { qid: text }
    importance: {},     // { qid: 1..5 }
    pending: {},        // { qid: true } réponse donnée en NOTE, à faire valider par l'IA (pas encore d'option choisie)
    idx: 0,
    quizSet: 'main',    // 'main' | 'perso'
    lastChange: 0,      // ms — dernière modification locale
    cloud: { status: 'idle', at: null, msg: '' }, // idle | sync | ok | off | err | offline
    includeRetired: false,
    radarCand: null,
    duel: { a: null, b: null },
    reviewFilter: 'all', reviewMode: 'all', reviewSearch: '',
    candFilter: 'all', candView: 'list', actuTheme: 'all', actuCand: null,
    profileTab: 'res'
  };
  // ── Test express : les 38 questions choisies par Adrien (01/09 soir) — couvrent les
  // 9 thèmes, pour estimer au mieux l'avis et l'intention de vote en ~15 minutes.
  var EXPRESS_QIDS = [1, 2, 3, 4, 5, 8, 9, 11, 101, 16, 19, 21, 25, 27, 28, 29, 32, 33, 37, 38, 41, 42, 44, 47, 52, 56, 64, 66, 67, 70, 74, 77, 78, 83, 111, 89, 97, 112];
  var QX = Q.filter(function (q) { return EXPRESS_QIDS.indexOf(q.id) !== -1; });
  function activeQuestions() {
    if (state.quizSet === 'perso' && POL.QUESTIONS_PERSO) return POL.QUESTIONS_PERSO;
    if (state.quizSet === 'express') return QX;
    return Q;
  }
  function currentQ() { return activeQuestions()[state.idx]; }
  function isMelati() { return state.profile === 'melati'; }
  function isGuest() { return state.profile === 'invite'; }
  // Les notes personnelles (et la validation IA) = version privée uniquement, et pas en express
  function notesAllowed() { return isOwner() && !isGuest() && state.quizSet !== 'express'; }
  function pfx(base) { return state.profile === 'adrien' ? base : base + '_' + state.profile; }
  function cloudKey() { return 'pol-2027-' + state.profile; }
  function cloudEnabled() { return !!CLOUD && !isGuest(); } // invité : JAMAIS de réseau

  var LS_DRAFT = 'pol_draft', LS_RESULTS = 'pol_results_cache', LS_IMP = 'pol_importance', LS_ARCHIVE = 'pol_archive', LS_META = 'pol_meta', LS_FLAGS = 'pol_flags';

  // ── Helpers ──
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function cc(hex) { return 'color-mix(in srgb, ' + hex + ', #fff var(--pol-lift))'; }
  function shortName(n) { var p = String(n || '').trim().split(/\s+/); return p.length > 1 ? p[0][0] + '. ' + p.slice(1).join(' ') : n; }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  var _toastT;
  function toast(msg) {
    var t = el('polToast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(_toastT); _toastT = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }
  function fmtDate(iso) { try { return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return iso; } }
  function fmtDateShort(iso) { try { return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }); } catch (e) { return iso; } }
  function fmtTime(iso) { try { return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function stamp(d) { return d.toISOString().slice(0, 10); }
  function countAnswered(QS) { return QS.filter(function (x) { return state.answers[x.id] !== undefined; }).length; }
  function nowMs() { return Date.now(); }

  var VIEWS = ['polIntro', 'polQuiz', 'polResults', 'polReview', 'polProfile', 'polCandidats', 'polCompare', 'polMethodo'];
  function show(view) {
    VIEWS.forEach(function (v) { var node = el(v); if (node) node.classList.add('pol-hidden'); });
    var target = el('pol' + view.charAt(0).toUpperCase() + view.slice(1));
    if (target) { target.classList.remove('pol-hidden'); }
    state.view = view;
    window.scrollTo(0, 0);
  }
  function setNav(view) {
    // Nav resserrée (01/09 soir) : Accueil · Candidats · Comparer · Profil — le quiz se
    // lance depuis l'accueil, les résultats vivent dans Profil, la méthodo dans le footer.
    var map = { intro: 0, candidats: 1, compare: 2, profile: 3, review: 3, results: 3 };
    document.querySelectorAll('.pol-bni').forEach(function (b, i) { b.classList.toggle('active', map[view] === i); });
    var tv = view === 'review' ? 'results' : view;
    document.querySelectorAll('.pol-topnav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-view') === tv); });
  }

  // ════════════════════════════════════════════════
  // COUCHE 1 — localStorage (brouillon)
  // ════════════════════════════════════════════════
  function saveDraftLocal() {
    lsSet(pfx(LS_DRAFT), { answers: state.answers, notes: state.notes, importance: state.importance, pending: state.pending, lastChange: state.lastChange, v: APP_VERSION });
    lsSet(pfx(LS_IMP), state.importance || {});
    lsSet(pfx(LS_META), { lastChange: state.lastChange });
  }
  function loadLocal() {
    var d = lsGet(pfx(LS_DRAFT), null);
    state.answers = {}; state.notes = {}; state.importance = {}; state.pending = {};
    if (d) { state.answers = d.answers || {}; state.notes = d.notes || {}; state.pending = d.pending || {}; state.lastChange = d.lastChange || 0; }
    Object.keys(state.pending).forEach(function (k) { if (state.answers[k] || !state.notes[k]) delete state.pending[k]; });
    var imp = lsGet(pfx(LS_IMP), null);
    state.importance = imp || (d && d.importance) || {};
    if (isTestSeed(state.notes)) { state.answers = {}; state.notes = {}; state.importance = {}; state.pending = {}; state.lastChange = nowMs(); saveDraftLocal(); try { localStorage.removeItem(pfx(LS_RESULTS)); localStorage.removeItem(pfx(LS_ARCHIVE)); } catch (e) {} }
    // sanity : on ne garde que des réponses exploitables
    Object.keys(state.answers).forEach(function (k) { var a = state.answers[k]; if (!a || typeof a !== 'object' || a.optIdx == null) delete state.answers[k]; });
  }
  // Signature des données factices du harness de test (26/08/2026) — aucun vrai utilisateur ne peut avoir exactement ces notes
  function isTestSeed(notes) { return !!(notes && notes['17'] === 'Note test Q17' && notes['51'] === 'Note test Q51'); }
  function touch() { state.lastChange = nowMs(); saveDraftLocal(); scheduleCloudPush(); }

  // ════════════════════════════════════════════════
  // COUCHE 2 — archive locale (instantanés, jamais effacés par « Refaire »)
  // ════════════════════════════════════════════════
  function getArchive() { return lsGet(pfx(LS_ARCHIVE), []); }
  function snapshot(reason) {
    var n = Object.keys(state.answers).length;
    if (n === 0) return null;
    var arc = getArchive();
    var sig = JSON.stringify(state.answers);
    if (arc[0] && JSON.stringify(arc[0].answers) === sig && arc[0].reason === reason) return arc[0]; // identique → pas de doublon
    var rec = { id: 'snap-' + nowMs(), created_at: new Date().toISOString(), reason: reason || 'instantané', n: n,
      answers: JSON.parse(sig), notes: JSON.parse(JSON.stringify(state.notes)), importance: JSON.parse(JSON.stringify(state.importance)) };
    arc.unshift(rec); arc = arc.slice(0, 8);
    lsSet(pfx(LS_ARCHIVE), arc);
    return rec;
  }
  function restoreSnapshot(id) {
    var rec = getArchive().find(function (r) { return r.id === id; }); if (!rec) return;
    if (!window.confirm('Restaurer cet instantané (' + rec.n + ' réponses, ' + fmtDate(rec.created_at) + ') ?\n\nTes réponses actuelles sont d\'abord mises de côté dans l\'archive.')) return;
    snapshot('avant restauration');
    var t = nowMs();
    state.answers = {}; Object.keys(rec.answers).forEach(function (k) { var a = rec.answers[k]; state.answers[k] = { optIdx: a.optIdx, score: a.score, t: t }; });
    state.notes = rec.notes || {}; state.importance = rec.importance || {}; state.pending = {};
    Object.keys(state.notes).forEach(function (k) { if (!state.answers[k]) state.pending[k] = true; });
    touch(); toast(rec.n + ' réponses restaurées'); goProfile();
  }

  // ════════════════════════════════════════════════
  // COUCHE 3 — cloud (fusion sans perte)
  // ════════════════════════════════════════════════
  function bundle() {
    return { v: APP_VERSION, profile: state.profile, lastChange: state.lastChange, device: navigator.userAgent.slice(0, 80),
      answers: state.answers, notes: state.notes, importance: state.importance, pending: state.pending,
      results_cache: lsGet(pfx(LS_RESULTS), []), archive: getArchive() };
  }
  // Fusion : union des réponses, la plus récente gagne ; jamais de suppression.
  function mergeStates(local, remote) {
    var out = { answers: {}, notes: {}, importance: {}, pending: {}, results_cache: [], archive: [] };
    var lc = local.lastChange || 0, rc = remote.lastChange || 0;
    var keys = {};
    Object.keys(local.answers || {}).forEach(function (k) { keys[k] = 1; });
    Object.keys(remote.answers || {}).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (k) {
      var la = (local.answers || {})[k], ra = (remote.answers || {})[k];
      if (la && ra) out.answers[k] = ((ra.t || 0) > (la.t || 0)) ? ra : la;
      else out.answers[k] = la || ra;
    });
    function mergeMap(a, b) {
      var o = {}; var ks = {};
      Object.keys(a || {}).forEach(function (k) { ks[k] = 1; }); Object.keys(b || {}).forEach(function (k) { ks[k] = 1; });
      Object.keys(ks).forEach(function (k) {
        var va = (a || {})[k], vb = (b || {})[k];
        if (va != null && va !== '' && vb != null && vb !== '') o[k] = (rc > lc) ? vb : va;
        else o[k] = (va != null && va !== '') ? va : vb;
      });
      return o;
    }
    out.notes = mergeMap(local.notes, remote.notes);
    out.importance = mergeMap(local.importance, remote.importance);
    Object.keys(local.pending || {}).concat(Object.keys(remote.pending || {})).forEach(function (k) { if (!out.answers[k] && out.notes[k]) out.pending[k] = true; });
    var seen = {};
    (local.results_cache || []).concat(remote.results_cache || []).forEach(function (r) { if (r && r.created_at && !seen[r.created_at]) { seen[r.created_at] = 1; out.results_cache.push(r); } });
    out.results_cache.sort(function (a, b) { return a.created_at < b.created_at ? 1 : -1; }); out.results_cache = out.results_cache.slice(0, 30);
    var seenA = {};
    (local.archive || []).concat(remote.archive || []).forEach(function (r) { if (r && r.id && !seenA[r.id]) { seenA[r.id] = 1; out.archive.push(r); } });
    out.archive.sort(function (a, b) { return a.created_at < b.created_at ? 1 : -1; }); out.archive = out.archive.slice(0, 8);
    return out;
  }
  function setCloud(status, msg) { state.cloud.status = status; state.cloud.msg = msg || ''; if (status === 'ok') state.cloud.at = new Date().toISOString(); renderCloudChip(); }
  function renderCloudChip() {
    var c = el('polCloud'); if (!c) return;
    if (isGuest()) { c.className = 'pol-cloud'; c.innerHTML = ''; c.style.display = 'none'; return; }
    c.style.display = '';
    var s = state.cloud.status;
    var lbl = s === 'ok' ? 'Sauvegardé dans le cloud' + (state.cloud.at ? ' à ' + fmtTime(state.cloud.at) : '')
      : s === 'sync' || s === 'pending' ? 'Sauvegarde en cours…'
      : s === 'off' ? 'Cloud à activer' : s === 'offline' ? 'Hors-ligne' : s === 'err' ? 'Erreur cloud' : 'Sauvegarde cloud';
    c.className = 'pol-cloud pol-cloud-' + s;
    // icône seule + point d'état (le texte vit dans title / Profil → Sauvegarde)
    c.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 18h10a4 4 0 0 0 .9-7.9 5.5 5.5 0 0 0-10.6-1.4A4.5 4.5 0 0 0 7 18Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"></path></svg><span class="pol-cloud-dot"></span>';
    c.title = lbl + (state.cloud.msg ? ' — ' + state.cloud.msg : '');
  }
  var _pushT = null, _pushing = false, _pushAgain = false;
  function scheduleCloudPush() {
    clearTimeout(_pushT);
    if (!cloudEnabled()) return;
    if (state.cloud.status === 'off') return;
    if (state.cloud.status !== 'sync') setCloud('pending');
    _pushT = setTimeout(function () { cloudPush(false); }, 1500);
  }
  function cloudPush(keepalive) {
    if (!cloudEnabled()) return Promise.resolve();
    if (state.cloud.status === 'off') return Promise.resolve();
    if (!navigator.onLine) { setCloud('offline', 'Pas de réseau — la sauvegarde partira au retour du réseau.'); return Promise.resolve(); }
    if (_pushing) { _pushAgain = true; return Promise.resolve(); }
    _pushing = true; setCloud('sync');
    return CLOUD.save(cloudKey(), bundle(), keepalive).then(function (r) {
      _pushing = false;
      if (r && r.missing) { setCloud('off', 'Table pol_store absente : exécute pol_store.sql dans Supabase.'); return; }
      setCloud('ok', 'Sauvegardé dans le cloud à ' + fmtTime(new Date().toISOString()));
      if (_pushAgain) { _pushAgain = false; scheduleCloudPush(); }
    }).catch(function (e) { _pushing = false; setCloud('err', 'Erreur cloud : ' + (e && e.message || e)); });
  }
  // Au démarrage : lire le cloud, fusionner, réécrire des deux côtés si besoin.
  function cloudBoot(then) {
    if (!cloudEnabled()) { then && then(); return; }
    if (!navigator.onLine) { setCloud('offline'); then && then(); return; }
    setCloud('sync');
    var localB = bundle();
    CLOUD.load(cloudKey()).then(function (r) {
      if (r && r.missing) { setCloud('off', 'Table pol_store absente : exécute pol_store.sql dans Supabase.'); then && then(); return; }
      var remote = (r && r.row && r.row.data) || null;
      if (remote && isTestSeed(remote.notes)) remote = null; // données du harness de test → ignorées, écrasées par le local
      var merged = mergeStates(localB, remote || {});
      var localSig = JSON.stringify({ a: localB.answers, n: localB.notes, i: localB.importance, p: localB.pending });
      var mergedSig = JSON.stringify({ a: merged.answers, n: merged.notes, i: merged.importance, p: merged.pending });
      var remoteSig = remote ? JSON.stringify({ a: remote.answers || {}, n: remote.notes || {}, i: remote.importance || {}, p: remote.pending || {} }) : null;
      var gained = Object.keys(merged.answers).length - Object.keys(localB.answers).length;
      if (mergedSig !== localSig) {
        if (Object.keys(localB.answers).length) snapshot('avant fusion cloud');
        state.answers = merged.answers; state.notes = merged.notes; state.importance = merged.importance; state.pending = merged.pending || {};
        state.lastChange = Math.max(state.lastChange || 0, (remote && remote.lastChange) || 0);
        saveDraftLocal();
        if (gained > 0) toast('☁️ ' + gained + ' réponse' + (gained > 1 ? 's' : '') + ' récupérée' + (gained > 1 ? 's' : '') + ' depuis le cloud');
      }
      lsSet(pfx(LS_RESULTS), merged.results_cache);
      lsSet(pfx(LS_ARCHIVE), merged.archive);
      if (remoteSig !== mergedSig || !remote || JSON.stringify(merged.results_cache) !== JSON.stringify((remote && remote.results_cache) || [])) {
        cloudPush(false).then(function () { then && then(); });
      } else { setCloud('ok', 'Cloud à jour'); then && then(); }
    }).catch(function (e) { setCloud('err', 'Cloud injoignable : ' + (e && e.message || e)); then && then(); });
  }
  window.addEventListener('online', function () { if (state.cloud.status === 'offline' || state.cloud.status === 'pending') cloudPush(false); });

  // ════════════════════════════════════════════════
  // DÉMARRAGE
  // ════════════════════════════════════════════════
  function syncHeaderH() { var h = document.querySelector('.pol-header'); if (h && h.offsetHeight) document.documentElement.style.setProperty('--pol-header-h', h.offsetHeight + 'px'); }
  function renderFooter() {
    var line = el('polFooterMaj'); if (!line) return;
    var nRun = POL.CANDIDATES.filter(POL.isRunning).length;
    line.textContent = Q.length + ' questions · ' + nRun + ' candidats en course · positions et données à jour au ' + (POL.POSITIONS_DATE || POL.DATA_DATE);
  }
  function init() {
    applyTheme(); renderFooter();
    syncHeaderH(); setTimeout(syncHeaderH, 700); window.addEventListener('resize', syncHeaderH);
    try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { applyTheme(); }); } catch (e) {}
    renderProfileSwitch();
    renderCloudChip();
    bootApp();
  }
  function bootApp() {
    loadLocal();
    renderEntry();
    // migration douce : réponses sans horodatage → t=0 (le cloud, s'il en a de plus récentes, gagnera)
    cloudBoot(function () { if (!el('polIntro').classList.contains('pol-hidden')) renderIntro(); });
  }
  function renderProfileSwitch() {
    var box = el('polProfileSwitch'); if (!box) return;
    // Version publique : aucun sélecteur, aucun prénom — le visiteur est simplement chez lui.
    if (!isOwner()) { box.innerHTML = ''; return; }
    box.innerHTML = ['adrien', 'melati', 'invite'].map(function (p) {
      return '<button class="pol-prof-btn' + (state.profile === p ? ' on' : '') + '" onclick="POLQ.switchProfile(\'' + p + '\')">' + PROFILE_LABELS[p] + '</button>';
    }).join('');
  }
  function switchProfile(p) {
    if (p === state.profile) return;
    try { saveCurrentNote(); } catch (e) {}
    saveDraftLocal();
    state.profile = p;
    try { localStorage.setItem(LS_PROFILE, p); } catch (e) {}
    state.answers = {}; state.notes = {}; state.importance = {}; state.pending = {}; state.idx = 0; state.lastChange = 0; state.quizSet = 'main';
    state.cloud = { status: 'idle', at: null, msg: '' };
    renderProfileSwitch();
    renderCloudChip();
    toast(PROFILE_LABELS[p] + ' — profil chargé');
    setNav('intro');
    bootApp();
  }

  // ════════════════════════════════════════════════
  // ACCUEIL = tableau de bord
  // ════════════════════════════════════════════════
  function renderEntry() { renderIntro(); show('intro'); }
  function daysUntil(iso) { var d = new Date(iso + 'T00:00:00'); return Math.ceil((d - new Date()) / 86400000); }
  function newQuestions() { return Q.filter(function (q) { return q.isNew; }); }
  function renderIntro() {
    var mainAnswered = countAnswered(Q);
    var impSet = Q.filter(function (x) { return state.answers[x.id] !== undefined && state.importance[x.id] != null; }).length;
    var rc = lsGet(pfx(LS_RESULTS), []);
    var lastDate = rc[0] ? rc[0].created_at : null;
    var live = null;
    if (mainAnswered > 0) { var sv = state.quizSet; state.quizSet = 'main'; live = computeResults(); state.quizSet = sv; }
    var complete = mainAnswered === Q.length;
    var newQ = newQuestions(), newUnans = newQ.filter(function (q) { return state.answers[q.id] === undefined; }).length;
    var j1 = daysUntil('2027-04-18');

    var nRun = POL.CANDIDATES.filter(POL.isRunning).length, nFam = POL.FAMILIES ? POL.FAMILIES.length : 22, nAct = allActus().length;
    var hero = '<div class="pol-home-hero"><span class="pol-home-kicker">Présidentielle 2027 · J-' + j1 + '</span>' +
      '<h1>Pour qui voter en 2027&nbsp;?</h1>' +
      '<p class="pol-lead">' + Q.length + ' questions, ' + nRun + ' candidats en course, et pour chacun une position <strong>sourcée question par question</strong>. Réponds, pondère ce qui compte pour toi, et découvre de qui tes idées sont vraiment les plus proches.</p>' +
      '<div class="pol-home-cta">' + (mainAnswered > 0
        ? '<button class="pol-btn pol-btn-primary" onclick="POLQ.showResultsFromAnswers()">Voir mes résultats</button><a class="pol-linkbtn" onclick="POLQ.nav(\'quiz\')">' + (complete ? 'Revoir mes réponses →' : 'Continuer le quiz (' + (Q.length - mainAnswered) + ' restantes) →') + '</a>'
        : '<button class="pol-btn pol-btn-primary" onclick="POLQ.startExpress()">Faire le test express — ' + QX.length + ' questions, 15 minutes</button><a class="pol-linkbtn" onclick="POLQ.nav(\'quiz\')">Test complet (' + Q.length + ' questions) →</a><a class="pol-linkbtn" onclick="POLQ.nav(\'methodo\')">Comment ça marche →</a>') + '</div>' +
      '<div class="pol-figures"><div class="pol-figure"><div class="pol-figure-n">' + Q.length + '</div><div class="pol-figure-l">questions · 9 thèmes</div></div><div class="pol-figure"><div class="pol-figure-n">' + nRun + '</div><div class="pol-figure-l">candidats en course</div></div><div class="pol-figure"><div class="pol-figure-n">' + nAct + '</div><div class="pol-figure-l">prises de position datées</div></div><div class="pol-figure"><div class="pol-figure-n">' + (Q.length * nFam) + '</div><div class="pol-figure-l">positions renseignées</div></div></div>' +
    '</div>';
    // (01/09 soir) Accueil désencombré : « Comment ça marche » et « Nos principes »
    // vivent dans la Méthodologie (footer) — l'accueil garde l'essentiel.

    var recap;
    if (mainAnswered > 0 && live) {
      recap = '<div class="pol-slbl">Ton récap</div>' +
        '<div class="pol-card pol-recap">' +
          '<div class="pol-recap-top">' + V.ring(mainAnswered / Q.length, 'Complétion', complete ? '#18753C' : '#1B4DE4') +
            '<div class="pol-recap-txt"><div class="pol-global-label" style="background:' + live.globalPos.color + '">' + esc(live.globalPos.label) + '</div>' +
            '<div class="pol-recap-sub">' + (complete ? '<strong>Profil complet</strong> · ' + Q.length + '/' + Q.length : '<strong>' + mainAnswered + '</strong>/' + Q.length + ' questions' + (countAnswered(QX) === QX.length ? ' · express complet' : '')) + '<br>' + impSet + '/' + mainAnswered + ' pertinences réglées' + (pendingCount(Q) ? '<br><strong>' + pendingCount(Q) + '</strong> réponse' + (pendingCount(Q) > 1 ? 's' : '') + ' en note à valider' : '') + (lastDate ? '<br>Dernier bilan : ' + fmtDate(lastDate) : '') + '</div></div></div>' +
          (live.matches[0] ? '<div class="pol-summary-top3">' + live.matches.slice(0, 3).map(function (m, i) { return '<div class="pol-summary-cand"><span class="pol-cand-rank">' + (i + 1) + '</span>' + candAvatar(m, 'sm') + '<span class="pol-summary-cand-name">' + esc(m.name) + '<span class="pol-summary-cand-party">' + esc(m.party) + '</span></span><span class="pol-summary-cand-pct">' + m.match + '%</span></div>'; }).join('') + '</div>' : '') +
          '<button class="pol-btn pol-btn-primary" style="margin-top:.9rem" onclick="POLQ.showResultsFromAnswers()">Voir mes résultats</button>' +
          '<div class="pol-btn-row" style="margin-top:.6rem">' +
            (mainAnswered < Q.length ? '<button class="pol-btn pol-btn-line pol-btn-sm" onclick="POLQ.nav(\'quiz\')">Continuer (' + (Q.length - mainAnswered) + ' restantes)</button>' : '<button class="pol-btn pol-btn-line pol-btn-sm" onclick="POLQ.reviseQuiz()">Revoir / affiner</button>') +
            '<button class="pol-btn pol-btn-ghost pol-btn-sm" onclick="POLQ.goReview()">Mes réponses</button>' +
          '</div>' +
        '</div>';
    } else {
      recap = '<div class="pol-card"><p class="pol-sub" style="margin:0 0 .9rem">' + Q.length + ' questions, 9 thèmes, ' + POL.CANDIDATES.filter(POL.isRunning).length + ' candidats en course. Découvre ton profil politique et les candidats les plus proches de tes idées.</p>' +
        '<button class="pol-btn pol-btn-primary" onclick="POLQ.nav(\'quiz\')">Commencer le quiz</button></div>';
    }

    var newCard = '';
    if (newUnans > 0 && mainAnswered > 0) {
      newCard = '<div class="pol-card pol-new-card"><div class="pol-perso-top"><span><strong>' + newUnans + ' nouvelle' + (newUnans > 1 ? 's' : '') + ' question' + (newUnans > 1 ? 's' : '') + ' « actu 2026-2027 »</strong><br><span class="pol-sub">Taxe Zucman, capitalisation, priorité nationale, réarmement, ZFE, Palestine, réseaux sociaux… ajoutées le ' + esc(POL.DATA_DATE) + '.</span></span></div>' +
        '<button class="pol-btn pol-btn-primary pol-btn-sm" style="margin-top:.7rem;width:100%" onclick="POLQ.startNewOnly()">Répondre aux nouvelles questions</button></div>';
    }

    var cloudCard = renderCloudCard(true);

    var actus = allActus(), seenD = lsGet(LS_ACTU_SEEN, ''), nNew = actus.filter(function (a) { return a.d > seenD; }).length;
    var actuCard = '';
    if (actus.length) {
      var ev = (POL.EVENTS || [])[0];
      actuCard = '<div class="pol-slbl">Fil d\'actu de la campagne' + (nNew ? ' <span class="pol-actu-n">' + nNew + ' nouv.</span>' : '') + '</div><div class="pol-card pol-actu-home">' +
        (ev ? '<div class="pol-actu-event-mini"><strong>' + esc(ev.label) + '</strong> · ' + esc(fmtDecl(ev.d)) + '<br><span class="pol-sub">' + esc(ev.txt.length > 240 ? ev.txt.slice(0, 237) + '…' : ev.txt) + '</span></div>' : '') +
        actus.slice(0, 3).map(function (a) { var c = candByName(a.c); return '<div class="pol-actu-mini"><span class="pol-cand-dot" style="background:' + (c ? c.color : '#888') + '"></span><span><strong>' + esc(a.c.split(' ').slice(-1)[0]) + '</strong> · ' + POL.themeEmoji(a.th) + ' ' + esc(a.txt.length > 120 ? a.txt.slice(0, 117) + '…' : a.txt) + (live ? ' ' + actuTag(a, live.profile) : '') + '</span></div>'; }).join('') +
        '<button class="pol-btn pol-btn-line pol-btn-sm" style="margin-top:.7rem;width:100%" onclick="POLQ.openActu()">Tout le fil d\'actu (' + actus.length + ' prises de position)</button></div>';
    }

    var dates = POL.KEY_DATES.filter(function (d) { return daysUntil(d.date) >= -1; }).slice(0, 3);
    var datesCard = '<div class="pol-slbl">Prochaines étapes de la campagne</div><div class="pol-card pol-dates">' +
      dates.map(function (d) { var n = daysUntil(d.date); return '<div class="pol-date-row"><span class="pol-date-badge">' + (n <= 0 ? 'auj.' : 'J-' + n) + '</span><span class="pol-date-lbl"><strong>' + esc(new Date(d.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })) + '</strong> · ' + esc(d.label) + '</span></div>'; }).join('') +
      '<div class="pol-sub" style="font-size:.72rem;margin-top:.5rem">Données à jour au ' + esc(POL.DATA_DATE) + ' · sondages ' + esc(POL.POLLS_DATE) + '.</div></div>';

    // Quiz sur-mesure : version privée uniquement (questions personnelles)
    var persoCard = '';
    if (isOwner() && !isGuest() && POL.QUESTIONS_PERSO) {
      var persoN = POL.QUESTIONS_PERSO.length;
      var persoAnswered = countAnswered(POL.QUESTIONS_PERSO);
      persoCard = '<div class="pol-slbl">Quiz sur-mesure</div>' +
        '<div class="pol-card pol-perso-card">' +
          '<div class="pol-perso-top"><span><strong>' + persoN + ' questions pour toi</strong><br><span class="pol-sub">Pensées pour un jeune créatif freelance à Paris : IA &amp; création, indépendants &amp; URSSAF, logement, culture… Chaque candidat y a désormais sa position question par question, avec un classement dédié.</span></span></div>' +
          '<div class="pol-btn-row" style="margin-top:.7rem">' +
            '<button class="pol-btn pol-btn-line pol-btn-sm" style="flex:1" onclick="POLQ.startPerso()">' + (persoAnswered >= persoN ? 'Revoir mes réponses' : persoAnswered > 0 ? 'Continuer (' + persoAnswered + '/' + persoN + ')' : 'Faire le quiz sur-mesure') + '</button>' +
            (persoAnswered > 0 ? '<button class="pol-btn pol-btn-primary pol-btn-sm" style="flex:1" onclick="POLQ.showPersoResults()">Résultats créa</button>' : '') +
          '</div>' +
        '</div>';
    }

    // Carte test express (tout le monde) — tant que le test complet n'est pas fini
    var xAnswered = countAnswered(QX), xDone = xAnswered === QX.length;
    var expressCard = '';
    if (!complete) {
      expressCard = '<div class="pol-slbl">Test express</div>' +
        '<div class="pol-card pol-express-card">' +
          '<div class="pol-perso-top"><span><strong>' + QX.length + ' questions clés · ~15 minutes</strong><br><span class="pol-sub">Les questions qui départagent vraiment les candidats, sur les 9 thèmes — avec une jauge d\'importance à régler pour chacune. Résultat : ton classement complet des candidats.</span></span></div>' +
          '<button class="pol-btn pol-btn-primary pol-btn-sm" style="margin-top:.7rem;width:100%" onclick="POLQ.startExpress()">' + (xDone ? 'Revoir le test express' : xAnswered > 0 ? 'Continuer (' + xAnswered + '/' + QX.length + ')' : 'Faire le test express') + '</button>' +
        '</div>';
    }

    var note = '<div class="pol-neutral-note"><strong>Notation pondérée</strong> : les sujets essentiels comptent plus, et tu règles toi-même la pertinence de chaque question (1-5). ' +
      (isMelati() ? 'Espace Melati, séparé.' : 'Neutre et pédagogique, tes réponses restent privées.') + '</div>';

    el('polIntro').innerHTML = hero + '<div class="pol-cols"><div class="pol-col">' + (mainAnswered > 0 ? recap : '') + newCard + expressCard + persoCard + '</div><div class="pol-col pol-col-side">' + actuCard + datesCard + cloudCard + '</div></div>';
  }

  // Carte cloud (accueil compact / profil détaillé)
  function renderCloudCard(compact) {
    if (isGuest()) {
      if (compact) return '<div class="pol-cloud-line ok">Tes réponses restent <strong>uniquement sur cet appareil</strong> — pas de compte, rien n\'est envoyé.</div>';
      return '<div class="pol-slbl">Sauvegarde</div><div class="pol-card pol-cloud-card"><div class="pol-cloud-txt"><strong>Aucun compte, aucun serveur</strong> : tes réponses sont enregistrées automatiquement sur cet appareil (et nulle part ailleurs). Tu peux les exporter dans un fichier pour les garder ou les transférer.</div>' +
        '<div class="pol-btn-row" style="margin-top:.7rem"><button class="pol-btn pol-btn-line pol-btn-sm" onclick="POLQ.exportBackup()">Fichier</button><button class="pol-btn pol-btn-ghost pol-btn-sm" onclick="POLQ.importBackup()">Restaurer</button></div></div>';
    }
    var s = state.cloud.status, n = Object.keys(state.answers).length;
    var line, cls = '';
    if (s === 'ok') { line = '<strong>Sauvegardé dans le cloud</strong> · ' + (state.cloud.at ? fmtDate(state.cloud.at) + ' à ' + fmtTime(state.cloud.at) : '') + ' · ' + n + ' réponses'; cls = 'ok'; }
    else if (s === 'sync' || s === 'pending') { line = 'Sauvegarde cloud en cours…'; }
    else if (s === 'offline') { line = 'Hors-ligne : tes réponses sont sur l\'appareil, elles partiront au retour du réseau.'; cls = 'warn'; }
    else if (s === 'err') { line = 'Cloud injoignable pour le moment (' + esc(state.cloud.msg) + '). Tes réponses restent sur l\'appareil.'; cls = 'warn'; }
    else if (s === 'off') { line = '<strong>Cloud à activer</strong> : la table <code>pol_store</code> n\'existe pas encore dans Supabase. Exécute <code>politique/pol_store.sql</code> (SQL Editor → Run), puis recharge. En attendant, pense au fichier de sauvegarde.'; cls = 'warn'; }
    else { line = '☁️ Sauvegarde cloud'; }
    var ios = /iPhone|iPad/.test(navigator.userAgent) && !window.navigator.standalone;
    var iosNote = ios && (s !== 'ok') ? '<div class="pol-sub" style="font-size:.74rem;margin-top:.5rem">Safari peut effacer le stockage d\'un site après 7 jours sans visite. Ajoute la page à l\'écran d\'accueil (Partager → Sur l\'écran d\'accueil) pour l\'éviter.</div>' : '';
    if (compact && s === 'ok') return '<div class="pol-cloud-line ' + cls + '">' + line + '</div>';
    return '<div class="pol-slbl">Sauvegarde</div><div class="pol-card pol-cloud-card ' + cls + '"><div class="pol-cloud-txt">' + line + '</div>' + iosNote +
      '<div class="pol-btn-row" style="margin-top:.7rem">' +
        '<button class="pol-btn pol-btn-line pol-btn-sm" onclick="POLQ.exportBackup()">Fichier</button>' +
        '<button class="pol-btn pol-btn-ghost pol-btn-sm" onclick="POLQ.importBackup()">Restaurer</button>' +
        (s !== 'off' ? '<button class="pol-btn pol-btn-ghost pol-btn-sm" onclick="POLQ.cloudNow()">Synchroniser</button>' : '') +
      '</div></div>';
  }
  function cloudNow() { if (!cloudEnabled()) return; if (state.cloud.status === 'off') { toast('Exécute pol_store.sql dans Supabase pour activer le cloud'); return; } toast('Synchronisation…'); cloudBoot(function () { toast(state.cloud.status === 'ok' ? '☁️ Cloud à jour' : 'Cloud : ' + state.cloud.status); refreshCurrent(); }); }
  function refreshCurrent() {
    if (!el('polIntro').classList.contains('pol-hidden')) renderIntro();
    else if (!el('polProfile').classList.contains('pol-hidden')) renderProfile();
  }

  // ════════════════════════════════════════════════
  // QUIZ
  // ════════════════════════════════════════════════
  function startQuiz(fresh) {
    state.quizSet = 'main';
    if (fresh) {
      var n = Object.keys(state.answers).length;
      if (n > 0 && !window.confirm('Refaire le quiz depuis zéro ?\n\nTes ' + n + ' réponses actuelles sont conservées dans l\'archive (Profil → Archive) et dans le cloud : rien n\'est perdu, tu pourras les restaurer.')) return;
      snapshot('avant « refaire le quiz »');
      var t = nowMs();
      state.answers = {}; state.notes = {}; state.importance = {}; state.pending = {}; state.idx = 0; state.lastChange = t;
      saveDraftLocal(); scheduleCloudPush();
    } else { state.idx = firstUnanswered(); }
    show('quiz'); setNav('quiz'); renderQuestion();
  }
  function reviseQuiz() { state.quizSet = 'main'; state.idx = 0; show('quiz'); setNav('quiz'); renderQuestion(); }
  function startMainQuiz() {
    state.quizSet = 'main';
    var n = countAnswered(Q);
    state.idx = (n > 0 && n < Q.length) ? firstUnanswered() : 0;
    show('quiz'); renderQuestion();
  }
  function startNewOnly() {
    state.quizSet = 'main';
    var i = Q.findIndex(function (q) { return q.isNew && state.answers[q.id] === undefined; });
    state.idx = i >= 0 ? i : 0; show('quiz'); setNav('quiz'); renderQuestion();
  }
  function startExpress() {
    state.quizSet = 'express';
    var n = countAnswered(QX);
    state.idx = (n > 0 && n < QX.length) ? firstUnanswered() : 0;
    show('quiz'); setNav('quiz'); renderQuestion();
  }
  function startPerso() {
    if (!POL.QUESTIONS_PERSO || !isOwner() || isGuest()) { toast('Quiz sur-mesure indisponible'); return; }
    state.quizSet = 'perso';
    var P = POL.QUESTIONS_PERSO; state.idx = 0;
    for (var i = 0; i < P.length; i++) { if (state.answers[P[i].id] === undefined) { state.idx = i; break; } }
    show('quiz'); setNav('quiz'); renderQuestion();
  }
  function firstUnanswered() {
    var QS = activeQuestions();
    for (var i = 0; i < QS.length; i++) { if (state.answers[QS[i].id] === undefined) return i; }
    return QS.length - 1;
  }
  function jumpTo(i) { saveCurrentNote(); state.idx = i; renderQuestion(); }
  function toggleMap() { var m = el('polQMap'); if (m) m.classList.toggle('pol-hidden'); }

  // Options affichées triées par position (droite → gauche), l'indice réel (stocké) est conservé
  function sortedOptions(q) { return q.options.map(function (o, i) { return { o: o, i: i }; }).sort(function (a, b) { return a.o.score - b.o.score; }); }
  function pendingCount(QS) { return (QS || Q).filter(function (x) { return state.pending[x.id] && !state.answers[x.id]; }).length; }

  function renderQuestion() {
    var QS = activeQuestions();
    if (state.idx < 0) state.idx = 0;
    if (state.idx >= QS.length) { finishQuiz(); return; }
    var q = QS[state.idx];
    var answeredCount = countAnswered(QS);
    var pct = Math.round((answeredCount / QS.length) * 100);
    var secColor = POL.SECTION_COLORS[q.theme];
    var sel = state.answers[q.id];
    var note = state.notes[q.id] || '';
    var persoTag = state.quizSet === 'perso' ? '<span class="pol-q-badge" style="background:#1B4DE422;color:var(--pol-blue)">Sur-mesure</span> ' : (state.quizSet === 'express' ? '<span class="pol-q-badge pol-q-express">Express</span> ' : '');
    var newTag = q.isNew ? '<span class="pol-q-badge pol-q-new">Actu 2026</span> ' : (q.updated ? '<span class="pol-q-badge pol-q-upd">MAJ ' + esc(q.updated) + '</span> ' : '');

    var optsHtml = sortedOptions(q).map(function (so) {
      var i = so.i, o = so.o; var on = sel && sel.optIdx === i;
      return '<button class="pol-opt' + (on ? ' sel' : '') + '" data-idx="' + i + '" onclick="POLQ.select(' + q.id + ',' + i + ')">' +
        '<span class="pol-opt-radio"></span><span class="pol-opt-txt">' + esc(o.text) + '</span></button>';
    }).join('');
    var isPending = !!state.pending[q.id];

    var essential = (q.w || POL.baseCoef(q.id)) >= 3;
    var impVal = state.importance[q.id];
    var minImp = essential ? 3 : 1;
    var tag = essential ? '<span class="pol-imp-tag central">Essentielle</span>' : (POL.baseCoef(q.id) <= 1 && !q.w ? '<span class="pol-imp-tag minor">Secondaire</span>' : '');
    var impBtns = [1, 2, 3, 4, 5].map(function (n) {
      var off = n < minImp; var on = impVal === n;
      if (off) return '<button class="pol-imp-btn off" disabled>' + n + '</button>';
      return '<button class="pol-imp-btn' + (on ? ' on' : '') + '" onclick="POLQ.setImportance(' + q.id + ',' + n + ')">' + n + '</button>';
    }).join('');
    var impHtml;
    if (state.quizSet === 'express') {
      // Express : jauge animée gauche → droite (remplace les 5 boutons)
      var curV = impVal || null;
      var thumbLeft = ((Math.max(curV || minImp, minImp) - 1) / 4) * 100;
      impHtml =
        '<div class="pol-imp' + (impVal == null ? ' pol-imp-todo' : '') + '">' +
          '<div class="pol-imp-head"><span>Ce sujet compte pour toi&nbsp;?</span>' + tag + '</div>' +
          '<div class="pol-gauge" id="polGauge" data-qid="' + q.id + '" data-min="' + minImp + '">' +
            '<div class="pol-gauge-track" id="polGaugeTrack">' +
              '<div class="pol-gauge-fill" id="polGaugeFill"></div>' +
              [1, 2, 3, 4, 5].map(function (n) { return '<span class="pol-gauge-dot' + (n < minImp ? ' off' : '') + '" style="left:' + ((n - 1) * 25) + '%"></span>'; }).join('') +
              '<div class="pol-gauge-thumb' + (curV ? '' : ' idle') + '" id="polGaugeThumb" style="left:' + thumbLeft + '%"></div>' +
            '</div>' +
            '<div class="pol-gauge-lblrow"><span>Peu</span><span class="pol-gauge-val" id="polGaugeVal">' + (curV ? '' : 'Fais glisser la jauge') + '</span><span>Crucial</span></div>' +
          '</div>' +
        '</div>';
    } else {
      impHtml =
        '<div class="pol-imp' + (impVal == null ? ' pol-imp-todo' : '') + '">' +
          '<div class="pol-imp-head"><span>Pertinence pour l\'avenir de la France</span>' + tag + '</div>' +
          '<div class="pol-imp-scale">' + impBtns + '</div>' +
          '<div class="pol-imp-legend"><span>Peu pertinente</span><span>Cruciale</span></div>' +
          '<div class="pol-imp-hint">Pas « à quel point ta réponse est forte », mais à quel point <strong>ce sujet compte pour l\'avenir du pays</strong>.</div>' +
        '</div>';
    }

    // sommaire (grille de navigation)
    var map = '<div id="polQMap" class="pol-qmap pol-hidden">' + POL.SECTIONS.map(function (s) {
      var items = QS.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) { return o.x.theme === s; });
      if (!items.length) return '';
      return '<div class="pol-qmap-sec"><div class="pol-qmap-lbl" style="color:' + POL.SECTION_COLORS[s] + '">' + esc(POL.SECTION_LABELS[s]) + '</div><div class="pol-qmap-grid">' +
        items.map(function (o) { var a = state.answers[o.x.id] !== undefined; var cur = o.i === state.idx; var pend = !a && state.pending[o.x.id]; return '<button class="pol-qmap-chip' + (a ? ' done' : '') + (pend ? ' pend' : '') + (cur ? ' cur' : '') + (o.x.isNew ? ' new' : '') + '" onclick="POLQ.jumpTo(' + o.i + ')" title="' + esc(o.x.question) + '">' + (o.i + 1) + '</button>'; }).join('') + '</div></div>';
    }).join('') + '</div>';

    el('polQuiz').innerHTML =
      '<div class="pol-progress-wrap">' +
        '<div class="pol-progress-meta"><span>Question ' + (state.idx + 1) + ' / ' + QS.length + '</span><button class="pol-map-btn" onclick="POLQ.toggleMap()">Sommaire</button><span>' + answeredCount + ' répondu' + (answeredCount > 1 ? 's' : '') + (pendingCount(QS) ? ' · ' + pendingCount(QS) + ' à valider' : '') + ' · ' + pct + '%</span></div>' +
        '<div class="pol-progress-track"><div class="pol-progress-fill" style="width:' + pct + '%"></div></div>' +
      '</div>' + map +
      '<div style="padding-top:.6rem">' +
        persoTag + newTag + '<span class="pol-q-badge">' + esc(POL.SECTION_LABELS[q.theme]) + '</span>' +
        '<h2 class="pol-q-title">' + esc(q.question) + '</h2>' +
        '<div class="pol-q-body"><div class="pol-q-left"><div class="pol-q-expl">' + q.explanation + '</div></div><div class="pol-q-right">' +
        '<div class="pol-opts">' + optsHtml + '</div>' +
        '<div class="pol-who-toggle"><button class="pol-linkbtn" onclick="POLQ.toggleWho(' + q.id + ',\'polWhoQ\')">Qui répond quoi ? (position des candidats)</button></div><div id="polWhoQ" class="pol-hidden"></div>' +
        (notesAllowed() ? '<div class="pol-pending-box' + (isPending ? ' on' : '') + '">' + (isPending ? '<strong>Réponse en note, à faire valider par l\'IA</strong> (aucune option cochée). Tu pourras la transformer en option plus tard (Résultats → notes à valider).' : '') + '</div>' : '') +
        impHtml +
        (notesAllowed() ? '<button class="pol-note-toggle" onclick="POLQ.toggleNote()">' + (note ? 'Ma note personnelle' : '＋ Ajouter une note — en complément de ton choix, ou à la place si aucune option ne colle') + '</button>' +
        '<textarea id="polNote" class="pol-note-area ' + (note ? '' : 'pol-hidden') + '" placeholder="Complète ton choix avec tes mots — ou réponds entièrement ici : sans option cochée, ta note passera en à valider et l\'IA choisira l\'option avec toi." onblur="POLQ.saveNote(' + q.id + ')">' + esc(note) + '</textarea>' : '') +
        '<div class="pol-save-hint">Sauvegarde automatique sur cet appareil' + (state.cloud.status === 'ok' || state.cloud.status === 'pending' || state.cloud.status === 'sync' ? ' et dans ton cloud' : '') + '.</div>' +
        '<div class="pol-qnav">' +
          (state.idx > 0 ? '<button class="pol-btn pol-btn-line" onclick="POLQ.prev()">← Précédente</button>' : '') +
          '<button class="pol-btn pol-btn-ghost" onclick="POLQ.skip()">Passer</button>' +
          '<button class="pol-btn pol-btn-primary" onclick="POLQ.next()">' + (state.idx === QS.length - 1 ? 'Terminer' : 'Suivante →') + '</button>' +
        '</div>' +
      '</div></div></div>';
    if (state.quizSet === 'express') initGauge();
  }

  // ── Jauge express : glisse gauche → droite, cran = classe g1…g5 (couleurs en jetons, Direction A) ──
  var GAUGE_LABELS = [null, '1 · Peu important', '2 · Un peu important', '3 · Important', '4 · Très important', '5 · Crucial'];
  function gaugePaint(val, animate) {
    var g = el('polGauge'), th = el('polGaugeThumb'), fl = el('polGaugeFill'), tv = el('polGaugeVal');
    if (!g || !th || !val) return;
    var left = ((val - 1) / 4) * 100;
    th.classList.remove('idle');
    g.className = 'pol-gauge g' + val;
    th.style.left = left + '%';
    if (fl) fl.style.width = left + '%';
    if (tv) tv.textContent = GAUGE_LABELS[val];
    if (animate) { th.classList.remove('pop'); void th.offsetWidth; th.classList.add('pop'); }
  }
  function initGauge() {
    var g = el('polGauge'); if (!g) return;
    var track = el('polGaugeTrack');
    var qid = Number(g.getAttribute('data-qid')), minImp = Number(g.getAttribute('data-min')) || 1;
    if (state.importance[qid]) gaugePaint(state.importance[qid], false);
    var dragging = false;
    function valueFrom(ev) {
      var r = track.getBoundingClientRect();
      var x = (ev.clientX != null ? ev.clientX : (ev.touches && ev.touches[0] ? ev.touches[0].clientX : 0)) - r.left;
      var v = Math.round((x / Math.max(1, r.width)) * 4) + 1;
      return Math.max(minImp, Math.min(5, v));
    }
    function apply(ev, animate) {
      var v = valueFrom(ev);
      if (state.importance[qid] !== v) setImportance(qid, v);
      gaugePaint(v, animate);
    }
    track.addEventListener('pointerdown', function (ev) { dragging = true; try { track.setPointerCapture(ev.pointerId); } catch (e) {} apply(ev, true); ev.preventDefault(); });
    track.addEventListener('pointermove', function (ev) { if (dragging) apply(ev, false); });
    ['pointerup', 'pointercancel'].forEach(function (evt) { track.addEventListener(evt, function () { if (dragging) { dragging = false; gaugePaint(state.importance[qid], true); } }); });
  }
  function toggleNote() { var ta = el('polNote'); if (ta) ta.classList.toggle('pol-hidden'); if (ta && !ta.classList.contains('pol-hidden')) ta.focus(); }
  function select(qid, optIdx) {
    var q = activeQuestions().find(function (x) { return x.id === qid; });
    state.answers[qid] = { optIdx: optIdx, score: q.options[optIdx].score, t: nowMs() };
    touch();
    delete state.pending[qid];
    var btns = el('polQuiz').querySelectorAll('.pol-opt');
    btns.forEach(function (b) { b.classList.toggle('sel', Number(b.getAttribute('data-idx')) === optIdx); });
    var pb = el('polQuiz').querySelector('.pol-pending-box'); if (pb) pb.classList.remove('on');
    var chip = el('polQMap') && el('polQMap').querySelector('.pol-qmap-chip.cur'); if (chip) chip.classList.add('done');
  }
  function setImportance(qid, val) {
    var q = activeQuestions().find(function (x) { return x.id === qid; });
    if (q && (q.w || POL.baseCoef(qid)) >= 3 && val < 3) return;
    state.importance[qid] = val;
    touch();
    var box = el('polQuiz');
    box.querySelectorAll('.pol-imp-btn').forEach(function (b, i) { b.classList.toggle('on', (i + 1) === val); });
    gaugePaint(val, true); // jauge express (no-op si absente)
    var wrap = box.querySelector('.pol-imp'); if (wrap) wrap.classList.remove('pol-imp-todo');
  }
  function canLeaveCurrent() {
    var q = currentQ(); if (!q) return true;
    if (state.answers[q.id] !== undefined && state.importance[q.id] == null) {
      toast(state.quizSet === 'express' ? 'Règle la jauge d\'importance pour continuer' : 'Choisis la pertinence de cette question pour continuer');
      var w = el('polQuiz').querySelector('.pol-imp'); if (w) { w.classList.add('pol-imp-todo'); w.scrollIntoView({ block: 'center' }); }
      return false;
    }
    return true;
  }
  // (01/09) Fusion des deux boutons note : UNE seule zone. Une note SANS option cochée
  // passe automatiquement la question en « à valider par l'IA » ; avec une option
  // cochée, la note est un complément (l'ancien bouton « Aucune option ne colle ? »
  // faisait doublon avec « Ajouter une note personnelle »).
  function saveNote(qid) {
    var ta = el('polNote'); if (!ta) return;
    var v = ta.value.trim();
    var before = state.notes[qid] || '';
    if (v) state.notes[qid] = v; else delete state.notes[qid];
    if (v && state.answers[qid] === undefined) state.pending[qid] = true;
    if (!v) delete state.pending[qid];
    var pb = el('polQuiz') && el('polQuiz').querySelector('.pol-pending-box');
    if (pb) {
      pb.classList.toggle('on', !!state.pending[qid]);
      if (state.pending[qid]) pb.innerHTML = '<strong>Réponse en note, à faire valider par l\'IA</strong> (aucune option cochée). Tu pourras la transformer en option plus tard (Résultats → notes à valider).';
    }
    if (v !== before) touch();
  }
  // Si on quitte une question « en note » sans texte, on annule le statut à valider
  function cleanPendingCurrent() { var q = currentQ(); if (q && state.pending[q.id] && !state.notes[q.id]) { delete state.pending[q.id]; saveDraftLocal(); } }
  function saveCurrentNote() { var q = currentQ(); if (q) saveNote(q.id); }
  function prev() { saveCurrentNote(); cleanPendingCurrent(); state.idx--; renderQuestion(); }
  function skip() { if (!canLeaveCurrent()) return; saveCurrentNote(); cleanPendingCurrent(); state.idx++; renderQuestion(); }
  function next() {
    if (!canLeaveCurrent()) return;
    saveCurrentNote(); cleanPendingCurrent();
    if (state.idx === activeQuestions().length - 1) { finishQuiz(); return; }
    state.idx++; renderQuestion();
  }

  // ════════════════════════════════════════════════
  // CALCULS
  // ════════════════════════════════════════════════
  function runningCands() { return POL.CANDIDATES.filter(function (c) { return state.includeRetired || POL.isRunning(c); }); }
  // ── Matching « programme » question par question (positions.js), mis en cache tant que rien ne change ──
  var _mqCache = { key: null, map: {} };
  function mqKey() { return state.profile + '|' + state.lastChange + '|' + Object.keys(state.answers).length + '|' + Object.keys(state.importance).length; }
  function mqOf(c) {
    if (!c || !POL.matchByQuestions || Object.keys(state.answers).length === 0) return null;
    var k = mqKey(); if (_mqCache.key !== k) { _mqCache.key = k; _mqCache.map = {}; }
    if (_mqCache.map[c.name] === undefined) { var r = POL.matchByQuestions(state.answers, state.importance, Q, c); _mqCache.map[c.name] = r.pct == null ? false : r; }
    return _mqCache.map[c.name] || null;
  }
  function themePctLabel(c, s) { var mq = mqOf(c); var t = mq && mq.themes[s]; return (t && t.pct != null) ? t.pct + ' % d\'accord' : c.scores[s] + '/10'; }
  function buildMatches(profile, cands) {
    return (cands || runningCands()).map(function (c) {
      var mq = mqOf(c);
      return { name: c.name, party: c.party, color: c.color, scores: c.scores, oneLiner: c.oneLiner || '', program: c.program || null, status: c.status || '', bloc: c.bloc,
        match: mq ? mq.pct : POL.computeMatch(profile, c.scores), mq: mq, covered: mq ? mq.n : 0 };
    }).sort(function (a, b) { return b.match - a.match; });
  }
  function globalOf(profile) {
    var vals = POL.SECTIONS.map(function (s) { return profile[s]; }).filter(function (v) { return v !== null && v !== undefined; });
    var g = vals.length ? vals.reduce(function (a, b) { return a + b; }, 0) / vals.length : null;
    return { score: g, pos: g !== null ? POL.positionLabel(g) : { label: '—', color: '#707070' } };
  }
  function computeResults() {
    var QS = activeQuestions();
    var profile = POL.computeUserProfile(state.answers, state.importance, QS);
    var g = globalOf(profile);
    return { profile: profile, matches: buildMatches(profile), globalScore: g.score, globalPos: g.pos, answered: countAnswered(QS), total: QS.length, set: state.quizSet };
  }
  // (01/09) Résultats du quiz créa : classement calculé UNIQUEMENT sur les questions perso,
  // avec les positions candidats dédiées (PROWS de data_perso.js fusionnées dans POL.POSITIONS).
  function computePersoResults() {
    var QS = POL.QUESTIONS_PERSO || [];
    var profile = POL.computeUserProfile(state.answers, state.importance, QS);
    var g = globalOf(profile);
    var matches = runningCands().map(function (c) {
      var mq = POL.matchByQuestions ? POL.matchByQuestions(state.answers, state.importance, QS, c) : null;
      var has = mq && mq.pct != null;
      return { name: c.name, party: c.party, color: c.color, scores: c.scores, oneLiner: c.oneLiner || '', program: c.program || null, status: c.status || '', bloc: c.bloc,
        match: has ? mq.pct : POL.computeMatch(profile, c.scores), mq: has ? mq : null, covered: has ? mq.n : 0 };
    }).sort(function (a, b) { return b.match - a.match; });
    return { profile: profile, matches: matches, globalScore: g.score, globalPos: g.pos, answered: countAnswered(QS), total: QS.length, set: 'perso' };
  }
  function showPersoResults() {
    if (!POL.QUESTIONS_PERSO || countAnswered(POL.QUESTIONS_PERSO) === 0) { toast('Réponds d\'abord au quiz créa'); return; }
    renderResults(computePersoResults()); show('results'); setNav('results');
  }
  function resultFromProfile(profile) {
    var g = globalOf(profile);
    return { profile: profile, matches: buildMatches(profile), globalScore: g.score, globalPos: g.pos, fromCache: true, answered: 0, total: Q.length };
  }
  function lastCachedResult() { var arr = lsGet(pfx(LS_RESULTS), []); return (arr[0] && arr[0].profile) ? arr[0] : null; }
  function currentProfileOrCached() {
    if (Object.keys(state.answers).length > 0) { var sv = state.quizSet; state.quizSet = 'main'; var r = computeResults(); state.quizSet = sv; return r; }
    var c = lastCachedResult(); return c ? resultFromProfile(c.profile) : null;
  }
  // Statistiques descriptives du profil
  function computeStats() {
    var QS = Q, st = { perTheme: {}, dist: { exd: 0, d: 0, c: 0, g: 0, exg: 0 }, impHist: [0, 0, 0, 0, 0], answered: 0, extremes: [], centrist: [], reliability: 0 };
    POL.SECTIONS.forEach(function (s) { st.perTheme[s] = { n: 0, total: 0, scores: [], mean: null, sd: null, coef: 0 }; });
    QS.forEach(function (q) {
      var t = st.perTheme[q.theme]; t.total++;
      var sc = POL.answerScore(state.answers[q.id], q); if (sc == null) return;
      st.answered++; t.n++; t.scores.push(sc);
      var imp = state.importance[q.id]; if (imp != null) st.impHist[imp - 1]++;
      t.coef += POL.questionCoef(q, imp);
      if (sc <= 1.5) st.dist.exd++; else if (sc <= 4) st.dist.d++; else if (sc < 6) st.dist.c++; else if (sc < 8.5) st.dist.g++; else st.dist.exg++;
      var a = state.answers[q.id];
      if (sc <= 0.5 || sc >= 9.5) st.extremes.push({ q: q, sc: sc, txt: q.options[a.optIdx].text });
      if (sc >= 4.5 && sc <= 5.5) st.centrist.push({ q: q, sc: sc });
    });
    POL.SECTIONS.forEach(function (s) {
      var t = st.perTheme[s]; if (!t.n) return;
      var m = t.scores.reduce(function (a, b) { return a + b; }, 0) / t.n;
      var v = t.scores.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / t.n;
      t.mean = m; t.sd = Math.sqrt(v);
    });
    st.reliability = st.answered / QS.length;
    return st;
  }
  function sdLabel(sd) { if (sd == null) return '—'; if (sd < 1.6) return 'très cohérent'; if (sd < 2.6) return 'cohérent'; if (sd < 3.5) return 'nuancé'; return 'contrasté'; }
  function agreementValues(profile, cand) {
    var mq = mqOf(cand); var o = {};
    POL.SECTIONS.forEach(function (s) {
      var t = mq && mq.themes[s];
      if (t && t.score != null) o[s] = (t.score + 1) / 2 * 10;
      else o[s] = profile[s] == null ? null : Math.max(0, 10 - Math.abs(profile[s] - cand.scores[s]));
    });
    return o;
  }
  function axes(scores) {
    var ex = [scores.eco, scores.social].filter(function (v) { return v != null; });
    var sy = [scores.immigration, scores.securite, scores.societal].filter(function (v) { return v != null; });
    return { x: ex.length ? ex.reduce(function (a, b) { return a + b; }, 0) / ex.length : null, y: sy.length ? sy.reduce(function (a, b) { return a + b; }, 0) / sy.length : null };
  }
  function posTag(diff) {
    if (diff <= 1) return { cls: 'pol-tag-accord', label: 'Accord' };
    if (diff <= 2.5) return { cls: 'pol-tag-proche', label: 'Proche' };
    if (diff <= 4.5) return { cls: 'pol-tag-ecart', label: 'Écart' };
    return { cls: 'pol-tag-desac', label: 'Désaccord' };
  }

  // ════════════════════════════════════════════════
  // FIL D'ACTU (actus.js) & « là où vous vous rejoignez »
  // ════════════════════════════════════════════════
  var LS_ACTU_SEEN = 'pol_actu_seen';
  function allActus() { return (POL.ACTUS || []).slice().sort(function (a, b) { return a.d < b.d ? 1 : a.d > b.d ? -1 : 0; }); }
  function actusOf(name) { return allActus().filter(function (a) { return a.c === name; }); }
  function actuScore(a, c) { return a.sc != null ? a.sc : (c && c.scores ? c.scores[a.th] : null); }
  // Questions du quiz visées par une prise de position (champ qids d'actus.js)
  function actuQs(a) { return (a.qids || []).map(function (id) { return Q.find(function (q) { return q.id === id; }); }).filter(Boolean); }
  function actuTag(a, profile) {
    var sc = actuScore(a, candByName(a.c)); if (sc == null) return '';
    // 1. Précis : moyenne des écarts avec TES réponses aux questions concernées
    var qs = actuQs(a), acc = 0, n = 0;
    qs.forEach(function (q) { var u = POL.answerScore(state.answers[q.id], q); if (u == null) return; acc += Math.abs(u - sc); n++; });
    if (n) { var tp = posTag(acc / n); return '<span class="pol-cand-theme-tag ' + tp.cls + '" title="par rapport à ' + (n > 1 ? 'tes réponses aux ' + n + ' questions concernées' : 'ta réponse à la question concernée') + '">' + tp.label + '</span>'; }
    // 2. Sinon : position moyenne sur le thème
    if (!profile || profile[a.th] == null) return '';
    var t = posTag(Math.abs(profile[a.th] - sc));
    return '<span class="pol-cand-theme-tag ' + t.cls + '" title="par rapport à ta position sur ce thème">' + t.label + '</span>';
  }
  function actuQChips(a) {
    var qs = actuQs(a); if (!qs.length) return '';
    return '<div class="pol-actu-qs">' + qs.map(function (q) {
      var short = q.question.indexOf(' : ') > 0 ? q.question.split(' : ')[0] : q.question.replace(/s*?s*$/, '');
      if (short.length > 34) short = short.slice(0, 32) + '…';
      var u = POL.answerScore(state.answers[q.id], q); var sc = actuScore(a, candByName(a.c));
      var cls = (u != null && sc != null) ? ' ' + posTag(Math.abs(u - sc)).cls : '';
      return '<button type="button" class="pol-actu-q' + cls + '" onclick="POLQ.editAnswer(' + q.id + ')" title="' + esc(q.question) + (u != null ? ' — ta réponse : ' + esc(q.options[state.answers[q.id].optIdx].text) : ' — pas encore répondu') + '">Q' + q.id + ' · ' + esc(short) + '</button>';
    }).join('') + '</div>';
  }
  function jsName(n) { return esc(n).replace(/'/g, "\\'"); }
  function actuItem(a, profile, showCand) {
    var c = candByName(a.c);
    var cand = showCand && c ? '<div class="pol-actu-cand" onclick="POLQ.openActu(\'' + jsName(a.c) + '\')">' + candAvatar(c, 'xs') + '<strong style="color:' + cc(c.color) + '">' + esc(a.c) + '</strong><span class="pol-cd-party">' + esc(c.party) + '</span></div>' : '';
    return '<div class="pol-actu-item" style="--ac:' + (c ? c.color : '#888') + '">' +
      '<div class="pol-actu-top"><span class="pol-actu-date">' + esc(fmtDecl(a.d)) + '</span><span class="pol-actu-th">' + POL.themeEmoji(a.th) + ' ' + esc(POL.SECTION_LABELS[a.th] || a.th) + '</span>' + actuTag(a, profile) + '</div>' +
      cand + '<div class="pol-actu-txt">' + esc(a.txt) + '</div>' +
      (a.q ? '<div class="pol-actu-quote">« ' + esc(a.q) + ' »</div>' : '') +
      (a.src ? '<div class="pol-actu-src">' + esc(a.src) + '</div>' : '') +
      actuQChips(a) +
    '</div>';
  }
  function themeFit(profile, c) {
    var mq = mqOf(c);
    var rows = POL.SECTIONS.filter(function (s) { return (mq && mq.themes[s].score != null) || (profile && profile[s] != null && c.scores[s] != null); }).map(function (s) {
      var t = mq && mq.themes[s]; var conc = (t && t.score != null) ? t.score : null;
      var signed = (profile && profile[s] != null && c.scores[s] != null) ? c.scores[s] - profile[s] : 0;
      return { s: s, conc: conc, pct: conc != null ? POL.concPct(conc) : null, diff: conc != null ? (1 - conc) * 5 : Math.abs(signed), signed: signed, n: t ? t.n : 0 };
    });
    if (rows.length < 2) return null;
    rows.sort(function (a, b) { return a.diff - b.diff; });
    return { best: rows.slice(0, 2), worst: rows.slice(-2).reverse(), all: rows };
  }
  function fitHtml(profile, c) {
    var f = themeFit(profile, c); if (!f) return '';
    function row(x) { var t = x.conc != null ? POL.concTag(x.conc) : posTag(x.diff); return '<div class="pol-fit-chip ' + t.cls + '">' + POL.themeEmoji(x.s) + ' ' + esc(POL.SECTION_LABELS[x.s]) + '<small>' + (x.conc != null ? x.pct + ' % d\'accord · ' + x.n + ' question' + (x.n > 1 ? 's' : '') : (x.diff < 0.05 ? 'même position' : 'écart ' + x.diff.toFixed(1) + (x.signed > 0 ? ' · + à gauche que toi' : ' · + à droite que toi'))) + '</small></div>'; }
    return '<div class="pol-fit"><div class="pol-fit-col"><div class="pol-fit-lbl">Vous vous rejoignez sur</div>' + f.best.map(row).join('') + '</div><div class="pol-fit-col"><div class="pol-fit-lbl">Vous divergez sur</div>' + f.worst.map(row).join('') + '</div></div>';
  }
  function actuBlock(name, profile, limit) {
    var list = actusOf(name); if (!list.length) return '';
    var shown = list.slice(0, limit || 4);
    return '<div class="pol-cand-prog-hint">Dernières prises de position <span class="pol-actu-n">' + list.length + '</span></div>' + shown.map(function (a) { return actuItem(a, profile, false); }).join('') +
      (list.length > shown.length ? '<button class="pol-linkbtn" style="margin-top:.3rem" onclick="POLQ.openActu(\'' + jsName(name) + '\')">Voir les ' + list.length + ' sorties récentes →</button>' : '');
  }
  function themeSummaryHtml(r) {
    var top = r.matches[0]; if (!top) return '';
    var topC = candByName(top.name); var mqTop = topC ? mqOf(topC) : null;
    var rows = POL.SECTIONS.filter(function (s) { return r.profile[s] != null; }).map(function (s) {
      var v = r.profile[s]; var t = mqTop && mqTop.themes[s]; var conc = (t && t.score != null) ? t.score : null;
      return { s: s, v: v, near: closestCandidateForTheme(s, v), conc: conc, pct: conc != null ? POL.concPct(conc) : null, n: t ? t.n : 0, dTop: conc != null ? (1 - conc) * 5 : Math.abs(top.scores[s] - v) };
    }).sort(function (a, b) { return a.dTop - b.dTop; });
    if (rows.length < 2) return '';
    var last = top.name.split(' ').slice(-1)[0];
    return '<div class="pol-slbl">Sujet par sujet</div><div class="pol-card"><div class="pol-cd-stat-hint" style="margin-top:0">Du sujet où tu es le plus en phase avec <strong>' + esc(last) + '</strong> (ton n°1) à celui où vous divergez le plus.</div>' +
      rows.map(function (x) { var t = x.conc != null ? POL.concTag(x.conc) : posTag(x.dTop); return '<div class="pol-ts-row"><div class="pol-ts-main"><span class="pol-ts-th">' + POL.themeEmoji(x.s) + ' ' + esc(POL.SECTION_LABELS[x.s]) + '</span><span class="pol-ts-you">' + (x.pct != null ? esc(last) + ' ' + x.pct + ' % · ' + x.n + ' q.' : 'toi ' + x.v.toFixed(1) + ' · ' + esc(last) + ' ' + top.scores[x.s]) + '</span><span class="pol-cand-theme-tag ' + t.cls + '">' + t.label + '</span></div>' + (x.near && x.near.name !== top.name ? '<div class="pol-ts-near">Le plus proche de toi sur ce sujet : <strong style="color:' + cc(x.near.color) + '">' + esc(x.near.name) + '</strong> (' + themePctLabel(x.near, x.s) + ')</div>' : '') + '</div>'; }).join('') +
      '<div class="pol-sub" style="font-size:.72rem;margin-top:.5rem">% d\'accord = concordance entre ses positions et tes réponses sur les questions du thème (100 % identiques · 50 % neutre · 0 % opposées), pondérée par ta pertinence. Accord ≥ 80 % · Proche ≥ 60 % · Écart ≥ 35 % · Désaccord en dessous.</div></div>';
  }
  function renderActu(up) {
    var all = allActus(), list = all;
    if (state.actuCand) list = list.filter(function (a) { return a.c === state.actuCand; });
    if (state.actuTheme !== 'all') list = list.filter(function (a) { return a.th === state.actuTheme; });
    var cands = {}; all.forEach(function (a) { cands[a.c] = (cands[a.c] || 0) + 1; });
    var sel = '<select class="pol-select" onchange="POLQ.setActuCand(this.value)"><option value="">Tous les candidats · ' + all.length + ' prises de position</option>' + Object.keys(cands).sort(function (a, b) { return cands[b] - cands[a] || a.localeCompare(b); }).map(function (n) { return '<option value="' + esc(n) + '"' + (state.actuCand === n ? ' selected' : '') + '>' + esc(n) + ' (' + cands[n] + ')</option>'; }).join('') + '</select>';
    var th = '<div class="pol-rv-chips" style="position:static;padding:.5rem 0 0"><button class="pol-rv-chip' + (state.actuTheme === 'all' ? ' on' : '') + '" onclick="POLQ.setActuTheme(\'all\')">Tous les sujets</button>' + POL.SECTIONS.map(function (s) { return '<button class="pol-rv-chip' + (state.actuTheme === s ? ' on' : '') + '" onclick="POLQ.setActuTheme(\'' + s + '\')">' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + '</button>'; }).join('') + '</div>';
    var events = !state.actuCand && state.actuTheme === 'all' ? (POL.EVENTS || []).map(function (e) { return '<div class="pol-card pol-actu-event"><div class="pol-actu-date">' + esc(fmtDecl(e.d)) + '</div><strong>' + esc(e.label) + '</strong><div class="pol-sub" style="margin-top:.3rem">' + esc(e.txt) + '</div></div>'; }).join('') : '';
    var groups = {}, order = [];
    list.forEach(function (a) { if (!groups[a.d]) { groups[a.d] = []; order.push(a.d); } groups[a.d].push(a); });
    var body = order.map(function (d) { return '<div class="pol-actu-day">' + esc(fmtDecl(d)) + '</div>' + groups[d].map(function (a) { return actuItem(a, up, true); }).join(''); }).join('');
    if (!list.length) body = '<div class="pol-empty"><div>Rien pour ce filtre.</div></div>';
    if (all.length) lsSet(LS_ACTU_SEEN, all[0].d);
    return '<div class="pol-card">' + sel + th + '</div>' + events + body;
  }
  function openActu(name) { state.candFilter = 'actu'; state.candView = 'list'; state.actuCand = name || null; state.actuTheme = 'all'; show('candidats'); setNav('candidats'); renderCandidats(); window.scrollTo(0, 0); }
  function setActuCand(name) { state.actuCand = name || null; renderCandidats(); }
  function setActuTheme(t) { state.actuTheme = t; renderCandidats(); }

  // ════════════════════════════════════════════════
  // FIN DE QUIZ / RÉSULTATS
  // ════════════════════════════════════════════════
  function finishQuiz() {
    var QS = activeQuestions();
    if (countAnswered(QS) === 0) { toast('Réponds à au moins une question.'); renderEntry(); setNav('intro'); return; }
    if (state.quizSet === 'perso') { snapshot('quiz créa terminé'); scheduleCloudPush(); renderResults(computePersoResults()); show('results'); setNav('results'); return; }
    var r = computeResults();
    persistResults(r); snapshot('quiz terminé'); scheduleCloudPush();
    renderResults(r); show('results'); setNav('results');
  }
  function showResultsFromAnswers() {
    var r = currentProfileOrCached();
    if (!r) { toast('Aucun résultat enregistré sur cet appareil.'); return; }
    renderResults(r); show('results'); setNav('results');
  }
  function persistResults(r) {
    var matchesJson = r.matches.map(function (m) { return { name: m.name, party: m.party, match_pct: m.match }; });
    var arr = lsGet(pfx(LS_RESULTS), []);
    var rec = { created_at: new Date().toISOString(), profile: r.profile, global_position: r.globalPos.label, global_score: r.globalScore, candidate_matches: matchesJson, answered: r.answered };
    // pas de doublon si rien n'a bougé depuis le dernier bilan
    if (arr[0] && Math.abs((arr[0].global_score || 0) - (r.globalScore || 0)) < 0.005 && JSON.stringify(arr[0].profile) === JSON.stringify(r.profile)) return;
    arr.unshift(rec); arr = arr.slice(0, 30);
    lsSet(pfx(LS_RESULTS), arr);
  }
  function saveBilan() { var r = currentProfileOrCached(); if (!r || r.fromCache) { toast('Rien à enregistrer'); return; } persistResults(r); snapshot('bilan enregistré'); scheduleCloudPush(); toast('Bilan enregistré dans l\'historique'); }

  function renderBars(profile) {
    return POL.SECTIONS.map(function (s) {
      var v = profile[s];
      if (v === null || v === undefined) {
        return '<div class="pol-bar-row"><div class="pol-bar-head"><span class="pol-bar-name">' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + '</span><span class="pol-bar-pos" style="color:var(--pol-mut)">non répondu</span></div><div class="pol-bar-track-wrap"><div class="pol-bar-track"></div></div></div>';
      }
      var p = POL.positionLabel(v);
      var left = ((10 - v) / 10) * 100;
      return '<div class="pol-bar-row">' +
        '<div class="pol-bar-head"><span class="pol-bar-name">' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + '</span><span class="pol-bar-pos" style="color:' + p.color + '">' + esc(p.label) + ' · ' + v.toFixed(1) + '</span></div>' +
        '<div class="pol-bar-track-wrap"><div class="pol-bar-track"></div><div class="pol-bar-marker" style="left:' + left + '%"></div></div>' +
        '</div>';
    }).join('');
  }
  function closestCandidateForTheme(theme, userScore) {
    var bestQ = null, bestQV = -Infinity, anyQ = false;
    runningCands().forEach(function (c) { var mq = mqOf(c); var t = mq && mq.themes[theme]; if (t && t.score != null) { anyQ = true; if (t.score > bestQV) { bestQV = t.score; bestQ = c; } } });
    if (anyQ) return bestQ;
    var best = null, bestDiff = Infinity, bestSame = null, bestSameDiff = Infinity;
    var userSide = userScore >= 5 ? 1 : -1;
    runningCands().forEach(function (c) {
      var sc = c.scores[theme]; if (sc === undefined) return;
      var d = Math.abs(sc - userScore);
      if (d < bestDiff) { bestDiff = d; best = c; }
      var side = sc >= 5 ? 1 : -1;
      if (side === userSide && d < bestSameDiff) { bestSameDiff = d; bestSame = c; }
    });
    if (bestSame && bestSameDiff <= bestDiff + 1.5) return bestSame;
    return best;
  }
  function candByName(n) { return POL.CANDIDATES.find(function (c) { return c.name === n; }); }
  function fmtDecl(d) { if (!d) return ''; var p = d.split('-'); var mois = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']; if (p.length === 3) return Number(p[2]) + ' ' + mois[Number(p[1]) - 1] + ' ' + p[0]; if (p.length === 2) return mois[Number(p[1]) - 1] + ' ' + p[0]; return p[0]; }
  function statusChip(c) {
    var lbl = POL.STATUS_LABELS[c.status] || c.status, ico = (POL.STATUS_ICONS || {})[c.status] || '';
    if (c.status === 'déclaré' && c.declared) lbl += ' le ' + fmtDecl(c.declared);
    if (c.status === 'conditionnel' && c.declared) lbl += ' (officialisation ' + fmtDecl(c.declared) + ')';
    return '<span class="pol-cd-status st-' + esc(c.status) + '">' + ico + ' ' + esc(lbl) + '</span>';
  }

  // (01/09 soir) Les résultats vivent dans la page Profil (onglet 📊) ET dans la vue
  // polResults (fin de quiz). renderResults rend dans `_resMount` ; _lastR = dernier résultat.
  var _resMount = 'polResults', _lastR = null;
  function renderResults(r, mountId) {
    _resMount = mountId || 'polResults';
    var host = el(_resMount); if (!host) return;
    _lastR = r;
    var isExpress = r.set === 'express';
    var isPerso = r.set === 'perso';
    var qCountLabel = r.answered > 0 ? (r.answered + '/' + r.total + ' questions' + (isExpress ? ' · test express' : isPerso ? ' · quiz créa' : '')) : 'résultats sauvegardés';
    var reliab = r.answered / (r.total || 1);
    var reliabTxt = r.fromCache ? 'bilan sauvegardé' : isPerso ? 'classement calculé uniquement sur tes questions créa/freelance' : isExpress ? (reliab >= 0.95 ? 'bonne estimation — le test complet affine encore' : 'estimation partielle — termine le test express') : (reliab >= 0.95 ? 'fiabilité maximale' : reliab >= 0.7 ? 'bonne fiabilité' : reliab >= 0.4 ? 'fiabilité moyenne — continue le quiz' : 'faible fiabilité — continue le quiz');
    var top = r.matches[0];
    if (!state.radarCand || !r.matches.find(function (m) { return m.name === state.radarCand; })) state.radarCand = top ? top.name : null;

    // podium
    var podium = r.matches.slice(0, 3);
    var podiumHtml = podium.length ? '<div class="pol-podium">' + [1, 0, 2].map(function (k) { var m = podium[k]; if (!m) return ''; return '<div class="pol-podium-item p' + (k + 1) + '"><span class="pol-podium-rank">' + (k + 1) + '</span>' + candAvatar(m, k === 0 ? 'big' : '') + '<span class="pol-podium-name">' + esc(m.name) + '</span><span class="pol-podium-pct">' + m.match + '%</span></div>'; }).join('') + '</div>' : '';

    // classement
    var candHtml = r.matches.map(function (m, i) {
      var rows = POL.SECTIONS.map(function (s) {
        var prog = m.program && m.program[s] ? '<div class="pol-cand-theme-prog">' + esc(m.program[s]) + '</div>' : '';
        var tagHtml = '';
        var tq = m.mq && m.mq.themes[s];
        if (tq && tq.score != null) { var tagQ = POL.concTag(tq.score); tagHtml = '<span class="pol-cand-theme-tag ' + tagQ.cls + '" title="' + tq.n + ' question' + (tq.n > 1 ? 's' : '') + ' comparée' + (tq.n > 1 ? 's' : '') + '">' + tagQ.label + ' · ' + tq.pct + ' %</span>'; }
        else if (r.profile[s] != null) { var tag = posTag(Math.abs(r.profile[s] - m.scores[s])); tagHtml = '<span class="pol-cand-theme-tag ' + tag.cls + '">' + tag.label + '</span>'; }
        if (!prog && !tagHtml) return '';
        return '<div class="pol-cand-theme-block"><div class="pol-cand-theme-row"><span class="pol-cand-theme-name">' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + '</span>' + tagHtml + '</div>' + prog + '</div>';
      }).join('');
      var diffRows = POL.SECTIONS.filter(function (s) { return r.profile[s] != null; }).map(function (s) { return { theme: s, diff: m.scores[s] - r.profile[s] }; });
      var head = m.oneLiner ? '<div class="pol-cand-oneliner">' + esc(m.oneLiner) + '</div>' : '';
      var pct = POL.POLLS ? POL.POLLS[m.name] : null;
      var c = candByName(m.name);
      var partyLine = partyLogo(c) + ((POL.STATUS_ICONS || {})[c.status] || '') + ' ' + esc(m.party) + (pct != null ? ' · sondages ~' + pctLabel(pct) : '');
      return (i === 10 ? '<div class="pol-strate-lbl">Plus éloignés de toi</div>' : '') + '<div class="pol-cand' + (i >= 10 ? ' compact' : '') + (POL.isRunning(c) ? '' : ' retired') + '" id="polCand' + i + '">' +
        '<div class="pol-cand-head" onclick="POLQ.toggleCand(' + i + ')">' +
          '<span class="pol-cand-rank">' + (i + 1) + '</span>' + candAvatar(m, 'sm') +
          '<span class="pol-cand-info"><span class="pol-cand-name">' + esc(m.name) + '</span><div class="pol-cand-party">' + partyLine + '</div></span>' +
          '<span class="pol-cand-pct">' + m.match + '%<span class="pol-cand-pct-lbl">d\'accord</span></span>' +
          '<span class="pol-cand-chev">▸</span>' +
        '</div>' +
        '<div class="pol-cand-detail">' + head + '<div class="pol-cd-meta">' + statusChip(c) + '</div>' + fitHtml(r.profile, c) + qFitHtml(m.mq) +
          '<div class="pol-cand-prog-hint">Écart avec toi, thème par thème</div><div class="pol-diff-legend"><span style="color:var(--pol-left)">◀ plus à gauche que toi</span><span style="color:var(--pol-right)">plus à droite que toi ▶</span></div>' + V.diffBars(diffRows) +
          '<div style="margin:.6rem 0 .3rem"><a class="pol-linkbtn" style="font-size:.82rem" onclick="POLQ.openDuel(\'' + esc(m.name).replace(/'/g, "\\'") + '\')">Comparer avec un autre candidat →</a></div>' +
          '<div class="pol-cand-prog-hint">Ce que ' + esc(m.name.split(' ').slice(-1)[0]) + ' défend :</div>' + rows + actuBlock(m.name, r.profile, 4) + '</div>' +
      '</div>';
    }).join('');

    // radar d'accord (masqué en résultats créa : il est calculé sur le grand quiz)
    var radarCand = candByName(state.radarCand);
    var radarHtml = '';
    if (radarCand && !isPerso) {
      var chips = r.matches.slice(0, 6).map(function (m) { return '<button class="pol-rv-chip' + (m.name === state.radarCand ? ' on' : '') + '" style="--rv:' + m.color + '" onclick="POLQ.setRadar(\'' + esc(m.name).replace(/'/g, "\\'") + '\')">' + esc(m.name.split(' ').slice(-1)[0]) + ' ' + m.match + '%</button>'; }).join('');
      radarHtml = '<div class="pol-slbl">Radar d\'accord</div><div class="pol-card"><div class="pol-rv-chips" style="position:static;padding:0 0 .6rem">' + chips + '</div>' +
        V.radar([{ values: agreementValues(r.profile, radarCand), color: radarCand.color, label: radarCand.name }], { title: 'Accord avec ' + radarCand.name }) +
        '<div class="pol-sub" style="font-size:.74rem;text-align:center">Plus la surface est grande, plus vous êtes d\'accord (bord = accord total, centre = désaccord total).</div></div>';
    }

    // boussole
    var me = axes(r.profile);
    var pts = runningCands().map(function (c) { var a = axes(c.scores); return { x: a.x, y: a.y, color: c.color, name: c.name, big: (POL.POLLS[c.name] || 0) >= 8 }; });
    if (me.x != null && me.y != null) pts.push({ x: me.x, y: me.y, me: true, name: 'Toi' });
    var compassHtml = '<div class="pol-slbl">Boussole politique</div><div class="pol-card">' + V.compass(pts) +
      '<div class="pol-sub" style="font-size:.74rem">Horizontal : économie &amp; social (redistribution ↔ marché). Vertical : immigration, sécurité, société (ouverture ↔ autorité). Les grosses pastilles = candidats à plus de 8 % dans les sondages.</div></div>';

    var pend = isOwner() && !isGuest() ? pendingCount(Q) : 0;
    var pendHtml = pend ? '<div class="pol-card pol-pend-card"><div class="pol-cloud-txt"><strong>' + pend + ' réponse' + (pend > 1 ? 's' : '') + ' en note, à faire valider par l\'IA</strong> — elles ne comptent pas encore dans ce résultat. Exporte les notes, demande à Claude de choisir l\'option qui correspond à chacune, puis colle sa validation.</div><div class="pol-btn-row" style="margin-top:.6rem"><button class="pol-btn pol-btn-line pol-btn-sm" onclick="POLQ.exportPending()">Exporter les notes</button><button class="pol-btn pol-btn-ghost pol-btn-sm" onclick="POLQ.pasteValidation()">Coller la validation</button></div></div>' : '';
    var expressMore = (isExpress && !r.fromCache) ? '<div class="pol-card pol-express-more"><strong>Résultat du test express</strong> (' + r.answered + ' questions clés). Pour un classement encore plus précis, le test complet couvre les ' + Q.length + ' questions.<div class="pol-btn-row" style="margin-top:.6rem"><button class="pol-btn pol-btn-line pol-btn-sm" onclick="POLQ.startMainQuiz()">Affiner avec le test complet (' + (Q.length - countAnswered(Q)) + ' questions restantes)</button></div></div>' : '';
    var persoBanner = isPerso ? '<div class="pol-card pol-express-more"><strong>Résultats spécial graphiste</strong> — classement recalculé uniquement sur tes ' + r.answered + ' questions créa/freelance (IA & création, statut d\'indépendant, URSSAF, culture, logement…), avec la position de chaque candidat sur CHAQUE question (bouton « Qui répond quoi ? » sur les questions du quiz créa). Ton classement général sur les ' + Q.length + ' questions reste dans Mes résultats.<div class="pol-btn-row" style="margin-top:.6rem"><button class="pol-btn pol-btn-line pol-btn-sm" onclick="POLQ.showResultsFromAnswers()">Revoir mon classement général</button></div></div>' : '';
    host.innerHTML = pendHtml + '<div class="pol-cols"><div class="pol-col">' +
      '<div class="pol-global">' +
        '<div class="pol-global-label" style="background:' + r.globalPos.color + '">' + esc(r.globalPos.label) + '</div>' +
        '<div class="pol-global-sub">Position globale · ' + (r.globalScore !== null ? r.globalScore.toFixed(1) : '—') + '/10 — <span style="color:var(--pol-txt-2)">' + qCountLabel + ' · ' + reliabTxt + '</span></div>' +
      '</div>' +
      podiumHtml + expressMore + persoBanner + themeSummaryHtml(r) +
      '<div class="pol-slbl">Classement — ' + r.matches.length + ' candidat' + (r.matches.length > 1 ? 's' : '') + (state.includeRetired ? ' (retirés inclus)' : ' en course') + '</div>' +
      '<div class="pol-cand-hint">Du plus proche au plus éloigné de tes idées. Touche une fiche : écart thème par thème, radar, duel, programme. <button class="pol-linkbtn" onclick="POLQ.toggleRetired()">' + (state.includeRetired ? 'Masquer les retirés / plan B' : 'Inclure les retirés / plan B') + '</button></div>' +
      candHtml + '</div><div class="pol-col pol-col-side">' +
      radarHtml + compassHtml +
      '<div class="pol-slbl">Ton profil par thème</div>' +
      '<div class="pol-card"><div class="pol-bars">' + renderBars(r.profile) + '</div>' +
        '<div class="pol-axis-legend"><span style="color:var(--pol-left)">← Gauche</span><span>Centre</span><span style="color:var(--pol-right)">Droite →</span></div>' +
      '</div>' +
      '<div class="pol-matching-note"><strong>Comment c\'est calculé</strong> — <strong>question par question</strong> : chaque candidat a une position sur chacune des ' + (isPerso ? r.total + ' questions du quiz créa' : Q.length + ' questions') + ' (programme, votes, déclarations — pas son « camp »). Pour chaque question à laquelle tu as répondu, la concordance va de <strong>+1</strong> (même option) à <strong>−1</strong> (option opposée), pondérée par la pertinence que tu as donnée (×2 si question essentielle). Le % ramène cette moyenne sur 0-100 (50 % = neutre). Le RN peut donc être noté comme la gauche sur la retraite et comme LR sur l\'immigration : rien n\'est recentré par la moyenne. Touche « Qui répond quoi ? » ' + (isPerso ? 'sur chaque question du quiz créa' : 'dans <em>Mes réponses</em>') + ' pour voir la position de chacun, question par question. Positions au ' + esc(POL.POSITIONS_DATE || POL.DATA_DATE) + '.</div>' +
      '<div class="pol-btn-row" style="margin-top:1.2rem"><button class="pol-btn pol-btn-line" onclick="POLQ.goReview()">Mes réponses</button>' + (isPerso ? '' : '<button class="pol-btn pol-btn-line" onclick="POLQ.saveBilan()">Enregistrer ce bilan</button>') + '</div>' +
      '<div style="text-align:center;margin-top:14px"><a class="pol-linkbtn" style="font-size:.85rem" onclick="POLQ.exportTxt()">Exporter mes résultats (.txt)</a></div></div></div>';
  }
  function toggleCand(i) { var c = el('polCand' + i); if (c) c.classList.toggle('open'); }
  function toggleRetired() {
    state.includeRetired = !state.includeRetired;
    if (_lastR && _lastR.set === 'perso') { renderResults(computePersoResults(), _resMount); return; }
    var r = currentProfileOrCached(); if (r) renderResults(r, _resMount);
  }
  function setRadar(name) { state.radarCand = name; var r = currentProfileOrCached(); if (r) { renderResults(r, _resMount); var n = document.querySelector('#' + _resMount + ' .pol-svg'); if (n) n.scrollIntoView({ block: 'center' }); } }

  // ════════════════════════════════════════════════
  // REVUE DES RÉPONSES
  // ════════════════════════════════════════════════
  // ── « Qui répond quoi ? » : candidats placés sous l'option la plus proche de leur position ──
  function toggleWho(qid, boxId) {
    var box = el(boxId); if (!box) return;
    var q = Q.find(function (x) { return x.id === qid; }) || (POL.QUESTIONS_PERSO || []).find(function (x) { return x.id === qid; }); if (!q) return;
    if (box.classList.contains('pol-hidden')) { box.innerHTML = whoWhatHtml(q); box.classList.remove('pol-hidden'); } else { box.classList.add('pol-hidden'); box.innerHTML = ''; }
  }
  function whoWhatHtml(q) {
    if (!POL.whoAnswers) return '';
    var a = state.answers[q.id]; var by = POL.whoAnswers(q, runningCands());
    var any = Object.keys(by).some(function (k) { return by[k].length; });
    if (!any) return '<div class="pol-who"><div class="pol-who-note">Pas encore de position connue des candidats sur cette question.</div></div>';
    return '<div class="pol-who">' + sortedOptions(q).map(function (so) {
      var list = (by[so.i] || []).slice().sort(function (x, y) { return pollOf(y.c) - pollOf(x.c); }); var mine = a && a.optIdx === so.i;
      return '<div class="pol-who-row' + (mine ? ' mine' : '') + '"><div class="pol-who-opt"><span class="pol-who-score">' + so.o.score + '</span><span>' + esc(so.o.text) + '</span>' + (mine ? '<span class="pol-who-you">toi</span>' : '') + '</div>' +
        '<div class="pol-who-cands">' + (list.length ? list.map(function (x) { return '<span class="pol-who-c" title="' + esc(x.c.name) + ' · ' + esc(x.c.party) + ' · position ' + x.p + '/10">' + candAvatar(x.c, 'xs') + '<span>' + esc(shortName(x.c.name)) + '</span></span>'; }).join('') : '<span class="pol-who-none">personne</span>') + '</div></div>';
    }).join('') + '<div class="pol-who-note">Chaque candidat en course est placé sous l\'option la plus proche de sa position (programme, votes, déclarations au ' + esc(POL.POSITIONS_DATE || '') + '). Barème 0 = droite · 10 = gauche.</div></div>';
  }
  // Questions où le candidat répond comme toi / à l'opposé (top 3, pondérées par ta pertinence)
  function qFitHtml(mq) {
    if (!mq || !mq.items || mq.items.length < 3) return '';
    var agree = mq.items.filter(function (x) { return x.conc >= 0.6; }).sort(function (a, b) { return (b.conc * b.w) - (a.conc * a.w); }).slice(0, 3);
    var dis = mq.items.filter(function (x) { return x.conc <= -0.3; }).sort(function (a, b) { return (a.conc * a.w) - (b.conc * b.w); }).slice(0, 3);
    if (!agree.length && !dis.length) return '';
    function li(x) { var oi = POL.nearestOption(x.q, x.p); var opt = x.q.options[oi]; return '<div class="pol-qf-item"><div class="pol-qf-q">Q' + x.q.id + ' · ' + esc(x.q.question) + '</div><div class="pol-qf-a">→ ' + esc(opt ? opt.text : '') + '</div></div>'; }
    return '<div class="pol-fit pol-qfit"><div class="pol-fit-col"><div class="pol-fit-lbl">Répond comme toi</div>' + (agree.length ? agree.map(li).join('') : '<div class="pol-sub" style="font-size:.74rem">Aucune question en accord net.</div>') + '</div><div class="pol-fit-col"><div class="pol-fit-lbl">À l\'opposé de toi</div>' + (dis.length ? dis.map(li).join('') : '<div class="pol-sub" style="font-size:.74rem">Aucune opposition nette.</div>') + '</div></div>' +
      '<div class="pol-sub" style="font-size:.7rem;margin:.2rem 0 .4rem">' + mq.n + ' questions comparées · ' + mq.pct + ' % d\'accord. Les questions que tu juges les plus pertinentes pèsent plus.</div>';
  }

  function goReview() { state.reviewFilter = 'all'; state.reviewMode = 'all'; state.reviewSearch = ''; show('review'); setNav('review'); renderReview(); }
  function setReviewFilter(theme) { state.reviewFilter = theme; renderReview(); window.scrollTo(0, 0); }
  function setReviewMode(m) { state.reviewMode = m; renderReview(); }
  function setReviewSearch(v) { state.reviewSearch = (v || '').toLowerCase(); renderReview(true); }
  function toggleCalc(theme) { var c = el('polCalc-' + theme); if (c) c.classList.toggle('pol-hidden'); }
  function editAnswer(qid) { state.quizSet = qid >= 1000 ? 'perso' : 'main'; var QS = activeQuestions(); var i = QS.findIndex(function (q) { return q.id === qid; }); if (i < 0) return; state.idx = i; show('quiz'); setNav('quiz'); renderQuestion(); }

  function renderReview(keepFocus) {
    var QS = Q;
    var profile = POL.computeUserProfile(state.answers, state.importance, QS);
    var answeredTotal = countAnswered(QS);
    if (answeredTotal === 0) {
      var cached = lastCachedResult();
      el('polReview').innerHTML = cached
        ? '<div class="pol-empty"><div>Le détail question-par-question n\'est pas sur cet appareil.<br><br>Ton bilan est sauvegardé, mais pour revoir chaque réponse il faut les récupérer (cloud ☁️, fichier 📂) ou refaire le quiz.</div></div>' +
          '<button class="pol-btn pol-btn-primary" onclick="POLQ.showResultsFromAnswers()">Voir mes résultats</button><button class="pol-btn pol-btn-line" style="margin-top:.6rem" onclick="POLQ.importBackup()">Restaurer un fichier</button>'
        : '<div class="pol-empty"><div>Aucune réponse à afficher pour l\'instant.</div></div><button class="pol-btn pol-btn-primary" onclick="POLQ.startQuiz(false)">Faire le quiz</button>';
      return;
    }
    var chips = '<button class="pol-rv-chip' + (state.reviewFilter === 'all' ? ' on' : '') + '" onclick="POLQ.setReviewFilter(\'all\')">Tout · ' + answeredTotal + '/' + QS.length + '</button>';
    chips += POL.SECTIONS.map(function (s) {
      var qs = QS.filter(function (q) { return q.theme === s; });
      var n = qs.filter(function (q) { return state.answers[q.id] !== undefined; }).length;
      return '<button class="pol-rv-chip' + (state.reviewFilter === s ? ' on' : '') + '" style="--rv:' + POL.SECTION_COLORS[s] + '" onclick="POLQ.setReviewFilter(\'' + s + '\')">' + esc(POL.SECTION_LABELS[s]) + ' · ' + n + '/' + qs.length + '</button>';
    }).join('');
    var modeList = [['all', 'Toutes'], ['unans', 'Non répondues'], ['pending', 'À valider'], ['noimp', 'Sans pertinence'], ['notes', 'Avec note'], ['new', 'Nouvelles']]
      .filter(function (m) { return notesAllowed() || (m[0] !== 'pending' && m[0] !== 'notes'); });
    var modes = modeList.map(function (m) { return '<button class="pol-rv-mode' + (state.reviewMode === m[0] ? ' on' : '') + '" onclick="POLQ.setReviewMode(\'' + m[0] + '\')">' + m[1] + '</button>'; }).join('');
    var search = '<input id="polRvSearch" class="pol-input pol-rv-search" type="search" placeholder="Rechercher une question…" value="' + esc(state.reviewSearch) + '" oninput="POLQ.setReviewSearch(this.value)">';

    function keep(q) {
      var a = state.answers[q.id];
      if (state.reviewMode === 'unans' && a) return false;
      if (state.reviewMode === 'pending' && (a || !state.pending[q.id])) return false;
      if (state.reviewMode === 'noimp' && (!a || state.importance[q.id] != null)) return false;
      if (state.reviewMode === 'notes' && !state.notes[q.id]) return false;
      if (state.reviewMode === 'new' && !q.isNew) return false;
      if (state.reviewSearch && q.question.toLowerCase().indexOf(state.reviewSearch) < 0 && !q.options.some(function (o) { return o.text.toLowerCase().indexOf(state.reviewSearch) >= 0; })) return false;
      return true;
    }
    var sections = POL.SECTIONS.filter(function (s) { return state.reviewFilter === 'all' || state.reviewFilter === s; });
    var shown = 0;
    var body = sections.map(function (s) {
      var col = POL.SECTION_COLORS[s];
      var v = profile[s]; var pos = v != null ? POL.positionLabel(v) : null;
      var qs = QS.filter(function (q) { return q.theme === s; });
      var visible = qs.filter(keep); if (!visible.length) return '';
      shown += visible.length;
      var head = '<div class="pol-rv-thead"><span class="pol-rv-tdot" style="background:' + col + '"></span><span class="pol-rv-tname">' + esc(POL.SECTION_LABELS[s]) + '</span>' +
        (pos ? '<span class="pol-rv-tpos" style="color:' + pos.color + '">' + esc(pos.label) + ' · ' + v.toFixed(1) + '/10</span>' : '<span class="pol-rv-tpos" style="color:var(--pol-mut)">non répondu</span>') + '</div>';
      var calcBtn = '', calc = '';
      var ansQ = qs.filter(function (q) { return state.answers[q.id] !== undefined; });
      if (ansQ.length) {
        var sumSC = 0, sumC = 0;
        var rows = ansQ.map(function (q) {
          var a = state.answers[q.id]; var sc = q.options[a.optIdx].score; var imp = state.importance[q.id]; var coef = POL.questionCoef(q, imp);
          sumSC += sc * coef; sumC += coef;
          return '<tr><td class="pol-calc-q">Q' + q.id + '</td><td>' + sc + '</td><td>×' + coef + '</td><td>' + (sc * coef).toFixed(0) + '</td></tr>';
        }).join('');
        calcBtn = '<button class="pol-rv-calcbtn" onclick="POLQ.toggleCalc(\'' + s + '\')">Voir le calcul</button>';
        calc = '<div id="polCalc-' + s + '" class="pol-rv-calc pol-hidden"><div class="pol-calc-intro">Moyenne pondérée : Σ(score × coef) ÷ Σ(coef). Coef = pertinence (1→1, 2→2, 3→4, 4→7, 5→10) × 2 si essentielle.</div>' +
          '<table class="pol-calc-tbl"><tr><th>Q</th><th>Score</th><th>Coef</th><th>Produit</th></tr>' + rows + '<tr class="pol-calc-tot"><td class="pol-calc-q">Total</td><td></td><td>' + sumC + '</td><td>' + sumSC.toFixed(0) + '</td></tr></table>' +
          '<div class="pol-calc-res">' + sumSC.toFixed(0) + ' ÷ ' + sumC + ' = <strong>' + (sumSC / sumC).toFixed(2) + '/10</strong></div></div>';
      }
      var items = visible.map(function (q) {
        var a = state.answers[q.id]; var note = state.notes[q.id]; var imp = state.importance[q.id];
        var opts = sortedOptions(q).map(function (so) { var i = so.i, o = so.o; var on = a && a.optIdx === i; return '<div class="pol-rv-opt' + (on ? ' chosen' : '') + '"><span class="pol-rv-otxt">' + esc(o.text) + '</span><span class="pol-rv-oscore">' + o.score + '</span></div>'; }).join('');
        var pendTag = (!a && state.pending[q.id]) ? '<div class="pol-rv-unans-tag pend">Réponse en note — à valider par l\'IA</div>' : '';
        var impBadge = a ? (imp != null ? '<span class="pol-rv-imp">Pertinence ' + imp + '/5 · coef ×' + POL.questionCoef(q, imp) + ((q.w || POL.baseCoef(q.id)) >= 3 ? ' · essentielle' : '') + '</span>' : '<span class="pol-rv-imp none">Pertinence non réglée (défaut 3)</span>') : '';
        return '<div class="pol-rv-q' + (a ? '' : ' unans') + '">' +
          '<div class="pol-rv-qt">Q' + q.id + ' · ' + esc(q.question) + (q.isNew ? ' <span class="pol-q-badge pol-q-new" style="margin:0">🆕</span>' : '') + '</div>' +
          (a ? (a.validated ? '<div class="pol-rv-unans-tag ok">Option choisie avec l\'IA</div>' : '') : (pendTag || '<div class="pol-rv-unans-tag">Non répondu</div>')) +
          '<div class="pol-rv-opts">' + opts + '</div>' + impBadge +
          (note ? '<div class="pol-rv-note">' + esc(note) + '</div>' : '') +
          '<div class="pol-rv-actions"><button class="pol-linkbtn" onclick="POLQ.editAnswer(' + q.id + ')">' + (a ? 'Modifier' : 'Répondre') + '</button><button class="pol-linkbtn" onclick="POLQ.toggleWho(' + q.id + ',\'polWhoR' + q.id + '\')">Qui répond quoi ?</button></div><div id="polWhoR' + q.id + '" class="pol-hidden"></div>' +
          '</div>';
      }).join('');
      return '<div class="pol-rv-section">' + head + calcBtn + calc + '<div class="pol-rv-items">' + items + '</div></div>';
    }).join('');
    if (!shown) body = '<div class="pol-empty"><div>Aucune question ne correspond à ce filtre.</div></div>';

    el('polReview').innerHTML =
      '<div class="pol-slbl">Mes réponses, question par question</div>' +
      '<div class="pol-rv-legend">Position de la réponse : <strong style="color:var(--pol-right)">0 = droite</strong> · <strong>5 = centre</strong> · <strong style="color:var(--pol-left)">10 = gauche</strong>. La moyenne du thème est pondérée par la pertinence que tu as donnée à chaque question. Sous chaque question, <strong>Qui répond quoi ?</strong> montre l\'option la plus proche de la position de chaque candidat.</div>' +
      search + '<div class="pol-rv-modes">' + modes + '</div>' +
      '<div class="pol-rv-chips">' + chips + '</div>' + body +
      '<button class="pol-btn pol-btn-primary" style="margin-top:1rem" onclick="POLQ.showResultsFromAnswers()">‹ Retour aux résultats</button>';
    if (keepFocus) { var inp = el('polRvSearch'); if (inp) { inp.focus(); var l = inp.value.length; try { inp.setSelectionRange(l, l); } catch (e) {} } }
  }

  // ════════════════════════════════════════════════
  // PROFIL : profil narratif · stats · évolution · archive · sauvegarde
  // ════════════════════════════════════════════════
  function goProfile() { show('profile'); setNav('profile'); renderProfile(); }
  function setProfileTab(t) { state.profileTab = t; renderProfile(); }
  function liveResultRecord() {
    if (Object.keys(state.answers).length === 0) return null;
    var sv = state.quizSet; state.quizSet = 'main'; var r = computeResults(); state.quizSet = sv;
    return { created_at: new Date().toISOString(), global_position: r.globalPos.label, global_score: r.globalScore, candidate_matches: r.matches.map(function (m) { return { name: m.name, party: m.party, match_pct: m.match }; }), profile: r.profile, _live: true, answered: r.answered };
  }
  function cleanResults(list) { return (list || []).filter(function (x) { return x && x.global_score != null; }); }

  function renderProfile() {
    var results = cleanResults(lsGet(pfx(LS_RESULTS), []));
    var live = liveResultRecord();
    if (live) {
      if (results.length && Math.abs(results[0].global_score - live.global_score) < 0.05) results = results.slice(1);
      results = [live].concat(results);
    }
    var tabs = [['res', 'Résultats'], ['profil', 'Profil'], ['stats', 'Stats'], ['histo', 'Historique'], ['save', 'Sauvegarde']].map(function (t) { return '<button class="pol-tab' + (state.profileTab === t[0] ? ' on' : '') + '" onclick="POLQ.setProfileTab(\'' + t[0] + '\')">' + t[1] + '</button>'; }).join('');
    var body;
    if (state.profileTab === 'stats') body = renderStats();
    else if (state.profileTab === 'histo') body = renderHistory(results);
    else if (state.profileTab === 'save') body = renderSave();
    else if (state.profileTab === 'res') body = '<div id="polProfRes"></div>';
    else body = renderProfilMain(results);
    el('polProfile').innerHTML = '<div class="pol-tabs">' + tabs + '</div>' + body;
    // Onglet : les résultats complets vivent ICI (01/09 soir — demande Adrien)
    if (state.profileTab === 'res') {
      var r = currentProfileOrCached();
      if (r) renderResults(r, 'polProfRes');
      else el('polProfRes').innerHTML = emptyCtaHtml();
    }
  }

  // État vide engageant (Direction A2) — commun aux onglets Résultats et Profil
  function emptyCtaHtml() {
    return '<div class="pol-cta-hero">' +
      '<h2>De qui tes idées sont-elles les plus proches&nbsp;?</h2>' +
      '<p>Réponds au test express — ' + QX.length + ' questions, un quart d\'heure — et découvre ton classement des ' + POL.CANDIDATES.filter(POL.isRunning).length + ' candidats, sujet par sujet.</p>' +
      '<button class="pol-btn pol-btn-primary" onclick="POLQ.startExpress()">Faire le test express</button>' +
      '<div><a class="pol-linkbtn" onclick="POLQ.nav(\'quiz\')">Ou le test complet (' + Q.length + ' questions) →</a></div>' +
    '</div>';
  }
  function renderProfilMain(results) {
    if (!results || !results.length) {
      return emptyCtaHtml();
    }
    var last = results[0];
    var top3 = (last.candidate_matches || []).filter(function (c) { var cc = candByName(c.name); return cc && (state.includeRetired || POL.isRunning(cc)); }).slice(0, 3);
    var n = Object.keys(state.answers).length, complete = countAnswered(Q) === Q.length;
    var summary =
      '<div class="pol-slbl">Mon profil politique</div>' +
      '<div class="pol-card">' +
        '<div class="pol-global" style="padding-top:0"><div class="pol-global-label" style="background:' + (POL.positionLabel(last.global_score != null ? last.global_score : 5).color) + '">' + esc(last.global_position || '—') + '</div>' +
        '<div class="pol-global-sub">' + (last._live ? (complete ? 'Profil complet · ' + Q.length + '/' + Q.length : n + ' réponses · quiz en cours') : 'Dernier bilan : ' + fmtDate(last.created_at)) + '</div></div>' +
        '<div class="pol-summary-top3">' + top3.map(function (c, i) { var cand = candByName(c.name); var col = cand ? cand.color : '#888'; return '<div class="pol-summary-cand"><span class="pol-cand-rank">' + (i + 1) + '</span>' + (cand ? candAvatar(cand, 'sm') : '') + '<span class="pol-summary-cand-name">' + esc(c.name) + '<span class="pol-summary-cand-party">' + esc(c.party) + '</span></span><span class="pol-summary-cand-pct">' + c.match_pct + '%</span></div>'; }).join('') + '</div>' +
        '<button class="pol-btn pol-btn-primary" style="margin-top:.9rem" onclick="POLQ.showResultsFromAnswers()">Voir mes résultats détaillés</button>' +
        '<div class="pol-btn-row" style="margin-top:.6rem"><button class="pol-btn pol-btn-line pol-btn-sm" onclick="POLQ.goReview()">Mes réponses</button><button class="pol-btn pol-btn-ghost pol-btn-sm" onclick="POLQ.exportTxtFromResult()">Exporter</button></div>' +
        '<button class="pol-btn pol-btn-line pol-btn-sm" style="margin-top:.6rem;width:100%" onclick="POLQ.startQuiz(true)">↺ Refaire le quiz (l\'actuel est archivé)</button>' +
      '</div>';
    var detail = '<div class="pol-slbl">Ce que tu penses, thème par thème</div>' +
      POL.SECTIONS.map(function (s) {
        var v = last.profile[s]; if (v === null || v === undefined) return '';
        var p = POL.positionLabel(v); var stmt = POL.themeStatement(s, v); var near = closestCandidateForTheme(s, v);
        var nearHtml = near ? '<div class="pol-cr-near"><span class="pol-cand-dot" style="background:' + near.color + '"></span> Le plus proche de toi sur ce thème : <strong style="color:' + cc(near.color) + '">' + esc(near.name) + '</strong> (' + themePctLabel(near, s) + ')</div>' : '';
        return '<div class="pol-cr-card"><div class="pol-cr-head"><span class="pol-cr-emoji">' + POL.themeEmoji(s) + '</span><span class="pol-cr-theme">' + esc(POL.SECTION_LABELS[s]) + '</span><span class="pol-cr-pos" style="color:' + p.color + '">' + esc(p.label) + ' · ' + Number(v).toFixed(1) + '</span></div><div class="pol-cr-text">' + esc(stmt) + '</div>' + nearHtml + '</div>';
      }).join('');
    return '<div class="pol-cols"><div class="pol-col">' + summary + '</div><div class="pol-col pol-col-side">' + detail + '</div></div>';
  }

  function renderStats() {
    var st = computeStats();
    if (!st.answered) return '<div class="pol-empty"><div>Réponds à quelques questions pour voir tes statistiques.</div></div>';
    var tot = st.answered;
    var distBins = [
      { label: 'Dr. radicale', full: 'Droite radicale', n: st.dist.exd, color: 'var(--pol-pos-dr)' }, { label: 'Droite', full: 'Droite', n: st.dist.d, color: 'var(--pol-pos-cd)' }, { label: 'Centre', full: 'Centre', n: st.dist.c, color: 'var(--pol-pos-c)' }, { label: 'Gauche', full: 'Gauche', n: st.dist.g, color: 'var(--pol-pos-cg)' }, { label: 'G. radicale', full: 'Gauche radicale', n: st.dist.exg, color: 'var(--pol-pos-gr)' }
    ];
    var distCard = '<div class="pol-slbl">Où se placent tes ' + tot + ' réponses ?</div><div class="pol-card">' + V.hist(distBins, { title: 'Répartition des réponses' }) +
      '<div class="pol-stat-grid">' + distBins.map(function (b) { return '<div class="pol-stat-cell"><span class="pol-stat-dot" style="background:' + b.color + '"></span>' + esc(b.full) + ' <strong>' + Math.round(b.n / tot * 100) + '%</strong></div>'; }).join('') + '</div></div>';

    var coh = '<div class="pol-slbl">Cohérence par thème</div><div class="pol-card"><div class="pol-sub" style="font-size:.76rem;margin-bottom:.6rem">Écart-type de tes réponses dans le thème : bas = tes réponses vont toutes dans le même sens ; haut = tu es nuancé ou contrasté selon les sujets.</div>' +
      POL.SECTIONS.map(function (s) {
        var t = st.perTheme[s]; if (!t.n) return '<div class="pol-coh-row"><span class="pol-coh-name">' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + '</span><span class="pol-coh-lbl" style="color:var(--pol-mut)">non répondu</span></div>';
        var w = Math.min(100, t.sd / 5 * 100);
        return '<div class="pol-coh-row"><span class="pol-coh-name">' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + ' <span class="pol-coh-n">' + t.n + '/' + t.total + '</span></span><span class="pol-coh-bar"><span style="width:' + w + '%;background:' + POL.SECTION_COLORS[s] + '"></span></span><span class="pol-coh-lbl">' + sdLabel(t.sd) + ' (σ ' + t.sd.toFixed(1) + ')</span></div>';
      }).join('') + '</div>';

    var weights = POL.SECTIONS.map(function (s) { return { s: s, c: st.perTheme[s].coef }; }).filter(function (o) { return o.c > 0; });
    var wsum = weights.reduce(function (a, b) { return a + b.c; }, 0) || 1;
    var prio = '<div class="pol-slbl">Ce qui compte le plus pour toi</div><div class="pol-card"><div class="pol-sub" style="font-size:.76rem;margin-bottom:.6rem">Somme des coefficients de pertinence que tu as donnés, thème par thème (ta hiérarchie de priorités).</div>' +
      V.hbars(weights.sort(function (a, b) { return b.c - a.c; }).map(function (o) { return { label: POL.SECTION_LABELS[o.s].split(' &')[0], value: Math.round(o.c / wsum * 100), color: POL.SECTION_COLORS[o.s], text: Math.round(o.c / wsum * 100) + '%' }; }), { title: 'Priorités' }) +
      V.hist([1, 2, 3, 4, 5].map(function (n, i) { return { label: 'Pert. ' + n, n: st.impHist[i], color: '#1B4DE4' }; }), { title: 'Distribution des pertinences' }) + '</div>';

    var decisive = POL.SECTIONS.filter(function (s) { return st.perTheme[s].mean != null; }).sort(function (a, b) { return Math.abs(st.perTheme[b].mean - 5) - Math.abs(st.perTheme[a].mean - 5); });
    var tranche = '<div class="pol-slbl">Tes thèmes les plus tranchés</div><div class="pol-card">' + decisive.slice(0, 3).map(function (s, i) { var m = st.perTheme[s].mean; var p = POL.positionLabel(m); return '<div class="pol-tranche"><span class="pol-cand-rank">' + (i + 1) + '</span><span class="pol-tranche-name">' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + '</span><span class="pol-tranche-pos" style="color:' + p.color + '">' + esc(p.label) + ' · ' + m.toFixed(1) + '</span></div>'; }).join('') +
      (decisive.length ? '<div class="pol-sub" style="font-size:.76rem;margin-top:.5rem">Thème le plus modéré : <strong>' + esc(POL.SECTION_LABELS[decisive[decisive.length - 1]]) + '</strong> (' + st.perTheme[decisive[decisive.length - 1]].mean.toFixed(1) + '/10).</div>' : '') + '</div>';

    var ext = '<div class="pol-slbl">Tes réponses les plus radicales (' + st.extremes.length + ')</div><div class="pol-card">' + (st.extremes.length ? st.extremes.slice(0, 8).map(function (e) { return '<div class="pol-ext"><span class="pol-ext-score" style="background:' + POL.positionLabel(e.sc).color + '">' + e.sc + '</span><span><strong>Q' + e.q.id + '</strong> ' + esc(e.q.question) + '<br><span class="pol-sub">→ ' + esc(e.txt) + '</span></span></div>'; }).join('') + (st.extremes.length > 8 ? '<div class="pol-sub" style="font-size:.74rem">… et ' + (st.extremes.length - 8) + ' autres.</div>' : '') : '<div class="pol-sub">Aucune réponse aux extrêmes : profil nuancé.</div>') + '</div>';

    var meta = '<div class="pol-card pol-stat-meta"><div><strong>' + tot + '</strong> réponses · <strong>' + Math.round(st.reliability * 100) + '%</strong> du quiz</div><div><strong>' + st.centrist.length + '</strong> réponses au centre (4,5-5,5)</div><div><strong>' + Object.keys(state.notes).length + '</strong> notes personnelles</div></div>';
    return '<div class="pol-cols"><div class="pol-col">' + meta + distCard + coh + '</div><div class="pol-col pol-col-side">' + prio + tranche + ext + '</div></div>';
  }

  function renderHistory(results) {
    var out = '';
    if (results && results.length > 1) {
      var chrono = results.slice().reverse();
      out += '<div class="pol-slbl">Évolution de ta position globale</div><div class="pol-card">' + V.lineChart(chrono.map(function (r) { return { label: fmtDateShort(r.created_at), y: r.global_score }; })) +
        '<div class="pol-axis-legend"><span style="color:var(--pol-right)">0 = droite</span><span>5 = centre</span><span style="color:var(--pol-left)">10 = gauche</span></div></div>';
      out += '<div class="pol-slbl">Bilans enregistrés</div>' + results.map(function (r, i) {
        var prev = results[i + 1]; var deltaHtml = '';
        if (prev && r.global_score != null && prev.global_score != null) {
          var d = r.global_score - prev.global_score; var cls = Math.abs(d) < 0.2 ? 'pol-delta-same' : (d > 0 ? 'pol-delta-up' : 'pol-delta-down'); var arrow = Math.abs(d) < 0.2 ? '=' : (d > 0 ? '↑ gauche' : '↓ droite');
          deltaHtml = '<span class="pol-histo-delta ' + cls + '"> · ' + arrow + ' ' + (d > 0 ? '+' : '') + d.toFixed(1) + '</span>';
        }
        var pos = POL.positionLabel(r.global_score != null ? r.global_score : 5);
        return '<div class="pol-histo-item"><div class="pol-histo-date">' + (r._live ? 'Maintenant (profil vivant)' : fmtDate(r.created_at)) + (r.answered ? ' · ' + r.answered + ' rép.' : '') + '</div><div><span class="pol-histo-pos" style="color:' + pos.color + '">' + esc(r.global_position || '—') + '</span><span class="pol-histo-delta" style="color:var(--pol-mut)"> · ' + (r.global_score != null ? r.global_score.toFixed(1) : '—') + '/10</span>' + deltaHtml + '</div>' + ((r.candidate_matches || [])[0] ? '<div class="pol-sub" style="font-size:.76rem">1er : ' + esc(r.candidate_matches[0].name) + ' ' + r.candidate_matches[0].match_pct + '%</div>' : '') + '</div>';
      }).join('');
      out += renderEvolutionTable(results);
    } else {
      out += '<div class="pol-matching-note">Un seul bilan pour l\'instant. Enregistre un bilan depuis les résultats (bouton « Enregistrer ce bilan ») ou refais le quiz dans quelques mois pour voir l\'évolution de tes opinions.</div>';
    }
    var arc = getArchive();
    out += '<div class="pol-slbl">Archive des réponses (instantanés)</div><div class="pol-card">' +
      (arc.length ? arc.map(function (a) { return '<div class="pol-arc-row"><div><strong>' + a.n + ' réponses</strong> · ' + esc(a.reason) + '<br><span class="pol-sub" style="font-size:.74rem">' + fmtDate(a.created_at) + ' à ' + fmtTime(a.created_at) + '</span></div><button class="pol-btn pol-btn-line pol-btn-sm" onclick="POLQ.restoreSnapshot(\'' + a.id + '\')">Restaurer</button></div>'; }).join('') : '<div class="pol-sub">Aucun instantané. Un instantané est créé automatiquement quand tu termines le quiz, enregistres un bilan ou cliques « Refaire ».</div>') +
      '<button class="pol-btn pol-btn-ghost pol-btn-sm" style="margin-top:.6rem;width:100%" onclick="POLQ.snapshotNow()">Créer un instantané maintenant</button></div>';
    return out;
  }
  function snapshotNow() { var r = snapshot('manuel'); if (r) { scheduleCloudPush(); toast('Instantané créé (' + r.n + ' réponses)'); renderProfile(); } else toast('Aucune réponse à archiver'); }
  function renderEvolutionTable(results) {
    var chrono = results.slice().reverse();
    var head = '<div class="pol-slbl">Scores par thème (chronologique)</div><div class="pol-card" style="overflow-x:auto;padding:.6rem">';
    var tbl = '<table class="pol-evo-tbl"><tr><th style="text-align:left">Thème</th>' + chrono.map(function (r) { return '<th>' + fmtDateShort(r.created_at) + '</th>'; }).join('') + '</tr>';
    POL.SECTIONS.forEach(function (s) {
      tbl += '<tr><td>' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + '</td>' + chrono.map(function (r) { var v = r.profile[s]; var col = v != null ? POL.positionLabel(v).color : 'var(--pol-mut)'; return '<td style="color:' + col + '">' + (v != null ? Number(v).toFixed(1) : '—') + '</td>'; }).join('') + '</tr>';
    });
    return head + tbl + '</table></div>';
  }
  function renderSave() {
    var n = Object.keys(state.answers).length;
    var sql = '';
    if (state.cloud.status === 'off' && !isMelati() && !isGuest()) {
      sql = '<div class="pol-card"><div class="pol-cand-prog-hint">Activer le cloud (une seule fois)</div><ol class="pol-steps"><li>Ouvre Supabase → projet MASSUP → <strong>SQL Editor</strong>.</li><li>Colle le contenu de <code>massup/politique/pol_store.sql</code> et clique <strong>Run</strong>.</li><li>Recharge cette page : la pastille ☁️ passe en vert et tes ' + n + ' réponses montent dans le cloud.</li></ol><div class="pol-sub" style="font-size:.74rem">La table s\'appelle <code>pol_store</code> : une ligne par profil, protégée par un en-tête secret. Zéro lien avec les tables muscu.</div></div>';
    }
    var th = getTheme(); var themeCard = '<div class="pol-card"><div class="pol-cand-prog-hint">Apparence</div><div class="pol-tabs pol-theme-tabs">' + [['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']].map(function (t) { return '<button class="pol-tab' + (th === t[0] ? ' on' : '') + '" onclick="POLQ.setTheme(\'' + t[0] + '\')">' + t[1] + '</button>'; }).join('') + '</div><div class="pol-sub" style="font-size:.74rem">Auto = suit le réglage de l\'appareil. Le bouton en haut à droite bascule aussi.</div></div>';
    var layers = '<div class="pol-card"><div class="pol-cand-prog-hint">Comment tes réponses sont protégées</div><ul class="pol-layers">' +
        '<li><strong>Appareil</strong> — chaque clic est écrit immédiatement dans le stockage du navigateur.</li>' +
        '<li><strong>Archive</strong> — des instantanés horodatés sont gardés (fin de quiz, bilan, « refaire ») et restaurables depuis Historique.</li>' +
        (isGuest() ? '' : '<li><strong>Cloud</strong> — fusion réponse par réponse : la version la plus récente gagne, un côté vide n\'écrase jamais un côté plein. Marche sur tous tes appareils, sans compte.</li>') +
        '<li><strong>Fichier</strong> — un .json que tu gardes (Fichiers / iCloud / Drive), restaurable à tout moment.</li></ul></div>';
    var ownerCard = '';
    if (isOwner() && !isGuest()) {
      ownerCard = '<div class="pol-card"><div class="pol-cand-prog-hint">Version privée</div><div class="pol-sub" style="font-size:.78rem">Cet appareil est en <strong>version privée</strong> (profils + cloud + notes). Le lien à partager reste anonyme : les visiteurs sont en version publique, sans compte ni cloud. Pour faire passer le test à quelqu\'un sur CET appareil, passe sur le profil <strong>Invité</strong> (en haut à droite) — ses réponses seront séparées des tiennes.</div></div>';
    }
    return '<div class="pol-cols"><div class="pol-col">' + themeCard + renderCloudCard(false) + sql + '</div><div class="pol-col pol-col-side">' +
      layers + ownerCard +
      '<div class="pol-card"><div class="pol-cand-prog-hint">À propos</div><div class="pol-sub" style="font-size:.8rem">Quiz Politique 2027 · version ' + APP_VERSION + ' · ' + Q.length + ' questions · ' + POL.CANDIDATES.length + ' candidats (' + POL.CANDIDATES.filter(POL.isRunning).length + ' en course) · sondages ' + esc(POL.POLLS_DATE) + '.' + (isOwner() ? ' Profil : ' + esc(PROFILE_LABELS[state.profile]) + '.' : '') + '</div></div></div></div>';
  }

  // ════════════════════════════════════════════════
  // EXPORT .txt
  // ════════════════════════════════════════════════
  // ── Réponses en note → validation par l'IA ──
  function exportPending() {
    var ids = Q.filter(function (q) { return state.pending[q.id] && !state.answers[q.id]; });
    if (!ids.length) { toast('Aucune note à valider'); return; }
    var L = [];
    L.push('QUIZ POLITIQUE 2027 — RÉPONSES EN NOTE À VALIDER (' + PROFILE_LABELS[state.profile] + ', ' + new Date().toLocaleString('fr-FR') + ')');
    L.push('Consigne pour l\'IA : pour chaque question, choisis l\'INDICE de l\'option qui correspond le mieux à la note, puis renvoie UNIQUEMENT un JSON de la forme {"app":"quiz-politique-validation","answers":{"<id>":<indice>,...}} (indice = numéro entre crochets).');
    ids.forEach(function (q) {
      L.push(''); L.push('Q' + q.id + ' [' + POL.SECTION_LABELS[q.theme] + '] ' + q.question);
      q.options.forEach(function (o, i) { L.push('   [' + i + '] (position ' + o.score + '/10) ' + o.text); });
      L.push('   NOTE DE ' + PROFILE_LABELS[state.profile].toUpperCase() + ' : ' + (state.notes[q.id] || ''));
    });
    var txt = L.join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { toast('Notes copiées dans le presse-papiers + fichier téléchargé'); }, function () {});
    downloadTxt(txt, 'notes-a-valider-' + state.profile + '-' + stamp(new Date()) + '.txt');
  }
  function pasteValidation() {
    var txt = window.prompt('Colle ici la validation de l\'IA (JSON {"answers":{"id":indice}} ou lignes "id:indice") :');
    if (!txt) return;
    applyValidation(txt);
  }
  function applyValidation(txt) {
    var map = {};
    try { var j = JSON.parse(txt); var a = j.answers || j; Object.keys(a).forEach(function (k) { var v = a[k]; map[k] = (v && typeof v === 'object') ? v.optIdx : v; }); }
    catch (e) { txt.split(/[\n,;]+/).forEach(function (line) { var m = line.match(/(\d+)\s*[:=]\s*(\d+)/); if (m) map[m[1]] = Number(m[2]); }); }
    var done = 0, bad = [];
    Object.keys(map).forEach(function (k) {
      var q = Q.find(function (x) { return x.id === Number(k); }) || (POL.QUESTIONS_PERSO || []).find(function (x) { return x.id === Number(k); });
      var idx = Number(map[k]);
      if (!q || isNaN(idx) || !q.options[idx]) { bad.push(k); return; }
      state.answers[q.id] = { optIdx: idx, score: q.options[idx].score, t: nowMs(), validated: true };
      delete state.pending[q.id]; done++;
    });
    if (!done) { toast('Rien de valide dans ce texte'); return; }
    touch(); snapshot('validation IA');
    toast(done + ' réponse' + (done > 1 ? 's' : '') + ' validée' + (done > 1 ? 's' : '') + (bad.length ? ' · ignorées : ' + bad.join(', ') : ''));
    showResultsFromAnswers();
  }

  function exportTxt() {
    if (Object.keys(state.answers).length === 0) { exportTxtFromResult(); return; }
    var sv = state.quizSet; state.quizSet = 'main'; var r = computeResults(); state.quizSet = sv;
    var lines = [], now = new Date();
    lines.push('QUIZ POLITIQUE 2027 — Mes résultats (' + PROFILE_LABELS[state.profile] + ')');
    lines.push('Exporté le ' + now.toLocaleString('fr-FR'));
    lines.push('Questions répondues : ' + r.answered + '/' + Q.length);
    lines.push('Position globale : ' + r.globalPos.label + ' (' + (r.globalScore !== null ? r.globalScore.toFixed(2) : '—') + '/10)');
    lines.push(''); lines.push('═══ PROFIL PAR THÈME ═══');
    POL.SECTIONS.forEach(function (s) { var v = r.profile[s]; lines.push('• ' + POL.SECTION_LABELS[s] + ' : ' + (v !== null ? v.toFixed(2) + '/10 — ' + POL.positionLabel(v).label : 'non répondu')); });
    lines.push(''); lines.push('═══ CANDIDATS (par correspondance) ═══');
    r.matches.forEach(function (m, i) { lines.push((i + 1) + '. ' + m.name + ' (' + m.party + ') — ' + m.match + '%'); });
    lines.push(''); lines.push('═══ MES RÉPONSES & NOTES ═══');
    Q.forEach(function (q) {
      var a = state.answers[q.id]; lines.push('');
      lines.push('[' + POL.SECTION_LABELS[q.theme] + '] Q' + q.id + '. ' + q.question);
      lines.push(a ? '   → ' + q.options[a.optIdx].text + '  (score ' + q.options[a.optIdx].score + '/10, pertinence ' + (state.importance[q.id] || '3 par défaut') + (a.validated ? ', validée par l\'IA' : '') + ')' : (state.pending[q.id] ? '   → (réponse en note, à valider par l\'IA)' : '   → (non répondu)'));
      if (state.notes[q.id]) lines.push('   Note : ' + state.notes[q.id]);
    });
    lines.push(''); lines.push('— Matching question par question : concordance de +1 (même option) à −1 (option opposée) entre ta réponse et la position de chaque candidat, pondérée par ta pertinence ; % = (moyenne + 1) ÷ 2 × 100. Positions au ' + (POL.POSITIONS_DATE || POL.DATA_DATE) + '.');
    downloadTxt(lines.join('\n'), 'quiz-politique-' + stamp(now) + '.txt'); toast('Export téléchargé');
  }
  function exportTxtFromResult() {
    if (Object.keys(state.answers).length) { exportTxt(); return; }
    var results = lsGet(pfx(LS_RESULTS), []); if (!results.length) { toast('Rien à exporter'); return; }
    var last = results[0], lines = [];
    lines.push('QUIZ POLITIQUE 2027 — Mon profil'); lines.push('Quiz du ' + fmtDate(last.created_at));
    lines.push('Position globale : ' + last.global_position + ' (' + (last.global_score != null ? Number(last.global_score).toFixed(2) : '—') + '/10)'); lines.push('');
    lines.push('═══ PROFIL PAR THÈME ═══');
    POL.SECTIONS.forEach(function (s) { var v = last.profile[s]; lines.push('• ' + POL.SECTION_LABELS[s] + ' : ' + (v != null ? Number(v).toFixed(2) + '/10 — ' + POL.positionLabel(v).label : 'non répondu')); });
    lines.push(''); lines.push('═══ CANDIDATS ═══');
    (last.candidate_matches || []).forEach(function (m, i) { lines.push((i + 1) + '. ' + m.name + ' (' + m.party + ') — ' + m.match_pct + '%'); });
    downloadTxt(lines.join('\n'), 'profil-politique-' + stamp(new Date()) + '.txt'); toast('Export téléchargé');
  }
  function downloadTxt(content, filename) {
    var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ════════════════════════════════════════════════
  // COUCHE 4 — fichier .json
  // ════════════════════════════════════════════════
  function exportBackup() {
    var backup = { app: 'quiz-politique', version: 2, profile: state.profile, exported_at: new Date().toISOString(),
      answers: state.answers || {}, notes: state.notes || {}, importance: state.importance || {}, pending: state.pending || {}, results_cache: lsGet(pfx(LS_RESULTS), []), archive: getArchive() };
    var nAns = Object.keys(backup.answers).length;
    downloadTxt(JSON.stringify(backup, null, 2), 'sauvegarde-quiz-politique-' + state.profile + '-' + stamp(new Date()) + '.json');
    toast(nAns > 0 ? nAns + ' réponses sauvegardées dans le fichier' : 'Sauvegarde téléchargée');
  }
  function importBackup() {
    var input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json,.json';
    input.onchange = function () {
      var f = input.files && input.files[0]; if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var data; try { data = JSON.parse(reader.result); } catch (e) { toast('Fichier illisible'); return; }
        if (!data || data.app !== 'quiz-politique') { toast('Ce fichier n\'est pas une sauvegarde du quiz'); return; }
        applyBackup(data);
      };
      reader.readAsText(f);
    };
    input.click();
  }
  function applyBackup(data) {
    var nAns = data.answers ? Object.keys(data.answers).length : 0;
    var cur = Object.keys(state.answers).length;
    var mode = 'merge';
    if (cur > 0) {
      var msg = 'Sauvegarde du ' + (data.exported_at ? fmtDate(data.exported_at) : '?') + ' : ' + nAns + ' réponses.\nTu as actuellement ' + cur + ' réponses.\n\nOK = FUSIONNER (on garde le plus récent de chaque réponse, rien n\'est perdu)\nAnnuler = ne rien faire';
      if (!window.confirm(msg)) return;
    } else { if (!window.confirm('Restaurer ' + nAns + ' réponses depuis ce fichier ?')) return; }
    snapshot('avant restauration fichier');
    var merged = mergeStates(bundle(), { answers: data.answers || {}, notes: data.notes || {}, importance: data.importance || {}, pending: data.pending || {}, results_cache: data.results_cache || [], archive: data.archive || [], lastChange: data.exported_at ? new Date(data.exported_at).getTime() : 0 });
    state.answers = merged.answers; state.notes = merged.notes; state.importance = merged.importance; state.pending = merged.pending || {};
    lsSet(pfx(LS_RESULTS), merged.results_cache); lsSet(pfx(LS_ARCHIVE), merged.archive);
    touch();
    toast(Object.keys(state.answers).length + ' réponses après ' + (mode === 'merge' ? 'fusion' : 'restauration'));
    renderEntry(); setNav('intro');
  }

  // ════════════════════════════════════════════════
  // CANDIDATS — annuaire · sondages · duel / comparer
  // ════════════════════════════════════════════════
  function goCandidats() { show('candidats'); setNav('candidats'); renderCandidats(); }
  function setCandFilter(f) { state.candFilter = f; state.candView = 'list'; renderCandidats(); window.scrollTo(0, 0); }
  function toggleCandDir(i) { var c = el('polCandDir' + i); if (c) c.classList.toggle('open'); }
  function polSlug(name) { return name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function candAvatar(c, mod) {
    var parts = c.name.trim().split(/\s+/);
    var ini = ((parts[0] || '')[0] || '') + (parts.length > 1 ? (parts[parts.length - 1][0] || '') : '');
    var src = 'imgs/' + polSlug(c.name) + '.jpg';
    return '<span class="pol-cd-avatar' + (mod ? ' ' + mod : '') + '" style="background:' + c.color + '"><span class="pol-cd-ini">' + esc(ini.toUpperCase()) + '</span><img class="pol-cd-photo" src="' + esc(src) + '" alt="" loading="lazy" onerror="this.remove()"></span>';
  }
  // Logo du parti (parties.js) — repli sur le sigle
  function partyLogo(c, size) {
    var p = POL.partyOf ? POL.partyOf(c) : null; if (!p) return '';
    return '<span class="pol-party-logo' + (size ? ' ' + size : '') + '" title="' + esc(c.party) + '"><span class="pol-party-sigle">' + esc(p.short.length <= 4 ? p.short : p.short.replace(/[^A-Za-zÀ-ÿ]/g, '').slice(0, 3).toUpperCase()) + '</span><img src="imgs/logos/' + p.slug + '.png" alt="" loading="lazy" onload="this.previousSibling.style.display=\'none\'" onerror="this.remove()"></span>';
  }
  function candThemeBar(score) { var left = ((10 - score) / 10) * 100; return '<div class="pol-cd-bar"><div class="pol-cd-bar-track"></div><div class="pol-cd-bar-dot" style="left:' + left + '%"></div></div>'; }
  function pollOf(c) { var p = POL.POLLS && POL.POLLS[c.name]; return p == null ? -1 : p; }
  function pctLabel(pct) { return pct == null ? '' : (pct < 1 ? '<1%' : (Math.round(pct * 10) / 10) + '%'); }
  function candAvg(c) { var v = POL.SECTIONS.map(function (s) { return c.scores[s]; }); return v.reduce(function (a, b) { return a + b; }, 0) / v.length; }

  function candCard(c, id, rank, userProfile) {
    var pos = POL.positionLabel(candAvg(c));
    var pct = POL.POLLS ? POL.POLLS[c.name] : null;
    var range = POL.POLLS_RANGE && POL.POLLS_RANGE[c.name];
    var mqc = mqOf(c); var match = mqc ? mqc.pct : (userProfile ? POL.computeMatch(userProfile, c.scores) : null);
    var stats = POL.SECTIONS.map(function (s) {
      var pp = POL.positionLabel(c.scores[s]);
      var you = userProfile && userProfile[s] != null ? '<span class="pol-cd-you" style="left:' + ((10 - userProfile[s]) / 10 * 100) + '%" title="toi"></span>' : '';
      return '<div class="pol-cd-stat"><div class="pol-cd-stat-top"><span class="pol-cd-stat-name">' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + '</span><span class="pol-cd-stat-pos" style="color:' + pp.color + '">' + esc(pp.label) + '</span></div>' +
        '<div class="pol-cd-bar"><div class="pol-cd-bar-track"></div>' + you + '<div class="pol-cd-bar-dot" style="left:' + ((10 - c.scores[s]) / 10 * 100) + '%"></div></div>' +
        (c.program && c.program[s] ? '<div class="pol-cd-stat-prog">' + esc(c.program[s]) + '</div>' : '') + '</div>';
    }).join('');
    return '<div class="pol-cd' + (POL.isRunning(c) ? '' : ' retired') + '" id="polCandDir' + id + '">' +
      '<div class="pol-cd-head" onclick="POLQ.toggleCandDir(' + id + ')">' +
        (rank ? '<span class="pol-cd-rank">' + rank + '</span>' : '') + candAvatar(c) +
        '<span class="pol-cd-info"><span class="pol-cd-name">' + esc(c.name) + '</span><span class="pol-cd-party">' + partyLogo(c) + ((POL.STATUS_ICONS || {})[c.status] || '') + ' ' + esc(c.party) + '</span></span>' +
        (match != null ? '<span class="pol-cd-match" title="accord avec toi">' + match + '%</span>' : '') +
        (pct != null && POL.isRunning(c) ? '<span class="pol-cd-poll">' + pctLabel(pct) + '</span>' : '') +
        '<span class="pol-cand-chev">▸</span>' +
      '</div>' +
      '<div class="pol-cd-detail">' +
        '<div class="pol-cd-meta">' + statusChip(c) + '<span class="pol-cd-pos-badge" style="background:' + pos.color + '">' + esc(pos.label) + '</span>' +
          (pct != null ? '<span class="pol-cd-poll-badge">~' + pctLabel(pct) + (range ? ' (' + range[0] + '-' + range[1] + ' %)' : '') + ' au 1er tour</span>' : '') + '</div>' +
        (c.oneLiner ? '<div class="pol-cd-oneliner">' + esc(c.oneLiner) + '</div>' : '') + (userProfile ? fitHtml(userProfile, c) : '') +
        (userProfile ? '<div class="pol-btn-row" style="margin:.4rem 0"><button class="pol-btn pol-btn-ghost pol-btn-sm" onclick="POLQ.openDuel(\'' + esc(c.name).replace(/'/g, "\\'") + '\')">Duel / comparer</button></div>' : '') +
        '<div class="pol-cd-stat-hint">Ses idées, thème par thème' + (userProfile ? ' <span class="pol-cd-you-legend">▮ toi</span>' : '') + '</div>' + stats + actuBlock(c.name, userProfile, 5) +
      '</div></div>';
  }

  function renderCandidats() {
    var r = currentProfileOrCached(); var up = r ? r.profile : null;
    var blocs = ['exg', 'gauche', 'centre', 'droite', 'exd'];
    var running = POL.CANDIDATES.filter(POL.isRunning), retired = POL.CANDIDATES.filter(function (c) { return !POL.isRunning(c); });
    var nOff = POL.CANDIDATES.filter(function (c) { return c.status === 'déclaré'; }).length, nPrim = POL.CANDIDATES.filter(function (c) { return c.status === 'primaire'; }).length, nPres = POL.CANDIDATES.filter(function (c) { return c.status === 'pressenti' || c.status === 'conditionnel'; }).length;
    var chips = '<button class="pol-rv-chip' + (state.candFilter === 'all' && state.candView === 'list' ? ' on' : '') + '" onclick="POLQ.setCandFilter(\'all\')">Sondages · ' + running.length + '</button>' +
      '<button class="pol-rv-chip' + (state.candView === 'duel' ? ' on' : '') + '" onclick="POLQ.openDuel()">Duel</button>' +
      '<button class="pol-rv-chip' + (state.candFilter === 'actu' && state.candView === 'list' ? ' on' : '') + '" style="--rv:#7C3AED" onclick="POLQ.openActu()">Actu · ' + allActus().length + '</button>' +
      '<button class="pol-rv-chip' + (state.candFilter === 'official' && state.candView === 'list' ? ' on' : '') + '" style="--rv:#18753C" onclick="POLQ.setCandFilter(\'official\')">Officiellement déclarés · ' + nOff + '</button>' +
      '<button class="pol-rv-chip' + (state.candFilter === 'primaire' && state.candView === 'list' ? ' on' : '') + '" style="--rv:#AD1457" onclick="POLQ.setCandFilter(\'primaire\')">Primaire PS/PP · ' + nPrim + '</button>' +
      '<button class="pol-rv-chip' + (state.candFilter === 'pressenti' && state.candView === 'list' ? ' on' : '') + '" style="--rv:#B45309" onclick="POLQ.setCandFilter(\'pressenti\')">Pressentis / quasi · ' + nPres + '</button>' +
      blocs.map(function (b) { var n = running.filter(function (c) { return c.bloc === b; }).length; return '<button class="pol-rv-chip' + (state.candFilter === b && state.candView === 'list' ? ' on' : '') + '" onclick="POLQ.setCandFilter(\'' + b + '\')">' + esc(POL.BLOC_LABELS[b]) + ' · ' + n + '</button>'; }).join('') +
      '<button class="pol-rv-chip' + (state.candFilter === 'retired' && state.candView === 'list' ? ' on' : '') + '" onclick="POLQ.setCandFilter(\'retired\')">Retirés / plan B · ' + retired.length + '</button>';

    var body, hint, top = '';
    if (state.candView === 'duel') { body = renderDuel(r); hint = 'Compare deux candidats entre eux — et avec toi, thème par thème.'; }
    else if (state.candFilter === 'actu') { body = renderActu(up); hint = '<strong>Fil d\'actu</strong> : dernières prises de position publiques (débats, interviews, universités d\'été), datées et sourcées, mises à jour le ' + esc(POL.ACTUS_DATE || POL.DATA_DATE) + '. ' + (up ? 'Chaque étiquette compare la position exprimée à <strong>la tienne</strong> sur ce thème.' : 'Fais le quiz pour voir à quel point chaque sortie colle à tes idées.'); }
    else if (state.candFilter === 'all') {
      var ranked = running.slice().sort(function (a, b) { return pollOf(b) - pollOf(a) || candAvg(b) - candAvg(a); });
      hint = 'Classés par <strong>intentions de vote au 1er tour</strong> (moyenne de plusieurs sondages, ' + esc(POL.POLLS_DATE) + '). Marine Le Pen est bien candidate (éligible depuis l\'arrêt du 7 juillet 2026). ' + (up ? 'Le % vert = ton accord avec chaque candidat.' : '');
      var pollRows = ranked.filter(function (c) { return pollOf(c) >= 2; }).map(function (c) { return { label: c.name.split(' ').slice(-1)[0], value: pollOf(c), color: c.color, range: POL.POLLS_RANGE && POL.POLLS_RANGE[c.name], text: pctLabel(pollOf(c)) }; });
      top = '<div class="pol-card">' + V.hbars(pollRows, { title: 'Sondages 1er tour', max: 40 }) + '<div class="pol-sub" style="font-size:.72rem">Barre = estimation médiane · zone claire = fourchette observée. Sources : ' + esc(POL.POLLS_SOURCES) + '. Hollande est testé comme hypothèse (non déclaré).</div></div>';
      var id0 = 0; body = ranked.map(function (c, k) { return candCard(c, id0++, k + 1, up); }).join('');
    } else if (state.candFilter === 'official') {
      hint = '<strong>Candidatures officiellement annoncées</strong> par la personne elle-même (date affichée sur chaque fiche), classées par sondages. Les candidats à la primaire PS/PP et les « pressentis » ne sont pas ici. Les 500 parrainages ne seront validés qu\'en mars 2027 par le Conseil constitutionnel.';
      var offs = running.filter(function (c) { return c.status === 'déclaré'; }).sort(function (a, b) { return pollOf(b) - pollOf(a); });
      var id3 = 0; body = offs.map(function (c, k) { return candCard(c, id3++, k + 1, up); }).join('');
    } else if (state.candFilter === 'primaire') {
      hint = 'Candidats à la <strong>primaire PS / Place publique</strong> des 9-10 et 16-17 octobre 2026 : un seul sera candidat à la présidentielle. Glucksmann s\'est déclaré le 23 août (TF1) pour cette primaire, pas (encore) pour la présidentielle ; Faure attendu avant le 15 septembre.';
      var prims = POL.CANDIDATES.filter(function (c) { return c.status === 'primaire'; }).sort(function (a, b) { return pollOf(b) - pollOf(a); });
      var id4 = 0; body = prims.map(function (c) { return candCard(c, id4++, null, up); }).join('');
    } else if (state.candFilter === 'pressenti') {
      hint = 'Pas (encore) de déclaration officielle : ils se préparent, hésitent ou attendent (Hollande décide « en décembre », Bertrand « je le serai » mais fin 2026, Zemmour, Villepin en quête de parrainages, Faure avant le 15 sept., Roussel le 6 sept.).';
      var pres = POL.CANDIDATES.filter(function (c) { return c.status === 'pressenti' || c.status === 'conditionnel'; }).sort(function (a, b) { return pollOf(b) - pollOf(a); });
      var id5 = 0; body = pres.map(function (c) { return candCard(c, id5++, null, up); }).join('');
    } else if (state.candFilter === 'retired') {
      hint = 'Ont renoncé ou sont en réserve : ils n\'entrent pas dans ton classement (sauf si tu actives « inclure les retirés » dans les résultats).';
      var id1 = 0; body = retired.map(function (c) { return candCard(c, id1++, null, up); }).join('');
    } else {
      hint = 'Bloc « ' + esc(POL.BLOC_LABELS[state.candFilter]) + ' », classé du plus à gauche au plus à droite.';
      var items = running.filter(function (c) { return c.bloc === state.candFilter; }).sort(function (a, b2) { return candAvg(b2) - candAvg(a); });
      var id2 = 0; body = items.map(function (c) { return candCard(c, id2++, null, up); }).join('');
    }
    el('polCandidats').innerHTML = '<div class="pol-slbl">Les candidats à la présidentielle 2027</div><div class="pol-cand-hint">' + hint + '</div><div class="pol-rv-chips">' + chips + '</div>' + top + ((state.candView === 'list' && state.candFilter !== 'actu') ? '<div class="pol-cd-list">' + body + '</div>' : body);
  }

  // ── Duel / comparateur ──
  function openDuel(name) { if (name) { if (state.duel.a !== name) state.duel.b = state.duel.a === name ? state.duel.b : state.duel.a; state.duel.a = name; } goCompare(); return; }
  function openDuelLegacy(name) {
    if (name) {
      if (!state.duel.a || state.duel.a === name) state.duel.a = name; else state.duel.b = name;
      if (state.duel.a === state.duel.b) state.duel.b = null;
    }
    state.candView = 'duel'; show('candidats'); setNav('candidats'); renderCandidats();
  }
  function setDuel(side, name) { state.duel[side] = name || null; if (state.duel.a && state.duel.a === state.duel.b) state.duel[side === 'a' ? 'b' : 'a'] = null; if (state.view === 'compare') renderCompare(); else renderCandidats(); }
  function renderDuel(r) {
    var running = POL.CANDIDATES.slice().sort(function (a, b) { return pollOf(b) - pollOf(a); });
    if (!state.duel.a) state.duel.a = 'Marine Le Pen';
    if (!state.duel.b) state.duel.b = r && r.matches[0] && r.matches[0].name !== state.duel.a ? r.matches[0].name : 'Édouard Philippe';
    var A = candByName(state.duel.a), B = candByName(state.duel.b);
    function sel(side, cur) { return '<select class="pol-select" onchange="POLQ.setDuel(\'' + side + '\', this.value)">' + running.map(function (c) { return '<option value="' + esc(c.name) + '"' + (c.name === cur ? ' selected' : '') + '>' + esc(c.name) + (POL.isRunning(c) ? '' : ' (retiré)') + '</option>'; }).join('') + '</select>'; }
    var head = '<div class="pol-card pol-duel-head"><div class="pol-duel-side">' + candAvatar(A, 'big') + sel('a', A.name) + '<span class="pol-cd-party">' + esc(A.party) + '</span></div><span class="pol-duel-vs">VS</span><div class="pol-duel-side">' + candAvatar(B, 'big') + sel('b', B.name) + '<span class="pol-cd-party">' + esc(B.party) + '</span></div></div>';
    var up = r ? r.profile : null;
    var mqA = mqOf(A), mqB = mqOf(B); var sim = POL.candSimilarity ? POL.candSimilarity(A, B) : null;
    var verdict = '';
    var rows = POL.SECTIONS.map(function (s) {
      var a = A.scores[s], b = B.scores[s], u = up ? up[s] : null;
      var win = '';
      var ta = mqA && mqA.themes[s], tb = mqB && mqB.themes[s];
      if (ta && tb && ta.score != null && tb.score != null) win = ta.score > tb.score + 0.01 ? 'a' : (tb.score > ta.score + 0.01 ? 'b' : '=');
      else if (u != null) { var da = Math.abs(a - u), db = Math.abs(b - u); win = da < db - 0.01 ? 'a' : (db < da - 0.01 ? 'b' : '='); }
      var youMark = u != null ? '<span class="pol-duel-you" style="left:' + ((10 - u) / 10 * 100) + '%"></span>' : '';
      return { s: s, a: a, b: b, u: u, win: win, html: '<div class="pol-duel-row"><div class="pol-duel-lbl">' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + (win && win !== '=' ? ' <span class="pol-duel-win" style="color:' + cc(win === 'a' ? A.color : B.color) + '">→ ' + esc((win === 'a' ? A : B).name.split(' ').slice(-1)[0]) + ' plus proche</span>' : (win === '=' ? ' <span class="pol-duel-win" style="color:var(--pol-mut)">égalité</span>' : '')) + '</div>' +
        '<div class="pol-duel-track"><div class="pol-cd-bar-track"></div>' + youMark + '<span class="pol-duel-dot" style="left:' + ((10 - a) / 10 * 100) + '%;background:' + A.color + '" title="' + esc(A.name) + ' ' + a + '"></span><span class="pol-duel-dot" style="left:' + ((10 - b) / 10 * 100) + '%;background:' + B.color + '" title="' + esc(B.name) + ' ' + b + '"></span></div></div>' };
    });
    if (up) {
      var wa = rows.filter(function (x) { return x.win === 'a'; }).length, wb = rows.filter(function (x) { return x.win === 'b'; }).length;
      var ma = mqA ? mqA.pct : POL.computeMatch(up, A.scores), mb = mqB ? mqB.pct : POL.computeMatch(up, B.scores);
      var closer = ma > mb ? A : (mb > ma ? B : null);
      verdict = '<div class="pol-card pol-duel-verdict"><div class="pol-duel-scores"><span style="color:' + cc(A.color) + '"><strong>' + ma + '%</strong> d\'accord</span><span class="pol-duel-vs-sm">' + wa + ' – ' + wb + ' thèmes</span><span style="color:' + cc(B.color) + '"><strong>' + mb + '%</strong> d\'accord</span></div>' +
        '<div class="pol-duel-txt">' + (closer ? 'Dans un second tour <strong>' + esc(A.name) + '</strong> / <strong>' + esc(B.name) + '</strong>, tes idées sont plus proches de <strong style="color:' + cc(closer.color) + '">' + esc(closer.name) + '</strong> (' + Math.max(ma, mb) + '% contre ' + Math.min(ma, mb) + '%).' : 'Égalité parfaite entre les deux.') + (sim != null ? ' Entre eux, ' + esc(A.name.split(' ').slice(-1)[0]) + ' et ' + esc(B.name.split(' ').slice(-1)[0]) + ' répondent pareil à <strong>' + sim + ' %</strong> des ' + Q.length + ' questions.' : '') + '</div></div>';
    } else verdict = '<div class="pol-matching-note">Fais le quiz pour voir de qui tu es le plus proche dans ce duel.' + (sim != null ? ' Entre eux : <strong>' + sim + ' %</strong> d\'idées communes sur les ' + Q.length + ' questions.' : '') + '</div>';
    var radar = '<div class="pol-card">' + V.radar([
      { values: up ? agreementValues(up, A) : A.scores, color: A.color, label: A.name.split(' ').slice(-1)[0] },
      { values: up ? agreementValues(up, B) : B.scores, color: B.color, label: B.name.split(' ').slice(-1)[0] }
    ], { title: 'Radar' }) + '<div class="pol-sub" style="font-size:.74rem;text-align:center">' + (up ? 'Surface = accord avec toi par thème.' : 'Surface = position (10 = gauche) par thème.') + '</div></div>';
    var bars = '<div class="pol-card"><div class="pol-cd-stat-hint">Positions thème par thème ' + (up ? '<span class="pol-cd-you-legend">▮ toi</span>' : '') + '</div>' + rows.map(function (x) { return x.html; }).join('') + '<div class="pol-axis-legend"><span style="color:var(--pol-left)">← Gauche</span><span>Centre</span><span style="color:var(--pol-right)">Droite →</span></div></div>';
    var progs = '<div class="pol-card"><div class="pol-cd-stat-hint">Leurs programmes, face à face</div>' + POL.SECTIONS.map(function (s) { return '<div class="pol-duel-prog"><div class="pol-duel-prog-t">' + POL.themeEmoji(s) + ' ' + esc(POL.SECTION_LABELS[s]) + '</div><div class="pol-duel-prog-cols"><div style="border-color:' + A.color + '"><strong style="color:' + cc(A.color) + '">' + esc(A.name.split(' ').slice(-1)[0]) + '</strong><br>' + esc(A.program[s] || '—') + '</div><div style="border-color:' + B.color + '"><strong style="color:' + cc(B.color) + '">' + esc(B.name.split(' ').slice(-1)[0]) + '</strong><br>' + esc(B.program[s] || '—') + '</div></div></div>'; }).join('') + '</div>';
    var duelActus = (actusOf(A.name).length || actusOf(B.name).length) ? '<div class="pol-card"><div class="pol-cd-stat-hint">Leurs dernières sorties</div><div class="pol-duel-prog-cols pol-duel-actus"><div style="border-color:' + A.color + '">' + (actusOf(A.name).slice(0, 3).map(function (a) { return actuItem(a, up, false); }).join('') || '<span class="pol-sub">—</span>') + '</div><div style="border-color:' + B.color + '">' + (actusOf(B.name).slice(0, 3).map(function (a) { return actuItem(a, up, false); }).join('') || '<span class="pol-sub">—</span>') + '</div></div></div>' : '';
    return '<div class="pol-cols"><div class="pol-col">' + head + verdict + radar + '</div><div class="pol-col pol-col-side">' + bars + progs + duelActus + '</div></div>';
  }

  // ════════════════════════════════════════════════
  // PAGE MÉTHODOLOGIE (30/08/2026)
  // ════════════════════════════════════════════════
  function goMethodo() { renderMethodo(); show('methodo'); setNav('methodo'); }
  function renderMethodo() {
    var nRun = POL.CANDIDATES.filter(POL.isRunning).length, nFam = POL.FAMILIES ? POL.FAMILIES.length : 22;
    var nOv = POL.POSITION_OVERRIDES ? Object.keys(POL.POSITION_OVERRIDES).length : 0;
    var coefRows = [[1, 1], [2, 2], [3, 4], [4, 7], [5, 10]].map(function (r) { return '<tr><td class="num">' + r[0] + '</td><td class="num">×' + r[1] + '</td><td class="num">×' + (r[1] * 2) + '</td></tr>'; }).join('');
    var concRows = [[0, '+1,00', 'Même option : accord parfait'], [2.5, '+0,50', 'Options voisines (échelle à 5 niveaux)'], [5, '0', 'Neutre : ni accord ni désaccord'], [7.5, '−0,50', 'Positions nettement éloignées'], [10, '−1,00', 'Options opposées']].map(function (r) { return '<tr><td class="num">' + String(r[0]).replace('.', ',') + '</td><td class="num">' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('');
    var famTiles = (POL.FAMILIES || []).map(function (f) { return '<span class="pol-rv-chip" style="cursor:default">' + esc((POL.FAMILY_LABELS || {})[f] || f) + '</span>'; }).join('');
    var seen = {}, partyTiles = POL.CANDIDATES.filter(function (c) { var p = POL.partyOf && POL.partyOf(c); if (!p || seen[p.slug]) return false; seen[p.slug] = true; return true; }).map(function (c) { var p = POL.partyOf(c); return '<div class="pol-party-tile">' + partyLogo(c) + '<span>' + esc(p.short) + '<small>' + esc(c.party.replace(/ · .*$/, '')) + '</small></span></div>'; }).join('');
    var html = '<div class="pol-page-head"><span class="pol-home-kicker">Transparence</span><h1>Méthodologie</h1><p class="pol-lead">Comment les ' + Q.length + ' questions sont construites, d\'où viennent les positions des ' + POL.CANDIDATES.length + ' candidats, et comment le pourcentage d\'accord est calculé — pour que tu puisses vérifier, contester et corriger.</p>' +
      '<div class="pol-toc"><a href="#m-principe">Principe</a><a href="#m-questions">Questions &amp; échelle</a><a href="#m-positions">Positions des candidats</a><a href="#m-calcul">Calcul du score</a><a href="#m-ponderation">Pondération</a><a href="#m-affichage">Ce qui est affiché</a><a href="#m-sources">Sources &amp; actu</a><a href="#m-limites">Limites</a><a href="#m-donnees">Données &amp; vie privée</a><a href="#m-maj">Mises à jour</a></div></div>';

    html += '<section class="pol-article" id="m-principe"><h2>1. Le principe : programme, pas camp</h2>' +
      '<p>La plupart des tests de positionnement classent les candidats sur un axe gauche-droite par thème, puis mesurent la distance à ta moyenne. Résultat : tout ramène au centre, et un candidat qui pense comme toi sur un sujet précis mais pas sur son « bloc » disparaît du classement.</p>' +
      '<p>Ici, <strong>chaque question compte pour elle-même</strong>. Pour chacune des ' + Q.length + ' questions, chaque candidat a une position sur la même échelle que tes options de réponse. Le Rassemblement national peut donc être noté comme la gauche sur la retraite à 60/62 ans et comme Les Républicains sur l\'immigration ; un socialiste favorable à la capitalisation est noté comme tel. Rien n\'est recentré par une moyenne.</p>' +
      '<div class="pol-callout">Méthode inspirée de la <a href="https://monvote2027.fr/methodologie" target="_blank" rel="noopener">méthodologie de monvote2027.fr</a> (concordance question par question sur une échelle à 5 niveaux), à laquelle on ajoute deux choses : une <strong>pondération par pertinence</strong> réglée par toi, et un <strong>fil d\'actu daté</strong> qui relie chaque position aux déclarations qui la fondent.</div></section>';

    html += '<section class="pol-article" id="m-questions"><h2>2. Les questions et l\'échelle</h2>' +
      '<p><strong>' + Q.length + ' questions</strong> réparties en 9 thèmes (' + POL.SECTIONS.map(function (t) { return POL.themeEmoji(t) + ' ' + POL.SECTION_LABELS[t]; }).join(', ') + ') : 100 questions de fond et 12 questions « actu 2026-2027 » (taxe Zucman, capitalisation, fonctionnaires, année blanche, priorité nationale, droit du sol, ZFE, réarmement, Palestine, exécutif vs Parlement, réseaux sociaux, uniforme). Chaque question est accompagnée d\'une explication chiffrée du contexte.</p>' +
      '<p>Chaque option de réponse porte un <strong>score de 0 à 10</strong> : 0 = position la plus à droite (libérale, identitaire, sécuritaire), 10 = la plus à gauche (redistributive, ouverte, écologiste radicale), 5 = position centrale. La majorité des questions ont 5 options (dont une centrale) ; certaines en ont 4 quand aucune position médiane n\'a de sens. Les options sont <strong>affichées dans un ordre stable, de la droite vers la gauche</strong>, pour que l\'échelle reste lisible d\'une question à l\'autre.</p>' +
      '<p>Tu peux passer une question, la marquer d\'une note libre (à faire valider ensuite) et revenir dessus à tout moment : une question non répondue est simplement ignorée dans le calcul.</p></section>';

    html += '<section class="pol-article" id="m-positions"><h2>3. Les positions des candidats</h2>' +
      '<p>Pour chaque question, la position d\'un candidat est un nombre sur la même échelle 0-10, en général égal au score de l\'option qu\'il choisirait (valeur intermédiaire quand il est entre deux options). Ces positions sont organisées en <strong>' + nFam + ' familles politiques</strong> — une ligne de ' + nFam + ' valeurs par question, soit ' + (Q.length * nFam) + ' positions — complétées par des <strong>exceptions individuelles</strong> pour ' + nOv + ' candidats dont la ligne personnelle s\'écarte de leur famille (Hollande sur la retraite à 63 ans et la capitalisation, Bardella sur la capitalisation, Brun sur EDF, Wauquiez sur l\'IVG, Villepin sur la Palestine…).</p>' +
      '<div class="pol-rv-chips" style="margin:.5rem 0">' + famTiles + '</div>' +
      '<p><strong>D\'où viennent-elles ?</strong> Des programmes (2022 et 2027 quand ils existent), des votes à l\'Assemblée nationale et au Sénat (réforme des retraites 2023, loi immigration 2024, taxe Zucman 2025, aide à mourir 2025-26, ZFE, loi Duplomb…), et des déclarations publiques datées : débats, interviews, universités d\'été, communiqués. Chaque prise de position récente est consignée dans le <a onclick="POLQ.openActu();return false;">fil d\'actu</a> avec sa date, sa source et les questions du quiz qu\'elle éclaire.</p>' +
      '<p>Une position est une <strong>appréciation éditoriale datée</strong> : elle est corrigée quand une déclaration ou un vote la contredit, jamais pour « rééquilibrer » un candidat. Dans le quiz et dans « Mes réponses », le bouton <em>Qui répond quoi ?</em> montre, pour chaque question, sous quelle option chaque candidat est placé.</p>' +
      '<h3>Partis représentés</h3><div class="pol-party-grid">' + partyTiles + '</div></section>';

    html += '<section class="pol-article" id="m-calcul"><h2>4. Le calcul de l\'accord</h2>' +
      '<p>Pour chaque question à laquelle tu as répondu, on mesure la distance <em>d</em> entre le score de ta réponse et la position du candidat, puis on la convertit en <strong>concordance</strong> entre +1 et −1 :</p>' +
      '<div class="pol-formula">d = | ta réponse − position du candidat |        (0 … 10)\nconcordance = 1 − d ÷ 5                          (+1 … −1)</div>' +
      '<div class="pol-table-wrap"><table class="pol-table"><thead><tr><th>Distance d</th><th>Concordance</th><th>Signification</th></tr></thead><tbody>' + concRows + '</tbody></table></div>' +
      '<p>Le <strong>score d\'un candidat</strong> est la moyenne pondérée de ces concordances sur toutes les questions répondues (et pour lesquelles sa position est connue). Il est affiché en pourcentage :</p>' +
      '<div class="pol-formula">score = Σ coef(q) × concordance(q) ÷ Σ coef(q)\n%  = (score + 1) ÷ 2 × 100        →  100 % identique · 50 % neutre · 0 % opposé</div>' +
      '<p>Le même calcul, restreint aux questions d\'un thème, donne le pourcentage par thème et les étiquettes <strong>Accord</strong> (≥ 80 %), <strong>Proche</strong> (≥ 60 %), <strong>Écart</strong> (≥ 35 %) et <strong>Désaccord</strong>.</p></section>';

    html += '<section class="pol-article" id="m-ponderation"><h2>5. La pondération par pertinence</h2>' +
      '<p>Après chaque réponse tu indiques, de 1 à 5, l\'importance que cette question a <em>pour toi</em>. Ce réglage détermine le coefficient de la question dans le score global ; il est <strong>doublé</strong> pour les questions marquées essentielles (retraites, immigration, impôts, climat…).</p>' +
      '<div class="pol-table-wrap"><table class="pol-table"><thead><tr><th>Pertinence</th><th>Coefficient</th><th>Question essentielle</th></tr></thead><tbody>' + coefRows + '</tbody></table></div>' +
      '<p>Une question sans pertinence réglée compte pour 3 (×4). La pondération influe sur le score global et les scores par thème, pas sur la position de chaque candidat, qui reste la même pour tout le monde.</p></section>';

    html += '<section class="pol-article" id="m-affichage"><h2>6. Ce qui est affiché — et ce qui ne compte pas</h2>' +
      '<ul><li><strong>Classement et podium</strong> : les candidats en course triés par % d\'accord (les retirés sont affichables à part).</li>' +
      '<li><strong>Sujet par sujet</strong> et <strong>« Vous vous rejoignez / divergez »</strong> : les mêmes concordances, restreintes à un thème.</li>' +
      '<li><strong>« Répond comme toi / À l\'opposé »</strong> : les trois questions (pondérées) où un candidat est le plus proche et le plus éloigné de toi.</li>' +
      '<li><strong>Comparer</strong> : pourcentage d\'idées communes entre deux candidats (concordance moyenne non pondérée sur les ' + Q.length + ' questions), thème par thème, puis question par question.</li>' +
      '<li><strong>Profil gauche/droite et boussole</strong> : une moyenne descriptive de tes réponses, pour te situer ; elle <em>ne sert plus au classement</em>.</li>' +
      '<li><strong>Fil d\'actu</strong> : chaque prise de position porte un score 0-10 et les questions visées ; l\'étiquette Accord/Proche/Écart compare ce score à <em>tes réponses à ces questions précises</em>.</li></ul>' +
      '<p>Repli : sans réponse enregistrée (bilan en cache seulement) ou pour le quiz sur-mesure, on retombe sur l\'ancien calcul par thème (RMSD sur les scores-thèmes). Les pourcentages archivés avant le 29 août 2026 ne sont pas comparables aux nouveaux.</p></section>';

    html += '<section class="pol-article" id="m-sources"><h2>7. Sources et fil d\'actu</h2>' +
      '<p>Le fil d\'actu compte <strong>' + allActus().length + ' prises de position</strong> pour ' + Object.keys(allActus().reduce(function (o, a) { o[a.c] = 1; return o; }, {})).length + ' candidats, mises à jour le ' + esc(POL.ACTUS_DATE || POL.DATA_DATE) + '. Chaque item indique le candidat, la date, le thème, la source (média, événement, site du parti), un résumé factuel, une citation quand elle est vérifiée, et les questions du quiz concernées.</p>' +
      '<p>Règles : une déclaration n\'est retenue que si elle a été lue sur une source identifiée ; ce qui n\'est rapporté que par un compte d\'actualité sur X ou par une seule chaîne d\'opinion est écarté tant qu\'il n\'est pas corroboré ; les fact-checks (chiffres contestés) sont mentionnés. Les sondages affichés sont des fourchettes issues de plusieurs instituts (' + esc(POL.POLLS_SOURCES || '') + ').</p></section>';

    html += '<section class="pol-article" id="m-limites"><h2>8. Limites</h2>' +
      '<ul><li>Un quiz simplifie : une position sur une échelle à 5 niveaux ne rend pas la nuance d\'un programme. Le résultat est <strong>indicatif</strong>.</li>' +
      '<li>À plusieurs mois du scrutin, beaucoup de programmes ne sont pas publiés : certaines positions reposent sur les votes passés et les déclarations, et peuvent évoluer. La date de dernière révision est indiquée partout.</li>' +
      '<li>Les candidats « pressentis » ou en primaire sont notés comme s\'ils étaient candidats ; les retirés sont conservés à titre de comparaison.</li>' +
      '<li>Les questions sur-mesure (indépendants, culture, IA…) n\'ont pas de position candidat par question et utilisent le calcul par thème.</li></ul>' +
      '<div class="pol-callout warn">Une position te paraît fausse ? Cherche la déclaration ou le vote qui la contredit, puis corrige-la dans <code>positions.js</code> (ligne de famille ou exception individuelle) — la correction vaut pour tout le monde.</div></section>';

    html += '<section class="pol-article" id="m-donnees"><h2>9. Données et vie privée</h2>' +
      (isGuest()
        ? '<p>Tes réponses sont enregistrées <strong>uniquement sur ton appareil</strong>, à chaque clic, et archivées en instantanés horodatés. <strong>Rien n\'est envoyé à un serveur</strong> : pas de compte, pas de cloud, pas de publicité, pas de mesure d\'audience, pas de cookie de suivi. Si tu veux garder ou transférer tes réponses, un export/import au format JSON est disponible dans Profil → Sauvegarde.</p>'
        : '<p>Tes réponses sont enregistrées <strong>sur ton appareil</strong> à chaque clic, archivées en instantanés horodatés, et synchronisées dans un <strong>espace cloud personnel</strong> (une seule ligne par profil, protégée par une clé) pour les retrouver sur un autre appareil. La fusion se fait réponse par réponse, la plus récente gagne, et un côté vide n\'écrase jamais un côté plein. Aucune donnée n\'est transmise à un tiers ; il n\'y a ni publicité, ni mesure d\'audience, ni cookie de suivi.</p>' +
          '<p>Plusieurs profils locaux cohabitent, strictement séparés. Un export/import de sauvegarde au format JSON est disponible dans Profil → Sauvegarde.</p>') +
      '</section>';

    html += '<section class="pol-article" id="m-maj"><h2>10. Mises à jour</h2>' +
      '<ul><li>Positions par question : <strong>' + esc(POL.POSITIONS_DATE || POL.DATA_DATE) + '</strong></li><li>Fil d\'actu : <strong>' + esc(POL.ACTUS_DATE || POL.DATA_DATE) + '</strong></li><li>Candidats, statuts, calendrier : <strong>' + esc(POL.DATA_DATE) + '</strong></li><li>Sondages : <strong>' + esc(POL.POLLS_DATE || '') + '</strong></li></ul>' +
      '<p>Les identifiants des questions et l\'ordre des options ne changent jamais : tes réponses passées restent valides quand une position, un statut ou une question est ajoutée.</p>' +
      '<div class="pol-link-row"><button class="pol-btn pol-btn-primary pol-btn-sm" onclick="POLQ.nav(\'quiz\')">Commencer ou reprendre le quiz</button><button class="pol-btn pol-btn-ghost pol-btn-sm" onclick="POLQ.nav(\'compare\')">Comparer deux candidats</button></div></section>';
    el('polMethodo').innerHTML = html;
  }

  // ════════════════════════════════════════════════
  // PAGE COMPARER (30/08/2026) — deux candidats face à face, question par question
  // ════════════════════════════════════════════════
  function goCompare(a, b) { if (a) state.duel.a = a; if (b) state.duel.b = b; state.cmpTheme = state.cmpTheme || 'all'; state.cmpShown = 12; renderCompare(); show('compare'); setNav('compare'); }
  function setCmpTheme(t) { state.cmpTheme = t; state.cmpShown = 12; renderCompare(); }
  function cmpShowAll() { state.cmpShown = (state.cmpShown || 12) + 20; renderCompare(); } // « Voir 20 de plus » (Direction A2)
  function renderCompare() {
    var r = currentProfileOrCached();
    var running = POL.CANDIDATES.slice().sort(function (a, b) { return pollOf(b) - pollOf(a); });
    if (!state.duel.a) state.duel.a = 'Marine Le Pen';
    if (!state.duel.b) state.duel.b = r && r.matches[0] && r.matches[0].name !== state.duel.a ? r.matches[0].name : 'Édouard Philippe';
    var A = candByName(state.duel.a), B = candByName(state.duel.b);
    function sel(side, cur) { return '<select class="pol-select" onchange="POLQ.setDuel(\'' + side + '\', this.value)">' + running.map(function (c) { return '<option value="' + esc(c.name) + '"' + (c.name === cur ? ' selected' : '') + '>' + esc(c.name) + (POL.isRunning(c) ? '' : ' (retiré)') + '</option>'; }).join('') + '</select>'; }
    function side(c, k) {
      var pct = pollOf(c);
      return '<div class="pol-cmp-side" style="--ac:' + c.color + '">' + candAvatar(c, 'big') + sel(k, c.name) + '<span class="pol-cd-party">' + partyLogo(c) + esc(c.party) + '</span><div class="pol-cmp-meta">' + statusChip(c) + (pct >= 0 && POL.isRunning(c) ? '<span class="pol-cd-poll-badge">~' + pctLabel(pct) + '</span>' : '') + '</div></div>';
    }
    var head = '<div class="pol-page-head"><span class="pol-home-kicker">Comparateur</span><h1>Comparer deux candidats</h1><p class="pol-lead">Leur taux d\'idées communes, thème par thème, puis les ' + Q.length + ' questions classées des plus grands accords aux plus grands désaccords' + (r ? ' — avec ta réponse en regard' : '') + '.</p></div>' +
      '<div class="pol-cmp-pick">' + side(A, 'a') + '<span class="pol-cmp-vs">VS</span>' + side(B, 'b') + '</div>';
    // similarité globale + par thème
    var items = [];
    Q.forEach(function (q) { var pa = POL.candPos(q, A), pb = POL.candPos(q, B); if (pa == null || pb == null) return; items.push({ q: q, pa: pa, pb: pb, conc: POL.concordance(pa, pb), u: r ? POL.answerScore(state.answers[q.id], q) : null }); });
    var sim = items.length ? POL.concPct(items.reduce(function (s, it) { return s + it.conc; }, 0) / items.length) : null;
    var nAcc = items.filter(function (it) { return it.conc >= 0.6; }).length, nDis = items.filter(function (it) { return it.conc < -0.3; }).length;
    var simCard = '<div class="pol-card pol-cmp-sim"><div class="pol-cmp-sim-n">' + (sim == null ? '—' : sim + ' %') + '</div><div class="pol-cmp-sim-l">d\'idées communes entre <strong style="color:' + cc(A.color) + '">' + esc(A.name.split(' ').slice(-1)[0]) + '</strong> et <strong style="color:' + cc(B.color) + '">' + esc(B.name.split(' ').slice(-1)[0]) + '</strong> sur ' + items.length + ' questions · ' + nAcc + ' accords, ' + nDis + ' désaccords</div><div class="pol-cmp-sim-bar"><span style="width:' + (sim || 0) + '%"></span></div></div>';
    var themeRows = POL.SECTIONS.map(function (t) {
      var its = items.filter(function (it) { return it.q.theme === t; }); if (!its.length) return '';
      var pct = POL.concPct(its.reduce(function (s, it) { return s + it.conc; }, 0) / its.length); var tag = POL.concTag((pct / 100) * 2 - 1);
      return '<div class="pol-duel-row" style="cursor:pointer" onclick="POLQ.setCmpTheme(\'' + t + '\')"><div class="pol-duel-lbl">' + POL.themeEmoji(t) + ' ' + esc(POL.SECTION_LABELS[t]) + ' <span class="pol-cand-theme-tag ' + tag.cls + '">' + pct + ' %</span></div><div class="pol-cmp-sim-bar" style="margin:.3rem 0 0;max-width:none;height:7px"><span style="width:' + pct + '%"></span></div></div>';
    }).join('');
    var themeCard = '<div class="pol-card"><div class="pol-cd-stat-hint">Idées communes par thème <span class="pol-sub">(touche un thème pour filtrer)</span></div>' + themeRows + '</div>';
    // verdict utilisateur
    var verdict = '';
    if (r) {
      var mqA = mqOf(A), mqB = mqOf(B); var ma = mqA ? mqA.pct : POL.computeMatch(r.profile, A.scores), mb = mqB ? mqB.pct : POL.computeMatch(r.profile, B.scores);
      var closer = ma > mb ? A : (mb > ma ? B : null);
      verdict = '<div class="pol-card pol-duel-verdict"><div class="pol-duel-scores"><span style="color:' + cc(A.color) + '"><strong>' + ma + '%</strong> d\'accord avec toi</span><span class="pol-duel-vs-sm">toi</span><span style="color:' + cc(B.color) + '"><strong>' + mb + '%</strong> d\'accord avec toi</span></div><div class="pol-duel-txt">' + (closer ? 'Tes idées sont plus proches de <strong style="color:' + cc(closer.color) + '">' + esc(closer.name) + '</strong> (' + Math.max(ma, mb) + ' % contre ' + Math.min(ma, mb) + ' %).' : 'Égalité parfaite entre les deux.') + '</div></div>';
    } else verdict = '<div class="pol-matching-note">Fais le quiz pour voir, question par question, de qui tu es le plus proche dans ce face-à-face.</div>';
    // liste question par question — Direction A2 (01/09 soir) : accords FUSIONNÉS en une
    // ligne, strates « d'accord / nuancé / opposés », pagination par 20 (fini le mur de 100)
    var th = state.cmpTheme || 'all';
    var list = items.filter(function (it) { return th === 'all' || it.q.theme === th; }).sort(function (a, b) { return b.conc - a.conc; });
    var chips = '<div class="pol-cmp-filters"><button class="pol-rv-chip' + (th === 'all' ? ' on' : '') + '" onclick="POLQ.setCmpTheme(\'all\')">Toutes · ' + items.length + '</button>' + POL.SECTIONS.map(function (t) { return '<button class="pol-rv-chip' + (th === t ? ' on' : '') + '" onclick="POLQ.setCmpTheme(\'' + t + '\')">' + esc(POL.SECTION_LABELS[t]) + '</button>'; }).join('') + '</div>';
    var shown = Math.min(list.length, state.cmpShown || 12);
    function optText(q, p) { var i = POL.nearestOption(q, p); return i >= 0 ? q.options[i].text : '—'; }
    function q_opt(q) { var a = state.answers[q.id]; return a && a.optIdx != null && q.options[a.optIdx] ? q.options[a.optIdx].text : '—'; }
    function catOf(c) { return c >= 0.6 ? 'acc' : (c < -0.3 ? 'dis' : 'mid'); }
    var CAT_LBL = { acc: 'Ils sont d\'accord', mid: 'Positions nuancées', dis: 'Ils s\'opposent' };
    var lastCat = null;
    var an = A.name.split(' ').slice(-1)[0], bn = B.name.split(' ').slice(-1)[0];
    var rows = list.slice(0, shown).map(function (it) {
      var tag = POL.concTag(it.conc), cat = catOf(it.conc), hdr = '';
      if (cat !== lastCat) {
        lastCat = cat;
        var nCat = list.filter(function (x) { return catOf(x.conc) === cat; }).length;
        hdr = '<div class="pol-cmp-cat">' + CAT_LBL[cat] + '<span>' + nCat + ' question' + (nCat > 1 ? 's' : '') + '</span></div>';
      }
      var ta = optText(it.q, it.pa), tb = optText(it.q, it.pb), same = ta === tb;
      var pos = same
        ? '<div class="pol-cmp-same">Même position — « ' + esc(ta) + ' »</div>'
        : '<div class="pol-cmp-cols"><div class="pol-cmp-col"><b>' + esc(an) + '</b>' + esc(ta) + '</div><div class="pol-cmp-col"><b>' + esc(bn) + '</b>' + esc(tb) + '</div></div>';
      var you = '';
      if (it.u != null) {
        var closer = Math.abs(it.u - it.pa) < Math.abs(it.u - it.pb) ? an : (Math.abs(it.u - it.pb) < Math.abs(it.u - it.pa) ? bn : null);
        you = '<div class="pol-cmp-you">Toi : ' + esc(q_opt(it.q)) + (closer && !same ? ' — plus proche de <b>' + esc(closer) + '</b>' : '') + '</div>';
      }
      return hdr + '<div class="pol-cmp-q"><div class="pol-cmp-q-top"><div class="pol-cmp-q-title"><small>' + esc(POL.SECTION_LABELS[it.q.theme]) + ' · Q' + it.q.id + '</small>' + esc(it.q.question) + '</div><span class="pol-cand-theme-tag pol-cmp-q-tag ' + tag.cls + '">' + tag.label + '</span></div>' + pos + you + '</div>';
    }).join('');
    var more = list.length > shown ? '<div class="pol-cmp-more"><button class="pol-btn pol-btn-line pol-btn-sm" onclick="POLQ.cmpShowAll()">Voir ' + Math.min(20, list.length - shown) + ' de plus (' + (list.length - shown) + ' restantes)</button></div>' : '';
    var listCard = '<div class="pol-slbl">Question par question</div>' + chips + '<div class="pol-cmp-list">' + rows + more + '</div>' +
      '<div class="pol-sub" style="font-size:.72rem;margin-top:.8rem">Position affichée = option la plus proche de la position estimée du candidat, au ' + esc(POL.POSITIONS_DATE || POL.DATA_DATE) + '.</div>';
    // dernières sorties : 2 par candidat, format court
    function actuSlim(a) { return '<div class="pol-actu-slim"><span class="pol-actu-slim-d">' + esc(fmtDecl(a.d)) + '</span><span>' + esc(a.txt.length > 150 ? a.txt.slice(0, 147) + '…' : a.txt) + '</span></div>'; }
    var aA = actusOf(A.name).slice(0, 2), aB = actusOf(B.name).slice(0, 2);
    var actus = (aA.length || aB.length) ? '<div class="pol-slbl">Leurs dernières sorties</div><div class="pol-card pol-cmp-actus">' +
      (aA.length ? '<div class="pol-cmp-actus-col"><b>' + esc(an) + '</b>' + aA.map(actuSlim).join('') + '</div>' : '') +
      (aB.length ? '<div class="pol-cmp-actus-col"><b>' + esc(bn) + '</b>' + aB.map(actuSlim).join('') + '</div>' : '') + '</div>' : '';
    el('polCompare').innerHTML = head + '<div class="pol-cols"><div class="pol-col">' + simCard + verdict + listCard + '</div><div class="pol-col pol-col-side">' + themeCard + actus + '</div></div>';
  }

  // ── Nav bas ──
  function nav(view) {
    if (view !== 'quiz') state.quizSet = 'main';
    if (view === 'quiz') { setNav('quiz'); startMainQuiz(); }
    else if (view === 'results') { var r = currentProfileOrCached(); if (!r) { toast('Fais le quiz pour voir tes résultats'); setNav('quiz'); startMainQuiz(); return; } renderResults(r); show('results'); setNav('results'); }
    else if (view === 'profile') { goProfile(); }
    else if (view === 'candidats') { goCandidats(); }
    else if (view === 'compare') { goCompare(); }
    else if (view === 'methodo') { goMethodo(); }
    else { renderEntry(); setNav('intro'); }
  }

  // ── API publique (handlers inline) ──
  window.POLQ = {
    startQuiz: startQuiz, reviseQuiz: reviseQuiz, startNewOnly: startNewOnly, startPerso: startPerso, startExpress: startExpress, startMainQuiz: startMainQuiz,
    select: select, setImportance: setImportance, toggleNote: toggleNote, saveNote: saveNote,
    prev: prev, skip: skip, next: next, jumpTo: jumpTo, toggleMap: toggleMap,
    toggleCand: toggleCand, toggleRetired: toggleRetired, setRadar: setRadar, saveBilan: saveBilan,
    goProfile: goProfile, setProfileTab: setProfileTab, restoreSnapshot: restoreSnapshot, snapshotNow: snapshotNow,
    goReview: goReview, setReviewFilter: setReviewFilter, setReviewMode: setReviewMode, setReviewSearch: setReviewSearch, toggleCalc: toggleCalc, editAnswer: editAnswer,
    goCandidats: goCandidats, goCompare: goCompare, goMethodo: goMethodo, setCandFilter: setCandFilter, toggleCandDir: toggleCandDir, openDuel: openDuel, setDuel: setDuel,
    openActu: openActu, setActuCand: setActuCand, setActuTheme: setActuTheme, setCmpTheme: setCmpTheme, cmpShowAll: cmpShowAll,
    showResultsFromAnswers: showResultsFromAnswers, showPersoResults: showPersoResults, exportTxt: exportTxt, exportTxtFromResult: exportTxtFromResult,
    exportBackup: exportBackup, importBackup: importBackup, cloudNow: cloudNow,
    exportPending: exportPending, pasteValidation: pasteValidation, applyValidation: applyValidation,
    nav: nav, switchProfile: switchProfile, toggleTheme: toggleTheme, setTheme: setTheme, toggleWho: toggleWho
  };

  // ── Sauvegarde de sécurité à la fermeture / mise en arrière-plan ──
  function flushOnLeave() {
    try { saveCurrentNote(); } catch (e) {}
    saveDraftLocal();
    if (state.cloud.status === 'pending' || state.cloud.status === 'sync') { clearTimeout(_pushT); _pushing = false; cloudPush(true); }
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flushOnLeave(); });
  window.addEventListener('pagehide', flushOnLeave);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
