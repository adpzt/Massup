"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");
const configHandler = require("../api/push-config");
const dispatchHandler = require("../api/push-dispatch");
const webpush = require("web-push");
const { scheduledReminders, isFrozen, timerNotification, requestMode, needsHistory } = dispatchHandler._test;

function response() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

test("push config only exposes the public VAPID key", async (t) => {
  const oldPublicKey = process.env.VAPID_PUBLIC_KEY;
  const oldPrivateKey = process.env.VAPID_PRIVATE_KEY;
  process.env.VAPID_PUBLIC_KEY = "public-key";
  process.env.VAPID_PRIVATE_KEY = "must-not-be-returned";
  t.after(() => {
    if (oldPublicKey === undefined) delete process.env.VAPID_PUBLIC_KEY;
    else process.env.VAPID_PUBLIC_KEY = oldPublicKey;
    if (oldPrivateKey === undefined) delete process.env.VAPID_PRIVATE_KEY;
    else process.env.VAPID_PRIVATE_KEY = oldPrivateKey;
  });

  const res = response();
  configHandler({ method: "GET" }, res);
  assert.deepEqual(res.body, { enabled: true, publicKey: "public-key" });
  assert.doesNotMatch(JSON.stringify(res.body), /must-not-be-returned/);
});

test("push config reports missing VAPID setup and rejects other methods", async (t) => {
  const oldPublicKey = process.env.VAPID_PUBLIC_KEY;
  delete process.env.VAPID_PUBLIC_KEY;
  t.after(() => {
    if (oldPublicKey === undefined) delete process.env.VAPID_PUBLIC_KEY;
    else process.env.VAPID_PUBLIC_KEY = oldPublicKey;
  });

  const missing = response();
  configHandler({ method: "GET" }, missing);
  assert.equal(missing.statusCode, 503);
  assert.equal(missing.body.error, "push_not_configured");

  const badMethod = response();
  configHandler({ method: "POST" }, badMethod);
  assert.equal(badMethod.statusCode, 405);
  assert.equal(badMethod.headers.Allow, "GET");
});

test("service worker leaves API responses out of the offline cache", () => {
  const listeners = {};
  const sandbox = {
    URL,
    self: {
      location: { origin: "https://massup.example" },
      addEventListener(name, callback) { listeners[name] = callback; },
      skipWaiting() {}
    },
    caches: {}
  };
  vm.runInNewContext(fs.readFileSync("sw.js", "utf8"), sandbox);
  let intercepted = false;
  listeners.fetch({
    request: { method: "GET", url: "https://massup.example/api/push-config" },
    respondWith() { intercepted = true; }
  });
  assert.equal(intercepted, false);
});

test("service worker still shows timer notifications while MASSUP is visible", async () => {
  const listeners = {};
  let shown = false;
  const sandbox = {
    URL,
    self: {
      location: { origin: "https://massup.example" },
      clients: { matchAll: async () => [{ visibilityState: "visible" }] },
      registration: { showNotification: async () => { shown = true; } },
      addEventListener(name, callback) { listeners[name] = callback; },
      skipWaiting() {}
    },
    caches: {}
  };
  vm.runInNewContext(fs.readFileSync("sw.js", "utf8"), sandbox);
  let pending;
  listeners.push({
    data: { json: () => ({ title: "Repos terminé", silentWhenVisible: false }) },
    waitUntil(promise) { pending = promise; }
  });
  await pending;
  assert.equal(shown, true);
});

