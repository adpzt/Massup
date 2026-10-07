// ============================================================
// fetch_logos.js — récupère les logos des partis (parties.js) depuis
// Wikipédia FR → massup/politique/imgs/logos/<slug>.png
// Méthode : 1) image de page (pageimages) si c'est un logo ; 2) sinon liste des
// fichiers de la page (prop=images) → premier fichier dont le nom contient
// « logo » (ou le sigle) → URL via imageinfo (largeur 400).
// Usage : node fetch_logos.js            (ne retélécharge pas l'existant)
//         node fetch_logos.js --force    (tout refaire)
//         node fetch_logos.js rn dlf     (slugs ciblés)
// Le rendu (quiz.js partyLogo) retombe sur le sigle si le fichier manque.
// ============================================================
const fs = require('fs'), path = require('path'), https = require('https');
const { PARTIES } = require('./parties.js');
const OUT = path.join(__dirname, 'imgs', 'logos');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2), FORCE = args.includes('--force'), ONLY = args.filter(a => !a.startsWith('--'));
const UA = { 'User-Agent': 'MassupQuiz/1.0 (usage personnel ; contact: adrien)' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Titres alternatifs quand le titre principal ne donne rien
const ALT = {
  'lutte-ouvriere': ['Lutte ouvrière', 'Lutte Ouvrière'],
  'revolution-permanente': ['Révolution permanente (média)', 'Révolution permanente (organisation politique)', 'Révolution Permanente'],
  'debout': ['Debout ! (mouvement)', 'Debout ! (parti)', 'Debout ! (parti politique français)', 'Picardie debout'],
  'lapres': ["L'Après (mouvement)", "L'Après (parti politique français)", "L'Après"],
  'les-ecologistes': ['Les Écologistes', 'Europe Écologie Les Verts'],
  'horizons': ['Horizons (parti politique)', 'Horizons (parti)'],
  'rn': ['Rassemblement national', 'Rassemblement National'],
  'reconquete': ['Reconquête (parti politique)', 'Reconquête !', 'Reconquête (parti)'],
  'dlf': ['Debout la France'],
  'la-france-humaniste': ['La France humaniste', 'La France humaniste (parti politique)'],
  'les-patriotes': ['Les Patriotes (parti politique)', 'Les Patriotes'],
  'nous-france': ['Nous France (parti politique)', 'Nous France (mouvement)']
};
function api(params, attempt) {
  attempt = attempt || 0;
  const url = 'https://fr.wikipedia.org/w/api.php?action=query&format=json&redirects=1&' + params;
  return new Promise((res, rej) => {
    https.get(url, { headers: UA }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => {
        if (r.statusCode === 429) { if (attempt < 5) return sleep(15000 * (attempt + 1)).then(() => api(params, attempt + 1)).then(res, rej); return rej(new Error('429')); }
        try { res(JSON.parse(d)); } catch (e) { rej(new Error('bad-json ' + r.statusCode)); }
      });
    }).on('error', rej);
  });
}
function download(url, dest, depth) {
  depth = depth || 0;
  return new Promise((res, rej) => {
    if (depth > 5) return rej(new Error('redirects'));
    https.get(url, { headers: UA }, r => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return download(r.headers.location, dest, depth + 1).then(res, rej);
      if (r.statusCode === 429 && depth < 4) { r.resume(); return sleep(6000).then(() => download(url, dest, depth + 1)).then(res, rej); }
      if (r.statusCode !== 200) return rej(new Error('HTTP ' + r.statusCode));
      const f = fs.createWriteStream(dest); r.pipe(f); f.on('finish', () => f.close(res));
    }).on('error', rej);
  });
}
const BAD = /armoiries|assembl|r[ée]publique_fran|drapeau|flag|s[ée]nat|[ée]lys[ée]e|hemicycle|palais|carte|map|portrait|cropped|(cropped)|photo/i;
const isLogoName = (n, meta) => !BAD.test(n) && (/logo|logotype|embl|sigle/i.test(n) || new RegExp('^(Fichier:|File:)?' + meta.short.replace(/[^a-z0-9]/gi, ''), 'i').test(n.replace(/[^a-z0-9:]/gi, '')));
async function findLogo(meta) {
  const titles = [meta.wiki].concat(ALT[meta.slug] || []).filter((t, i, a) => a.indexOf(t) === i);
  for (const title of titles) {
    const t = encodeURIComponent(title);
    // 1) image de page si son nom ressemble à un logo
    const j1 = await api('prop=pageimages&piprop=thumbnail|name&pithumbsize=400&titles=' + t);
    const pg = j1.query && j1.query.pages && Object.values(j1.query.pages)[0];
    if (!pg || pg.missing !== undefined) { await sleep(7000); continue; }
    if (pg.thumbnail && pg.pageimage && isLogoName(pg.pageimage, meta)) return { url: pg.thumbnail.source, name: pg.pageimage, title };
    await sleep(7000);
    // 2) liste des fichiers de la page
    const j2 = await api('prop=images&imlimit=50&titles=' + t);
    const pg2 = j2.query && j2.query.pages && Object.values(j2.query.pages)[0];
    const imgs = (pg2 && pg2.images || []).map(i => i.title).filter(n => /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(n) && !/commons-logo|wiki|icon|flag|drapeau|carte|map|question|red_pog|pictogram|blank/i.test(n));
    const cand = imgs.find(n => isLogoName(n.replace(/^Fichier:|^File:/, ''), meta)) || null;
    if (cand) {
      await sleep(7000);
      const j3 = await api('prop=imageinfo&iiprop=url&iiurlwidth=400&titles=' + encodeURIComponent(cand));
      const pg3 = j3.query && j3.query.pages && Object.values(j3.query.pages)[0];
      const ii = pg3 && pg3.imageinfo && pg3.imageinfo[0];
      if (ii) return { url: ii.thumburl || ii.url, name: cand, title };
    }
    await sleep(7000);
  }
  return null;
}
(async () => {
  const done = new Set(); let ok = 0, miss = 0;
  const manifestPath = path.join(OUT, 'logos_manifest.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  for (const [party, meta] of Object.entries(PARTIES)) {
    if (done.has(meta.slug)) { if (manifest[Object.keys(manifest).find(k => PARTIES[k] && PARTIES[k].slug === meta.slug)]) manifest[party] = meta.slug + '.png'; continue; }
    done.add(meta.slug);
    if (ONLY.length && !ONLY.includes(meta.slug)) continue;
    const file = path.join(OUT, meta.slug + '.png');
    if (fs.existsSync(file) && !FORCE && !ONLY.includes(meta.slug)) { console.log('⏭️  déjà là :', meta.slug); manifest[party] = meta.slug + '.png'; ok++; continue; }
    try {
      const found = await findLogo(meta);
      if (!found) { console.log('⚠️  PAS DE LOGO :', meta.slug); miss++; delete manifest[party]; if (fs.existsSync(file)) fs.unlinkSync(file); }
      else { await download(found.url, file); manifest[party] = meta.slug + '.png'; console.log('✅', meta.slug, '←', found.name, '(' + found.title + ')'); ok++; }
    } catch (e) { console.log('❌', meta.slug, e.message); miss++; }
    await sleep(12000);
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('\nTerminé : ' + ok + ' logos OK, ' + miss + ' manquants → imgs/logos/');
})();
