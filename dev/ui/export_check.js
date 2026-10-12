// Contrôle du « Dossier coach (Excel) » (12/10/2026) : génère le classeur dans l'app de test
// (réseau coupé, données de démonstration) et l'enregistre pour être relu par openpyxl.
// Usage (depuis MUSCU/) : node massup/dev/ui/export_check.js <dossier de sortie>
const path = require('path');
const { chromium, serve, newPage, wait } = require('./lib');
const seeds = require('./seeds');

(async () => {
  const out = process.argv[2];
  if (!out) { console.error('Usage : node export_check.js <dossier de sortie>'); process.exit(2); }
  const { srv, base } = await serve();
  const browser = await chromium.launch();
  const errors = [];
  try {
    const { ctx, page } = await newPage(browser, base, { seed: seeds.adrienSeed, errors });
    await page.goto(base + 'index.html'); await wait(1800);
    const [dl] = await Promise.all([page.waitForEvent('download'), page.evaluate('exportCoachDossier()')]);
    const file = path.join(out, dl.suggestedFilename());
    await dl.saveAs(file);
    console.log(file);
    await ctx.close();
  } finally {
    await browser.close(); srv.close();
  }
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
})();
