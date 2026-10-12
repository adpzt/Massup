// Recalcule les scores-thèmes de chaque candidat = moyenne de ses positions sur les questions du thème (arrondi 0,5).
// Même méthode que le profil de l'utilisateur → les comparaisons thème par thème restent justes.
// usage : node massup/dev/politique/recompute_scores.js   (à lancer après toute correction de positions)
const fs = require('fs'), path = require('path');
const D = path.join(__dirname, '..', '..', 'politique');
global.window = global; ['data.js', 'parties.js', 'positions.js'].forEach(f => require(path.join(D, f)));
const P = window.POL, T = ['eco', 'social', 'immigration', 'securite', 'env', 'europe', 'institutions', 'societal', 'education'];
let src = fs.readFileSync(path.join(D, 'data.js'), 'utf8');
const a = src.indexOf('var CANDIDATES = ['), b = src.indexOf('\n  ];', a), lines = src.slice(a, b).split('\n'); let n = 0;
for (let i = 0; i < lines.length; i++) {
  const t = lines[i].trim(); if (!t.startsWith('{"name"')) continue;
  const comma = t.endsWith(','), c = JSON.parse(comma ? t.slice(0, -1) : t), live = P.CANDIDATES.find(x => x.name === c.name);
  T.forEach(th => { const v = P.QUESTIONS.filter(q => q.theme === th).map(q => P.candPos(q, live)).filter(x => x != null); if (v.length) c.scores[th] = Math.round(v.reduce((x, y) => x + y, 0) / v.length * 2) / 2; });
  lines[i] = lines[i].match(/^\s*/)[0] + JSON.stringify(c) + (comma ? ',' : ''); n++;
}
fs.writeFileSync(path.join(D, 'data.js'), src.slice(0, a) + lines.join('\n') + src.slice(b));
console.log(n + ' candidats : scores-thèmes recalculés');
