"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

test("returning from Shortcuts forces a health pull despite the one-minute throttle", async () => {
  const listeners = {};
  const scheduled = [];
  const db = { health: {}, healthMeta: {} };
  const document = {
    hidden: false,
    addEventListener(name, callback) { listeners[name] = callback; },
    getElementById() { return null; }
  };
  const window = { location: { href: "" } };
  const sandbox = {
    Date,
    Math,
    Promise,
    Uint8Array,
    document,
    window,
    setTimeout(callback, delay) { scheduled.push({ callback, delay }); },
    location: { origin: "https://massup.example" },
    navigator: {},
    crypto: { getRandomValues() {} }
  };

  vm.runInNewContext(fs.readFileSync("steps.js", "utf8"), sandbox);
  const STEPS = sandbox.STEPS;
  let saves = 0;
  const rows = [
    { d: "2026-09-29", k: "steps", v: 8123 },
    { d: "2026-09-29", k: "steps_h09", v: 812.4 }
  ];
  STEPS.init({
    app: "adrien",
    db: () => db,
    save() { saves++; },
    toast() {},
    sb: () => ({
      from() {
        return {
          select() { return this; },
          gte() { return this; },
          order() { return this; },
          range() { return Promise.resolve({ data: rows }); }
        };
      }
    }),
    onChange() {}
  });

  await STEPS.pull(true);
  STEPS.refresh();
  assert.match(window.location.href, /^shortcuts:\/\/run-shortcut\?name=/);
  listeners.visibilitychange();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(db.health["2026-09-29"].steps, 8123);
  assert.equal(db.health["2026-09-29"].steps_h09, 812);
  assert.ok(saves > 0);
  assert.deepEqual(scheduled.map((item) => item.delay), [1500, 4000, 9000]);
});

test("health pull imports the full chart year in pages, not only the latest ten days", async () => {
  const document = {
    hidden: false,
    addEventListener() {},
    getElementById() { return null; }
  };
  const db = { health: {}, healthMeta: {} };
  const today = new Date();
  const oldDate = new Date(today);
  oldDate.setDate(oldDate.getDate() - 340);
  const oldKey = `${oldDate.getFullYear()}-${String(oldDate.getMonth() + 1).padStart(2, "0")}-${String(oldDate.getDate()).padStart(2, "0")}`;
  const rows = Array.from({ length: 1001 }, (_, i) => ({
    d: i === 0 ? oldKey : oldKey,
    k: "steps",
    v: String(5000 + i)
  }));
  const pageRequests = [];
  const sb = {
    from() {
      const query = {
        select() { return this; },
        gte(_column, date) { this.since = date; return this; },
        order() { return this; },
        range(start, end) {
          pageRequests.push({ since: this.since, start, end });
          return Promise.resolve({ data: rows.slice(start, end + 1) });
        }
      };
      return query;
    }
  };
  const sandbox = {
    Date,
    Math,
    Promise,
    Uint8Array,
    document,
    window: { location: { href: "" } },
    setTimeout() {},
    location: { origin: "https://massup.example" },
    navigator: {},
    crypto: { getRandomValues() {} }
  };

  vm.runInNewContext(fs.readFileSync("steps.js", "utf8"), sandbox);
  sandbox.STEPS.init({ app: "adrien", db: () => db, save() {}, toast() {}, sb: () => sb, onChange() {} });
  await sandbox.STEPS.pull(true);

  assert.equal(pageRequests.length, 2);
  assert.deepEqual(pageRequests.map((page) => page.start), [0, 1000]);
  assert.ok(pageRequests[0].since <= oldKey);
  assert.equal(db.health[oldKey].steps, 6000);
});

