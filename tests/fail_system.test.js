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
    eval: (logs, ref, code) => { ctx.__logs = logs; vm.runInContext("DB.logs=__logs;DB.weights.pecdeck=[{date:'2026-08-20',val:" + ref + "}];", ctx); return vm.runInContext(code, ctx); },
  };
}
const ex = (key, w0, lo, hi, sets) => ({
  key, w: w0, w0, n: sets.length, reps: lo, rHi: hi, unite: key === "dev_incline" ? "kg/côté" : "kg", status: "done", main: true,
  sets: sets.map(([w, reps, feel]) => ({ w, reps, feel })),
});
const app = load();

test("10-10-10-11 en 8-10 (OK · DUR · DUR · ÉCHEC) = 5/5, séance à 20, hausse d'un cran", () => {
  const a = ex("tirage_vert", 56, 8, 10, [[56, 10, "ok"], [56, 10, "dur"], [56, 10, "dur"], [56, 11, "echec"]]);
  const b = ex("dev_incline", 24, 8, 10, [[24, 10, "ok"], [24, 10, "dur"], [24, 10, "echec"], [24, 10, "echec"]]);
  assert.equal(app.score(a), 5);
  assert.equal(app.note20([a, b]), 20);
  assert.deepEqual(app.analyze(a), { suggest: 1, to: 60 });
  assert.deepEqual(app.analyze(b), { suggest: 1, to: 26 }); // échec en S3 : autorisé
});

test("8-8-8-11 ne suffit pas ; échec en S1 ou S2 = pas prêt de monter", () => {
  assert.notEqual(app.analyze(ex("tirage_vert", 56, 8, 10, [[56, 8, "ok"], [56, 8, "dur"], [56, 8, "dur"], [56, 11, "echec"]])).suggest, 1);
  assert.notEqual(app.analyze(ex("tirage_vert", 56, 8, 10, [[56, 10, "echec"], [56, 10, "dur"], [56, 10, "dur"], [56, 11, "echec"]])).suggest, 1);
  assert.notEqual(app.analyze(ex("tirage_vert", 56, 8, 10, [[56, 10, "ok"], [56, 10, "echec"], [56, 10, "dur"], [56, 11, "echec"]])).suggest, 1);
});

test("hausse jugée sur la charge réellement utilisée (cas réels du 31/10)", () => {
  // chest press : 3 séries à 50, la dernière à 55 tient aussi le haut → 55
  const chest = ex("chestpress_v", 50, 8, 10, [[50, 10, "ok"], [50, 10, "facile"], [50, 11, "ok"], [55, 10, "echec"]]);
  assert.deepEqual(app.analyze(chest), { suggest: 1, to: 55 });
  // incliné : référence 24, 4×10 propre à 22 → remonter à 24 = la référence (rien à appliquer)
  const inc = ex("dev_incline", 24, 8, 10, [[22, 10, "ok"], [22, 10, "dur"], [22, 10, "ok"], [22, 10, "echec"]]);
  assert.notEqual(app.analyze(inc).suggest, -1);
});

test("série 1 à l'échec : 4/5 max ; sous le bas → un cran en dessous, au bas → on garde", () => {
  const under = ex("dev_incline", 24, 8, 10, [[24, 7, "echec"], [24, 8, "dur"], [24, 8, "dur"], [24, 8, "echec"]]);
  assert.ok(app.score(under) <= 4);
  assert.deepEqual(app.analyze(under), { suggest: -1, to: 22 });
  const atLo = ex("dev_incline", 24, 8, 10, [[24, 8, "echec"], [24, 8, "dur"], [24, 8, "dur"], [24, 8, "echec"]]);
  assert.ok(app.score(atLo) <= 4);
  assert.notEqual(app.analyze(atLo).suggest, -1);
  const old = ex("pecdeck", 49, 10, 12, [[54, 10, "echec"], [54, 10, "echec"], [54, 10, "echec"], [54, 10, "echec"]]); delete old.rHi;
  assert.equal(app.score(old), 5); // séance d'avant le 28/10 : ancien barème intact
});

