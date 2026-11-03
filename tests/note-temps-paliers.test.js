"use strict";
// 03/11/2026 (demandes Adrien) : « manque de temps » = exos passés / écourtés sans perte de points ;
// abdo passé avant le 07/12 = non noté (pas 0) ; barre « séries à la charge » découpée par palier de reps.
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
  vm.runInContext("DB.weights={tirage_vert:[{date:'2026-10-28',val:56}],dev_incline:[{date:'2026-10-28',val:24}]}; DB.logs=[];", ctx);
  return ctx;
}
const ctx = load();
const run = (code, vars) => { Object.assign(ctx, vars || {}); return vm.runInContext(code, ctx); };
const ex = (key, w0, sets, extra) => Object.assign({
  key, w: w0, w0, n: 4, reps: 8, rHi: 10, unite: "kg", status: "done", main: true,
  sets: sets.map(([reps, feel]) => ({ w: w0, reps, feel })),
}, extra || {});
const full = () => ex("tirage_vert", 56, [[10, "ok"], [10, "dur"], [10, "dur"], [11, "echec"]]);
const skipped = () => ex("dev_incline", 24, [], { status: "skipped" });
const cut = () => ex("dev_incline", 24, [[10, "ok"], [10, "dur"]], { status: "skipped" });

test("manque de temps : un exo passé ne note pas, sinon il vaut 0", () => {
  assert.equal(run("asNote20From(__l,null,'2026-11-03')", { __l: [full(), skipped()] }), 10);
  assert.equal(run("asNote20From(__l,'temps','2026-11-03')", { __l: [full(), skipped()] }), 20);
});

test("manque de temps : un exo écourté se juge sur ses séries faites", () => {
  const sans = run("asNote20From(__l,null,'2026-11-03')", { __l: [full(), cut()] });
  const avec = run("asNote20From(__l,'temps','2026-11-03')", { __l: [full(), cut()] });
  assert.ok(avec > sans, avec + " > " + sans);
  assert.ok(avec >= 19);
});

test("abdo passé : non noté avant le 07/12, 0 dès le 07/12", () => {
  const ab = () => ({ key: "crunch_decline", n: 3, reps: 12, status: "skipped", main: true, sets: [] });
  assert.equal(run("asNote20From(__l,null,'2026-11-03')", { __l: [full(), ab()] }), 20);
  assert.equal(run("asNote20From(__l,null,'2026-12-07')", { __l: [full(), ab()] }), 10);
});

test("tout exempté : la séance reste notée sur la liste brute", () => {
  assert.equal(run("asNote20From(__l,'temps','2026-11-03')", { __l: [skipped()] }), 0);
});

test("paliers de reps : 24 kg × 8 puis × 10 = deux barres distinctes", () => {
  const log = (id, date, reps) => ({ id, date, time: "07:00", sessions: ["s1"], live: { exos: [ex("dev_incline", 24, reps.map((r) => [r, "ok"]))] } });
  run("DB.logs=__logs", { __logs: [log(1, "2026-10-20", [8, 8, 8, 8]), log(2, "2026-10-24", [8, 9, 8, 8]), log(3, "2026-10-30", [10, 10, 10, 9])] });
  const lc = run("loadCount('dev_incline')");
  assert.equal(lc.lvl, 10);
  assert.equal(lc.done, 4); // seule la séance à × 10 compte
  run("DB.logs=__logs", { __logs: [log(1, "2026-10-20", [8, 8, 8, 8]), log(2, "2026-10-24", [8, 9, 8, 8])] });
  const lc8 = run("loadCount('dev_incline')");
  assert.equal(lc8.lvl, 8);
  assert.equal(lc8.done, 8);
  assert.match(lc8.lbl, /24 kg\/côté &#xD7; 8/);
});

test("paliers : une séance moins bonne après avoir atteint × 10 compte encore (stagnation)", () => {
  const log = (id, date, reps) => ({ id, date, time: "07:00", sessions: ["s1"], live: { exos: [ex("dev_incline", 24, reps.map((r) => [r, "ok"]))] } });
  run("DB.logs=__logs", { __logs: [log(1, "2026-10-20", [8, 8, 8, 8]), log(2, "2026-10-24", [10, 10, 10, 10]), log(3, "2026-10-30", [8, 9, 8, 8])] });
  const lc = run("loadCount('dev_incline')");
  assert.equal(lc.lvl, 10);
  assert.equal(lc.done, 8);
});
