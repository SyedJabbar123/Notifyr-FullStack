import rateLimit from "express-rate-limit";
import env from "../config/env.js";

// Layer 1 — coarse IP throttle. Cheap, in-memory, resets on deploy.
// This is NOT the "1 message per hour per device" business rule — that lives in
// rateLimitService.js and is backed by the message_rate_limits table.
export const publicRouteThrottle = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Slow down and try again shortly",
    },
  },
});

// Stricter throttle for login/password endpoints — prevents unlimited brute-force
// attempts against a single account. Tighter window+cap than general public traffic.
export const authRouteThrottle = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "TOO_MANY_ATTEMPTS",
      message: "Too many attempts — try again in 15 minutes",
    },
  },
});
