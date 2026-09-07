import * as itemModel from "../models/itemModel.js";
import { signVerifyToken } from "../utils/jwt.js";
import * as messageService from "../services/messageService.js";
import { AppError } from "../utils/AppError.js";
import { isGlobalDndActiveNow } from "../services/dndService.js";
// In-memory verify-attempt cooldown. Short-lived and low-volume, so a Map is fine —
// no need for a DB table here (see design doc §4).
const verifyAttempts = new Map(); // key: deviceHash+qrId -> { count, lockedUntil }
const MAX_ATTEMPTS = 3;
const COOLDOWN_MS = 15 * 60 * 1000; // 15 min, matching the handoff doc

// Per-item status='dnd' always wins. Otherwise, if the item is 'active' but the
// owner's global schedule says DND right now, treat it as dnd too. 'lost' is left
// alone regardless of DND — a lost item should stay reachable.
function effectiveStatus(item) {
  if (
    item.status === "active" &&
    isGlobalDndActiveNow(item.global_dnd_schedule)
  ) {
    return "dnd";
  }
  return item.status;
}

export async function getItemLanding(req, res, next) {
  try {
    const item = await itemModel.findPublicByQrId(req.params.qrId);
    if (!item)
      return next(new AppError("NOT_FOUND", "This code isn't registered", 404));

    // camelCase + field names matching the finder portal's documented contract.
    // Strip everything internal (owner_id, pin_code) before this reaches the finder.
    res.status(200).json({
      category: item.category,
      nickname: item.nickname,
      itemPhotoUrl: item.hide_photo_public ? undefined : item.item_photo_url,
      status: effectiveStatus(item), // active | dnd | lost
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyPresence(req, res, next) {
  try {
    const { qrId, input } = req.body;
    const key = `${req.deviceHash}:${qrId}`;
    const attempt = verifyAttempts.get(key) || { count: 0, lockedUntil: 0 };

    if (Date.now() < attempt.lockedUntil) {
      return next(
        new AppError(
          "TOO_MANY_ATTEMPTS",
          "Too many attempts — try again later",
          429,
        ),
      );
    }

    const item = await itemModel.findPublicByQrId(qrId);
    if (!item)
      return next(new AppError("NOT_FOUND", "This code isn't registered", 404));

    const isCorrect =
      input.trim().toLowerCase() === String(item.pin_code).trim().toLowerCase();

    if (!isCorrect) {
      attempt.count += 1;
      const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - attempt.count);
      if (attempt.count >= MAX_ATTEMPTS) {
        attempt.lockedUntil = Date.now() + COOLDOWN_MS;
        attempt.count = 0;
      }
      verifyAttempts.set(key, attempt);
      // 200, not 401 — this is an expected outcome the frontend branches on, not a server error.
      return res.status(200).json({ verified: false, attemptsRemaining });
    }

    verifyAttempts.delete(key);
    const sessionToken = signVerifyToken(qrId);
    res.status(200).json({ verified: true, sessionToken });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { qrId, sessionToken, presetType, freeText, location } = req.body;
    await messageService.sendFinderMessage({
      qrId,
      sessionToken,
      presetType,
      freeText,
      lat: location?.lat,
      lng: location?.lng,
      deviceHash: req.deviceHash,
    });
    res.status(201).json({ sent: true });
  } catch (err) {
    next(err);
  }
}
