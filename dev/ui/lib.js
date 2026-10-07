// Navigateur de test SANS RÉSEAU : seul 127.0.0.1 répond, donc le CDN Supabase ne charge pas,
// les apps démarrent en mode local et un test ne peut JAMAIS écrire dans le cloud réel.
const fs = require('fs'), path = require('path'), http = require('http');
const PW = '/Volumes/Adrien SSD/x_ia/IA Creative Space/node_modules/playwright-core';
const { chromium } = require(PW);
const ROOT = path.join(__dirname, '..', '..');
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };

// Mini serveur statique sur massup/ (port libre choisi par l'OS)
function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rsp);
    }).listen(0, '127.0.0.1', () => res({ srv, base: 'http://127.0.0.1:' + srv.address().port + '/' }));
  });
}

async function newPage(browser, base, { scheme = 'dark', width = 390, height = 844, dsf = 2, seed = null, errors = [] } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf, isMobile: true, hasTouch: true, userAgent: UA, colorScheme: scheme, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  await page.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  page.on('pageerror', e => errors.push('JS : ' + e.message.slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|Failed to load resource|net::/.test(m.text())) errors.push('console : ' + m.text().slice(0, 200)); });
  if (seed) await page.addInitScript(seed);
  return { ctx, page };
}

const wait = ms => new Promise(r => setTimeout(r, ms));
module.exports = { chromium, serve, newPage, wait, ROOT };
