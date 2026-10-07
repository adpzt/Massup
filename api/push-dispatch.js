"use strict";

const crypto = require("node:crypto");
const webpush = require("web-push");

const SUPABASE_URL = (process.env.SUPABASE_URL || "https://xtcmvbzjcpewivhnvvwz.supabase.co").replace(/\/+$/, "");
const REST_URL = SUPABASE_URL + "/rest/v1/";

function authorized(req) {
  const expected = process.env.PUSH_CRON_TOKEN || "";
  const actual = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(actual);
  if (expectedBytes.length < 32 || actualBytes.length !== expectedBytes.length) return false;
  return crypto.timingSafeEqual(actualBytes, expectedBytes);
}

async function rest(path, options) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  const response = await fetch(REST_URL + path, {
    method: options.method || "GET",
    headers: {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {})
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {})
  });
  const text = await response.text();
  if (!response.ok) throw new Error("Supabase REST " + response.status + ": " + text.slice(0, 300));
  return text ? JSON.parse(text) : [];
}

function localClock(timeZone, now) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now).reduce((out, part) => {
    if (part.type !== "literal") out[part.type] = part.value;
    return out;
  }, {});
  const dow = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[parts.weekday];
  return {
    date: parts.year + "-" + parts.month + "-" + parts.day,
    dow,
    minute: Number(parts.hour) * 60 + Number(parts.minute)
  };
}

function dueAt(configuredTime, currentMinute) {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(configuredTime || "")) return false;
  const [hour, minute] = configuredTime.split(":").map(Number);
  const target = hour * 60 + minute;
  return currentMinute >= target && currentMinute <= target + 4;
}

function daysSince(lastDate, today) {
  if (!lastDate) return 999;
  return Math.floor((Date.parse(today + "T00:00:00Z") - Date.parse(lastDate + "T00:00:00Z")) / 86400000);
}

function allowedEndpoint(endpoint) {
  let url;
  try {
    url = new URL(endpoint);
  } catch (error) {
    return false;
  }
  if (url.protocol !== "https:" || (url.port && url.port !== "443")) return false;
  const host = url.hostname.toLowerCase();
  return host === "fcm.googleapis.com"
    || host === "web.push.apple.com"
    || host.endsWith(".push.apple.com")
    || host === "push.services.mozilla.com"
    || host.endsWith(".push.services.mozilla.com")
    || host.endsWith(".notify.windows.com");
}

const WATER_MESSAGES = [
  "Une petite pause pour boire un verre d’eau 💧",
  "Hydratation check : quelques gorgées et on repart !",
  "Ton rappel tout doux : pense à boire un peu d’eau.",
  "Le corps avance mieux quand on pense aussi à l’eau 💦",
  "Petite mission du moment : remplir ton verre.",
  "Une gorgée maintenant, et tu continues ta journée tranquille.",
  "Pause hydratation ! Ton prochain verre t’attend.",
  "On fait le plein d’eau ? Quelques gorgées suffisent pour y penser.",
  "Petit rappel frais : bois un peu d’eau 🫗",
  "Tu as pensé à boire de l’eau aujourd’hui ? C’est le moment d’y faire un tour."
];
const NOON_WORKOUT_MESSAGES = [
  "On se fait une séance aujourd’hui ? Même une courte compte 💪",
  "Une séance dans le programme aujourd’hui ? La salle t’attend !",
  "Et si tu t’offrais un petit moment pour toi à la salle ?",
  "Le plus dur, c’est souvent de commencer. On y va aujourd’hui ?",
  "Tu as un créneau aujourd’hui pour une séance ? 🔥"
];
const EVENING_WORKOUT_MESSAGES = [
  "Allez go, on va au sport ! La première série lance la machine.",
  "C’est le moment : chaussures, musique, et direction la salle 💪",
  "Une séance imparfaite vaut mieux qu’une séance repoussée. Go !",
  "La salle t’attend. On y va pour une série, puis on avise.",
  "Allez, petit pas vers la salle — le reste suivra 🔥",
  "Tu peux le faire : on pose le téléphone et on démarre la séance.",
  "Go au sport ! Ton toi de demain sera content d’y être allé.",
  "Il est encore temps de bouger un peu. On lance la séance ?",
  "On enfile les baskets et on y va. Pas besoin d’attendre la motivation !",
  "C’est parti pour le sport — quelques minutes suffisent pour démarrer."
];
const BEDTIME_MESSAGES = [
  "On pense à ralentir et à préparer la nuit 🌙",
  "La journée peut attendre demain. Place au repos.",
  "Petit signal pour couper et aller te coucher.",
  "Il est temps de poser le téléphone et de récupérer 😴",
  "Direction le lit : demain, tu seras content d’avoir dormi."
];
const SLEEP_LOG_MESSAGES = [
  "Entre les heures de ta nuit dans MASSUP, ça prend quelques secondes.",
  "Tu peux noter ta nuit d’hier dans MASSUP quand tu as un instant.",
  "Petit rappel sommeil : renseigne tes heures approximatives de la nuit.",
  "Pense à noter quand tu as essayé de dormir et quand tu t’es réveillé.",
  "On garde un petit repère ? Entre les heures de ta nuit dans MASSUP."
];

