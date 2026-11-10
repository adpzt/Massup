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
  require("./_app").loadApp(vm, ctx);
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

test("abdo passé : non noté avant le 04/01, 0 dès le 04/01 (décalé le 09/11)", () => {
  const ab = () => ({ key: "crunch_decline", n: 3, reps: 12, status: "skipped", main: true, sets: [] });
  assert.equal(run("asNote20From(__l,null,'2026-11-03')", { __l: [full(), ab()] }), 20);
  assert.equal(run("asNote20From(__l,null,'2026-12-07')", { __l: [full(), ab()] }), 20);
  assert.equal(run("asNote20From(__l,null,'2027-01-04')", { __l: [full(), ab()] }), 10);
});

test("tout exempté : la séance reste notée sur la liste brute", () => {
  assert.equal(run("asNote20From(__l,'temps','2026-11-03')", { __l: [skipped()] }), 0);
});

// 06/11 (Adrien) : palier = charge du jour × reps visées ; défaut = 5 dernières séances ; ½ série à 1-2 reps de la cible.
const plog = (id, date, reps, extra) => ({ id, date, time: "07:00", sessions: ["s1"], live: { exos: [ex("dev_incline", 24, reps.map((r) => [r, "ok"]), extra)] } });

test("paliers : reps par défaut = médiane des 5 dernières séances à cette charge", () => {
  run("DB.logs=__logs", { __logs: [plog(1, "2026-10-20", [8, 8, 8, 8]), plog(2, "2026-10-24", [8, 9, 8, 8]), plog(3, "2026-10-30", [10, 10, 10, 9])] });
  const lc8 = run("loadCount('dev_incline')");
  assert.equal(lc8.lvl, 8);
  assert.equal(lc8.done, 12);
  assert.match(lc8.lbl, /24 kg\/côté &#xD7; 8/);
  run("DB.logs=__logs", { __logs: [plog(1, "2026-10-20", [8, 8, 8, 8]), plog(2, "2026-10-24", [8, 9, 8, 8]), plog(3, "2026-10-30", [10, 10, 10, 9]), plog(4, "2026-11-02", [10, 10, 10, 10]), plog(5, "2026-11-05", [10, 10, 10, 10])] });
  const lc10 = run("loadCount('dev_incline')");
  assert.equal(lc10.lvl, 10);
  assert.equal(lc10.done, 11.5); // depuis la 1re séance à × 10 : 3,5 + 4 + 4 (le 9 vaut ½)
  assert.equal(lc10.doneTxt, "11,5");
});

test("crédit partiel : cible 12 → 12 = 1, 11 et 10 = ½, 9 = 0", () => {
  run("DB.logs=[]");
  const lc = run("loadCount('dev_incline',{key:'dev_incline',w:24,weight:24,gR:12,sets:[{w:24,reps:12},{w:24,reps:11},{w:24,reps:10},{w:24,reps:9}]})");
  assert.equal(lc.lvl, 12);
  assert.equal(lc.done, 2);
});

test("en séance : le palier suit le poids de travail du jour (60 kg, pas la réf. 56)", () => {
  const T = (id, d, w, reps) => ({ id, date: d, time: "07:00", sessions: ["s2"], live: { exos: [ex("tirage_vert", w, reps.map((r) => [r, "dur"]))] } });
  run("DB.logs=__logs", { __logs: [T(1, "2026-10-28", 56, [10, 10, 10, 10]), T(2, "2026-11-02", 60, [8, 8, 7, 6])] });
  const lc = run("loadCount('tirage_vert',{key:'tirage_vert',w:60,weight:60,sets:[{w:60,reps:8}]})");
  assert.equal(lc.w, 60);
  assert.equal(lc.lvl, 8);
  assert.equal(lc.done, 4); // aujourd'hui 1 + séance du 02/11 : 8, 8, 7 (½), 6 (½) — les séries à 56 ne comptent pas
});

test("reps choisies en séance : gravées dans le log, elles restent le défaut à ce poids", () => {
  run("DB.logs=__logs", { __logs: [plog(1, "2026-10-20", [8, 8, 8, 8]), plog(2, "2026-10-24", [10, 9, 9, 8], { gR: 10 })] });
  const lc = run("loadCount('dev_incline')");
  assert.equal(lc.lvl, 10);
  assert.equal(lc.auto, false);
  assert.equal(lc.done, 2.5); // séance du 24/10 seulement (palier visé ce jour-là) : 1 + ½ + ½ + ½
});

test("re-notation « manque de temps » : séance du 03/11 (2 exos écourtés + Pallof passé) 14 → 18, une seule fois", () => {
  const S = (w, reps, feel) => ({ w, reps, feel });
  const E = (key, n, lo, hi, w0, sets, status) => ({ key, n, reps: lo, rHi: hi, w: w0, w0, main: true, unite: "kg", status: status || "done", pain: false, sets });
  const l = { id: 1, date: "2026-11-03", live: { context: "temps", note20: 14, n20v: 6, exos: [
    E("dev_incline", 4, 8, 10, 24, [S(24, 8, "ok"), S(24, 8, "dur"), S(24, 8, "ok"), S(24, 10, "echec")]),
    E("hip_thrust", 4, 10, 12, 60, [S(60, 10, "dur"), S(60, 9, "dur"), S(60, 10, "dur")], "skipped"),
    E("chestpress_v", 4, 8, 10, 55, [S(55, 10, "facile"), S(55, 10, "ok"), S(55, 10, "dur")], "skipped"),
    E("pecdeck", 4, 10, 12, 54, [S(54, 8, "ok"), S(54, 8, "dur"), S(54, 10, "dur"), S(54, 10, "echec")]),
    E("elev_lat", 4, 8, 12, 8, [S(8, 10, "ok"), S(8, 9, "dur"), S(8, 10, "dur"), S(8, 9, "echec")]),
    E("pallof", 3, 10, 12, 10, [], "skipped")] } };
  run("DB.logs=[__l];noteRegradeTemps();noteRegradeTemps();", { __l: l });
  assert.equal(l.live.note20, 18);
  assert.equal(l.live.note20Prev, 14);
});

test("douleur d'avant le 07/10 : arrêt 🩹 sans zone = « zone non notée », plus « poignet 0 »", () => {
  const lv = { pain: 0, exos: [{ key: "leg_press", pain: true, sets: [] }] };
  assert.equal(run("liveLogPainAny(__v)", { __v: lv }), true);
  assert.equal(run("painZonesTxt(liveLogPains(__v))", { __v: lv }), "zone non notée");
  assert.equal(run("painZonesTxt(liveLogPains(__v))", { __v: { pain: 2, exos: [] } }), "poignet 2/5");
});

test("durée > 3 h sans séries horodatées : neutralisée, valeur gardée", () => {
  const a = { id: 5, date: "2026-10-10", duration_min: 250, live: { exos: [{ key: "pecdeck", sets: [{ reps: 10 }] }] } };
  const b = { id: 6, date: "2026-11-03", duration_min: 55, live: { exos: [] } };
  run("DB.logs=[__a,__b];fixLongDurations();", { __a: a, __b: b });
  assert.equal(a.duration_min, null);
  assert.equal(a.durationRaw, 250);
  assert.equal(b.duration_min, 55);
});

// 09/11 (Adrien : « je choisis 4×10 et au repos il me propose 8 ») : la série terminée propose les reps visées.
test("série terminée : propose les reps visées de l'intro, sinon le palier auto", () => {
  run("DB.logs=[]");
  assert.equal(run("asDefReps({key:'tirage_vert',weight:56,reps:8,rHi:10,gR:10})"), 10);
  assert.equal(run("asDefReps({key:'tirage_vert',weight:56,reps:8,rHi:10})"), 8, "sans historique ni choix : le bas de la fourchette");
  assert.equal(run("asDefReps({key:'pallof',weight:10,reps:30,cnt:'s'})"), 30, "exo en secondes : inchangé");
});

// 10/11 (Adrien : « face pull : 26/30 en × 14, jamais en × 15 alors que je fais presque toujours 15 ») :
// en fourchette impaire (12-15), le haut de la fourchette est un palier → 12 · 15 · 17.
test("paliers 12-15 : le haut de la fourchette est un palier (15, plus 14)", () => {
  assert.equal(run("lcRepLevel(12,15,15)"), 15);
  assert.equal(run("lcRepLevel(12,14,15)"), 12);
  assert.equal(run("lcRepLevel(12,17,15)"), 17);
  assert.equal(run("lcRepLevel(8,11,12)"), 10, "fourchette paire 8-12 : inchangée");
  assert.equal(run("lcRepLevel(8,9,10)"), 8, "fourchette 8-10 : inchangée");
  assert.equal(run("lcStepLevel(12,15,15,-1)"), 12);
  assert.equal(run("lcStepLevel(12,15,12,1)"), 15);
  assert.equal(run("lcStepLevel(12,15,15,1)"), 17);
  assert.equal(run("lcStepLevel(8,10,8,1)"), 10);
  const F = (id, d, reps, extra) => ({ id, date: d, time: "07:00", sessions: ["s2"], live: { exos: [Object.assign({ key: "face_pull", w: 20, w0: 20, n: 3, reps: 12, rHi: 15, unite: "kg", status: "done", main: true, sets: reps.map((r) => ({ w: 20, reps: r, feel: "dur" })) }, extra || {})] } });
  run("DB.weights.face_pull=[{date:'2026-11-09',val:20}];DB.logs=__logs", { __logs: [F(1, "2026-08-18", [15, 15, 15]), F(2, "2026-08-21", [15, 15, 15]), F(3, "2026-11-01", [15, 11, 10]), F(4, "2026-11-09", [15, 15, 15], { gR: 14 })] });
  const lc = run("loadCount('face_pull')");
  assert.equal(lc.lvl, 15, "le × 14 gravé le 09/11 remonte à × 15");
  assert.equal(lc.done, 10); // 3 + 3 + 1 (11 et 10 = 0 à 4-5 reps de 15) + 3
  assert.equal(run("asDefReps({key:'face_pull',weight:20,reps:12,rHi:15})"), 15, "la série terminée propose 15");
});

// 11/11 (Adrien : « pourquoi 20 alors que j'ai perdu plein de points ? ») : séance enregistrée avec ses exemptions (09/11 : 18),
// sans n20x → la re-notation du boot rajoutait l'abdo passé une 2e fois (20). Plus jamais, et la note revient à 18.
test("re-notation « manque de temps » : jamais sur une séance enregistrée depuis le 04/11 (double exemption)", () => {
  const S = (w, reps, feel) => ({ w, reps, feel });
  const E = (key, n, lo, hi, w0, sets, status) => ({ key, n, reps: lo, rHi: hi, w: w0, w0, main: true, unite: "kg", status: status || "done", pain: false, sets });
  const l = { id: 2, date: "2026-11-09", live: { context: "energie", note20: 18, n20v: 6, exos: [
    E("tirage_vert", 4, 8, 10, 60, [S(60, 8, "dur"), S(60, 8, "dur"), S(60, 8, "dur"), S(60, 7, "echec")]),
    E("rowing_pb", 4, 8, 10, 56, [S(56, 8, "dur"), S(56, 8, "echec"), S(56, 8, "echec"), S(56, 7, "echec")]),
    E("crunch_decline", 3, 12, null, 12, [], "skipped")] } };
  run("DB.logs=[__l];noteRegradeTemps();", { __l: l });
  assert.equal(l.live.note20, 18);
  assert.equal(l.live.n20x, 1);
  const bad = { id: 3, date: "2026-11-09", live: { note20: 20, note20Prev: 18, n20v: 6, n20x: 1, exos: [] } };
  const t3 = { id: "1793702789954", date: "2026-11-03", live: { note20: 19, note20Prev: 14, n20v: 6, n20x: 1, exos: [] } };
  const ok = { id: 4, date: "2026-10-20", live: { note20: 13, note20Prev: 11, n20v: 6, n20x: 1, exos: [] } };
  run("DB.profile.noteFix1111=false;DB.logs=[__a,__b,__c];noteFixDouble();", { __a: bad, __b: t3, __c: ok });
  assert.equal(bad.live.note20, 18);
  assert.equal(bad.live.note20Dbl, 20);
  assert.equal(t3.live.note20, 18);
  assert.equal(ok.live.note20, 13, "re-notation légitime d'avant le 04/11 : inchangée");
});
