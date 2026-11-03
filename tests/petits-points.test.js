"use strict";
// 04/11/2026 — petits points : journal du poignet sur 2 séances le même jour, pas saisis à la main dans l'export,
// pesées Renpho (Santé) ajoutées à l'historique sans rien écraser ni ressusciter.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function stub() {
  return new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : k === "length" ? 0 : stub()), apply: () => stub(), construct: () => stub() });
}
const store = {};
const ctx = {
  console, Date, JSON, Math, setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  localStorage: { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } },
  document: stub(), navigator: { userAgent: "" }, location: { search: "", hash: "" },
  fetch: () => Promise.resolve(stub()), matchMedia: () => ({ matches: false, addEventListener() {} }),
  addEventListener() {}, removeEventListener() {}, initAuth() {},
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("cardio.js", "utf8"), ctx, { filename: "cardio.js" });
require("./_app").loadApp(vm, ctx);
const run = (code, vars) => { Object.assign(ctx, vars || {}); return vm.runInContext(code, ctx); };

test("poignet : 2 séances le même jour se combinent (plus d'écrasement), une séance reprise remplace sa part", () => {
  run("DB.painLog=[];painLogPut('2026-11-04',1,{level:2,zones:[{z:'poignet',lvl:2}],note:'matin'});painLogPut('2026-11-04',2,{level:0,zones:[],note:''});");
  let e = run("DB.painLog[0]");
  assert.equal(run("DB.painLog.length"), 1);
  assert.equal(e.level, 2);
  assert.equal(e.note, "matin");
  run("painLogPut('2026-11-04',1,{level:1,zones:[{z:'poignet',lvl:1}],note:'matin'},true)");
  e = run("DB.painLog[0]");
  assert.equal(e.level, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(e.zones)), [{ z: "poignet", lvl: 1 }]);
});

test("export : un jour de pas saisi à la main est lu comme dans l'app", () => {
  run("DB.health={'2026-11-02':{ms:8400},'2026-11-03':{steps:12000,ms:5000}};");
  assert.equal(run("stepsAt('2026-11-02')"), 8400);
  assert.equal(run("stepsAt('2026-11-03')"), 12000);
});

test("pesées Renpho : ajout seulement, jamais d'écrasement ni de pesée supprimée, rien avant le 01/11 ni dans le futur", () => {
  const t = run("todayStr()"), y = run("rankAddDays(todayStr(),-1)"), y2 = run("rankAddDays(todayStr(),-2)"), f = run("rankAddDays(todayStr(),1)");
  run("DB.bodyWeight=[{date:__y,weight_kg:74.3,note:''}];DB.deletedBW=[__y2];", { __y: y, __y2: y2 });
  const m = { "2026-10-31": 74.1 }; m[y] = 73.9; m[y2] = 74.0; m[t] = 74.2; m[f] = 75;
  const n = run("importHealthWeights(__m)", { __m: m });
  assert.equal(n, t >= "2026-11-01" ? 1 : 0);
  const bw = run("JSON.stringify(DB.bodyWeight)");
  assert.ok(bw.includes('"' + y + '","weight_kg":74.3')); // la saisie à la main gagne
  assert.ok(!bw.includes(y2) && !bw.includes("2026-10-31") && !bw.includes(f));
  assert.equal(run("importHealthWeights(__m)", { __m: m }), 0); // idempotent
});
