"use strict";
// Saison Sèche construite d'avance (04/11/2026) : bascule le lundi 4 janvier 2027, aperçu par appareil sans gravure,
// seuils de la note de semaine, règle de MAINTIEN des charges en séance.
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
  localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
  document: stub(), navigator: { userAgent: "" }, location: { search: "", hash: "" },
  fetch: () => Promise.resolve(stub()), matchMedia: () => ({ matches: false, addEventListener() {} }),
  addEventListener() {}, removeEventListener() {}, initAuth() {},
};
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ["saison.js", "cardio.js"]) vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f });
require("./_app").loadApp(vm, ctx);
const run = (code, vars) => { Object.assign(ctx, vars || {}); return vm.runInContext(code, ctx); };
const preview = (on) => { if (on) store.massup_seche_preview = "1"; else delete store.massup_seche_preview; };

test("bascule : masse jusqu'au 03/01/2027, Sèche dès le lundi 04/01/2027", () => {
  preview(false);
  assert.equal(run("SAISON.realIdAt('2027-01-03')"), "masse");
  assert.equal(run("SAISON.realIdAt('2027-01-04')"), "seche");
  assert.equal(run("SAISON.idAt('2026-11-04')"), "masse");
  assert.equal(run("SAISON.cfg('2027-02-01').nut.kcal.goal"), 2450);
});

test("aperçu : la semaine en cours s'affiche en Sèche, les semaines passées et les séances restent en masse", () => {
  preview(true);
  const mon = run("SAISON._monday(todayStr())");
  assert.equal(run("SAISON.idAt(todayStr())"), "seche");
  assert.equal(run("SAISON.idAt(rankAddDays(__m,-7))", { __m: mon }), "masse");
  assert.equal(run("SAISON.realIdAt(todayStr())"), "masse");
  assert.equal(run("SAISON.previewAt(__m)", { __m: mon }), true);
  run("_cloudPullOk=true");
  assert.equal(run("noteCanGrave(__m)", { __m: mon }), false); // jamais gravé en aperçu
  assert.equal(run("SAISON.weekGoal(__m,4)", { __m: mon }), 3);
  preview(false);
  assert.equal(run("SAISON.weekGoal(__m,4)", { __m: mon }), 4);
});

test("note de semaine en Sèche : jours dans le déficit (2 100-2 600 kcal) et ≥ 150 g de protéines", () => {
  const mon = run("SAISON._monday(todayStr())");
  ctx.INTAKE = { val: (d, k) => (k === "kcal" ? 2400 : 155) };
  run("DB.logs=[];DB.rank=DB.rank||{};");
  preview(false);
  const m = run("bilanNoteWeekV5(__m)", { __m: mon });
  assert.equal(m.sz, "masse");
  assert.equal(m.kcalDays, 0); // 2 400 < 2 600 en masse
  preview(true);
  const s = run("bilanNoteWeekV5(__m)", { __m: mon });
  assert.equal(s.sz, "seche");
  assert.ok(s.kcalDays >= 1 && s.kcalDays === s.protDays, JSON.stringify([s.kcalDays, s.protDays]));
  assert.match(s.pil[1].c[0][0], /déficit/);
  assert.equal(s.goal, 3);
  preview(false);
  delete ctx.INTAKE;
});

test("séance en Sèche : tenir la charge à 1 rep sous la fourchette = pleine valeur (maintien)", () => {
  const ex = (sz) => ({ key: "tirage_vert", w: 56, w0: 56, n: 4, reps: 8, rHi: 10, unite: "kg", status: "done", main: true, sz,
    sets: [{ w: 56, reps: 7, feel: "ok" }, { w: 56, reps: 8, feel: "dur" }, { w: 56, reps: 8, feel: "dur" }, { w: 56, reps: 9, feel: "echec" }] });
  const masse = run("asScoreExoRaw(__x)", { __x: ex(undefined) });
  const seche = run("asScoreExoRaw(__x)", { __x: ex("seche") });
  assert.ok(seche > masse, seche + " > " + masse);
  assert.equal(seche, 5);
});