function reminderVariant(messages, date, time) {
  const day = Math.floor(Date.parse(date + "T00:00:00Z") / 86400000);
  const slot = Number((time || "00:00").replace(":", ""));
  return messages[(day + slot) % messages.length];
}

function isFrozen(state, date) {
  const db = state.data || state;
  const pauses = db.rank && Array.isArray(db.rank.pauses) ? db.rank.pauses : [];
  return pauses.some((pause) => pause.start <= date && date <= pause.end);
}

function lastSessionDate(db) {
  return (db.logs || []).filter(hasWorkout).reduce((latest, log) => {
    return !latest || log.date > latest ? log.date : latest;
  }, null);
}

function hasWorkout(log) {
  return (Array.isArray(log.sessions) && log.sessions.length > 0)
    || !!log.sid
    || (Array.isArray(log.exos) && log.exos.length > 0);
}

function addScheduledItem(groups, clock, time, type, title, body) {
  if (!dueAt(time, clock.minute)) return;
  const group = groups.get(time) || { kind: "scheduled", slot: time, items: [] };
  if (group.items.some((item) => item.type === type)) return;
  group.items.push({ type, title, body });
  groups.set(time, group);
}

// (07/10) Les logs (historique complet des séances) et le journal de sommeil ne servent qu'aux rappels
// séance / sommeil : on ne les télécharge que quand l'un de ces créneaux tombe, pas chaque minute.
function needsHistory(state, clock) {
  const db = state.data || state;
  const reminders = db.reminders || {};
  if (reminders.enabled !== true) return false;
  if (reminders.workoutEnabled !== false
    && (dueAt(reminders.workoutNoonTime || "12:00", clock.minute) || dueAt(reminders.workoutEveningTime || "18:00", clock.minute))) return true;
  return reminders.sleepLogEnabled !== false && dueAt(reminders.sleepLogTime || "08:30", clock.minute);
}

