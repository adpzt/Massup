"use strict";
// Notation v5 + gravure (03/11/2026) : barème, malus, gravure figée, fusion « 1re gravure gagne », barème d'époque avant le 09/11.
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
  // Semaine du lundi 09/11/2026 (1re semaine v5), vue depuis le dimanche 22/11 ; modules Pas / Sommeil / Yazio simulés
  ctx.__low = {};
  ctx.__kcal = 2800;
  ctx.STEPS = { weekPts: () => 2, week: () => ({ sum: 55000, avg: 7857 }), stepsOf: (d) => (ctx.__low[d] != null ? ctx.__low[d] : 8000) };
  ctx.SLEEP = { _duration: () => 480 };
  ctx.INTAKE = { val: (d, k) => (k === "kcal" ? ctx.__kcal : 140), ready: () => true };
  vm.runInContext(`
    todayStr=function(){ return '2026-11-22'; };
    noteWeekClosed=function(){ return true; };
    muscleVolume=function(){ return {}; }; volTier=function(){ return 'ok'; };
    saveDB=function(){};
    DB.logs=['2026-11-09','2026-11-11','2026-11-13','2026-11-15'].map(function(d,i){ return {id:900+i,date:d,sessions:['s1'],live:{note20:16}}; });
    DB.rank={pauses:[],weekly:{'2026-11-09':{v:3,shaker:7,run:1,maison:10}}};
    DB.sleepLog={}; for(var i=0;i<7;i++){ DB.sleepLog[rankAddDays('2026-11-08',i)]={bed:'23:30',wake:'07:30'}; }
    DB.bodyWeight=[{date:'2026-11-12',weight_kg:74.5}];
    DB.noteGrav={};
  `, ctx);
  return (code, vars) => { Object.assign(ctx, vars || {}); return JSON.parse(vm.runInContext("JSON.stringify(" + code + ")", ctx)); };
}

test("v5 : salle 5 + 4, nutrition 3 + 2 + 1, activité 2 + 1 + 1 = 19/20", () => {
  const run = load();
  const B = run("bilanNoteWeek('2026-11-09')");
  assert.equal(B.v, 5);
  assert.equal(B.note, 19);
  assert.deepEqual(B.pil.map((p) => p.p), [9, 6, 4]);
  assert.equal(B.malus.length, 0);
  assert.equal(B.graved, undefined, "sans données cloud chargées, rien n'est gravé");
});

test("v5 : malus −0,5 par jour sous 1 000 pas et −0,5 sans pesée ; donnée manquante = 0", () => {
  const run = load();
  run("(DB.bodyWeight=[],1)", { __low: { "2026-11-10": 640, "2026-11-14": 820 } });
  const B = run("bilanNoteWeek('2026-11-09')");
  assert.equal(B.note, 17.5);
  assert.equal(B.malus.length, 3);
  run("(DB.rank.weekly={},1)");
  const C = run("bilanNoteWeek('2026-11-09')");
  assert.equal(C.pil[1].c[2][2], 0, "shaker non coché = 0");
});

test("gravure : une fois la semaine close et les données chargées, la note ne bouge plus", () => {
  const run = load();
  const g = run("bilanNoteWeek('2026-11-09')", { _cloudPullOk: true });
  assert.equal(g.graved, 1);
  assert.equal(g.note, 19);
  const after = run("bilanNoteWeek('2026-11-09')", { __kcal: 0 });
  assert.equal(after.note, 19, "la note gravée ne change pas quand les données changent");
});

test("fusion : à semaine égale, la 1re gravure gagne", () => {
  const run = load();
  run("(DB.noteGrav={'2026-11-09':{note:12,at:9},'2026-11-16':{note:15,at:3}},mergeBackupIntoDB({noteGrav:{'2026-11-09':{note:10,at:5},'2026-11-16':{note:8,at:7},'2026-11-23':{note:14,at:1}}}),1)");
  assert.deepEqual(run("[DB.noteGrav['2026-11-09'].note,DB.noteGrav['2026-11-16'].note,DB.noteGrav['2026-11-23'].note]"), [10, 15, 14]);
});

test("avant le 09/11 : barème d'époque (v3), jamais la v5", () => {
  const run = load();
  assert.equal(run("bilanNoteWeek('2026-11-02').v"), 3);
});
