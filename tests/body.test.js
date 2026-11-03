"use strict";
// Poids de corps (tendance + rythme) et mensurations (fusion, suppression) — 02/11/2026.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function stub() {
  return new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : k === "length" ? 0 : stub()), apply: () => stub(), construct: () => stub() });
}
function load() {
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
  return (code, vars) => { Object.assign(ctx, vars || {}); return JSON.parse(vm.runInContext("JSON.stringify(" + code + ")", ctx)); };
}
const bw = (pairs) => pairs.map(([date, kg]) => ({ date, weight_kg: kg }));

test("tendance = moyenne des pesées des 7 derniers jours", () => {
  const run = load();
  const t = run("bwTrend(__d)", { __d: bw([["2026-10-01", 70], ["2026-10-03", 72], ["2026-10-07", 71], ["2026-10-09", 73]]) });
  assert.deepEqual(t.map((p) => p.y), [70, 71, 71, 72]);
});

test("rythme : pente sur 4 semaines, null sans 3 pesées étalées sur 10 jours", () => {
  const run = load();
  const r = run("bwRate(__d)", { __d: bw([["2026-10-01", 70], ["2026-10-08", 70.3], ["2026-10-15", 70.6], ["2026-10-22", 70.9]]) });
  assert.ok(Math.abs(r.rate - 0.3) < 1e-9);
  assert.equal(run("bwRate(__d)", { __d: bw([["2026-10-01", 70], ["2026-10-03", 70.3], ["2026-10-05", 70.6]]) }), null);
  assert.equal(run("bwRate(__d)", { __d: bw([["2026-10-01", 70], ["2026-10-20", 71]]) }), null);
});

test("mensurations : fusion par date, la plus récente gagne, une suppression ne ressuscite pas", () => {
  const run = load();
  const out = run("(function(){DB.bodyMeas={'2026-10-03':{bras:34,at:10},'2026-10-10':{del:1,at:50}};"
    + "mergeBackupIntoDB({bodyMeas:{'2026-10-03':{bras:35,at:5},'2026-10-10':{bras:36,at:20},'2026-10-17':{bras:37,at:30}}});"
    + "return {m:DB.bodyMeas,list:bodyMeasList().map(function(e){return e.date;})};})()");
  assert.equal(out.m["2026-10-03"].bras, 34);
  assert.equal(out.m["2026-10-10"].del, 1);
  assert.deepEqual(out.list, ["2026-10-03", "2026-10-17"]);
});