function scheduledReminders(state, clock) {
  const db = state.data || state;
  const reminders = db.reminders || {};
  if (reminders.enabled !== true || isFrozen(state, clock.date)) return [];
  const groups = new Map();
  const waterTimes = Array.isArray(reminders.hydrationTimes)
    ? reminders.hydrationTimes
    : ["08:30", "11:00", "14:30", "17:00", "19:00", "21:00"];
  if (reminders.hydrationEnabled !== false) {
    Array.from(new Set(waterTimes)).forEach((time) => {
      if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time || "")) {
        addScheduledItem(groups, clock, time, "water", "Bois de l’eau", reminderVariant(WATER_MESSAGES, clock.date, time));
      }
    });
  }

  const startedToday = reminders.workoutStartedDate === clock.date;
  const trainedToday = (db.logs || []).some((log) => log.date === clock.date && hasWorkout(log));
  const lastDate = lastSessionDate(db);
  const inactivityDays = daysSince(lastDate, clock.date);
  const shouldPrompt = reminders.workoutEnabled !== false
    && !startedToday && !trainedToday && lastDate && inactivityDays >= 2;
  if (shouldPrompt) {
    const noonTime = reminders.workoutNoonTime || "12:00";
    const eveningTime = reminders.workoutEveningTime || "18:00";
    addScheduledItem(groups, clock, noonTime, "workout", "On se fait une séance aujourd’hui ?", reminderVariant(NOON_WORKOUT_MESSAGES, clock.date, noonTime));
    addScheduledItem(groups, clock, eveningTime, "workout", "Allez, go au sport !", reminderVariant(EVENING_WORKOUT_MESSAGES, clock.date, eveningTime));
  }

  if (reminders.sleepLogEnabled !== false) {
    const sleepTime = reminders.sleepLogTime || "08:30";
    if (dueAt(sleepTime, clock.minute)) {
      const yesterday = new Date(Date.parse(clock.date + "T12:00:00Z") - 86400000).toISOString().slice(0, 10);
      const sleep = db.sleepLog && db.sleepLog[yesterday];
      if (!sleep || !sleep.bed || !sleep.wake) {
        addScheduledItem(groups, clock, sleepTime, "sleep", "Entre ta durée de sommeil", reminderVariant(SLEEP_LOG_MESSAGES, clock.date, sleepTime));
      }
    }
  }

  if (reminders.bedtimeEnabled !== false) {
    const bedtime = reminders.bedtimeTime || "23:30";
    addScheduledItem(groups, clock, bedtime, "bedtime", "Va dodo 🌙", reminderVariant(BEDTIME_MESSAGES, clock.date, bedtime));
  }

  return Array.from(groups.values()).map((group) => {
    const types = new Set(group.items.map((item) => item.type));
    const title = group.items.length === 1 ? group.items[0].title
      : types.has("water") && types.has("sleep") ? "Eau + sommeil"
        : types.has("water") && types.has("workout") ? "Eau + séance"
          : "Petit rappel";
    return { kind: group.kind, slot: group.slot, title, body: group.items.map((item) => item.body).join(" ") };
  });
}

function timerNotification(event) {
  const title = event.title.replace(/^MASSUP\s*[—-]\s*/i, "");
  if (/repos terminé/i.test(title)) return { title: "Repos terminé", body: "Lance ta prochaine série !" };
  if (/chrono terminé/i.test(title)) return { title: "Temps écoulé", body: "Ton exercice est terminé." };
  return { title, body: event.body };
}

// Le Cron « massup-push-timers » (toutes les 5 s, cf. push_timer_fast.sql) n'appelle ce endpoint
// que lorsqu'un chrono arrive à échéance ; le Cron minute fait le reste (rappels programmés).
async function claimDueTimerEvents() {
  return rest("rpc/claim_due_push_timer_events", { method: "POST", body: {} });
}

function requestMode(req) {
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (error) { body = null; }
  }
  return body && body.mode === "timers" ? "timers" : "all";
}

