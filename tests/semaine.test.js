"use strict";
// 16/11/2026 (Adrien) : bilan de la semaine v5 — phrases du volume alignées sur les barres, pages Nutrition et
// Pas & sommeil, verdict à plat et 3 leviers chiffrés ; plus aucun « shaker » affiché.
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
  for (const f of ["saison.js", "cardio.js"]) vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f });
  require("./_app").loadApp(vm, ctx);
  vm.runInContext(fs.readFileSync("semaine.js", "utf8"), ctx, { filename: "semaine.js" });
  return ctx;
}
const ctx = load();
const run = (code, vars) => { Object.assign(ctx, vars || {}); return vm.runInContext(code, ctx); };

// Faux Yazio / pas / sommeil pour la semaine du 02/11/2026 (passée)
const WS = "2026-11-02";
function fakeData(days) {
  run(`
    var __D=__days;
    INTAKE={NUT:[
      {k:'kcal',lbl:'Calories',u:'kcal',goal:3000,low:2600,kind:'min',col:'kcal'},
      {k:'glu',lbl:'Glucides',u:'g',goal:410,low:300,kind:'min',col:'glu'},
      {k:'prot',lbl:'Protéines',u:'g',goal:150,low:130,kind:'min',col:'prot'},
      {k:'lip',lbl:'Lipides',u:'g',goal:75,max:85,kind:'target',col:'lip'},
      {k:'fib',lbl:'Fibres',u:'g',goal:30,low:20,kind:'min',col:'mic'},
      {k:'sucre',lbl:'Sucres',u:'g',goal:130,kind:'max',col:'mic'},
      {k:'sat',lbl:'Graisses saturées',u:'g',goal:30,kind:'max',col:'mic'},
      {k:'sodium',lbl:'Sodium',u:'mg',goal:2300,kind:'max',col:'mic'}],
      complete:function(d){ return !!__D[d]; }, val:function(d,k){ var e=__D[d]; return e&&e[k]>0?e[k]:null; }};
    STEPS={week:function(mon){ var days=[],sum=0,n=0; for(var i=0;i<7;i++){ var d=rankAddDays(mon,i), v=[204,2128,7353,2232,223,1433,253][i]; days.push({d:d,v:v,fut:false}); sum+=v; n++; } return {mon:mon,days:days,n:n,avg:sum/n,sum:sum}; }};
    SLEEP={_duration:function(b,w){ var a=+b.slice(0,2)*60+ +b.slice(3), c=+w.slice(0,2)*60+ +w.slice(3); var m=c-a; if(m<=0) m+=1440; return m; }};
    DB.sleepLog={'2026-11-01':{bed:'00:45',wake:'08:15'},'2026-11-02':{bed:'01:05',wake:'08:15'},'2026-11-03':{bed:'01:30',wake:'08:30'},
      '2026-11-04':{bed:'04:10',wake:'10:00'},'2026-11-05':{bed:'01:45',wake:'08:45'},'2026-11-06':{bed:'02:30',wake:'10:20'},'2026-11-07':{bed:'01:45',wake:'08:30'}};
  `, { __days: days });
}
// Ses vrais totaux Yazio de la semaine du 02/11
const REAL = {
  "2026-11-02": { kcal: 2861, glu: 433, prot: 161, lip: 52, fib: 22, sucre: 103, sat: 14, sodium: 6003 },
  "2026-11-03": { kcal: 3226, glu: 390, prot: 151, lip: 114, fib: 34, sucre: 78, sat: 26, sodium: 1096 },
  "2026-11-04": { kcal: 2825, glu: 298, prot: 123, lip: 127, fib: 25, sucre: 45, sat: 31, sodium: 867 },
  "2026-11-05": { kcal: 2828, glu: 424, prot: 160, lip: 55, fib: 25, sucre: 86, sat: 12, sodium: 32 },
  "2026-11-06": { kcal: 2711, glu: 365, prot: 197, lip: 49, fib: 18, sucre: 55, sat: 10, sodium: 2 },
  "2026-11-07": { kcal: 3304, glu: 457, prot: 115, lip: 110, fib: 22, sucre: 82, sat: 38, sodium: 498 },
  "2026-11-08": { kcal: 2559, glu: 185, prot: 140, lip: 142, fib: 6, sucre: 34, sat: 38, sodium: 4 },
};