test("natural timer completion keeps its server push queued", () => {
  const app = fs.readFileSync("app.js", "utf8");
  const restTimer = app.slice(app.indexOf("function startTimer("), app.indexOf("function updateTimerUI("));
  const liveTimer = app.slice(app.indexOf("function asTickFn()"), app.indexOf("function asUpdateWorkTimerUI("));
  const stopTimer = app.slice(app.indexOf("function stopTimer("), app.indexOf("function formatTime("));

  assert.doesNotMatch(restTimer, /updateWorkoutPushTimer\(null\)/);
  assert.doesNotMatch(liveTimer, /updateWorkoutPushTimer\(null\)/);
  assert.match(restTimer, /stopTimer\(sid,ei,true\)/);
  assert.match(stopTimer, /if\(!preservePush\) updateWorkoutPushTimer\(null\)/);
  // Annuler ne touche que les rappels FUTURS : un repos déjà fini part même si l'app est rouverte
  const shared = fs.readFileSync("push_timer.js", "utf8");
  assert.match(shared, /\.gt\('due_at',new Date\(\)\.toISOString\(\)\)/);
  const sql = fs.readFileSync("push_timer_fast.sql", "utf8");
  assert.match(sql, /status = 'pending'\s+and due_at > now\(\);/);
});

test("service worker still shows scheduled reminders while MASSUP is visible", async () => {
  const listeners = {};
  let shownOptions;
  const sandbox = {
    URL,
    self: {
      location: { origin: "https://massup.example" },
      clients: { matchAll: async () => [{ visibilityState: "visible" }] },
      registration: { showNotification: async (_title, options) => { shownOptions = options; } },
      addEventListener(name, callback) { listeners[name] = callback; },
      skipWaiting() {}
    },
    caches: {}
  };
  vm.runInNewContext(fs.readFileSync("sw.js", "utf8"), sandbox);
  let pending;
  listeners.push({
    data: { json: () => ({ title: "Bois de l’eau", silentWhenVisible: false, url: "/melati.html" }) },
    waitUntil(promise) { pending = promise; }
  });
  await pending;
  assert.equal(shownOptions.icon, "/imgs/melati_icon.png");
  assert.equal(shownOptions.data.url, "/melati.html");
});

test("push dispatcher rejects requests without the cron bearer token", async (t) => {
  const oldToken = process.env.PUSH_CRON_TOKEN;
  process.env.PUSH_CRON_TOKEN = "a".repeat(32);
  t.after(() => {
    if (oldToken === undefined) delete process.env.PUSH_CRON_TOKEN;
    else process.env.PUSH_CRON_TOKEN = oldToken;
  });

  const res = response();
  await dispatchHandler({ method: "POST", headers: { authorization: "Bearer wrong" } }, res);
  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { ok: false, error: "unauthorized" });
});

test("scheduled reminders combine water and missing sleep entry at matching times", () => {
  const state = {
    data: {
      reminders: {
        enabled: true,
        hydrationEnabled: true,
        hydrationTimes: ["08:30"],
        sleepLogEnabled: true,
        sleepLogTime: "08:30",
        workoutEnabled: false,
        bedtimeEnabled: false
      },
      sleepLog: {},
      rank: { pauses: [] },
      logs: []
    }
  };
  const reminders = scheduledReminders(state, { date: "2026-10-01", minute: 8 * 60 + 30 });

  assert.equal(reminders.length, 1);
  assert.equal(reminders[0].title, "Eau + sommeil");
  assert.match(reminders[0].body, /eau/i);
  assert.match(reminders[0].body, /nuit|sommeil/i);
  assert.equal(reminders[0].slot, "08:30");
});