async function dispatchDueTimerEvents(events, subscriptions, stateByUser) {
  const byEndpoint = new Map(subscriptions.map((item) => [item.endpoint, item]));
  let delivered = 0, removed = 0;
  for (const event of events) {
    const subscription = byEndpoint.get(event.subscription_endpoint);
    const ownerState = subscription && stateByUser.get(subscription.user_id);
    if (ownerState) {
      const timeZone = subscription.time_zone || "UTC";
      let local;
      try {
        local = localClock(timeZone, new Date());
      } catch (error) {
        console.warn("[MASSUP] Timer push skipped: invalid time zone for user", subscription.user_id);
        await rest("push_timer_events?" + new URLSearchParams({ id: "eq." + event.id }), {
          method: "PATCH", body: { status: "cancelled", claimed_at: null }
        });
        continue;
      }
      if (isFrozen(ownerState, local.date)) {
        await rest("push_timer_events?" + new URLSearchParams({ id: "eq." + event.id }), {
          method: "PATCH", body: { status: "cancelled", claimed_at: null }
        });
        continue;
      }
    }
    if (!subscription || !allowedEndpoint(subscription.endpoint)) {
      if (subscription) {
        await rest("push_subscriptions?" + new URLSearchParams({ endpoint: "eq." + subscription.endpoint }), { method: "DELETE" });
        removed++;
      } else {
        await rest("push_timer_events?" + new URLSearchParams({ id: "eq." + event.id }), {
          method: "PATCH",
          body: { status: "failed", claimed_at: null }
        });
      }
      continue;
    }
    try {
      await webpush.sendNotification({
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth }
      }, JSON.stringify({
        ...timerNotification(event),
        tag: "massup-timer-" + event.id,
        silentWhenVisible: false,
        url: ownerState && ownerState.app === "melati" ? "/melati.html" : "/"
      }), { TTL: 300, urgency: "high" });
      await rest("push_timer_events?" + new URLSearchParams({
        id: "eq." + event.id,
        status: "eq.processing"
      }), { method: "PATCH", body: { status: "sent", claimed_at: null } });
      delivered++;
    } catch (error) {
      const status = error.statusCode || 0;
      if (status === 404 || status === 410) {
        await rest("push_subscriptions?" + new URLSearchParams({ endpoint: "eq." + subscription.endpoint }), { method: "DELETE" });
        removed++;
      } else {
        await rest("push_timer_events?" + new URLSearchParams({
          id: "eq." + event.id,
          status: "eq.processing"
        }), {
          method: "PATCH",
          body: {
            status: event.attempt_count >= 3 ? "failed" : "pending",
            claimed_at: null
          }
        });
        console.warn("[MASSUP] Timer push delivery failed:", status || error.message);
      }
    }
  }
  return { delivered, removed };
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  if (!authorized(req)) return res.status(401).json({ ok: false, error: "unauthorized" });
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) return res.status(503).json({ ok: false, error: "push_not_configured" });

  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    const mode = requestMode(req);
    // Les chronos d'abord : la requête la plus urgente, et souvent la seule utile.
    const events = await claimDueTimerEvents();
    if (mode === "timers" && !events.length) return res.status(200).json({ ok: true, delivered: 0, removed: 0 });
    const subscriptions = await rest("push_subscriptions?select=user_id,endpoint,p256dh,auth,time_zone,updated_at&order=updated_at.desc", {});
    let timerResult = { delivered: 0, removed: 0 };
    if (events.length) {
      const endpoints = new Set(events.map((event) => event.subscription_endpoint));
      const timerUsers = Array.from(new Set(subscriptions.filter((item) => endpoints.has(item.endpoint)).map((item) => item.user_id)));
      const timerStates = timerUsers.length ? await rest("user_state?" + new URLSearchParams({
        select: "user_id,app:data->>app,rank:data->rank",
        user_id: "in.(" + timerUsers.join(",") + ")"
      }).toString(), {}) : [];
      timerResult = await dispatchDueTimerEvents(events, subscriptions, new Map(timerStates.map((item) => [item.user_id, item])));
    }
    if (mode === "timers" || !subscriptions.length) {
      return res.status(200).json({ ok: true, delivered: timerResult.delivered, removed: timerResult.removed });
    }
    const ids = Array.from(new Set(subscriptions.map((item) => item.user_id)));
    const states = await rest("user_state?" + new URLSearchParams({
      select: "user_id,app:data->>app,reminders:data->reminders,rank:data->rank",
      user_id: "in.(" + ids.join(",") + ")"
    }).toString(), {});
    const stateByUser = new Map(states.map((item) => [item.user_id, item]));
    const zoneByUser = new Map();
    subscriptions.forEach((item) => { if (!zoneByUser.has(item.user_id)) zoneByUser.set(item.user_id, item.time_zone || "UTC"); });
    const historyIds = states.filter((item) => {
      try {
        return needsHistory(item, localClock(zoneByUser.get(item.user_id) || "UTC", new Date()));
      } catch (error) {
        return false;
      }
    }).map((item) => item.user_id);
    if (historyIds.length) {
      const histories = await rest("user_state?" + new URLSearchParams({
        select: "user_id,logs:data->logs,sleepLog:data->sleepLog",
        user_id: "in.(" + historyIds.join(",") + ")"
      }).toString(), {});
      histories.forEach((item) => {
        const state = stateByUser.get(item.user_id);
        if (state) Object.assign(state, { logs: item.logs, sleepLog: item.sleepLog });
      });
    }
    const deliveries = await rest("push_schedule_deliveries?" + new URLSearchParams({
      select: "user_id,kind,local_date,slot",
      user_id: "in.(" + ids.join(",") + ")",
      local_date: "gte." + new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10)
    }).toString(), {});
    const sent = new Set(deliveries.map((item) => [item.user_id, item.kind, item.local_date, item.slot].join("|")));
    const byUser = new Map();
    subscriptions.forEach((item) => {
      const list = byUser.get(item.user_id) || [];
      list.push(item);
      byUser.set(item.user_id, list);
    });
    let delivered = timerResult.delivered, removed = timerResult.removed;
    for (const [userId, userSubscriptions] of byUser) {
      const state = stateByUser.get(userId);
      if (!state) continue;
      const timeZone = userSubscriptions[0].time_zone || "UTC";
      let clock;
      try {
        clock = localClock(timeZone, new Date());
      } catch (error) {
        console.warn("[MASSUP] Push skipped: invalid time zone for user", userId);
        continue;
      }
      const reminders = scheduledReminders(state, clock);
      for (const reminder of reminders) {
        const key = [userId, reminder.kind, clock.date, reminder.slot].join("|");
        if (sent.has(key)) continue;
        const claim = await rest("push_schedule_deliveries?on_conflict=user_id,kind,local_date,slot", {
          method: "POST",
          prefer: "resolution=ignore-duplicates,return=representation",
          body: { user_id: userId, kind: reminder.kind, local_date: clock.date, slot: reminder.slot }
        });
        if (!claim.length) continue;
        const payload = JSON.stringify({
          title: reminder.title,
          body: reminder.body,
          tag: "massup-" + reminder.kind + "-" + clock.date.replace(/-/g, "") + "-" + reminder.slot.replace(/:/g, ""),
          silentWhenVisible: false,
          url: state.app === "melati" ? "/melati.html" : "/"
        });
        let userDelivered = false;
        for (const subscription of userSubscriptions) {
          if (!allowedEndpoint(subscription.endpoint)) {
            await rest("push_subscriptions?" + new URLSearchParams({ endpoint: "eq." + subscription.endpoint }), { method: "DELETE" });
            removed++;
            console.warn("[MASSUP] Removed a subscription with an unsupported push endpoint");
            continue;
          }
          try {
            await webpush.sendNotification({
              endpoint: subscription.endpoint,
              keys: { p256dh: subscription.p256dh, auth: subscription.auth }
            }, payload, { TTL: 300, urgency: "normal" });
            delivered++;
            userDelivered = true;
          } catch (error) {
            const status = error.statusCode || 0;
            if (status === 404 || status === 410) {
              await rest("push_subscriptions?" + new URLSearchParams({ endpoint: "eq." + subscription.endpoint }), { method: "DELETE" });
              removed++;
            } else {
              console.warn("[MASSUP] Push delivery failed:", status || error.message);
            }
          }
        }
        if (!userDelivered) {
          await rest("push_schedule_deliveries?" + new URLSearchParams({
            user_id: "eq." + userId,
            kind: "eq." + reminder.kind,
            local_date: "eq." + clock.date,
            slot: "eq." + reminder.slot
          }), { method: "DELETE" });
        }
      }
    }
    return res.status(200).json({ ok: true, delivered, removed });
  } catch (error) {
    console.error("[MASSUP] Push dispatch failed:", error.message);
    return res.status(502).json({ ok: false, error: "push_dispatch_failed" });
  }
};

module.exports._test = { scheduledReminders, isFrozen, timerNotification, requestMode, needsHistory };
