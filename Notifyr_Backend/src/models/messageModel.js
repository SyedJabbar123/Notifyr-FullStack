import pool from "../config/db.js";

export async function insert({
  id,
  itemId,
  senderType,
  presetType,
  freeText,
  lat,
  lng,
  replyToken,
  deviceHash,
}) {
  await pool.query(
    `INSERT INTO messages (id, item_id, sender_type, preset_type, free_text, location_lat, location_lng, reply_token, device_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      itemId,
      senderType,
      presetType,
      freeText || null,
      lat ?? null,
      lng ?? null,
      replyToken || null,
      deviceHash,
    ],
  );
}

export async function listOwnedBy(ownerId) {
  const [rows] = await pool.query(
    `SELECT m.* FROM messages m
     JOIN items i ON i.id = m.item_id
     WHERE i.owner_id = ?
     ORDER BY m.created_at ASC`,
    [ownerId],
  );
  return rows;
}

// Ownership is enforced by joining through items — caller passes ownerId.
export async function listForItemOwnedBy(itemId, ownerId) {
  const [rows] = await pool.query(
    `SELECT m.* FROM messages m
     JOIN items i ON i.id = m.item_id
     WHERE m.item_id = ? AND i.owner_id = ?
     ORDER BY m.created_at ASC`,
    [itemId, ownerId],
  );
  return rows;
}

export async function markReadOwnedBy(messageId, ownerId) {
  const [result] = await pool.query(
    `UPDATE messages m
     JOIN items i ON i.id = m.item_id
     SET m.read_by_owner = TRUE
     WHERE m.id = ? AND i.owner_id = ?`,
    [messageId, ownerId],
  );
  return result.affectedRows > 0;
}

export async function findByReplyToken(token) {
  const [rows] = await pool.query(
    `SELECT * FROM messages WHERE reply_token = ?`,
    [token],
  );
  return rows[0] || null;
}

// Admin dashboard stats — total messages, and how many are still unread.
export async function getCounts() {
  const [[row]] = await pool.query(
    `SELECT COUNT(*) AS total, SUM(CASE WHEN read_by_owner = FALSE AND sender_type = 'finder' THEN 1 ELSE 0 END) AS unread
     FROM messages`,
  );
  return { total: row.total, unread: Number(row.unread) || 0 };
}

export async function getDeviceHashByMessageId(messageId, ownerId) {
  const [rows] = await pool.query(
    `SELECT m.device_hash FROM messages m
     JOIN items i ON i.id = m.item_id
     WHERE m.id = ? AND i.owner_id = ?`,
    [messageId, ownerId],
  );
  return rows[0]?.device_hash || null;
}

export async function getItemIdByMessageId(messageId, ownerId) {
  const [rows] = await pool.query(
    `SELECT m.item_id FROM messages m
     JOIN items i ON i.id = m.item_id
     WHERE m.id = ? AND i.owner_id = ?`,
    [messageId, ownerId],
  );
  return rows[0]?.item_id || null;
}

export async function deleteOwnedBy(messageId, ownerId) {
  const [result] = await pool.query(
    `DELETE m FROM messages m
     JOIN items i ON i.id = m.item_id
     WHERE m.id = ? AND i.owner_id = ?`,
    [messageId, ownerId],
  );
  return result.affectedRows > 0;
}

export async function deleteAllOwnedBy(ownerId) {
  await pool.query(
    `DELETE m FROM messages m
     JOIN items i ON i.id = m.item_id
     WHERE i.owner_id = ?`,
    [ownerId],
  );
}
