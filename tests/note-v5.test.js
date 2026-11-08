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
    console, Date: class extends Date { static now() { return new Date("2026-11-23T10:00:00").getTime(); } }, JSON, Math, setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    localStorage: { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } },
    document: stub(), navigator: { userAgent: "" }, location: { search: "", hash: "" },
    fetch: () => Promise.resolve(stub()), matchMedia: () => ({ matches: false, addEventListener() {} }),
    addEventListener() {}, removeEventListener() {}, initAuth() {},
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync("cardio.js", "utf8"), ctx, { filename: "cardio.js" });
  require("./_app").loadApp(vm, ctx);
  // Semaine du lundi 09/11/2026 (1re semaine v5), vue depuis le dimanche 22/11 ; modules Pas / Sommeil / Yazio simulés
  ctx.__low = {};
  ctx.__kcal = 2800;
  ctx.STEPS = { weekPts: () => 2, week: () => ({ sum: 55000, avg: 7857 }), stepsOf: (d) => (ctx.__low[d] != null ? ctx.__low[d] : 8000) };
  ctx.SLEEP = { _duration: () => 480 };
  ctx.INTAKE = { val: (d, k) => (k === "kcal" ? ctx.__kcal : 140), ready: () => true, syncAt: () => ctx.__sync };
  ctx.__sync = 0;
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

test("v5 avant le 07/12 : salle 9 + nutrition 6 + activité 3 = 18/19, ramené à 20 → 19 (la course ne compte pas)", () => {
  const run = load();
  const B = run("bilanNoteWeek('2026-11-09')");
  assert.equal(B.v, 5);
  assert.equal(B.note, 19);
  assert.deepEqual(B.pil.map((p) => p.p), [9, 6, 3]);
  assert.equal(B.pil[2].c.length, 2, "pas de ligne Course avant le 07/12");
  assert.equal(B.malus.length, 0);
  assert.equal(B.graved, undefined, "sans données cloud chargées, rien n'est gravé");
});

test("v5 : malus −0,5 sans pesée ; les jours sous 1 000 pas ne comptent qu'à partir du 07/12 ; donnée manquante = 0", () => {
  const run = load();
  run("(DB.bodyWeight=[],1)", { __low: { "2026-11-10": 640, "2026-11-14": 820 } });
  const B = run("bilanNoteWeek('2026-11-09')");
  assert.equal(B.note, 18.5, "19 − 0,5 sans pesée ; les 2 jours sous 1 000 pas ne coûtent rien avant le 07/12");
  assert.equal(B.malus.length, 1);
  run("(DB.rank.weekly={},1)");
  const C = run("bilanNoteWeek('2026-11-09')");
  assert.equal(C.pil[1].c[2][2], 0, "shaker non coché = 0");
  run("(DB.logs.forEach(function(l,i){ l.date=rankAddDays('2026-12-07',i*2); }),DB.rank.weekly={'2026-12-07':{v:3,shaker:7,run:1}},todayStr=function(){ return '2026-12-20'; },1)", { __low: { "2026-12-08": 640 } });
  assert.equal(run("bilanNoteWeek('2026-12-07').malus.length"), 2, "dès le 07/12 : sans pesée + 1 jour sous 1 000 pas");
});

test("dès le 07/12 : la course compte sur 1, sans malus en plus si elle manque", () => {
  const run = load();
  run("(DB.logs.forEach(function(l,i){ l.date=rankAddDays('2026-12-07',i*2); }),DB.rank.weekly={'2026-12-07':{v:3,shaker:7,run:0}},DB.bodyWeight=[{date:'2026-12-08',weight_kg:75}],todayStr=function(){ return '2026-12-20'; },1)");
  const B = run("bilanNoteWeek('2026-12-07')");
  assert.equal(B.pil[2].m, 4);
  assert.equal(B.malus.length, 0);
  assert.equal(B.note, 17, "9 + 6 + pas 2 + nuits 0 + course 0/1 = 17, aucun malus en plus");
});

test("gravure : seulement le lundi après un ↻ fait après le dimanche 20 h, puis la note ne bouge plus", () => {
  const run = load();
  const sun20 = new Date("2026-11-15T20:00:00").getTime();
  run("1", { _cloudPullOk: true });
  assert.equal(run("bilanNoteWeek('2026-11-09').graved||0"), 0, "sans ↻ après dimanche 20 h : pas gravée");
  run("(localStorage.setItem('massup_refreshAt',String(" + (sun20 + 3600e3) + ")),1)", { __sync: sun20 + 3700e3 });
  const g = run("bilanNoteWeek('2026-11-09')");
  assert.equal(g.graved, 1);
  assert.equal(g.note, 19);
  const after = run("bilanNoteWeek('2026-11-09')", { __kcal: 0 });
  assert.equal(after.note, 19, "la note gravée ne change pas quand les données changent");
});

