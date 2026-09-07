import { v4 as uuidv4 } from "uuid";
import * as rateLimitModel from "../models/rateLimitModel.js";
import { AppError } from "../utils/AppError.js";

const MAX_MESSAGES_PER_HOUR = 10;

// Layer 2 — the actual business rule (1 message per item per device per hour).
// Distinct from the express-rate-limit IP throttle in middleware/rateLimiter.js.
export async function assertNotRateLimited(itemId, deviceHash) {
  const count = await rateLimitModel.countRecentSends(itemId, deviceHash);
  if (count >= MAX_MESSAGES_PER_HOUR) {
    throw new AppError(
      "RATE_LIMITED",
      "You already sent a message for this item recently. Try again later.",
      429,
    );
  }
}

export async function logSend(itemId, deviceHash) {
  await rateLimitModel.logSend({ id: uuidv4(), itemId, deviceHash });
}

export async function pruneOldEntries() {
  const deleted = await rateLimitModel.pruneOlderThan24h();
  if (deleted > 0) console.log(`Pruned ${deleted} stale rate-limit rows`);
}