test("hydration, workout and bedtime reminders rotate through the requested message counts", () => {
  const addDays = (date, offset) => {
    const value = new Date(date + "T12:00:00Z");
    value.setUTCDate(value.getUTCDate() + offset);
    return value.toISOString().slice(0, 10);
  };
  const bodiesFor = (count, time, configure) => {
    const bodies = new Set();
    for (let i = 0; i < count; i++) {
      const date = addDays("2026-10-01", i);
      const reminders = configure(date);
      bodies.add(scheduledReminders({
        data: { reminders, logs: [{ date: addDays(date, -2), sessions: ["s1"] }], rank: { pauses: [] } }
      }, { date, minute: Number(time.slice(0, 2)) * 60 + Number(time.slice(3)) })[0].body);
    }
    return bodies.size;
  };
  const quiet = { enabled: true, hydrationEnabled: false, workoutEnabled: false, sleepLogEnabled: false, bedtimeEnabled: false };

  assert.equal(bodiesFor(10, "08:30", () => ({ ...quiet, hydrationEnabled: true, hydrationTimes: ["08:30"] })), 10);
  assert.equal(bodiesFor(5, "12:00", () => ({ ...quiet, workoutEnabled: true, workoutNoonTime: "12:00" })), 5);
  assert.equal(bodiesFor(10, "18:00", () => ({ ...quiet, workoutEnabled: true, workoutEveningTime: "18:00" })), 10);
  assert.equal(bodiesFor(5, "23:30", () => ({ ...quiet, bedtimeEnabled: true, bedtimeTime: "23:30" })), 5);
});

test("workout encouragement starts two days after the last session and stops after starting", () => {
  const state = {
    data: {
      reminders: {
        enabled: true,
        hydrationEnabled: false,
        workoutEnabled: true,
        workoutNoonTime: "12:00",
        workoutEveningTime: "18:00",
        sleepLogEnabled: false,
        bedtimeEnabled: false
      },
      logs: [{ date: "2026-09-29", sessions: ["s1"] }],
      rank: { pauses: [] }
    }
  };
  const noon = scheduledReminders(state, { date: "2026-10-01", minute: 12 * 60 });
  assert.equal(noon.length, 1);
  assert.equal(noon[0].title, "On se fait une séance aujourd’hui ?");
  assert.ok(noon[0].body.length > 0);

  state.data.reminders.workoutStartedDate = "2026-10-01";
  const evening = scheduledReminders(state, { date: "2026-10-01", minute: 18 * 60 });
  assert.deepEqual(evening, []);
});

test("Melati session logs suppress reminders and its account receives its own scheduled reminders", () => {
  const state = {
    app: "melati",
    reminders: {
      enabled: true,
      hydrationEnabled: true,
      hydrationTimes: ["12:00"],
      workoutEnabled: true,
      workoutNoonTime: "12:00",
      workoutEveningTime: "18:00",
      sleepLogEnabled: false,
      bedtimeEnabled: false
    },
    logs: [{ date: "2026-10-01", sid: "A", exos: [{ k: "squat" }] }],
    rank: { pauses: [] }
  };
  const today = scheduledReminders(state, { date: "2026-10-01", minute: 12 * 60 });
  assert.equal(today.length, 1);
  assert.equal(today[0].title, "Bois de l’eau");

  state.logs = [{ date: "2026-09-29", sid: "A", exos: [{ k: "squat" }] }];
  const reminders = scheduledReminders(state, { date: "2026-10-01", minute: 12 * 60 });
  assert.equal(reminders.length, 1);
  assert.equal(reminders[0].title, "Eau + séance");
  assert.match(reminders[0].body, /eau/i);
  assert.match(reminders[0].body, /séance|salle|sport/i);
});

test("frozen dates suppress all scheduled reminders and workout timers", () => {
  const state = {
    data: {
      reminders: { enabled: true, hydrationTimes: ["08:30"] },
      rank: { pauses: [{ start: "2026-10-01", end: "2026-10-03" }] }
    }
  };
  assert.equal(isFrozen(state, "2026-10-02"), true);
  assert.deepEqual(scheduledReminders(state, { date: "2026-10-02", minute: 8 * 60 + 30 }), []);
});

test("timer push titles and bodies omit the duplicate MASSUP prefix", () => {
  assert.deepEqual(timerNotification({
    title: "MASSUP — repos terminé",
    body: "Temps de repos écoulé. Lance la série !"
  }), { title: "Repos terminé", body: "Lance ta prochaine série !" });
});

