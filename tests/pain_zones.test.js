"use strict";
// Douleur de fin de séance (16/11) : recherche de zone + intensité par exo, niveau de zone = max de ses exos.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function ctx() {
  const c = vm.createContext({ DB: { logs: [] }, AS: { exos: [], end: {} }, console });
  vm.runInContext(fs.readFileSync("pain_zones.js", "utf8"), c, { filename: "pain_zones.js" });
  return c;
}

test("recherche : phrase libre, accents, début de mot", () => {
  const c = ctx();
  assert.equal(c.painSearch("bas du biceps proche du coude", [])[0], "biceps_bas");
  assert.equal(c.painSearch("coude int", [])[0], "coude_int");
  assert.equal(c.painSearch("epaule arriere", [])[0], "epaule_ar");
  assert.equal(c.painSearch("Épaule arrière", [])[0], "epaule_ar");
  assert.equal(c.painSearch("lombaire", [])[0], "basdos");
  assert.ok(c.painSearch("bic", []).indexOf("biceps") >= 0);
  assert.equal(c.painSearch("bic", ["biceps"]).indexOf("biceps"), -1, "zone déjà choisie : plus proposée");
  assert.equal(c.painSearch("autre", []).indexOf("autre"), -1, "« Autre » n'est plus proposé");
});

test("vieilles clés et texte libre gardent leur libellé", () => {
  const c = ctx();
  for (const k of ["poignet", "coude", "epaule", "nuque", "hautdos", "basdos", "hanche", "genou", "cheville", "autre"]) assert.notEqual(c.painZoneLabel(k), k);
  assert.equal(c.painZoneLabel("Tendon bizarre"), "Tendon bizarre");
  assert.equal(c.painCleanTxt('  <b>truc "x"  '), "B truc x");
});

test("niveau de zone = le plus haut de ses exos ; une seule zone = tous les exos y sont rattachés", () => {
  const c = ctx();
  c.AS.exos = [{ name: "Curl", pp: { lvl: 3, z: [] } }, { name: "Rowing", pp: { lvl: 2, z: [] } }, { name: "Tirage" }];
  c.AS.end = { painAny: true, pains: [{ z: "biceps_bas", lvl: null }] };
  assert.equal(c.asPainAnswered(c.AS.end), true);
  assert.equal(c.AS.end.pains[0].lvl, 3);
  assert.deepEqual([...c.AS.exos[1].pp.z], ["biceps_bas"]);
  // 2e zone sans exo rattaché → pas encore répondu
  c.AS.end.pains.push({ z: "epaule", lvl: null });
  assert.equal(c.asPainAnswered(c.AS.end), false);
  assert.match(c.painMissing(c.AS.end), /Épaule/);
  c.AS.exos[1].pp.z = ["epaule"];
  assert.equal(c.asPainAnswered(c.AS.end), true);
  assert.equal(c.AS.end.pains[0].lvl, 3);
  assert.equal(c.AS.end.pains[1].lvl, 2);
  // exo coché sans intensité → bloque
  c.AS.exos[2].pp = { lvl: null, z: ["epaule"] };
  assert.equal(c.asPainAnswered(c.AS.end), false);
  assert.match(c.painMissing(c.AS.end), /Tirage : quelle intensité/);
});

test("« Oui » sans exo coché ni zone → pas répondu ; « Non » → répondu", () => {
  const c = ctx();
  c.AS.end = { painAny: true, pains: [] };
  assert.equal(c.asPainAnswered(c.AS.end), false);
  c.AS.end.pains = [{ z: "genou" }];
  assert.equal(c.asPainAnswered(c.AS.end), false);
  c.AS.end.painOut = { lvl: 2, z: [] };
  assert.equal(c.asPainAnswered(c.AS.end), true);
  assert.equal(c.AS.end.pains[0].lvl, 2);
  assert.equal(c.asPainAnswered({ painAny: false }), true);
});
