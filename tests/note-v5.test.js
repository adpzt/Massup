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
  ctx.STEPS = { weekPts: (ws, max) => max, week: () => ({ sum: 55000, avg: 7857 }), stepsOf: (d) => (ctx.__low[d] != null ? ctx.__low[d] : 8000) };
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

test("v5 avant le 04/01 : salle 9 + nutrition 6 + activité 2 (pas sur 1 dès le 09/11) = 17/18, ramené à 20 → 19", () => {
  const run = load();
  const B = run("bilanNoteWeek('2026-11-09')");
  assert.equal(B.v, 5);
  assert.equal(B.note, 19);
  assert.deepEqual(B.pil.map((p) => p.p), [9, 6, 2]);
  assert.equal(B.maxRaw, 18);
  assert.equal(B.pil[2].c[0][3], 1, "pas sur 1 point jusqu'au 04/01");
  assert.equal(B.pil[2].c.length, 2, "pas de ligne Course avant le 04/01");
  assert.equal(B.malus.length, 0);
  assert.equal(B.graved, undefined, "sans données cloud chargées, rien n'est gravé");
});

test("v5 : malus −0,5 sans pesée ; les jours sous 1 000 pas ne comptent qu'à partir de la bascule (04/01) ; donnée manquante = 0", () => {
  const run = load();
  run("(DB.bodyWeight=[],1)", { __low: { "2026-11-10": 640, "2026-11-14": 820 } });
  const B = run("bilanNoteWeek('2026-11-09')");
  assert.equal(B.note, 18.5, "19 − 0,5 sans pesée ; les 2 jours sous 1 000 pas ne coûtent rien avant la bascule");
  assert.equal(B.malus.length, 1);
  run("(DB.rank.weekly={},1)");
  const C = run("bilanNoteWeek('2026-11-09')");
  assert.equal(C.pil[1].c[2][2], 0, "shaker non coché = 0");
  // mécanisme testé avec une bascule fictive au 07/12 (la vraie date, 04/01, tombe en Sèche : autres seuils nutrition)
  run("(RUN_REQ_START=STEPS_FULL_START='2026-12-07',DB.logs.forEach(function(l,i){ l.date=rankAddDays('2026-12-07',i*2); }),DB.rank.weekly={'2026-12-07':{v:3,shaker:7,run:1}},todayStr=function(){ return '2026-12-20'; },1)", { __low: { "2026-12-08": 640 } });
  assert.equal(run("bilanNoteWeek('2026-12-07').malus.length"), 2, "après la bascule : sans pesée + 1 jour sous 1 000 pas");
});