test("volume : les phrases suivent les MÊMES seuils que les barres (capture du 16/11)", () => {
  const vol = { Pecs: 12, "Épaules": 13, Triceps: 13, Dos: 19, Biceps: 20, Jambes: 10, Abdos: 3 };
  const notes = run("WK.volNotes(__v)", { __v: vol });
  const by = Object.fromEntries(notes.map((g) => [g.tone, g.l.join(" | ")]));
  assert.match(by.gold, /Biceps 20/);
  assert.doesNotMatch(by.gold, /Dos/, "Dos 19 est bleu sur la barre, pas gold");
  assert.match(by.ok, /Dos 19/);
  assert.match(by.low, /Pecs 12/);
  assert.match(by.blood, /Jambes 10/);
  for (const g of notes) for (const l of g.l) {
    const [name, v] = [l.replace(/ \d+$/, ""), +l.match(/\d+$/)[0]];
    assert.equal(run(`volTier(${JSON.stringify(name)},${v})`), g.tone, l);
  }
});

test("nutrition : moyenne sur les jours complets + solutions selon le cas", () => {
  fakeData(REAL);
  const N = run(`WK.nut('${WS}')`);
  assert.equal(N.noted, 7);
  assert.equal(Math.round(N.avg.kcal), 2902);
  let D = run(`WK.nutDiag(WK.nut('${WS}'))`);
  let t = D.map((x) => x.t).join(" / ");
  assert.match(t, /Calories dans la cible : 2.902 kcal/, "98 kcal sous 3 000 : dans la cible");
  assert.match(t, /Lipides/, "lipides au-dessus de 85 g en moyenne");
  // Même semaine avec 450 kcal de moins par jour et un dimanche à 1 500 : solutions glucides + jour creux nommé
  const low = {};
  for (const [d, v] of Object.entries(REAL)) low[d] = Object.assign({}, v, { kcal: v.kcal - 450, glu: v.glu - 80 });
  low["2026-11-08"].kcal = 1500;
  fakeData(low);
  D = run(`WK.nutDiag(WK.nut('${WS}'))`);
  const kc = D.find((x) => /Calories/.test(x.t));
  assert.equal(kc.sev, 3);
  assert.ok(kc.o.length >= 3, "plusieurs solutions");
  assert.match(kc.o[0], /dim : 1.500 kcal/, "le jour creux est nommé en premier");
  assert.match(kc.o.join(" "), /riz|avoine|pain/, "glucides bas → solutions glucides");
});

test("nutrition : protéines basses → des solutions protéines, pas un conseil générique", () => {
  const low = {};
  for (const [d, v] of Object.entries(REAL)) low[d] = Object.assign({}, v, { prot: 105 });
  fakeData(low);
  const D = run(`WK.nutDiag(WK.nut('${WS}'))`);
  const p = D.find((x) => /Protéines/.test(x.t));
  assert.ok(p.sev >= 2);
  assert.match(p.o.join(" "), /whey|skyr|œufs/);
});

test("pas & sommeil : jours sans sortir et coucher tardif détectés, chiffrés", () => {
  fakeData(REAL);
  const S = run(`WK.act('${WS}')`);
  assert.equal(S.sum, 13826);
  assert.equal(S.low.length, 3);
  assert.ok(S.avgBed >= 25 * 60, "coucher moyen après 1 h");
  const D = run(`WK.actDiag(WK.act('${WS}'))`);
  assert.match(D[0].t + D[1].t, /13.826 pas sur 50.000/);
  assert.match(JSON.stringify(D), /Vise/);
});

test("verdict : piliers à plat, leviers triés par points perdus, aucun « shaker »", () => {
  fakeData(REAL);
  const B = {
    v: 5, note: 14.5, maxRaw: 19, scaled: 1, goal: 4, malus: [],
    pil: [
      { i: "🏋️", l: "Salle", m: 10, p: 8.1, c: [["Assiduité", "3/4 séances", 3.5, 5], ["Qualité", "moy. 18,3/20", 4.6, 5]] },
      { i: "🍽️", l: "Nutrition", m: 6, p: 5, c: [["Jours ≥ 2 600 kcal", "6/7", 2.6, 3], ["Jours ≥ 135 g de protéines", "5/7", 1.4, 2], ["Créatine", "7/7", 1, 1]] },
      { i: "👟", l: "Activité", m: 3, p: 0.9, c: [["Pas", "13 826/50 000", 0, 2], ["Nuits ≥ 7 h", "6/7", 0.9, 1]] },
    ],
  };
  const L = run("WK.levers(__B,'" + WS + "',null)", { __B: B });
  assert.equal(L.length, 3);
  assert.equal(L[0].l, "Pas", "le plus gros manque d'abord (2 pts)");
  assert.equal(L[1].l, "Assiduité");
  assert.ok(L[0].lost > L[1].lost && L[1].lost >= L[2].lost);
  const html = run("WK.verdictHtml(__B,'" + WS + "',null,'')", { __B: B });
  const txt = (h) => h.replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(txt(html), /shaker/i);
  assert.doesNotMatch(html, /wr-b-row/, "plus de bulles imbriquées");
  run("WR={shaker:6,maison:8,run:0}");
  assert.doesNotMatch(txt(run(`WK.nutHtml('${WS}',null)`)), /shaker/i);
});