test("fusion : à semaine égale, la 1re gravure gagne", () => {
  const run = load();
  run("(DB.noteGrav={'2026-11-09':{v:5,note:12,at:9},'2026-11-16':{v:5,note:15,at:3}},mergeBackupIntoDB({noteGrav:{'2026-11-09':{v:5,note:10,at:5},'2026-11-16':{v:5,note:8,at:7},'2026-11-23':{v:5,note:14,at:1}}}),1)");
  assert.deepEqual(run("[DB.noteGrav['2026-11-09'].note,DB.noteGrav['2026-11-16'].note,DB.noteGrav['2026-11-23'].note]"), [10, 15, 14]);
});

test("v5 dès la semaine du 26/10 (demande d'Adrien) : une ancienne gravure v3 de cette semaine est ignorée", () => {
  const run = load();
  run("(DB.noteGrav={'2026-10-26':{v:3,note:13.5,at:1},'2026-10-19':{v:3,note:13.5,at:1}},1)");
  assert.equal(run("bilanNoteWeek('2026-10-26').v"), 5);
  assert.equal(run("bilanNoteWeek('2026-10-19').note"), 13.5, "avant le 26/10 : la gravure d'époque reste");
  run("(mergeBackupIntoDB({noteGrav:{'2026-10-26':{v:3,note:9,at:0}}}),1)");
  assert.equal(run("bilanNoteWeek('2026-10-26').v"), 5, "une gravure v3 venue du cloud ne revient pas");
});

test("regravure du 03/11 : séances ≥ 26/10 re-notées une seule fois (ancienne note gardée), exo d'avant les fourchettes jugé avec REP_RANGE", () => {
  const run = load();
  run(`(DB.logs=[
    {id:1,date:'2026-10-27',sessions:['s1'],live:{note20:20,exos:[{key:'pecdeck',name:'Pec Deck',n:4,reps:10,w:54,w0:49,unite:'kg',status:'done',sets:[{reps:10,feel:'echec',w:54},{reps:8,feel:'echec',w:54},{reps:9,feel:'echec',w:54},{reps:8,feel:'echec',w:54}]}]}},
    {id:2,date:'2026-10-19',sessions:['s1'],live:{note20:20,exos:[{key:'pecdeck',n:4,reps:10,w:54,w0:49,unite:'kg',status:'done',sets:[{reps:10,feel:'echec',w:54}]}]}}
  ],1)`);
  assert.equal(run("noteRegrade()"), 1, "seule la séance du 27/10 est re-notée");
  const l = run("DB.logs[0].live");
  assert.equal(l.note20Prev, 20);
  assert.equal(l.n20v, 6);
  assert.equal(l.exos[0].rHi, 12, "fourchette 10-12 du pec deck appliquée");
  assert.ok(l.note20 <= 16, "échec dès la série 1 : 4/5 au plus → 16/20 au plus");
  assert.equal(run("DB.logs[1].live.note20"), 20, "avant le 26/10 : rien ne bouge");
  assert.equal(run("noteRegrade()"), 0, "une seule fois");
});

// 09/11 (Adrien : « trop sévère ») : une séance sous l'objectif = 3,5/5 d'assiduité dès la semaine du 02/11.
test("assiduité : 3/4 séances = 3,5/5 (avant le 02/11 : 2,5)", () => {
  const run = load();
  run("(DB.logs=DB.logs.slice(0,3),1)");
  const B = run("bilanNoteWeekV5('2026-11-09')");
  assert.equal(B.pil[0].c[0][2], 3.5);
  assert.equal(B.pil[0].p, 7.5, "3,5 + qualité 16/20 = 4");
  run("(ASSID_SOFT_START='2026-12-01',1)");
  assert.equal(run("bilanNoteWeekV5('2026-11-09')").pil[0].c[0][2], 2.5);
});

// 09/11 : le bilan de la semaine n'est proposé qu'après un ↻ fait après le dimanche 20 h (et Yazio relu ensuite).
test("bilan de la semaine : attend un ↻ après le dimanche 20 h", () => {
  const run = load();
  const sun20 = new Date("2026-11-15T20:00:00").getTime();
  run("(localStorage.setItem('massup_refreshAt',String(__r)),1)", { __r: sun20 - 3600000, __sync: sun20 });
  assert.equal(run("wrDataReady('2026-11-09')"), false, "↻ fait avant le dimanche 20 h");
  run("(localStorage.setItem('massup_refreshAt',String(__r)),1)", { __r: sun20 + 600000, __sync: sun20 + 300000 });
  assert.equal(run("wrDataReady('2026-11-09')"), false, "Yazio pas encore relu après le ↻");
  run("1", { __sync: sun20 + 900000 });
  assert.equal(run("wrDataReady('2026-11-09')"), true);
  assert.equal(run("wrDataReady('2026-10-19')"), true, "semaines d'avant la v5 : comme avant");
});
