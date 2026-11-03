"use strict";
// app.js découpé le 04/11/2026 en 7 fichiers chargés DANS CET ORDRE (index.html, sw.js ASSETS) — mêmes fonctions globales,
// rien d'autre ne change. Les tests chargent les morceaux un par un, comme le navigateur (vérifie aussi le découpage).
const fs = require("node:fs");
const APP_FILES = ["app-1-donnees.js", "app-2-seances.js", "app-3-sante.js", "app-4-liveup.js", "app-5-detente.js", "app-6-progression.js", "app-7-bilans.js"];
function loadApp(vm, ctx) { for (const f of APP_FILES) vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }); }
function appSource() { return APP_FILES.map((f) => fs.readFileSync(f, "utf8")).join(""); }
module.exports = { APP_FILES, loadApp, appSource };
