import { v4 as uuidv4 } from "uuid";
import * as blockModel from "../models/blockModel.js";
import { AppError } from "../utils/AppError.js";
import * as messageModel from "../models/messageModel.js";

export async function blockDevice(ownerId, { device_hash, item_id }) {
  await blockModel.insert({
    id: uuidv4(),
    ownerId,
    itemId: item_id,
    deviceHash: device_hash,
  });
}
export async function listBlocks(ownerId) {
  return blockModel.listByOwner(ownerId);
}

export async function unblockDevice(blockId, ownerId) {
  const ok = await blockModel.deleteOwnedBy(blockId, ownerId);
  if (!ok) throw new AppError("NOT_FOUND", "Block not found", 404);
}

export async function blockDeviceByMessage(ownerId, messageId) {
  const deviceHash = await messageModel.getDeviceHashByMessageId(
    messageId,
    ownerId,
  );
  if (!deviceHash) {
    throw new AppError("NOT_FOUND", "Message not found", 404);
  }
  const itemId = await messageModel.getItemIdByMessageId(messageId, ownerId);
  await blockDevice(ownerId, { device_hash: deviceHash, item_id: itemId });
}
