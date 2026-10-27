"use strict";
// Système « une seule charge » (28/10/2026) : barème v4 de la note /5, verdicts de charge,
// et garantie que les séances d'avant (sans fourchette gravée) gardent leur barème.
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
  vm.runInContext(fs.readFileSync("app.js", "utf8"), ctx, { filename: "app.js" });
  vm.runInContext("DB.weights={tirage_vert:[{date:'2026-10-28',val:56}],dev_incline:[{date:'2026-10-28',val:24}],pecdeck:[{date:'2026-10-28',val:49}]}; DB.logs=[];", ctx);
  return {
    score: (x) => { ctx.__x = x; return vm.runInContext("asScoreExoRaw(__x)", ctx); },
    analyze: (x) => { ctx.__x = x; return JSON.parse(vm.runInContext("(function(){var o=asAnalyzeExo(__x);return JSON.stringify({suggest:o.suggest,to:o.suggestTo==null?null:o.suggestTo});})()", ctx)); },
    note20: (list) => { ctx.__l = list; return vm.runInContext("asNote20From(__l)", ctx); },
  };
}
const ex = (key, w0, lo, hi, sets) => ({
  key, w: w0, w0, n: sets.length, reps: lo, rHi: hi, unite: key === "dev_incline" ? "kg/côté" : "kg", status: "done", main: true,
  sets: sets.map(([w, reps, feel]) => ({ w, reps, feel })),
});
const app = load();

test("exécution conforme (OK · DUR · DUR · ÉCHEC dans la fourchette) = 5/5, séance à 20", () => {
  const a = ex("tirage_vert", 56, 8, 10, [[56, 8, "ok"], [56, 8, "dur"], [56, 8, "dur"], [56, 10, "echec"]]);
  const b = ex("dev_incline", 24, 8, 10, [[24, 9, "ok"], [24, 9, "dur"], [24, 8, "dur"], [24, 9, "echec"]]);
  assert.equal(app.score(a), 5);
  assert.equal(app.note20([a, b]), 20);
});

test("toutes les séries à l'échec = 2,5 max même reps faites ; l'ancien barème donnait 5", () => {
  const sets = [[54, 10, "echec"], [54, 10, "echec"], [54, 10, "echec"], [54, 10, "echec"]];
  assert.ok(app.score(ex("pecdeck", 49, 10, 12, sets)) <= 2.5);
  const old = ex("pecdeck", 49, 10, 12, sets); delete old.rHi; // séance d'avant le 28/10
  assert.equal(app.score(old), 5);
});

test("série 1 à l'échec = 4 max et proposition d'un cran en dessous ; dernière à l'échec = normal", () => {
  const s1 = ex("dev_incline", 24, 8, 10, [[24, 8, "echec"], [24, 8, "dur"], [24, 8, "dur"], [24, 8, "echec"]]);
  assert.ok(app.score(s1) <= 4);
  assert.deepEqual(app.analyze(s1), { suggest: -1, to: 22 });
  const last = ex("dev_incline", 24, 8, 10, [[24, 8, "ok"], [24, 8, "dur"], [24, 8, "dur"], [24, 7, "echec"]]);
  assert.equal(app.score(last), 5);
});

test("hausse proposée seulement si toutes les séries atteignent le haut sans échec avant la dernière", () => {
  const top = ex("tirage_vert", 56, 8, 10, [[56, 10, "ok"], [56, 10, "dur"], [56, 10, "dur"], [56, 11, "echec"]]);
  assert.deepEqual(app.analyze(top), { suggest: 1, to: 60 });
  const early = ex("tirage_vert", 56, 8, 10, [[56, 10, "ok"], [56, 10, "echec"], [56, 10, "dur"], [56, 10, "echec"]]);
  assert.notEqual(app.analyze(early).suggest, 1);
  const notTop = ex("tirage_vert", 56, 8, 10, [[56, 10, "ok"], [56, 9, "dur"], [56, 10, "dur"], [56, 10, "echec"]]);
  assert.notEqual(app.analyze(notTop).suggest, 1);
});

test("+1 rep ne baisse jamais la note (même ressenti)", () => {
  const feels = ["facile", "ok", "dur", "echec"];
  for (let i = 0; i < 400; i++) {
    const sets = [0, 1, 2, 3].map(() => [56, 4 + Math.floor(Math.random() * 9), feels[Math.floor(Math.random() * 4)]]);
    const base = app.score(ex("tirage_vert", 56, 8, 10, sets));
    const k = Math.floor(Math.random() * 4);
    const more = sets.map((s, j) => (j === k ? [s[0], s[1] + 1, s[2]] : s));
    assert.ok(app.score(ex("tirage_vert", 56, 8, 10, more)) >= base - 1e-9, JSON.stringify(sets) + " +1 rep série " + (k + 1));
  }
});
