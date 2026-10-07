#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// Vérification visuelle mobile (08/10/2026) — `npm run ui -- [options]` depuis MUSCU/
//   (rien)                     tous les écrans du catalogue (screens.js), mode sombre + clair
//   --only a_nutria,m_nutri    seulement les écrans dont le nom contient un de ces mots
//   --app adrien|melati|politique   une seule app (plusieurs : séparées par des virgules)
//   --scheme dark|light|both   (défaut both)
//   --go "nutOpen();…" --app melati --name mon_ecran   écran à la volée (actions séparées par ;;)
//   --width 390 --height 844   (défaut iPhone 390 × 844)
//   --baseline                 enregistre les problèmes actuels comme « déjà connus » (baseline.json)
// Les problèmes déjà connus sont affichés à part : seuls les NOUVEAUX font échouer la vérification.
// Sortie : captures + report.json dans MUSCU/.verif-ui/ (hors dépôt, effacé à chaque lancement).
// Le réseau est coupé (seul 127.0.0.1 répond) : aucun risque d'écrire dans le cloud Supabase.
// Code de sortie 1 s'il y a un débordement, un texte coupé, un contraste < AA ou une erreur JS.
// ═══════════════════════════════════════════════════════════════════════════
const fs = require('fs'), path = require('path');
const { chromium, serve, newPage, wait, ROOT } = require('./lib');
const seeds = require('./seeds'), audit = require('./audit'), SCREENS = require('./screens');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const apps = arg('app', 'adrien,melati,politique').split(',');
const only = (arg('only', '') || '').split(',').filter(Boolean);
const schemes = { both: ['dark', 'light'], dark: ['dark'], light: ['light'] }[arg('scheme', 'both')];
const width = +arg('width', 390), height = +arg('height', 844);
const OUT = path.join(ROOT, '..', '.verif-ui');
const BASE_F = path.join(__dirname, 'baseline.json'), SAVE_BASE = process.argv.includes('--baseline');
const known = new Set(fs.existsSync(BASE_F) ? JSON.parse(fs.readFileSync(BASE_F, 'utf8')) : []);
const keyOf = (name, scheme, kind, x) => [name, scheme, kind, x.sel, x.txt || x.why || ''].join('|');
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });

const jobs = [];
for (const a of apps) {
  const app = SCREENS[a]; if (!app) { console.log('App inconnue : ' + a); process.exit(2); }
  const list = arg('go') ? [[arg('name', a + '_custom'), arg('go').split(';;'), { scroll: arg('scroll'), full: process.argv.includes('--full') }]]
    : app.list.filter(([n]) => !only.length || only.some(o => n.includes(o)));
  for (const s of list) jobs.push({ app, screen: s });
}
if (!jobs.length) { console.log('Aucun écran ne correspond.'); process.exit(2); }

(async () => {
  const { srv, base } = await serve();
  const browser = await chromium.launch();
  const report = [], allKeys = []; let issues = 0, old = 0;
  for (const scheme of schemes) for (const { app, screen: [name, actions, opt = {}] } of jobs) {
    const errors = [];
    const { ctx, page } = await newPage(browser, base, { scheme, width, height, seed: app.seed ? seeds[app.seed] : null, errors });
    await page.goto(base + app.page); await wait(1800);
    for (const a of actions) { try { await page.evaluate(a); } catch (e) { errors.push('action « ' + a.slice(0, 50) + ' » : ' + e.message.split('\n')[0].slice(0, 120)); } await wait(700); }
    await wait(900); // les panneaux s'animent : une capture trop tôt paraît délavée
    const shots = [], res = { contrast: [], overflow: [], clipped: [] };
    const take = async suffix => {
      const f = `${name}_${scheme}${suffix}.png`; await page.screenshot({ path: path.join(OUT, f) }); shots.push(f);
      const r = await page.evaluate(`(${audit.toString()})()`);
      for (const k of Object.keys(res)) for (const x of r[k]) if (!res[k].some(y => y.sel === x.sel && y.txt === x.txt)) res[k].push(x);
    };
    if (opt.full) {
      const Ht = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0, i = 0; y < Ht && i < 8; y += height - 80, i++) { await page.evaluate(y => window.scrollTo(0, y), y); await wait(400); await take('_' + i); }
    } else {
      await take('');
      if (opt.scroll) {
        const n = await page.evaluate(sel => { for (const s of sel.split(',')) { const e = document.querySelector(s); if (e && e.scrollHeight > e.clientHeight + 40) return Math.min(5, Math.ceil((e.scrollHeight - e.clientHeight) / (e.clientHeight * .85))); } return 0; }, opt.scroll);
        for (let i = 1; i <= n; i++) {
          await page.evaluate(([sel, i]) => { for (const s of sel.split(',')) { const e = document.querySelector(s); if (e && e.scrollHeight > e.clientHeight + 40) { e.scrollTop = e.clientHeight * .85 * i; return; } } }, [opt.scroll, i]);
          await wait(450); await take('_' + i);
        }
      }
    }
    await ctx.close();
    // séparer nouveaux / déjà connus
    const fresh = { contrast: [], overflow: [], clipped: [] }; let nOld = 0;
    for (const k of Object.keys(res)) for (const x of res[k]) { const key = keyOf(name, scheme, k, x); allKeys.push(key); if (known.has(key)) nOld++; else fresh[k].push(x); }
    const n = fresh.contrast.length + fresh.overflow.length + fresh.clipped.length + errors.length; issues += n; old += nOld;
    report.push({ name, scheme, shots, errors, nouveaux: fresh, connus: nOld, tout: { ...res } });
    console.log((n ? '❌ ' : '✅ ') + name + ' [' + scheme + '] — ' + shots.length + ' capture(s)' + (n ? ` · NOUVEAU : ${fresh.overflow.length} débordement(s) · ${fresh.clipped.length} texte(s) coupé(s) · ${fresh.contrast.length} contraste(s) < AA · ${errors.length} erreur(s) JS` : '') + (nOld ? ` · (${nOld} déjà connu(s))` : ''));
    Object.assign(res, fresh);
    for (const e of errors) console.log('     ⚠️  ' + e);
    for (const o of res.overflow.slice(0, 6)) console.log('     ↔️  ' + o.sel + ' : ' + o.why + (o.txt ? ' « ' + o.txt + ' »' : ''));
    for (const c of res.clipped.slice(0, 4)) console.log('     ✂️  ' + c.sel + ' « ' + c.txt + ' »');
    for (const c of res.contrast.slice(0, 6)) console.log('     🎨 ' + c.ratio + ':1 (min ' + c.need + ') ' + c.sel + ' « ' + c.txt + ' » ' + c.color + ' sur ' + c.bg);
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
  if (SAVE_BASE) { const merged = [...new Set([...known, ...allKeys])].sort(); fs.writeFileSync(BASE_F, JSON.stringify(merged, null, 0).replace(/","/g, '",\n"')); console.log('\n📌 baseline.json : ' + merged.length + ' problème(s) connus enregistrés'); }
  await browser.close(); srv.close();
  console.log('\nCaptures : ' + OUT + (old ? '\n(' + old + ' problème(s) déjà connus, listés dans report.json → « connus » / « tout »)' : '') + (issues ? '\n❌ ' + issues + ' NOUVEAU(X) problème(s) — à corriger avant de dire « terminé »' : '\n✅ Aucun nouveau problème. Regarder quand même les captures des écrans modifiés.'));
  process.exit(issues && !SAVE_BASE ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
