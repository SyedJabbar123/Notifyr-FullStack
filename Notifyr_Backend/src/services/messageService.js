import { v4 as uuidv4 } from "uuid";
import * as itemModel from "../models/itemModel.js";
import * as messageModel from "../models/messageModel.js";
import * as blockModel from "../models/blockModel.js";
import * as rateLimitService from "./rateLimitService.js";
import * as notificationService from "./notificationService.js";
import { verifyVerifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import { isGlobalDndActiveNow } from "./dndService.js";

// The finder-facing send flow: session token -> item/status check -> block check ->
// rate limit -> insert -> push. Field names match the documented finder portal contract.
export async function sendFinderMessage({
  qrId,
  sessionToken,
  presetType,
  freeText,
  lat,
  lng,
  deviceHash,
}) {
  // 1. Session token must be valid AND scoped to this exact qrId.
  try {
    verifyVerifyToken(sessionToken, qrId);
  } catch {
    throw new AppError(
      "INVALID_SESSION_TOKEN",
      "Verification expired or invalid — please try again",
      401,
    );
  }

  const item = await itemModel.findPublicByQrId(qrId);
  if (!item) throw new AppError("NOT_FOUND", "This code isn't registered", 404);

  // Backend must enforce this too, never trust the client — frontend already checks
  // status on the landing page, but a stale/replayed request could skip that.
  const isDnd =
    item.status === "dnd" ||
    (item.status === "active" &&
      isGlobalDndActiveNow(item.global_dnd_schedule));
  if (isDnd) {
    throw new AppError(
      "OWNER_UNAVAILABLE",
      "Owner is currently unavailable",
      403,
    );
  }

  // 2. Blocked devices get a generic failure — never reveal that they were blocked,
  // that just teaches them to rotate device/IP.
  const blocked = await blockModel.isBlocked(
    item.id,
    item.owner_id,
    deviceHash,
  );
  if (blocked) {
    throw new AppError(
      "MESSAGE_NOT_DELIVERED",
      "This message could not be delivered",
      422,
    );
  }

  // 3. Business-rule rate limit (per hour per device per item).
  await rateLimitService.assertNotRateLimited(item.id, deviceHash);

  // 4. Insert message.
  const messageId = uuidv4();
  await messageModel.insert({
    id: messageId,
    itemId: item.id,
    senderType: "finder",
    presetType,
    freeText,
    lat,
    lng,
    replyToken: null, // Phase 2 — not in current scope
    deviceHash,
  });
  await rateLimitService.logSend(item.id, deviceHash);

  // 5. Push — best-effort, never blocks/fails this response.
  await notificationService.notifyOwnerOfMessage(item.owner_id, item, {
    id: messageId,
    free_text: freeText,
    preset_type: presetType,
    nickname: item.nickname,
  });

  return { messageId };
}
