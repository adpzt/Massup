// Passe 2 (cohérence programme ↔ positions) : applique position_shifts, program_updates, oneliners de out/*.json
// usage : node apply2.js [--write]
const fs = require('fs'), path = require('path');
const D = '/Volumes/Adrien SSD/x_ia/MUSCU/massup/politique/';
// POL_WORK=<scratchpad> node massup/dev/politique/apply_agents.js [--write]
const S = process.env.POL_WORK || process.cwd(), WRITE = process.argv.includes('--write');
global.window = global; ['data.js', 'parties.js', 'positions.js'].forEach(f => require(D + f));
const P = window.POL, Q = {}; P.QUESTIONS.forEach(q => Q[q.id] = q);
const THEMES = ['eco', 'social', 'immigration', 'securite', 'env', 'europe', 'institutions', 'societal', 'education'];
const outs = fs.readdirSync(S + '/out').filter(f => /^\d+\.json$/.test(f)).sort();
const shifts = [], progs = [], ones = [], bad = [];
for (const f of outs) {
  const J = JSON.parse(fs.readFileSync(S + '/out/' + f, 'utf8'));
  (J.position_shifts || []).forEach(x => {
    const c = P.CANDIDATES.find(k => k.name === x.c), q = Q[x.qid];
    if (!c || !q) return bad.push(f + ' inconnu ' + x.c + ' Q' + x.qid);
    const cur = P.candPos(q, c), sc = q.options.map(o => o.score), to = +x.to;
    if (Math.abs(cur - x.from) > 0.01) return bad.push(f + ' ' + x.c + ' Q' + x.qid + ' from ' + x.from + ' ≠ actuel ' + cur);
    if (!(to >= Math.min(...sc) && to <= Math.max(...sc))) return bad.push(f + ' ' + x.c + ' Q' + x.qid + ' hors bornes ' + to);
    if (to === cur) return;
    shifts.push(Object.assign({ _f: f }, x, { to }));
  });
  (J.program_updates || []).forEach(x => { if (THEMES.includes(x.theme) && x.text && x.text.length > 80 && P.CANDIDATES.some(k => k.name === x.c)) progs.push(Object.assign({ _f: f }, x)); else bad.push(f + ' programme rejeté ' + x.c + '/' + x.theme); });
  (J.oneliners || []).forEach(x => { if (P.CANDIDATES.some(k => k.name === x.c) && x.text) ones.push(Object.assign({ _f: f }, x)); });
}
// doublons (même candidat + question) : on garde le dernier agent (le plus spécifique est le seul en général)
const sh = {}; shifts.forEach(x => sh[x.c + '|' + x.qid] = x);
const S2 = Object.values(sh);
console.log('positions', S2.length, '· programmes', progs.length, '· résumés', ones.length, '· rejets', bad.length);
bad.forEach(b => console.log('  ✗', b));
const per = {}; S2.forEach(x => per[x.c] = (per[x.c] || 0) + 1); console.log(JSON.stringify(per));
if (!WRITE) process.exit(0);

// 1. positions.js : bloc daté « passe 2 »
let ps = fs.readFileSync(D + 'positions.js', 'utf8');
const by = {}; S2.forEach(x => (by[x.c] = by[x.c] || []).push(x));
let blk = "  // ── MAJ du 12/10/2026 — passe 2 « cohérence programme ↔ positions » (8 agents, programmes officiels relus question par question) ──\n";
for (const c in by) {
  const o = {}; by[c].forEach(x => o[x.qid] = x.to);
  blk += '  // ' + c + ' : ' + by[c].map(x => 'Q' + x.qid + ' ' + x.from + '→' + x.to).join(' · ') + '\n';
  blk += '  OVERRIDES[' + JSON.stringify(c) + '] = Object.assign(OVERRIDES[' + JSON.stringify(c) + '] || {}, ' + JSON.stringify(o).replace(/"(\d+)":/g, '$1: ').replace(/,/g, ', ') + ');\n';
}
const anchor = '\n  function candPos(q, c) {';
if (!ps.includes(anchor)) throw new Error('ancre candPos introuvable');
ps = ps.replace(anchor, '\n' + blk + anchor);
fs.writeFileSync(D + 'positions.js', ps);

// 2. data.js : programmes + résumés, ligne JSON par candidat
let src = fs.readFileSync(D + 'data.js', 'utf8');
const a = src.indexOf('var CANDIDATES = ['), b = src.indexOf('\n  ];', a);
const lines = src.slice(a, b).split('\n');
const PROG = {}; progs.forEach(p => (PROG[p.c] = PROG[p.c] || {})[p.theme] = p.text);
const ONE = {}; ones.forEach(o => ONE[o.c] = o.text);
for (let i = 0; i < lines.length; i++) {
  const t = lines[i].trim(); if (!t.startsWith('{"name"')) continue;
  const comma = t.endsWith(','), c = JSON.parse(comma ? t.slice(0, -1) : t);
  if (PROG[c.name]) Object.assign(c.program, PROG[c.name]);
  if (ONE[c.name]) c.oneLiner = ONE[c.name];
  lines[i] = lines[i].match(/^\s*/)[0] + JSON.stringify(c) + (comma ? ',' : '');
}
src = src.slice(0, a) + lines.join('\n') + src.slice(b);
fs.writeFileSync(D + 'data.js', src);
console.log('écrit : positions.js (' + Object.keys(by).length + ' candidats) + data.js');
