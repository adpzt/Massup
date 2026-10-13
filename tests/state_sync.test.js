"use strict";
// Synchro sûre côté serveur (13/10/2026) : state_sync.js + supabase.js face à un faux Supabase qui
// applique la même règle que user_state_put (user_state_cas.sql). Deux « appareils » = deux contextes
// avec chacun leur stockage local (comme Safari et l'icône sur l'iPhone).
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const UID = "u-adrien";
const flush = async () => { for (let i = 0; i < 15; i++) await new Promise((r) => setTimeout(r, 2)); };
const clone = (x) => JSON.parse(JSON.stringify(x));

function fakeServer({ legacy = false } = {}) {
  const srv = { row: null, puts: 0, upserts: 0, legacy };
  srv.client = () => {
    function builder(table) {
      const q = { table, op: "select", filters: [] };
      const b = {
        select() { return b; }, eq() { return b; }, order() { return b; }, in() { return b; }, not() { return b; },
        maybeSingle() { q.single = true; return b; },
        upsert(row) { q.op = "upsert"; q.row = row; return b; },
        delete() { q.op = "delete"; return b; },
        then(res, rej) { return Promise.resolve(run(q)).then(res, rej); },
        catch(rej) { return Promise.resolve(run(q)).catch(rej); },
      };
      return b;
    }
    function run(q) {
      if (q.table !== "user_state") return { data: q.op === "select" ? [] : null, error: null };
      if (q.op === "select") {
        if (!srv.row) return { data: null, error: null };
        const out = { user_id: UID, data: clone(srv.row.data), updated_at: "x" };
        if (!srv.legacy) out.rev = srv.row.rev;
        return { data: out, error: null };
      }
      if (q.op === "upsert") { // écriture directe : le trigger fait avancer rev
        srv.upserts++;
        srv.row = { data: clone(q.row.data), rev: srv.row ? srv.row.rev + 1 : 0 };
        return { data: null, error: null };
      }
      return { data: null, error: null };
    }
    return {
      auth: { getUser: () => Promise.resolve({ data: { user: { id: UID } } }) },
      from: builder,
      rpc(name, args) {
        if (srv.legacy) return Promise.resolve({ data: null, error: { code: "PGRST202", message: "Could not find the function public.user_state_put" } });
        srv.puts++;
        if (!srv.row) { srv.row = { data: clone(args.p_data), rev: 1 }; return Promise.resolve({ data: { ok: true, rev: 1 }, error: null }); }
        if (srv.row.rev !== args.p_base_rev) return Promise.resolve({ data: { ok: false, rev: srv.row.rev }, error: null });
        srv.row = { data: clone(args.p_data), rev: srv.row.rev + 1 };
        return Promise.resolve({ data: { ok: true, rev: srv.row.rev }, error: null });
      },
    };
  };
  return srv;
}

// Un appareil : supabase.js + state_sync.js réels, DB / saveDB / fusion réduits à l'essentiel d'app.js
function device(srv, initialDB) {
  const store = new Map();
  if (initialDB) store.set("massup_db", JSON.stringify(initialDB));
  const ctx = {
    console: { warn() {}, log() {}, error() {} }, JSON, Math, Date, Promise, String, Object, Array,
    setTimeout: (f) => setTimeout(f, 0), clearTimeout, // débounces de synchro instantanés
    localStorage: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) },
    document: { addEventListener() {}, getElementById: () => ({ style: {} }), querySelector: () => null, visibilityState: "visible" },
    navigator: { onLine: true },
    location: { reloaded: 0, reload() { this.reloaded++; } },
    showToast() {},
  };
  ctx.window = { supabase: { createClient: () => srv.client() } };
  vm.createContext(ctx);
  vm.runInContext(`
    var DB = { weights:{}, logs:[], bodyWeight:[], profile:{}, deletedLogs:[] };
    var _saveDBTimer = null;
    function loadDB(){ var s=localStorage.getItem('massup_db'); if(s){ var d=JSON.parse(s); Object.keys(d).forEach(function(k){ DB[k]=d[k]; }); } }
    function saveDB(){ DB.profile.rev=(DB.profile.rev||0)+1; localStorage.setItem('massup_db', JSON.stringify(DB)); syncToSupabase(); }
    function isLocalDBVirgin(){ return !DB.logs.length && !DB.profile.name; }
    function mergeBackupIntoDB(bk){
      (bk.logs||[]).forEach(function(l){ if(DB.deletedLogs.indexOf(String(l.id))<0 && !DB.logs.some(function(x){return x.id===l.id;})) DB.logs.push(l); });
      Object.keys(bk.weights||{}).forEach(function(k){ if(!DB.weights[k]) DB.weights[k]=[];
        bk.weights[k].forEach(function(e){ if(!DB.weights[k].some(function(x){return x.date===e.date;})) DB.weights[k].push(e); }); });
      return true;
    }
  `, ctx);
  vm.runInContext(fs.readFileSync("state_sync.js", "utf8"), ctx, { filename: "state_sync.js" });
  vm.runInContext(fs.readFileSync("supabase.js", "utf8"), ctx, { filename: "supabase.js" });
  vm.runInContext("appInitialized = true;", ctx);
  const api = {
    ctx, store,
    get DB() { return vm.runInContext("DB", ctx); },
    run: (code) => vm.runInContext(code, ctx),
    async boot() { await vm.runInContext("syncFromSupabase()", ctx); await flush(); },
    async edit(code) { vm.runInContext(code + "; saveDB();", ctx); await flush(); },
    async foreground() { vm.runInContext("fgCloudCheck()", ctx); await flush(); },
    meta: () => JSON.parse(store.get("massup_sync") || "null"),
  };
  return api;
}