test("history offers day, week, month, and year views with point selection and retained scroll", async () => {
  const listeners = {};
  const body = { innerHTML: "" };
  const scroll = { scrollTop: 0 };
  const history = { innerHTML: "", closest() { return scroll; } };
  const overlay = { classList: { add() {}, contains() { return true; } } };
  const chartWrap = {
    handlers: {},
    addEventListener(name, callback) { this.handlers[name] = callback; }
  };
  const document = {
    hidden: false,
    body: { style: {} },
    addEventListener(name, callback) { listeners[name] = callback; },
    getElementById(id) { return id === "stOverlay" ? overlay : id === "stBody" ? body : null; },
    querySelector(selector) {
      return selector === ".st-chart-wrap" ? chartWrap
        : selector === ".st-history" ? history : null;
    }
  };
  body.querySelector = (selector) => selector === ".as-scroll" ? scroll : null;
  const health = {};
  const d = new Date();
  for (let i = 364; i >= 0; i--) {
    const day = new Date(d);
    day.setDate(day.getDate() - i);
    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    health[key] = { steps: 6500 + (i % 500) };
  }
  const db = { health, healthMeta: { token: "private-token" } };
  const sandbox = {
    Date,
    Math,
    Promise,
    Uint8Array,
    document,
    window: { location: { href: "" } },
    setTimeout() {},
    location: { origin: "https://massup.example" },
    navigator: {},
    crypto: { getRandomValues() {} }
  };
  vm.runInNewContext(fs.readFileSync("steps.js", "utf8"), sandbox);
  sandbox.STEPS.init({ app: "adrien", db: () => db, save() {}, toast() {}, sb: () => null, onChange() {} });
  sandbox.STEPS.open();
  history.innerHTML = body.innerHTML;
  const markup = () => body.innerHTML + history.innerHTML;

  assert.match(markup(), /Semaine/);
  assert.equal((history.innerHTML.match(/class="st-point(?: dense)?(?: selected)?(?: empty)?"/g) || []).length, 7);
  assert.doesNotMatch(markup(), /série en cours|Dans la note de semaine|Relier l’app Santé|st-leg/);
  assert.match(markup(), /Copier le lien/);
  assert.match(markup(), /<details class="wn-card st-sec st-manual">/);
  scroll.scrollTop = 420;
  sandbox.STEPS._select(0);
  assert.equal(scroll.scrollTop, 420);
  assert.match(history.innerHTML, /Semaine ·/);
  assert.equal((history.innerHTML.match(/class="st-point(?:\s[^"]*)?"/g) || []).length, 7);
  assert.match(history.innerHTML, /aria-pressed="true"/);
  assert.doesNotMatch(history.innerHTML, /\d+ jour[s]? avec données/);
  assert.match(history.innerHTML, /st-period-stats/);
  assert.doesNotMatch(history.innerHTML, /st-chart-title/);

  sandbox.STEPS._mode("month");
  const daysThisMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  assert.equal((history.innerHTML.match(/class="st-point(?:\s[^"]*)?"/g) || []).length, daysThisMonth);
  assert.match(history.innerHTML, /Mois ·/);
  const currentMonthStats = history.innerHTML.match(/<div class="st-grid st-period-stats">.*?<\/div><\/div>/)?.[0];
  sandbox.STEPS._page(-1);
  assert.match(history.innerHTML, /août|juillet|juin|mai|avril|mars|février|janvier/i);
  assert.notEqual(history.innerHTML.match(/<div class="st-grid st-period-stats">.*?<\/div><\/div>/)?.[0], currentMonthStats);
  sandbox.STEPS._mode("year");
  assert.equal((history.innerHTML.match(/class="st-point(?:\s[^"]*)?"/g) || []).length, 12);
  assert.match(history.innerHTML, /Année ·/);
  sandbox.STEPS._select(0);
  assert.match(history.innerHTML, /janvier/i);
  sandbox.STEPS._select(0);
  assert.match(history.innerHTML, /Année ·/);
  sandbox.STEPS._mode("week");
  assert.equal((history.innerHTML.match(/class="st-point(?:\s[^"]*)?"/g) || []).length, 7);

  chartWrap.handlers.pointerdown({ clientX: 180, clientY: 50 });
  chartWrap.handlers.pointerup({ clientX: 100, clientY: 52 });
  assert.match(history.innerHTML, /<button type="button" onclick="STEPS\._page\(1\)"/);
});

test("Adrien's steps card shows the weekly average and progress to 55,000 without a day count", () => {
  const today = new Date();
  const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const expectedSum = (today.getDay() + 6) % 7 === 0 ? 12000 : 22000;
  const expectedAverage = expectedSum === 12000 ? 12000 : 11000;
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  const card = { innerHTML: "" };
  const document = {
    hidden: false,
    addEventListener() {},
    getElementById(id) { return id === "bilanWeekNut" ? {} : id === "stCard" ? card : null; }
  };
  const sandbox = {
    Date, Math, Promise, Uint8Array, document,
    window: { location: { href: "" } }, setTimeout() {},
    location: { origin: "https://massup.example" }, navigator: {},
    crypto: { getRandomValues() {} }
  };
  vm.runInNewContext(fs.readFileSync("steps.js", "utf8"), sandbox);
  sandbox.STEPS.init({
    app: "adrien",
    db: () => ({ health: { [key]: { steps: 12000 }, [yesterdayKey]: { steps: 10000 } }, healthMeta: {} }),
    save() {}, toast() {}, sb: () => null, onChange() {}
  });
  sandbox.STEPS.renderCard();

  assert.match(card.innerHTML, /Moyenne cette semaine/);
  assert.ok(card.innerHTML.includes(expectedAverage.toLocaleString("fr-FR")));
  assert.match(card.innerHTML, /55000/);
  assert.match(card.innerHTML, new RegExp(`style="width:${Math.min(100, expectedSum / 55000 * 100)}%"`));
  assert.doesNotMatch(card.innerHTML, /renseigné/);
});

test("day view renders actual hourly steps and period-specific statistics", async () => {
  const today = new Date();
  const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const health = { [key]: { steps: 900, steps_h09: 300, steps_h10: 600 } };
  const listeners = {};
  const body = { innerHTML: "" };
  const scroll = { scrollTop: 0 };
  const history = { innerHTML: "", closest() { return scroll; } };
  const overlay = { classList: { add() {}, contains() { return true; } } };
  const chartWrap = { addEventListener() {} };
  const document = {
    hidden: false,
    body: { style: {} },
    addEventListener(name, callback) { listeners[name] = callback; },
    getElementById(id) { return id === "stOverlay" ? overlay : id === "stBody" ? body : null; },
    querySelector(selector) {
      return selector === ".st-chart-wrap" ? chartWrap
        : selector === ".st-history" ? history : null;
    }
  };
  body.querySelector = (selector) => selector === ".as-scroll" ? scroll : null;
  const sandbox = {
    Date, Math, Promise, Uint8Array, document,
    window: { location: { href: "" } }, setTimeout() {},
    location: { origin: "https://massup.example" }, navigator: {},
    crypto: { getRandomValues() {} }
  };
  vm.runInNewContext(fs.readFileSync("steps.js", "utf8"), sandbox);
  sandbox.STEPS.init({
    app: "adrien",
    db: () => ({ health, healthMeta: { token: "private-token" } }),
    save() {}, toast() {}, sb: () => null, onChange() {}
  });
  sandbox.STEPS.open();
  history.innerHTML = body.innerHTML;
  sandbox.STEPS._mode("day");

  assert.match(history.innerHTML, /mode-day adrien hourly/);
  assert.equal((history.innerHTML.match(/class="st-point[^"]*hour-point/g) || []).length, 24);
  assert.match(history.innerHTML, /Heures actives/);
  assert.match(history.innerHTML, /st-period-stats/);
  const stats = history.innerHTML.match(/<div class="st-grid st-period-stats">([\s\S]*?)<\/div><\/div>/);
  assert.equal((stats?.[1].match(/<div><b/g) || []).length, 4);
  sandbox.STEPS._select(9);
  assert.match(history.innerHTML, /<strong class="t-red">300<\/strong>/);
  assert.match(history.innerHTML, /pas · 09:00–10:00/);
  const detail = history.innerHTML.match(/<div class="st-chart-detail">([\s\S]*?)<\/div>/)?.[1] || "";
  assert.doesNotMatch(detail, /\d{1,2} [a-zéû]+/);
  assert.match(fs.readFileSync("steps.css", "utf8"), /\.st-chart-bars\.adrien \.st-point-val\{display:none;\}/);
});

test("step points are not assigned to completed weeks before the feature launch week", () => {
  const document = {
    hidden: false,
    addEventListener() {},
    getElementById() { return null; }
  };
  const sandbox = {
    Date,
    Math,
    Promise,
    Uint8Array,
    document,
    window: { location: { href: "" } },
    setTimeout() {},
    location: { origin: "https://massup.example" },
    navigator: {},
    crypto: { getRandomValues() {} }
  };
  vm.runInNewContext(fs.readFileSync("steps.js", "utf8"), sandbox);
  sandbox.STEPS.init({ app: "adrien", db: () => ({ health: {}, healthMeta: {} }), save() {}, toast() {}, sb: () => null, onChange() {} });
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) - 7);
  const priorMonday = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
  assert.equal(sandbox.STEPS.weekPts(priorMonday, 3), null);
});

test("shared render helper preserves scroll only when rerendering the same view", () => {
  const sandbox = {
    Date,
    Math,
    Promise,
    Uint8Array,
    document: { addEventListener() {} },
    window: { location: { href: "" } },
    setTimeout() {},
    location: { origin: "https://massup.example" },
    navigator: {},
    crypto: { getRandomValues() {} }
  };
  vm.runInNewContext(fs.readFileSync("steps.js", "utf8"), sandbox);

  let content = "old";
  let scroll = { scrollTop: 420 };
  const body = {
    get innerHTML() { return content; },
    set innerHTML(value) {
      content = value;
      scroll = { scrollTop: 0 };
    },
    querySelector(selector) { return selector === ".as-scroll" ? scroll : null; }
  };

  sandbox.STEPS.renderPreservingScroll(body, "rerendered", true);
  assert.equal(scroll.scrollTop, 420);
  sandbox.STEPS.renderPreservingScroll(body, "new view", false);
  assert.equal(scroll.scrollTop, 0);
});
