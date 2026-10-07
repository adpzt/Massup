#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// `npm run build` — contrôle avant commit/déploiement (08/10/2026).
// L'app est en JS vanilla : rien à compiler. Ce script vérifie ce qui casse l'app en prod :
//   1. syntaxe de chaque fichier JS servi (une apostrophe mal échappée = écran blanc) ;
//   2. tests `node --test tests/*.test.js` ;
//   3. hygiène git : aucun fichier interdit suivi par git (dépôt GitHub PUBLIC) ;
//   4. avertissement si un fichier mis en cache par sw.js a changé sans incrément de CACHE.
// Lancé depuis MUSCU/ (package.json racine). Il ne doit JAMAIS être branché comme script `build` du
// package.json de massup/ : Vercel exigerait alors un dossier public/ et le déploiement échouerait.
// ═══════════════════════════════════════════════════════════════════════════
const fs = require('fs'), path = require('path'), { execFileSync, spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
let failed = false;
const ok = m => console.log('  ✅ ' + m), ko = m => { failed = true; console.log('  ❌ ' + m); }, warn = m => console.log('  ⚠️  ' + m);
const git = args => { try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { return null; } };

// 1. Syntaxe
console.log('1. Syntaxe JS');
const jsFiles = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    if (f.startsWith('.') || f === 'node_modules' || f === 'dev' || f === 'tests') continue;
    const p = path.join(dir, f), st = fs.statSync(p);
    if (st.isDirectory()) walk(p); else if (f.endsWith('.js')) jsFiles.push(p);
  }
})(ROOT);
let bad = 0;
for (const f of jsFiles) {
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  if (r.status !== 0) { bad++; ko(path.relative(ROOT, f) + '\n' + r.stderr.split('\n').slice(0, 6).join('\n')); }
}
if (!bad) ok(jsFiles.length + ' fichiers JS sans erreur de syntaxe');

// 2. Tests
console.log('2. Tests');
const tests = fs.readdirSync(path.join(ROOT, 'tests')).filter(f => f.endsWith('.test.js') && !f.startsWith('._')).map(f => path.join('tests', f));
const t = spawnSync(process.execPath, ['--test', ...tests], { cwd: ROOT, encoding: 'utf8' });
const pass = (t.stdout.match(/^ℹ pass (\d+)/m) || [])[1], fail = (t.stdout.match(/^ℹ fail (\d+)/m) || [])[1];
if (t.status === 0) ok((pass || '?') + ' tests verts'); else ko((fail || '?') + ' test(s) en échec :\n' + t.stdout.split('\n').filter(l => /not ok|Error|expected|actual/.test(l)).slice(0, 15).join('\n'));

// 3. Hygiène git (dépôt public)
console.log('3. Hygiène git');
const tracked = git(['ls-files']);
if (tracked === null) warn('git indisponible, contrôle sauté');
else {
  const FORBIDDEN = [/(^|\/)\._/, /(^|\/)env$/, /(^|\/)\.env/, /node_modules\//, /\.bak$/, /(^|\/)(reset|seed)_weight_history\.sql$/, /\.md$/];
  const hits = tracked.split('\n').filter(f => f && FORBIDDEN.some(re => re.test(f)));
  if (hits.length) ko('fichiers interdits suivis par git (dépôt PUBLIC) : ' + hits.slice(0, 10).join(', ') + ' → git rm --cached');
  else ok('aucun fichier interdit suivi');
}

// 3 bis. Vercel : aucun script de build côté site (sinon il exige un dossier public/ → déploiement en erreur)
const pkgScripts = (JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts) || {};
if (pkgScripts.build || pkgScripts['vercel-build']) ko('massup/package.json contient un script build/vercel-build → Vercel échouera (« No Output Directory named public »). Les scripts de dev vont dans MUSCU/package.json.');
else ok('massup/package.json sans script de build (déploiement Vercel statique)');

// 4. Version du cache du service worker
console.log('4. Cache du service worker');
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const assets = ((sw.match(/ASSETS\s*=\s*\[([^\]]+)\]/) || [])[1] || '').match(/'\/[^']*'/g) || [];
const cached = new Set(assets.map(a => a.slice(2, -1)).map(a => a || 'index.html'));
const changed = (git(['diff', '--name-only', 'HEAD']) || '').split('\n').filter(Boolean);
const swHead = git(['show', 'HEAD:sw.js']);
const ver = s => (String(s).match(/CACHE\s*=\s*'([^']+)'/) || [])[1];
const touched = changed.filter(f => cached.has(f));
if (!swHead) ok('sw.js pas encore commité, contrôle sauté');
else if (touched.length && ver(swHead) === ver(sw)) warn('fichiers en cache modifiés (' + touched.join(', ') + ') mais CACHE est toujours ' + ver(sw) + ' → incrémenter dans sw.js');
else ok('CACHE = ' + ver(sw));

console.log(failed ? '\n❌ BUILD EN ÉCHEC — corriger avant de commiter.' : '\n✅ BUILD OK');
process.exit(failed ? 1 : 0);