const BASE = { weights: { hip: [{ date: "2026-10-01", val: 80 }] }, logs: [{ id: 1, date: "2026-10-01" }], bodyWeight: [], profile: { name: "Adrien", rev: 50 }, deletedLogs: [] };

test("plan: adopt when the cloud moved and nothing is pending here, merge when both moved, keep otherwise", () => {
  const ctx = { localStorage: { getItem() { return null; }, setItem() {} }, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync("state_sync.js", "utf8"), ctx);
  const S = vm.runInContext("STATE_SYNC", ctx);
  const meta = { uid: UID, base: 4, lrev: 10 };
  assert.equal(S.plan({ meta, cloudRev: 4, localRev: 10 }), "keep");
  assert.equal(S.plan({ meta, cloudRev: 4, localRev: 12 }), "keep");
  assert.equal(S.plan({ meta, cloudRev: 5, localRev: 10 }), "adopt");
  assert.equal(S.plan({ meta, cloudRev: 5, localRev: 11 }), "merge");
  assert.equal(S.plan({ meta: null, cloudRev: 5, localRev: 900, legacyCloudRev: 100 }), "merge");
  assert.equal(S.plan({ meta: null, cloudRev: null, localRev: 10, legacyCloudRev: 100 }), "adopt");
  assert.equal(S.plan({ virgin: true, meta, cloudRev: 4, localRev: 10 }), "adopt");
});

test("a stale copy with a HIGHER local counter can no longer overwrite the cloud", async () => {
  const srv = fakeServer();
  srv.row = { data: clone(BASE), rev: 7 };
  const icon = device(srv, clone(BASE));
  const safari = device(srv, clone(BASE));
  await icon.boot();
  await safari.boot();
  // Safari a tourné à vide longtemps : son compteur local est très au-dessus
  safari.run("DB.profile.rev = 5000; localStorage.setItem('massup_db', JSON.stringify(DB)); STATE_SYNC.writeMeta('massup_sync', {uid:'" + UID + "', base: STATE_SYNC.readMeta('massup_sync').base, lrev: 5000});");
  // L'icône applique un nouveau poids et enregistre une séance
  await icon.edit("DB.weights.hip.push({date:'2026-10-13', val:85}); DB.logs.push({id:2, date:'2026-10-13'})");
  assert.equal(srv.row.data.weights.hip.at(-1).val, 85);
  // Safari revient au premier plan : il adopte le cloud au lieu de garder sa vieille copie
  await safari.foreground();
  assert.equal(safari.ctx.location.reloaded, 1);
  const adopted = JSON.parse(safari.store.get("massup_db"));
  assert.equal(adopted.weights.hip.at(-1).val, 85);
  assert.ok(adopted.logs.some((l) => l.id === 2));
  assert.ok(adopted.profile.rev > 5000, "le compteur repart au-dessus : la garde anti-onglet périmé recharge au lieu d'écraser");
});

