"use strict";
// Découpage d'app.js (04/11/2026) : la page, le cache hors ligne et les tests chargent les MÊMES fichiers dans le MÊME ordre.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const { APP_FILES } = require("./_app");

test("index.html charge les 7 morceaux d'app dans l'ordre, et plus app.js", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const srcs = [...html.matchAll(/<script src="(app[^"]*\.js)"><\/script>/g)].map((m) => m[1]);
  assert.deepEqual(srcs, APP_FILES);
  assert.equal(fs.existsSync("app.js"), false);
});

test("sw.js met les 7 morceaux en cache, dans l'ordre", () => {
  const sw = fs.readFileSync("sw.js", "utf8");
  const list = [...sw.matchAll(/'\/(app-[^']+\.js)'/g)].map((m) => m[1]);
  assert.deepEqual(list, APP_FILES);
  assert.equal(/'\/app\.js'/.test(sw), false);
});