test("+1 rep ne baisse jamais la note (même ressenti)", () => {  const feels = ["facile", "ok", "dur", "echec"];
  for (let i = 0; i < 400; i++) {
    const sets = [0, 1, 2, 3].map(() => [56, 4 + Math.floor(Math.random() * 9), feels[Math.floor(Math.random() * 4)]]);
    const base = app.score(ex("tirage_vert", 56, 8, 10, sets));
    const k = Math.floor(Math.random() * 4);
    const more = sets.map((s, j) => (j === k ? [s[0], s[1] + 1, s[2]] : s));
    assert.ok(app.score(ex("tirage_vert", 56, 8, 10, more)) >= base - 1e-9, JSON.stringify(sets) + " +1 rep série " + (k + 1));
  }
});

test("séries à la charge actuelle (historique réel du pec deck) et référence qui suit la charge", () => {
  const app2 = load();
  const L = (id, d, sets) => ({ id, date: d, time: "07:00", sessions: ["s1"], live: { exos: [{ key: "pecdeck", w: 54, w0: 49, n: 4, reps: 10, rHi: 12, unite: "kg", status: "done", main: true, sets: sets.map(([w, r]) => ({ w, reps: r, feel: "dur" })) }] } });
  const logs = [
    L(1, "2026-10-10", [[49, 10], [49, 10], [49, 10], [49, 10]]),
    L(2, "2026-10-13", [[49, 10], [49, 10], [54, 10], [54, 10]]),
    L(3, "2026-10-18", [[49, 10], [54, 10], [54, 10], [54, 10]]),
    L(4, "2026-10-23", [[54, 8], [54, 10], [54, 10], [54, 8]]),
    L(5, "2026-10-27", [[54, 10], [54, 8], [54, 9], [54, 8]]),
    L(6, "2026-10-31", [[54, 10], [54, 10], [54, 10], [54, 11]]),
  ];
  const r = app2.eval(logs, 54, "JSON.stringify(loadCount('pecdeck'))");
  assert.deepEqual(JSON.parse(r).done, 17);
  assert.deepEqual(JSON.parse(r).target, 40);
  const ar = app2.eval([], 49, "AS={exos:[{key:'pecdeck',name:'Pec Deck',w0:49,weight:54,n:4,reps:10,rHi:12,unite:'kg',status:'done',main:true,sets:[{w:54,reps:10,feel:'ok'},{w:54,reps:10,feel:'dur'},{w:54,reps:10,feel:'dur'},{w:54,reps:11,feel:'echec'}]}]};JSON.stringify({a:asAutoRefFollow(),ref:getCurrentWeight('pecdeck')})");
  assert.deepEqual(JSON.parse(ar), { a: { pecdeck: { from: 49, to: 54 } }, ref: 54 });
});

test("une séance plus légère ne remet pas le compteur de séries à zéro (curl marteau croisé réel)", () => {
  const app3 = load();
  const C = (id, d, sets) => ({ id, date: d, time: "07:00", sessions: ["s2"], live: { exos: [{ key: "curl_marteau_croise", w: 10, w0: 10, n: 4, reps: 10, rHi: 12, unite: "kg", status: "done", main: true, sets: sets.map(([w, r]) => ({ w, reps: r, feel: "dur" })) }] } });
  const logs = [
    C(1, "2026-10-15", [[10, 10], [10, 9], [10, 9], [10, 10]]),
    C(2, "2026-10-20", [[6, 15], [6, 15], [8, 10], [8, 15]]),
    C(3, "2026-10-28", [[10, 10], [10, 10], [10, 10], [8, 12]]),
  ];
  const r = JSON.parse(app3.eval(logs, 54, "DB.weights.curl_marteau_croise=[{date:'2026-08-18',val:10}];JSON.stringify(loadCount('curl_marteau_croise'))"));
  assert.equal(r.done, 7);
});

test("durée de séance = de la 1re à la dernière série validée (oubli de « terminé » ignoré)", () => {
  const app4 = load();
  const t0 = Date.now() - 3 * 3600000; // séance commencée il y a 3 h, fin oubliée
  const r = app4.eval([], 54, "AS={step:'end',startTs:" + (t0 - 600000) + ",exos:[{key:'tirage_vert',sets:[{t:" + t0 + "},{t:" + (t0 + 20 * 60000) + "}]},{key:'rowing_pb',sets:[{t:" + (t0 + 55 * 60000) + "}]}]};asElapsedMin()");
  assert.equal(Number(r), 55);
});