test("push dispatcher delivers timer alerts and reminders", async (t) => {
  const envKeys = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT", "PUSH_CRON_TOKEN"];
  const oldEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  const vapid = webpush.generateVAPIDKeys();
  Object.assign(process.env, {
    SUPABASE_URL: "https://supabase.example",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    VAPID_PUBLIC_KEY: vapid.publicKey,
    VAPID_PRIVATE_KEY: vapid.privateKey,
    VAPID_SUBJECT: "mailto:test@example.com",
    PUSH_CRON_TOKEN: "b".repeat(32)
  });
  const originalFetch = global.fetch;
  const originalSend = webpush.sendNotification;
  const requests = [];
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "UTC", year: "numeric", month: "2-digit", day: "2-digit",
    weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(now).reduce((out, part) => {
    if (part.type !== "literal") out[part.type] = part.value;
    return out;
  }, {});
  const dayOfWeek = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[parts.weekday];
  const subscription = {
    user_id: "00000000-0000-4000-8000-000000000001",
    endpoint: "https://web.push.apple.com/device",
    p256dh: "key",
    auth: "secret",
    time_zone: "UTC"
  };
  const unsafeSubscription = {
    ...subscription,
    endpoint: "http://127.0.0.1/admin"
  };
  const state = {
    user_id: subscription.user_id,
    app: "melati",
    data: {
      reminders: {
        enabled: true,
        hydrationEnabled: true,
        hydrationTimes: [parts.hour + ":" + parts.minute],
        workoutEnabled: false,
        sleepLogEnabled: false,
        bedtimeEnabled: false
      },
      logs: [],
      sleepLog: {},
      rank: { pauses: [] }
    }
  };
  const timerEvent = {
    id: "timer-event-1",
    subscription_endpoint: subscription.endpoint,
    due_at: new Date(Date.now() - 1000).toISOString(),
    title: "MASSUP — repos terminé",
    body: "Temps de repos écoulé. Lance la série !",
    attempt_count: 1
  };
  global.fetch = async (url, options) => {
    const parsed = new URL(url);
    requests.push({ path: parsed.pathname, query: parsed.searchParams, method: options.method });
    if (parsed.pathname.endsWith("/rpc/claim_due_push_timer_events")) {
      return { ok: true, status: 200, text: async () => JSON.stringify([timerEvent]) };
    }
    if (parsed.pathname.endsWith("/push_timer_events") && options.method === "PATCH") {
      return { ok: true, status: 204, text: async () => "" };
    }
    if (parsed.pathname.endsWith("/push_schedule_deliveries")) {
      if (options.method === "POST") return { ok: true, status: 201, text: async () => JSON.stringify([{ user_id: subscription.user_id }]) };
      if (options.method === "DELETE") return { ok: true, status: 204, text: async () => "" };
      return { ok: true, status: 200, text: async () => "[]" };
    }
    if (parsed.pathname.endsWith("/push_subscriptions")) {
      if (options.method === "DELETE") return { ok: true, status: 204, text: async () => "" };
      return { ok: true, status: 200, text: async () => JSON.stringify([subscription, unsafeSubscription]) };
    }
    if (parsed.pathname.endsWith("/user_state")) {
      return { ok: true, status: 200, text: async () => JSON.stringify([state]) };
    }
    if (parsed.pathname.endsWith("/push_deliveries") && options.method === "POST") {
      return { ok: true, status: 201, text: async () => JSON.stringify([{ user_id: subscription.user_id }]) };
    }
    if (parsed.pathname.endsWith("/push_deliveries")) {
      return { ok: true, status: 200, text: async () => "[]" };
    }
    throw new Error("Unexpected request path: " + parsed.pathname);
  };
  const sentPayloads = [];
  webpush.sendNotification = async (_sub, payload) => { sentPayloads.push(JSON.parse(payload)); return {}; };
  t.after(() => {
    global.fetch = originalFetch;
    webpush.sendNotification = originalSend;
    envKeys.forEach((key) => {
      if (oldEnv[key] === undefined) delete process.env[key];
      else process.env[key] = oldEnv[key];
    });
  });

  const res = response();
  await dispatchHandler({
    method: "POST",
    headers: { authorization: "Bearer " + process.env.PUSH_CRON_TOKEN }
  }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.delivered, 2);
  assert.equal(res.body.removed, 1);
  assert.equal(sentPayloads[0].title, "Repos terminé");
  assert.equal(sentPayloads[0].body, "Lance ta prochaine série !");
  assert.equal(sentPayloads[0].silentWhenVisible, false);
  assert.equal(sentPayloads[0].url, "/melati.html");
  assert.equal(sentPayloads[1].title, "Bois de l’eau");
  assert.match(sentPayloads[1].body, /eau|gorgée|hydratation|boire|verre/i);
  assert.equal(sentPayloads[1].url, "/melati.html");
  assert.ok(requests.some((item) => item.path.endsWith("/rpc/claim_due_push_timer_events")));
  assert.ok(requests.some((item) => item.method === "POST" && item.query.get("on_conflict") === "user_id,kind,local_date,slot"));
  const stateRequest = requests.filter((item) => item.path.endsWith("/user_state")).pop();
  assert.match(stateRequest.query.get("select"), /reminders:data->reminders/);
  // Rappel eau seul : l'historique (logs, sommeil) n'est pas téléchargé
  assert.ok(!requests.some((item) => item.path.endsWith("/user_state") && /logs/.test(item.query.get("select") || "")));
});

