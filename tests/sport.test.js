"use strict";
// « Un autre sport ? » (12/10/2026) : calculs du module course (sport.js)
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function load(logs) {
  const sandbox = { console, Date, JSON, Math, String, DB: { logs: logs || [] }, localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} } };
  vm.runInNewContext(fs.readFileSync("sport.js", "utf8"), sandbox);
  return sandbox.SPORT._test;
}

test("pace and speed are computed from distance and time, without 60-second rounding glitches", () => {
  const t = load();
  assert.equal(t.fmtPace(1830, 5.2), "5&#x2032;52&#x2033;/km");
  assert.equal(t.fmtSpeed(1830, 5.2), "10,2 km/h");
  assert.equal(t.fmtPace(299.8, 1), "5&#x2032;00&#x2033;/km"); // 4′59,8″ arrondi → 5′00″, jamais 4′60″
  assert.equal(t.fmtDur(3725), "1h02:05");
  assert.equal(t.fmtPace(0, 5), null);
});

test("the suggested distance starts at 5 km and grows by 0.5 km on the best recent run, capped at 10", () => {
  assert.equal(load([]).targetKm(), 5);
  const run = (date, km) => ({ date, sport: "course", run: { km, sec: km * 360 } });
  assert.equal(load([run("2026-10-10", 5.2)]).targetKm(), 5.5);
  assert.equal(load([run("2026-10-01", 7), run("2026-10-08", 6), run("2026-10-10", 6.5)]).targetKm(), 7.5);
  assert.equal(load([run("2026-12-01", 9.8)]).targetKm(), 10);
});

test("a run never counts as a gym session and the course flow replaces the manual session link", () => {
  const app = fs.readFileSync("app.js", "utf8");
  assert.match(app, /function logWeight\(l\)\{\n  if\(l&&l\.sport==='course'\) return 0;/);
  assert.match(app, /onclick="asOtherSport\(\)"/);
  assert.doesNotMatch(app, /onclick="asManualEntry\(\)"/);
});
