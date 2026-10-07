"use strict";

module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ enabled: false, error: "method_not_allowed" });
  }
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) return res.status(503).json({ enabled: false, error: "push_not_configured" });
  return res.status(200).json({ enabled: true, publicKey });
};
