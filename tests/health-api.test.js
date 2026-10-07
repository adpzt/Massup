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
  assert.deepEqual(res.body, { ok: true, received: 2, saved: 2 });
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
