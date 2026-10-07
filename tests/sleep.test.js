"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function setup(now) {
  const db = { sleepLog: {} };
  const values = {};
  const card = { innerHTML: "" };
  const parent = { insertBefore(element) { element.parentNode = this; } };
  const host = { parentNode: parent, nextSibling: null };
  const body = { innerHTML: "" };
  const overlay = {
    classList: {
      open: false,
      add() { this.open = true; },
      remove() { this.open = false; },
      contains(value) { return value === "open" && this.open; }
    }
  };
  const document = {
    body: { style: {} },
    createElement() { return { id: "", innerHTML: "" }; },
    getElementById(id) {
      if (id === "stCard") return null;
      if (id === "sleepCard") return card;
      if (id === "bilanWeekNut") return host;
      if (id === "sleepOverlay") return overlay;
      if (id === "sleepBody") return body;
      return values[id] || null;
    }
  };
  const FixedDate = now ? class extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return new Date(now).getTime(); }
  } : Date;
  const sandbox = { Date: FixedDate, Math, Promise, document };
  vm.runInNewContext(fs.readFileSync("sleep.js", "utf8"), sandbox);
  let saves = 0;
  sandbox.SLEEP.init({ db: () => db, save() { saves++; }, toast() {} });
  return { db, values, card, body, overlay, document, SLEEP: sandbox.SLEEP, saves: () => saves };
}

test("sleep duration handles overnight times and rejects invalid input", () => {
  const { SLEEP } = setup();

  assert.equal(SLEEP._duration("22:30", "06:45"), 495);
  assert.equal(SLEEP._duration("23:50", "00:10"), 20);
  assert.equal(SLEEP._duration("08:00", "08:00"), null);
  assert.equal(SLEEP._duration("", "07:00"), null);
  assert.equal(SLEEP._duration("25:00", "07:00"), null);
});

test("sleep card always targets the night that ended today", () => {
  const ctx = setup("2026-10-01T12:07:00");

  assert.equal(ctx.SLEEP._night(), "2026-09-30");
  ctx.SLEEP.renderCard();
  assert.match(ctx.card.innerHTML, /Nuit du 30 sept\.\s+au 1 oct\./);
});

test("home card requires explicit manual save and labels the full night range", () => {
  const ctx = setup();
  ctx.values["slp-bed"] = { value: "23:10" };
  ctx.values["slp-wake"] = { value: "06:40" };

  ctx.SLEEP.renderCard();
  const key = ctx.SLEEP._night();
  assert.equal(ctx.saves(), 0);
  assert.equal(ctx.db.sleepLog[key], undefined);
  assert.match(ctx.card.innerHTML, /Enregistrer/);
  assert.match(ctx.card.innerHTML, /Historique/);
  assert.match(ctx.card.innerHTML, /Nuit du .+ au .+/);
  assert.match(ctx.card.innerHTML, /approximatif/i);
  assert.match(ctx.card.innerHTML, /Heure de dodo/);
  assert.doesNotMatch(ctx.card.innerHTML, /Je vais dormir|Réveillé/);

  ctx.SLEEP._saveHome();
  assert.deepEqual({ ...ctx.db.sleepLog[key] }, { bed: "23:10", wake: "06:40" });
  assert.equal(ctx.saves(), 1);
  assert.match(ctx.card.innerHTML, /7 h 30/);
});

test("full-screen editing saves to the selected night and cancel discards changes", () => {
  const ctx = setup();
  const selected = "2026-09-20";
  ctx.db.sleepLog[selected] = { bed: "22:30", wake: "06:30" };
  ctx.SLEEP.open();
  ctx.SLEEP._range(30);
  ctx.SLEEP._select(selected);

  assert.match(ctx.body.innerHTML, /Nuit du .+ au .+/);
  assert.match(ctx.body.innerHTML, /Nuit du dimanche 20 septembre au lundi 21 septembre/);
  assert.match(ctx.body.innerHTML, /Modifier cette nuit/);
  assert.match(ctx.body.innerHTML, /Heure de dodo/);
  assert.match(ctx.body.innerHTML, /Enregistrer cette nuit/);
  ctx.values["slp-edit-bed"] = { value: "23:00" };
  ctx.values["slp-edit-wake"] = { value: "07:00" };
  ctx.SLEEP._cancelEdit();
  assert.equal(ctx.db.sleepLog[selected].bed, "22:30");

  ctx.values["slp-edit-bed"] = { value: "23:15" };
  ctx.values["slp-edit-wake"] = { value: "07:15" };
  ctx.SLEEP._saveSelected();
  assert.deepEqual({ ...ctx.db.sleepLog[selected] }, { bed: "23:15", wake: "07:15" });
  assert.equal(ctx.db.sleepLog[ctx.SLEEP._night()], undefined);
  assert.equal(ctx.saves(), 1);
  assert.match(ctx.body.innerHTML, /30 nuits|7 dernières nuits/);
});

test("sleep summary only averages complete nights", () => {
  const { SLEEP } = setup();
  const result = SLEEP._summary([
    { minutes: 420 },
    { minutes: null },
    { minutes: 480 }
  ]);

  assert.deepEqual(JSON.parse(JSON.stringify(result)), { count: 2, total: 900, avg: 450, best: 480 });
});
