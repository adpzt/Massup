"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const handler = require("../api/health");

function response() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

function request(method, body) {
  return {
    method,
    query: { t: "test-token" },
    readableEnded: true,
    body
  };
}

test("GET explains that health uploads require POST", async () => {
  const res = response();
  await handler(request("GET"), res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, "POST");
  assert.equal(res.body.ok, false);
});

test("POST forwards daily text rows and reports saved rows", async (t) => {
  const originalFetch = global.fetch;
  let forwarded;
  global.fetch = async (_url, options) => {
    forwarded = JSON.parse(options.body);
    return { ok: true, text: async () => "2" };
  };
  t.after(() => { global.fetch = originalFetch; });

  const res = response();
  await handler(request("POST", "2026-09-28;steps;8123\n2026-09-29;steps;9000"), res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(forwarded.p_rows, [
    { d: "2026-09-28", k: "steps", v: "8123" },
    { d: "2026-09-29", k: "steps", v: "9000" }
  ]);
  assert.deepEqual(res.body, { ok: true, received: 2, saved: 2, recu: ["steps : 2 j · moy. 8561,5"], attention: [] });
});

test("POST accepts hourly step rows from the iOS Shortcut", async (t) => {
  const originalFetch = global.fetch;
  let forwarded;
  global.fetch = async (_url, options) => {
    forwarded = JSON.parse(options.body);
    return { ok: true, text: async () => "2" };
  };
  t.after(() => { global.fetch = originalFetch; });

  const res = response();
  await handler(request("POST", {
    rows: [
      { d: "2026-09-28", k: "steps_h09", v: "812" },
      { d: "2026-09-28", k: "steps_h23", v: "120" }
    ]
  }), res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(forwarded.p_rows, [
    { d: "2026-09-28", k: "steps_h09", v: "812" },
    { d: "2026-09-28", k: "steps_h23", v: "120" }
  ]);
});

test("POST rejects a body with no readable rows", async () => {
  const res = response();
  await handler(request("POST", "not a health row"), res);
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.ok, false);
});

test("POST surfaces Supabase failures instead of returning success", async (t) => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: false, text: async () => "RPC unavailable" });
  t.after(() => { global.fetch = originalFetch; });

  const res = response();
  await handler(request("POST", "2026-09-29;steps;9000"), res);
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.ok, false);
  assert.match(res.body.error, /RPC unavailable/);
});

test("POST accepte la nutrition Yazio et la pesée Renpho (02/11), par paquets, avec un résumé", async (t) => {
  const originalFetch = global.fetch;
  const batches = [];
  global.fetch = async (_url, options) => {
    const b = JSON.parse(options.body);
    batches.push(b.p_rows.length);
    return { ok: true, text: async () => String(b.p_rows.length) };
  };
  t.after(() => { global.fetch = originalFetch; });
  const lines = ["2026-11-01;nu_kcal;2 845,5", "2026-11-01;Protéines;142,3", "01/11/2026;poids;71,6", "2026-11-01;kcal;512"];
  for (let i = 0; i < 2100; i++) lines.push("2026-10-01;nu_sodium;" + i);
  const res = response();
  await handler(request("POST", lines.join("\n")), res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(batches, [2000, 104]);
  assert.equal(res.body.saved, 2104);
  assert.ok(res.body.recu.includes("nu_kcal : 1 j · moy. 2845,5") && res.body.recu.includes("nu_prot : 1 j · moy. 142,3") && res.body.recu.includes("bw_kg : 1 j · moy. 71,6"));
  assert.ok(res.body.recu.includes("kcal : 1 j · moy. 512"), "« kcal » reste l'énergie active");
  assert.deepEqual(res.body.attention, []);
  const res2 = response();
  await handler(request("POST", "2026-11-01;steps;7432\n2026-11-01;nu_kcal;7432"), res2);
  assert.match(res2.body.attention[0], /les pas du jour/);
  batches.length = 0;
  const res3 = response();
  await handler(request("POST", "2026-11-01;bw_kg;0\n2026-10-31;bw_kg;74,1"), res3);
  assert.deepEqual(res3.body.recu, ["bw_kg : 1 j · moy. 74,1"], "une pesée à 0 est ignorée");
  assert.deepEqual(res.body.attention, []);
});
