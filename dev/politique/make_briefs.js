// Génère les fiches de brief des agents de recherche (/pol-update) : questions actives + une fiche par candidat
// (programme, position actuelle sur chaque question, derniers items du fil d'actu).
// usage : node massup/dev/politique/make_briefs.js /chemin/du/scratchpad   → <dossier>/brief/*.md
const fs = require('fs'), path = require('path');
const OUT = path.join(process.argv[2] || process.cwd(), 'brief'); fs.mkdirSync(OUT, { recursive: true });
global.window = global; const POLDIR = path.join(__dirname, '..', '..', 'politique');
['data.js', 'parties.js', 'positions.js', 'actus.js'].forEach(f => require(path.join(POLDIR, f)));
const P = window.POL;
const slug = n => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
let qs = '# Questions actives du quiz (' + P.QUESTIONS.length + ') — échelle 0 = droite … 10 = gauche\n';
P.QUESTIONS.forEach(q => { qs += '\nQ' + q.id + ' [' + q.theme + '] ' + q.question + '\n' + q.options.map(o => '   ' + o.score + ' = ' + o.text).join('\n') + '\n'; });
fs.writeFileSync(path.join(OUT, 'questions.md'), qs);
P.CANDIDATES.forEach(c => {
  let t = '# ' + c.name + ' — ' + c.party + ' — statut : ' + c.status + ' — famille positions : ' + P.FAMILY_OF[c.name] + '\n\n## oneLiner actuel\n' + c.oneLiner + '\n\n## Programme actuel (9 thèmes)\n';
  for (const k in c.program) t += '- **' + k + '** : ' + c.program[k] + '\n';
  t += '\n## Position actuelle par question (0 droite … 10 gauche) → option la plus proche\n';
  P.QUESTIONS.forEach(q => { const p = P.candPos(q, c); if (p == null) { t += 'Q' + q.id + ' : (aucune)\n'; return; } const o = q.options.reduce((a, b) => Math.abs(b.score - p) < Math.abs(a.score - p) ? b : a); t += 'Q' + q.id + ' [' + q.theme + '] ' + q.question.slice(0, 90) + ' → ' + p + ' (« ' + o.text.slice(0, 80) + ' »)\n'; });
  t += '\n## Derniers items déjà au fil d’actu (ne pas redoubler)\n' + P.ACTUS.filter(a => a.c === c.name).slice(0, 12).map(a => '- ' + a.d + ' [' + a.th + '] ' + a.txt.slice(0, 160)).join('\n') + '\n';
  fs.writeFileSync(path.join(OUT, slug(c.name) + '.md'), t);
});
console.log(P.CANDIDATES.length + ' fiches + questions.md → ' + OUT);