test("dispatcher reads the fast timer mode from JSON or string bodies", () => {
  assert.equal(requestMode({ body: { mode: "timers" } }), "timers");
  assert.equal(requestMode({ body: "{\"mode\":\"timers\"}" }), "timers");
  assert.equal(requestMode({ body: {} }), "all");
  assert.equal(requestMode({ body: "not json" }), "all");
  assert.equal(requestMode({}), "all");
});

function withDispatchEnv(t) {
  const envKeys = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT", "PUSH_CRON_TOKEN"];
  const oldEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  const vapid = webpush.generateVAPIDKeys();
  Object.assign(process.env, {
    SUPABASE_URL: "https://supabase.example",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    VAPID_PUBLIC_KEY: vapid.publicKey,
    VAPID_PRIVATE_KEY: vapid.privateKey,
    VAPID_SUBJECT: "mailto:test@example.com",
    PUSH_CRON_TOKEN: "c".repeat(32)
  });
  const originalFetch = global.fetch;
  const originalSend = webpush.sendNotification;
  t.after(() => {
    global.fetch = originalFetch;
    webpush.sendNotification = originalSend;
    envKeys.forEach((key) => {
      if (oldEnv[key] === undefined) delete process.env[key];
      else process.env[key] = oldEnv[key];
    });
  });
}

test("fast timer mode stops after the claim when nothing is due", async (t) => {
  withDispatchEnv(t);
  const paths = [];
  global.fetch = async (url) => {
    const path = new URL(url).pathname;
    paths.push(path);
    if (path.endsWith("/rpc/claim_due_push_timer_events")) return { ok: true, status: 200, text: async () => "[]" };
    throw new Error("Unexpected request path: " + path);
  };
  const res = response();
  await dispatchHandler({ method: "POST", body: { mode: "timers" }, headers: { authorization: "Bearer " + process.env.PUSH_CRON_TOKEN } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true, delivered: 0, removed: 0 });
  assert.deepEqual(paths, ["/rest/v1/rpc/claim_due_push_timer_events"]);
});

