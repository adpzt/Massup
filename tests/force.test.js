"use strict";
// Indice de force (03/11/2026) : 1RM estimé (Epley), indice chaîné, exo non travaillé = inchangé, base 100.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function load(logs) {
  const ctx = { console, Date, JSON, Math, DB: { logs } };
  vm.createContext(ctx);
  vm.runInContext(`
    function todayStr(){ return '2026-11-03'; }
    function rankMonday(d){ var x=new Date(d+'T12:00:00'); x.setDate(x.getDate()-((x.getDay()+6)%7)); return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); }
    function rankAddDays(d,n){ var x=new Date(d+'T12:00:00'); x.setDate(x.getDate()+n); return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); }
  `, ctx);
  vm.runInContext(fs.readFileSync("force.js", "utf8"), ctx, { filename: "force.js" });
  return JSON.parse(vm.runInContext("JSON.stringify(FORCE.model())", ctx));
}
const log = (date, key, w, reps) => ({ date, live: { exos: [{ key, w, sets: [{ w, reps }] }] } });

test("base 100, puis +10 % sur un exo et l'autre non travaillé = racine de 1,1", () => {
  const M = load([log("2026-10-05", "tirage_vert", 60, 10), log("2026-10-06", "leg_press", 100, 10), log("2026-10-12", "tirage_vert", 66, 10)]);
  assert.equal(M.pts[0].v, 100);
  assert.ok(Math.abs(M.cur - 100 * Math.sqrt(1.1)) < 1e-9);
  assert.deepEqual(M.exos.map((e) => Math.round(e.pct)), [10, 0]);
});

test("1RM estimé = charge × (1 + reps/30), reps plafonnées à 12, exos hors liste ignorés", () => {
  const M = load([log("2026-10-05", "dev_incline", 30, 20), log("2026-10-05", "curl_halt", 20, 10)]);
  assert.equal(M.exos.length, 1);
  assert.ok(Math.abs(M.exos[0].v - 30 * (1 + 12 / 30)) < 1e-9);
});
