import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js";
import * as itemModel from "../models/itemModel.js";
import * as qrModel from "../models/qrModel.js";
import { AppError } from "../utils/AppError.js";

export async function listOwnerItems(ownerId) {
  return itemModel.listByOwner(ownerId);
}

export async function createItem(ownerId, payload) {
  const id = uuidv4();
  await itemModel.insert({
    id,
    ownerId,
    category: payload.category,
    nickname: payload.nickname,
    itemPhotoUrl: payload.item_photo_url,
    details: payload.details,
    privateDetails: payload.private_details,
  });
  return { id };
}

async function assertOwnership(itemId, ownerId) {
  const item = await itemModel.findById(itemId);
  if (!item) throw new AppError("NOT_FOUND", "Item not found", 404);
  if (item.owner_id !== ownerId)
    throw new AppError("FORBIDDEN", "Not your item", 403);
  return item;
}

export async function updateItem(itemId, ownerId, fields) {
  await assertOwnership(itemId, ownerId);
  await itemModel.update(itemId, fields);
}

export async function updateStatus(itemId, ownerId, status) {
  await assertOwnership(itemId, ownerId);
  await itemModel.updateStatus(itemId, status);

  // Deactivating an item also frees the QR tag for reassignment — one transaction.
  if (status === "deactivated") {
    const item = await itemModel.findById(itemId);
    if (item.qr_id) {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await itemModel.unbindQr(itemId, conn);
        await qrModel.setStatus(item.qr_id, "unassigned", conn);
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    }
  }
}

export async function bindQr(itemId, ownerId, qrId) {
  await assertOwnership(itemId, ownerId);

  const qr = await qrModel.findById(qrId);
  if (!qr) throw new AppError("NOT_FOUND", "QR code not recognized", 404);
  if (qr.status !== "unassigned") {
    throw new AppError(
      "QR_ALREADY_ASSIGNED",
      "This tag is already bound to another item",
      409,
    );
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await itemModel.bindQr(itemId, qrId, conn);
    await qrModel.setStatus(qrId, "assigned", conn);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function getOne(itemId, ownerId) {
  const item = await assertOwnership(itemId, ownerId);
  return item;
}

export async function unbindQr(itemId, ownerId) {
  const item = await assertOwnership(itemId, ownerId);
  if (!item.qr_id)
    throw new AppError("NO_QR_BOUND", "No QR code is bound to this item", 400);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await itemModel.unbindQr(itemId, conn);
    await qrModel.setStatus(item.qr_id, "unassigned", conn);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function deleteItem(itemId, ownerId) {
  const item = await assertOwnership(itemId, ownerId);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await itemModel.deleteDependencies(itemId, conn);

    // Release the tag before removing its item record.
    if (item.qr_id) {
      await itemModel.unbindQr(itemId, conn);
      await qrModel.setStatus(item.qr_id, "unassigned", conn);
    }

      await itemModel.deleteById(itemId, conn);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