test("two devices that both changed something: the refused write merges and nothing is lost", async () => {
  const srv = fakeServer();
  srv.row = { data: clone(BASE), rev: 3 };
  const icon = device(srv, clone(BASE));
  const mac = device(srv, clone(BASE));
  await icon.boot();
  await mac.boot();
  await icon.edit("DB.logs.push({id:2, date:'2026-10-12'})");
  // Le Mac enregistre AUSSI quelque chose, à partir de l'ancienne version
  await mac.edit("DB.logs.push({id:3, date:'2026-10-13'})");
  // 1er envoi refusé → relecture + fusion + saveDB ; le nouvel envoi est reparti avec la bonne base
  const ids = srv.row.data.logs.map((l) => l.id).sort();
  assert.deepEqual(ids, [1, 2, 3]);
  assert.equal(mac.meta().base, srv.row.rev);
});

test("a boot with nothing new does not rewrite the snapshot (other devices are not disturbed)", async () => {
  const srv = fakeServer();
  srv.row = { data: clone(BASE), rev: 9 };
  const icon = device(srv, clone(BASE));
  await icon.boot(); // 1er lancement après la mise à jour : fusion → un envoi
  const after1 = srv.row.rev;
  const icon2 = device(srv, JSON.parse(icon.store.get("massup_db")));
  icon2.store.set("massup_sync", icon.store.get("massup_sync"));
  await icon2.boot(); // relance sans modif
  assert.equal(srv.row.rev, after1);
});

test("server without user_state_put (SQL not applied yet): falls back to the old upsert", async () => {
  const srv = fakeServer({ legacy: true });
  srv.row = { data: clone(BASE), rev: 0 };
  const icon = device(srv, clone(BASE));
  await icon.boot();
  await icon.edit("DB.logs.push({id:2, date:'2026-10-13'})");
  assert.ok(srv.upserts >= 1);
  assert.ok(srv.row.data.logs.some((l) => l.id === 2));
});

test("Melati uses the same conditional write, merges softly and never resurrects a deleted weigh-in", () => {
  const mel = fs.readFileSync("melati.js", "utf8");
  assert.match(mel, /STATE_SYNC\.put\(mlSb,DB,meta\.base\)/);
  assert.match(mel, /function mlMergeCloud\(bk\)/);
  assert.match(mel, /DB\.deletedPesees\.push\(date\)/);
  assert.match(mel, /\['pesees','logs','tests','deletedPesees'\]/);
  const html = fs.readFileSync("melati.html", "utf8");
  assert.ok(html.indexOf("state_sync.js") < html.indexOf("melati.js"));
  const idx = fs.readFileSync("index.html", "utf8");
  assert.ok(idx.indexOf("state_sync.js") < idx.indexOf("supabase.js"));
});

test("Melati soft merge adds what is missing here and never replaces or resurrects", () => {
  const mel = fs.readFileSync("melati.js", "utf8");
  const a = mel.indexOf("function mlMergeCloud(bk){");
  const fn = mel.slice(a, mel.indexOf("\n}\n", a) + 2);
  const ctx = { JSON, Object, Array, String };
  vm.createContext(ctx);
  vm.runInContext(`var DB = {
    logs:[{id:1,date:'2026-10-01'}], weights:{hip:[{date:'2026-10-13',val:60}]}, pesees:[{date:'2026-10-10',kg:64}],
    deletedPesees:['2026-10-05'], tests:[], salsa:{'2026-10-12':true}, eau:{}, crea:{}, mobiDays:{}, mobiLog:{}, health:{}, healthMeta:{}, rev:20 };
    function dbNormalize(){}` + fn, ctx);
  vm.runInContext(`mlMergeCloud({
    logs:[{id:1,date:'2026-10-01',note:'cloud'},{id:2,date:'2026-10-11'}],
    weights:{hip:[{date:'2026-10-13',val:55},{date:'2026-10-08',val:50}]},
    pesees:[{date:'2026-10-10',kg:70},{date:'2026-10-05',kg:65},{date:'2026-10-03',kg:65.5}],
    salsa:{'2026-10-09':true}, np:{custom:[1]}, rev:900 })`, ctx);
  const DB = clone(vm.runInContext("DB", ctx)); // objets d'un autre contexte vm → copie
  assert.deepEqual(DB.logs.map((l) => l.id), [1, 2]);
  assert.equal(DB.logs[0].note, undefined, "même id : la séance d'ici n'est pas remplacée");
  assert.deepEqual(DB.weights.hip.map((e) => e.val), [50, 60]);
  assert.deepEqual(DB.pesees.map((p) => p.date + ":" + p.kg), ["2026-10-03:65.5", "2026-10-10:64"]);
  assert.ok(DB.salsa["2026-10-09"] && DB.salsa["2026-10-12"]);
  assert.deepEqual(DB.np, { custom: [1] });
  assert.equal(DB.rev, 20);
});
