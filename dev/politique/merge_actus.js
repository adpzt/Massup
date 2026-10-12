// Fusion des sorties des agents (out/*.json) → rapport de validation + fichier candidats normalisé.
// usage : node merge.js            (rapport seulement)
//         node merge.js --write    (réécrit massup/politique/actus.js avec les nouveaux items validés)
const fs = require('fs'), path = require('path');
const POLDIR = '/Volumes/Adrien SSD/x_ia/MUSCU/massup/politique';
// Dossier de travail (out/*.json des agents, merged.json, fix.js, events_new.json, new_names.json) :
// POL_WORK=/chemin/du/scratchpad node massup/dev/politique/merge_actus.js [--write "12 octobre 2026"]
const S = process.env.POL_WORK || process.cwd();
global.window = global;
['data.js', 'parties.js', 'positions.js', 'actus.js'].forEach(f => require(path.join(POLDIR, f)));
const P = window.POL;
const THEMES = ['eco', 'social', 'immigration', 'securite', 'env', 'europe', 'institutions', 'societal', 'education'];
const QIDS = new Set(P.QUESTIONS.map(q => q.id));
const extraNames = new Set(JSON.parse(fs.existsSync(S + '/new_names.json') ? fs.readFileSync(S + '/new_names.json', 'utf8') : '[]'));
const NAMES = new Set(P.CANDIDATES.map(c => c.name).concat([...extraNames]));
const BAD_SRC = /cnews|cerfia|mediavenir|impactmedia|fdesouche|^x\b|twitter seul/i;
const OK_SRC = /afp|le monde|figaro|lib[ée]ration|[ée]chos|france ?info|france ?inter|franceinfo|bfm|lci|tf1|france ?2|france ?3|france ?5|public s[ée]nat|lcp|ouest|parisien|opinion|mediapart|politico|express|le point|jdd|journal du dimanche|rtl|europe ?1|sud radio|20 ?minutes|tribune|huffpost|nouvel obs|l'obs|marianne|challenges|capital|reuters|bloomberg|la croix|humanit[ée]|site officiel|communiqu[ée]|parti|\.fr|\.com|vie-publique|ifop|elabe|odoxa|ipsos|harris|toluna|opinionway|cluster|verian|insee|assembl[ée]e|s[ée]nat|gouvernement|conseil constitutionnel|france tv|francetv|radio france|rmc|la d[ée]p[êe]che|sud ouest|voix du nord|progr[èe]s|dna|actu\.fr|m[ée]dia|youtube/i;
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
function sim(a, b) { const A = new Set(norm(a).split(' ').filter(w => w.length > 3)), B = new Set(norm(b).split(' ').filter(w => w.length > 3)); let n = 0; A.forEach(w => { if (B.has(w)) n++; }); return n / Math.max(1, Math.min(A.size, B.size)); }