test("après la bascule : la course compte sur 1, les pas sur 2, sans malus en plus si la course manque", () => {
  const run = load();
  assert.deepEqual(run("[RUN_REQ_START,STEPS_FULL_START]"), ["2027-01-04", "2027-01-04"], "bascule le lundi 04/01 (décision du 09/11)");
  run("(RUN_REQ_START=STEPS_FULL_START='2026-12-07',DB.logs.forEach(function(l,i){ l.date=rankAddDays('2026-12-07',i*2); }),DB.rank.weekly={'2026-12-07':{v:3,shaker:7,run:0}},DB.bodyWeight=[{date:'2026-12-08',weight_kg:75}],todayStr=function(){ return '2026-12-20'; },1)");
  const B = run("bilanNoteWeek('2026-12-07')");
  assert.equal(B.pil[2].m, 4);
  assert.equal(B.malus.length, 0);
  // 26/11 : dès le 30/11, Nutrition /8 (créatine /2 + shaker /1) → total brut 22. Sans réserve saisie : estimation à 0 %
  // (Remplissage, gain 0 → 0/2) : 9 + 3 + 2 + 0 + 1 + pas 2 = 17/22 → 15,5/20
  assert.equal(B.note, 15.5, "9 + kcal 3 + prot 2 + créatine 0 + shaker 1 + pas 2 + nuits 0 + course 0 = 17/22, aucun malus en plus");
  run("(DB.profile.creaStart={date:'2026-12-07',pct:100},(function(){ for(var i=0;i<7;i++) ensureNutriDay(rankAddDays('2026-12-07',i)).crea=5; })(),1)");
  assert.equal(run("bilanNoteWeek('2026-12-07').note"), 17.5, "réserve pleine tenue : créatine 2/2 → 19/22 → 17,5");
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
  run("(DB.noteGrav={'2026-11-09':{v:5,note:12,at:9},'2026-11-16':{v:5,note:15,at:3,wkv:2}},mergeBackupIntoDB({noteGrav:{'2026-11-09':{v:5,note:10,at:5},'2026-11-16':{v:5,note:8,at:7,wkv:2},'2026-11-23':{v:5,note:14,at:1}}}),1)");
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

// 23/11 (Adrien) : dès la semaine du 23/11, le bilan attend le LUNDI matin — nuit du dimanche notée + ↻ après minuit —
// pour que le dimanche compte en entier ; les nuits de la semaine = du lundi soir au dimanche soir.
test("bilan de la semaine (dès le 23/11) : lundi matin, nuit du dimanche + ↻ après minuit", () => {
  const run = load();
  const at = (s) => new Date(s).getTime();
  run("(DB.logs.push({id:990,date:'2026-11-24',sessions:['s1'],live:{note20:16}}),todayStr=function(){ return __t; },1)", { __t: "2026-11-29" });
  run("(Date.now=function(){ return __n; },1)", { __n: at("2026-11-29T21:00:00") });
  assert.equal(run("wrPendingWeekRaw()"), "2026-11-16", "dimanche soir : la semaine en cours n'est plus proposée");
  run("(todayStr=function(){ return '2026-11-30'; },DB.rank.weekly['2026-11-16']={v:3},Date.now=function(){ return __n; },1)", { __n: at("2026-11-30T08:00:00") });
  assert.equal(run("wrPendingWeekRaw()"), "2026-11-23");
  run("(localStorage.setItem('massup_refreshAt',String(__r)),1)", { __r: at("2026-11-29T21:00:00"), __sync: at("2026-11-29T21:01:00") });
  assert.equal(run("wrWaitReason('2026-11-23')"), "sleep", "nuit du dimanche pas notée");
  run("(DB.sleepLog['2026-11-29']={bed:'23:30',wake:'07:30'},1)");
  assert.equal(run("wrWaitReason('2026-11-23')"), "refresh", "↻ du dimanche soir : dimanche incomplet");
  assert.equal(run("noteCanGrave('2026-11-23')"), false);
  run("(localStorage.setItem('massup_refreshAt',String(__r)),1)", { __r: at("2026-11-30T07:50:00"), __sync: at("2026-11-30T07:51:00") });
  assert.equal(run("wrDataReady('2026-11-23')"), true);
  assert.equal(run("wrNightKey('2026-11-23',6)"), "2026-11-29", "la nuit de dimanche à lundi compte");
  assert.equal(run("wrNightKey('2026-11-16',0)"), "2026-11-16", "dès le 16/11 (regravée)");
  assert.equal(run("wrNightKey('2026-11-09',0)"), "2026-11-08", "semaines d'avant : inchangées");
  // Semaine du 16/11 gravée avec l'ancienne règle : ignorée (regravée une fois), puis la nouvelle gravure tient
  assert.equal(run("noteGravValid('2026-11-16',{v:5,note:16,rgv:2,asv:2})"), false);
  assert.equal(run("noteGravValid('2026-11-16',{v:5,note:16,rgv:2,asv:2,wkv:2})"), true);
  assert.equal(run("noteGravValid('2026-11-09',{v:5,note:16,rgv:2,asv:2})"), true, "semaine du 09/11 : intacte");
  // Nuit oubliée : plus d'attente à partir du mardi 5 h
  run("(delete DB.sleepLog['2026-11-29'],Date.now=function(){ return __n; },1)", { __n: at("2026-12-01T06:00:00") });
  assert.equal(run("wrDataReady('2026-11-23')"), true);
});

test("semaine du 02/11 gravée avec l'ancienne assiduité : ignorée puis regravée une fois (asv 2)", () => {
  const run = load();
  assert.equal(run("noteGravValid('2026-11-02',{v:5,note:15,rgv:2})"), false);
  assert.equal(run("noteGravValid('2026-11-02',{v:5,note:15,rgv:2,asv:2})"), true);
  assert.equal(run("noteGravValid('2026-11-09',{v:5,note:15,rgv:2})"), true, "les semaines suivantes ne sont pas concernées");
});

test("réservoir de créatine (26/11) : perte −3/jour, gains 5 g = +7 / 10 g = +12, plafond 10 g, borné 0-100", () => {
  const run = load();
  assert.deepEqual(run("[creaGain(0),creaGain(5),creaGain(10),creaGain(20),creaGain(3)]"), [0, 7, 12, 12, 1.4 * 3]);
  run("(todayStr=function(){ return '2026-12-06'; },DB.nutrition={},DB.profile.creaStart={date:'2026-11-23',pct:100},1)");
  // 5 g un jour sur deux à 100 % : tient entre 97 et 100
  run("((function(){ for(var i=0;i<14;i+=2) ensureNutriDay(rankAddDays('2026-11-23',i)).crea=5; })(),1)");
  const v = run("(function(){ var S=creaSeries(), a=[]; Object.keys(S.e).forEach(function(d){ a.push(S.e[d]); }); return [Math.min.apply(null,a),Math.max.apply(null,a)]; })()");
  assert.deepEqual(v, [97, 100]);
  // sans rien : −3 par jour jusqu'à 0, jamais en négatif
  run("(DB.nutrition={},DB.profile.creaStart={date:'2026-12-01',pct:10},1)");
  assert.equal(run("creaAt('2026-12-04')"), 0);
  assert.equal(run("creaAt('2026-12-02')"), 4);
});

test("créatine (26/11) : mode fixé lundi 0 h, note Plein / Remplissage, jours gelés retirés de la note mais pas de la jauge", () => {
  const run = load();
  run("(todayStr=function(){ return '2026-12-13'; },DB.nutrition={},DB.rank.pauses=[],1)");
  // PLEIN : 100 % le lundi 0 h, aucune prise → dimanche 79 % → 0/2 ; sinon (r−80)/15×2
  run("(DB.profile.creaStart={date:'2026-12-07',pct:100},1)");
  let W = run("creaWeek('2026-12-07')");
  assert.equal(W.mode, "plein"); assert.equal(W.noteSun, 79); assert.equal(W.pts, 0);
  run("(ensureNutriDay('2026-12-10').crea=10,1)"); // +12 → 91 dimanche → (91−80)/15×2 = 1,47
  W = run("creaWeek('2026-12-07')");
  assert.equal(W.noteSun, 91); assert.equal(W.pts, 1.47);
  // 2 jours gelés, aucune prise : la note ne perd pas leurs 6 points (85 → 0,67/2), la jauge si (79)
  run("(DB.nutrition={},DB.rank.pauses=[{start:'2026-12-08',end:'2026-12-09',type:'vacances'}],1)");
  W = run("creaWeek('2026-12-07')");
  assert.equal(W.sun, 79); assert.equal(W.noteSun, 85); assert.equal(W.pts, 0.67); assert.equal(W.frozen, 2);
  // REMPLISSAGE : 50 % lundi 0 h ; 10 g/jour → +9/jour → objectif +25 atteint → 2/2
  run("(DB.rank.pauses=[],DB.nutrition={},DB.profile.creaStart={date:'2026-12-07',pct:50},1)");
  run("((function(){ for(var i=0;i<7;i++) ensureNutriDay(rankAddDays('2026-12-07',i)).crea=10; })(),1)");
  W = run("creaWeek('2026-12-07')");
  assert.equal(W.mode, "remp"); assert.equal(W.ok, true); assert.equal(W.pts, 2);
  // 5 g sur 3 jours seulement : gain = 3×7 − 21 = 0 → 0/2 ; 5 g tous les jours : +28 → atteint
  run("(DB.nutrition={},function(){ for(var i=0;i<3;i++) ensureNutriDay(rankAddDays('2026-12-07',i)).crea=5; }(),1)");
  assert.equal(run("creaWeek('2026-12-07').pts"), 0);
  // objectif réduit au prorata des jours non gelés (7 jours gelés → objectif 0 → 2/2)
  run("(DB.rank.pauses=[{start:'2026-12-07',end:'2026-12-13',type:'blessure'}],1)");
  W = run("creaWeek('2026-12-07')");
  assert.equal(W.target, 0); assert.equal(W.pts, 2);
});

test("créatine (26/11) : tap 0 → 5 → 10 → 0 ; un shaker ajoute 5 g aujourd'hui, retirés si le shaker revient à 0", () => {
  const run = load();
  run("(todayStr=function(){ return '2026-12-09'; },DB.nutrition={},renderBilanWeekNut=function(){},1)");
  assert.deepEqual(run("(function(){ var a=[]; for(var i=0;i<3;i++){ creaTapToday(); a.push(creaDose('2026-12-09')); } return a; })()"), [5, 10, 0]);
  run("(DB.nutrition={},nutTapWeek('shaker'),1)");
  assert.equal(run("creaDose('2026-12-09')"), 5, "shaker → 5 g");
  run("(creaSetDay('2026-12-09',10),nutTapWeek('shaker'),1)");
  assert.equal(run("creaDose('2026-12-09')"), 10, "une saisie à 10 g n'est pas rabaissée");
  run("(DB.nutrition={},nutTapWeek('shaker'),1)");
  for (let i = 0; i < 7; i++) run("(nutTapWeek('shaker'),1)"); // 1 → 7 puis retour à 0
  assert.equal(run("nutWeekCount('shaker','2026-12-07')"), 0);
  assert.equal(run("creaDose('2026-12-09')"), 0, "le 5 g automatique part avec le shaker");
  // avant le 26/11, un jour « shaker » de l'ancien compteur = 5 g
  run("(DB.nutrition={'2026-11-20':{shaker:true}},1)");
  assert.equal(run("creaDose('2026-11-20')"), 5);
});

test("shaker (26/11) : un shaker remplit lait, kiwi et collagène (démarré) ; un kiwi pris seul n'est pas compté deux fois", () => {
  const run = load();
  run("(todayStr=function(){ return '2026-12-09'; },DB.nutrition={},renderBilanWeekNut=function(){},DB.profile.suppl={colla:'2026-12-01'},1)");
  run("(nutTapWeek('kiwi'),nutTapWeek('shaker'),1)");
  assert.deepEqual(run("['shaker','lait','kiwi','colla'].map(function(f){ return nutWeekCount(f,'2026-12-07'); })"), [1, 1, 1, 1]);
  run("(nutTapWeek('shaker'),1)");
  assert.deepEqual(run("['shaker','lait','kiwi','colla'].map(function(f){ return nutWeekCount(f,'2026-12-07'); })"), [2, 2, 2, 2]);
  run("(DB.nutrition={},DB.profile.suppl={},nutTapWeek('shaker'),1)");
  assert.equal(run("nutWeekCount('colla','2026-12-07')"), 0, "collagène pas encore reçu : rien");
});
