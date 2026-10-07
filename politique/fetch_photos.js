// ============================================================
// fetch_photos.js — récupère les photos des candidats 2027
// depuis Wikipédia (API pageimages) → massup/politique/imgs/
// Usage : node fetch_photos.js
// Les fichiers sont nommés <slug>.jpg (slug = nom sans accents, tirets).
// Le rendu (quiz.js candAvatar) utilise ce même slug ; si l'image manque,
// il retombe sur l'avatar initiales.
// ============================================================
const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT = path.join(__dirname, 'imgs');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// nom → titre exact de la page Wikipédia FR (pour éviter les homonymies)
const CANDIDATES = [
  ['Nathalie Arthaud', 'Nathalie Arthaud'],
  ['Anasse Kazib', 'Anasse Kazib'],
  ['Selma Labib', 'Selma Labib'],
  ['Jean-Luc Mélenchon', 'Jean-Luc Mélenchon'],
  ['Raphaël Glucksmann', 'Raphaël Glucksmann'],
  ['Olivier Faure', 'Olivier Faure (homme politique)'],
  ['François Hollande', 'François Hollande'],
  ['François Ruffin', 'François Ruffin'],
  ['Clémentine Autain', 'Clémentine Autain'],
  ['Karim Bouamrane', 'Karim Bouamrane'],
  ['Jérôme Guedj', 'Jérôme Guedj'],
  ['Marine Tondelier', 'Marine Tondelier'],
  ['Delphine Batho', 'Delphine Batho'],
  ['Gabriel Attal', 'Gabriel Attal'],
  ['Édouard Philippe', 'Édouard Philippe'],
  ['Bruno Retailleau', 'Bruno Retailleau'],
  ['Xavier Bertrand', 'Xavier Bertrand'],
  ['Laurent Wauquiez', 'Laurent Wauquiez'],
  ['David Lisnard', 'David Lisnard'],
  ['Gérald Darmanin', 'Gérald Darmanin'],
  ['Nicolas Dupont-Aignan', 'Nicolas Dupont-Aignan'],
  ['Dominique de Villepin', 'Dominique de Villepin'],
  ['François Asselineau', 'François Asselineau'],
  ['Marine Le Pen', 'Marine Le Pen'],
  ['Jordan Bardella', 'Jordan Bardella'],
  ['Éric Zemmour', 'Éric Zemmour'],
  ['Florian Philippot', 'Florian Philippot'],
  ['Fabien Roussel', 'Fabien Roussel'],
  ['Ségolène Royal', 'Ségolène Royal'],
  ['Philippe Brun', 'Philippe Brun (homme politique)']
];

function slug(name) {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function getJSONonce(url) {
  return new Promise((res, rej) => {
    https.get(url, { headers: { 'User-Agent': 'MassupQuiz/1.0 (contact: adrien@example.com)' } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => {
        if (r.statusCode === 429) { rej(new Error('429')); return; }
        try { res(JSON.parse(d)); } catch (e) { rej(new Error('bad-json')); }
      });
    }).on('error', rej);
  });
}

// retry avec backoff sur 429 / erreurs réseau
async function getJSON(url) {
  var delay = 2000;
  for (var attempt = 0; attempt < 5; attempt++) {
    try { return await getJSONonce(url); }
    catch (e) {
      if (attempt === 4) throw e;
      await sleep(delay); delay *= 2;
    }
  }
}

function download(url, dest, depth) {
  depth = depth || 0;
  return new Promise((res, rej) => {
    if (depth > 5) return rej(new Error('too many redirects'));
    https.get(url, { headers: { 'User-Agent': 'MassupQuiz/1.0 (contact: adrien)' } }, r => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        return download(r.headers.location, dest, depth + 1).then(res).catch(rej);
      }
      if (r.statusCode !== 200) { rej(new Error('HTTP ' + r.statusCode)); return; }
      const f = fs.createWriteStream(dest);
      r.pipe(f); f.on('finish', () => f.close(() => res()));
    }).on('error', rej);
  });
}

(async () => {
  let ok = 0, miss = 0;
  const manifest = {};
  for (const [name, title] of CANDIDATES) {
    const existing = path.join(OUT, slug(name) + '.jpg');
    if (fs.existsSync(existing)) { manifest[name] = slug(name) + '.jpg'; console.log('⏭️  déjà là :', name); ok++; continue; }
    const api = 'https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=500&titles=' + encodeURIComponent(title);
    try {
      const j = await getJSON(api);
      const pages = j.query && j.query.pages;
      const pg = pages && Object.values(pages)[0];
      const thumb = pg && pg.thumbnail && pg.thumbnail.source;
      if (!thumb) { console.log('⚠️  PAS DE PHOTO :', name); miss++; continue; }
      const file = path.join(OUT, slug(name) + '.jpg');
      await download(thumb, file);
      manifest[name] = slug(name) + '.jpg';
      console.log('✅', name, '→', slug(name) + '.jpg');
      ok++;
    } catch (e) { console.log('❌', name, '—', e.message); miss++; }
    await sleep(4000); // throttle pour éviter le 429 de Wikipédia
  }
  fs.writeFileSync(path.join(OUT, 'photos_manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('\nTerminé : ' + ok + ' photos, ' + miss + ' manquantes. Manifest : imgs/photos_manifest.json');
})();