const outs = fs.readdirSync(S + '/out').filter(f => /^\d+\.json$/.test(f)).sort();
const report = { files: {}, rejected: [], accepted: [], status: [], shifts: [], programs: [], oneliners: [], newc: [], notes: [] };
for (const f of outs) {
  let J; try { J = JSON.parse(fs.readFileSync(S + '/out/' + f, 'utf8')); } catch (e) { report.files[f] = 'JSON INVALIDE : ' + e.message; continue; }
  report.files[f] = (J.items || []).length + ' items';
  for (const it of (J.items || [])) {
    const why = [];
    if (!NAMES.has(it.c)) why.push('nom inconnu « ' + it.c + ' »');
    if (!/^2026-(09-\d\d|10-(0\d|1[0-2]))$/.test(it.d || '')) why.push('date hors fenêtre ' + it.d);
    if (!THEMES.includes(it.th)) why.push('thème ' + it.th);
    if (!it.src || (BAD_SRC.test(it.src) && !OK_SRC.test(it.src.replace(BAD_SRC, '')))) why.push('source ' + it.src);
    if (!it.txt || it.txt.length < 25) why.push('txt vide');
    if (it.sc != null && !(it.sc >= 0 && it.sc <= 10)) why.push('sc ' + it.sc);
    const q = (it.qids || []).filter(id => QIDS.has(+id)).map(Number);
    // doublon avec l'existant ou déjà accepté
    const dupOld = P.ACTUS.find(a => a.c === it.c && Math.abs(new Date(a.d) - new Date(it.d)) <= 2 * 864e5 && sim(a.txt, it.txt) > 0.5);
    const dupNew = report.accepted.find(a => a.c === it.c && Math.abs(new Date(a.d) - new Date(it.d)) <= 2 * 864e5 && sim(a.txt, it.txt) > 0.5);
    if (dupOld) why.push('doublon existant');
    if (dupNew) why.push('doublon (autre agent ' + dupNew._f + ')');
    const clean = { c: it.c, d: it.d, th: it.th }; if (it.sc != null) clean.sc = Math.round(it.sc * 2) / 2; clean.src = it.src; clean.txt = it.txt; if (it.q) clean.q = it.q; if (q.length) clean.qids = q;
    if (why.length) report.rejected.push({ f, c: it.c, d: it.d, why: why.join(' ; '), txt: (it.txt || '').slice(0, 90) });
    else report.accepted.push(Object.assign(clean, { _f: f }));
  }
  (J.status_changes || []).forEach(x => report.status.push(Object.assign({ _f: f }, x)));
  (J.position_shifts || []).forEach(x => report.shifts.push(Object.assign({ _f: f }, x)));
  (J.program_updates || []).forEach(x => report.programs.push(Object.assign({ _f: f }, x)));
  (J.oneliners || []).forEach(x => report.oneliners.push(Object.assign({ _f: f }, x)));
  (J.new_candidates || []).forEach(x => report.newc.push(Object.assign({ _f: f }, x)));
  (J.notes || []).forEach(x => report.notes.push(f + ' | ' + (typeof x === 'string' ? x : JSON.stringify(x))));
}
fs.writeFileSync(S + '/merged.json', JSON.stringify(report, null, 1));
console.log('Fichiers :', JSON.stringify(report.files));
console.log('Items acceptés', report.accepted.length, '· rejetés', report.rejected.length, '· statuts', report.status.length, '· shifts', report.shifts.length, '· programmes', report.programs.length, '· oneliners', report.oneliners.length, '· nouveaux', report.newc.length, '· notes', report.notes.length);
const per = {}; report.accepted.forEach(a => per[a.c] = (per[a.c] || 0) + 1); console.log('Par candidat :', JSON.stringify(per));
const rj = {}; report.rejected.forEach(r => { const k = r.why.split(' ; ')[0].replace(/«.*»|\d{4}-\d\d-\d\d|source .*/, m => m.startsWith('source') ? 'source' : m.startsWith('«') ? '' : 'date'); rj[k] = (rj[k] || 0) + 1; }); console.log('Motifs de rejet :', JSON.stringify(rj));

if (process.argv.includes('--write')) {
  let items = report.accepted.map(a => { const o = Object.assign({}, a); delete o._f; return o; });
  if (fs.existsSync(S + '/fix.js')) items = require(S + '/fix.js')(items);
  const extraEvents = JSON.parse(fs.existsSync(S + '/events_new.json') ? fs.readFileSync(S + '/events_new.json', 'utf8') : '[]');
  const all = items.concat(P.ACTUS).sort((a, b) => b.d.localeCompare(a.d));
  const events = extraEvents.concat(P.EVENTS).sort((a, b) => b.d.localeCompare(a.d));
  const date = process.argv[process.argv.indexOf('--write') + 1] || '12 octobre 2026';
  const head = fs.readFileSync(path.join(POLDIR, 'actus.js'), 'utf8').split('(function () {')[0]
    .replace(/^\/\/ Fil d'actu.*$/m, "// Fil d'actu — dernières prises de position publiques des candidats 2027 (sweeps de fin août, du 1er septembre et du 12 octobre 2026).");
  const body = '(function () {\n  var POL = window.POL; if (!POL) return;\n  POL.ACTUS_DATE = ' + JSON.stringify(date) + ';\n  POL.EVENTS = ' + JSON.stringify(events, null, 4).replace(/\n/g, '\n  ') + ';\n  POL.ACTUS = [\n' + all.map(a => '    ' + JSON.stringify(a)).join(',\n') + '\n  ];\n})();\n';
  fs.writeFileSync(path.join(POLDIR, 'actus.js'), head + body);
  console.log('actus.js réécrit :', all.length, 'items,', events.length, 'événements');
}