test("fast timer mode sends due timers without loading workout logs or scheduled reminders", async (t) => {
  withDispatchEnv(t);
  const subscription = { user_id: "00000000-0000-4000-8000-000000000002", endpoint: "https://web.push.apple.com/adrien", p256dh: "k", auth: "a", time_zone: "Europe/Paris" };
  const requests = [];
  global.fetch = async (url, options) => {
    const parsed = new URL(url);
    requests.push({ path: parsed.pathname, query: parsed.searchParams, method: options.method, body: options.body });
    if (parsed.pathname.endsWith("/rpc/claim_due_push_timer_events")) {
      return { ok: true, status: 200, text: async () => JSON.stringify([{ id: "e1", subscription_endpoint: subscription.endpoint, due_at: new Date().toISOString(), title: "Repos terminé", body: "Lance ta prochaine série !", attempt_count: 1 }]) };
    }
    if (parsed.pathname.endsWith("/push_subscriptions")) return { ok: true, status: 200, text: async () => JSON.stringify([subscription]) };
    if (parsed.pathname.endsWith("/user_state")) return { ok: true, status: 200, text: async () => JSON.stringify([{ user_id: subscription.user_id, app: null, rank: { pauses: [] } }]) };
    if (parsed.pathname.endsWith("/push_timer_events") && options.method === "PATCH") return { ok: true, status: 204, text: async () => "" };
    throw new Error("Unexpected request path: " + parsed.pathname);
  };
  const sent = [];
  webpush.sendNotification = async (_sub, payload, options) => { sent.push({ payload: JSON.parse(payload), options }); return {}; };
  const res = response();
  await dispatchHandler({ method: "POST", body: { mode: "timers" }, headers: { authorization: "Bearer " + process.env.PUSH_CRON_TOKEN } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.delivered, 1);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].payload.title, "Repos terminé");
  assert.equal(sent[0].payload.url, "/");
  assert.equal(sent[0].options.urgency, "high");
  const stateRequest = requests.find((item) => item.path.endsWith("/user_state"));
  assert.doesNotMatch(stateRequest.query.get("select"), /logs/);
  assert.ok(!requests.some((item) => item.path.endsWith("/push_schedule_deliveries")));
  assert.equal(JSON.parse(requests.find((item) => item.method === "PATCH").body).status, "sent");
});

function loadPushTimer({ fetchImpl, client, enabled = () => true }) {
  const listeners = {};
  const sandbox = {
    console,
    Promise,
    Date,
    JSON,
    fetch: fetchImpl,
    navigator: { serviceWorker: { ready: Promise.resolve({ pushManager: { getSubscription: async () => ({ endpoint: "https://web.push.apple.com/me" }) } }) } },
    document: { visibilityState: "visible", addEventListener(name, callback) { listeners[name] = callback; } },
    window: { addEventListener(name, callback) { listeners["window:" + name] = callback; } }
  };
  vm.runInNewContext(fs.readFileSync("push_timer.js", "utf8"), sandbox);
  const errors = [];
  const timer = sandbox.PushTimer.create({ url: "https://sb.example", key: "anon", client, enabled, onError: (error) => errors.push(error.message) });
  return { timer, listeners, sandbox, errors };
}

const fakeSession = { access_token: "jwt", user: { id: "u1" } };

test("rest timer push is scheduled with a single keepalive RPC request", async () => {
  const calls = [];
  const client = { auth: { getSession: async () => ({ data: { session: fakeSession } }) }, from() { throw new Error("legacy path must not run"); } };
  const { timer, errors } = loadPushTimer({
    client: () => client,
    fetchImpl: async (url, options) => { calls.push({ url, options }); return { ok: true, status: 204, text: async () => "" }; }
  });
  const due = Date.now() + 90000;
  await timer.update(due, "Repos terminé", "Lance ta prochaine série !");
  assert.deepEqual(errors, []);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://sb.example/rest/v1/rpc/schedule_push_timer");
  assert.equal(calls[0].options.keepalive, true);
  assert.equal(calls[0].options.headers.Authorization, "Bearer jwt");
  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.p_endpoint, "https://web.push.apple.com/me");
  assert.equal(body.p_due_at, new Date(due).toISOString());
});

test("superseded timer requests are skipped and disabled reminders only cancel", async () => {
  const bodies = [];
  const client = { auth: { getSession: async () => ({ data: { session: fakeSession } }) } };
  let allowed = true;
  const { timer } = loadPushTimer({
    client: () => client,
    enabled: () => allowed,
    fetchImpl: async (_url, options) => { bodies.push(JSON.parse(options.body)); return { ok: true, status: 204, text: async () => "" }; }
  });
  timer.update(null);
  await timer.update(Date.now() + 60000, "Repos terminé", "Go");
  assert.equal(bodies.length, 1);
  assert.ok(bodies[0].p_due_at);
  allowed = false;
  await timer.update(Date.now() + 60000, "Repos terminé", "Go");
  assert.equal(bodies[1].p_due_at, null);
});

test("timer push falls back to the two-step insert until push_timer_fast.sql is installed", async () => {
  const ops = [];
  const query = (table) => {
    const chain = {
      update(value) { ops.push(["update", table, value]); return chain; },
      eq(column, value) { ops.push(["eq", column, value]); return chain; },
      gt(column) { ops.push(["gt", column]); return Promise.resolve({ error: null }); },
      insert(value) { ops.push(["insert", table, value]); return Promise.resolve({ error: null }); }
    };
    return chain;
  };
  const client = { auth: { getSession: async () => ({ data: { session: fakeSession } }) }, from: query };
  let rpcCalls = 0;
  const { timer, errors } = loadPushTimer({
    client: () => client,
    fetchImpl: async () => { rpcCalls++; return { ok: false, status: 404, text: async () => '{"code":"PGRST202"}' }; }
  });
  await timer.update(Date.now() + 60000, "Repos terminé", "Go");
  await timer.update(Date.now() + 90000, "Repos terminé", "Go");
  assert.deepEqual(errors, []);
  assert.equal(rpcCalls, 1, "the missing RPC is only probed once");
  assert.ok(ops.some((op) => op[0] === "gt" && op[1] === "due_at"));
  assert.equal(ops.filter((op) => op[0] === "insert").length, 2);
});

test("an unconfirmed timer request is re-sent when the app goes to the background", async () => {
  let release;
  const calls = [];
  const client = { auth: { getSession: async () => ({ data: { session: fakeSession } }) } };
  const { timer, listeners, sandbox } = loadPushTimer({
    client: () => client,
    fetchImpl: (url, options) => {
      calls.push(JSON.parse(options.body));
      if (calls.length === 1) return new Promise((resolve) => { release = () => resolve({ ok: true, status: 204, text: async () => "" }); });
      return Promise.resolve({ ok: true, status: 204, text: async () => "" });
    }
  });
  const pending = timer.update(Date.now() + 60000, "Repos terminé", "Go");
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(calls.length, 1);
  sandbox.document.visibilityState = "hidden";
  listeners.visibilitychange();
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(calls.length, 2, "flush bypasses the stuck queue");
  assert.equal(calls[1].p_due_at, calls[0].p_due_at);
  release();
  await pending;
  listeners.visibilitychange();
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(calls.length, 2, "a confirmed request is not re-sent");
});

test("workout logs and sleep entries are only needed when their reminder slot is due", () => {
  const reminders = { enabled: true, workoutEnabled: true, workoutNoonTime: "12:00", workoutEveningTime: "18:00", sleepLogEnabled: true, sleepLogTime: "08:30" };
  assert.equal(needsHistory({ reminders }, { minute: 12 * 60 + 2 }), true);
  assert.equal(needsHistory({ reminders }, { minute: 8 * 60 + 30 }), true);
  assert.equal(needsHistory({ reminders }, { minute: 15 * 60 }), false);
  assert.equal(needsHistory({ reminders: { ...reminders, enabled: false } }, { minute: 12 * 60 }), false);
  assert.equal(needsHistory({ reminders: { ...reminders, workoutEnabled: false, sleepLogEnabled: false } }, { minute: 12 * 60 }), false);
});
