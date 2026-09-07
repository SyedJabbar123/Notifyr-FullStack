import pool from "../config/db.js";

export async function insert({ id, ownerId, itemId, deviceHash }) {
  await pool.query(
    `INSERT INTO blocked_devices (id, owner_id, item_id, device_hash) VALUES (?, ?, ?, ?)`,
    [id, ownerId, itemId || null, deviceHash],
  );
}

// Blocked if: globally blocked by this item's owner, OR blocked for this specific item.
export async function isBlocked(itemId, ownerId, deviceHash) {
  const [rows] = await pool.query(
    `SELECT 1 FROM blocked_devices
     WHERE device_hash = ? AND owner_id = ? AND (item_id IS NULL OR item_id = ?)
     LIMIT 1`,
    [deviceHash, ownerId, itemId],
  );
  return rows.length > 0;
}

export async function listByOwner(ownerId) {
  const [rows] = await pool.query(
    `SELECT b.*, i.nickname AS item_nickname
     FROM blocked_devices b
     LEFT JOIN items i ON i.id = b.item_id
     WHERE b.owner_id = ?
     ORDER BY b.blocked_at DESC`,
    [ownerId],
  );
  return rows;
}

export async function deleteOwnedBy(blockId, ownerId) {
  const [result] = await pool.query(
    `DELETE FROM blocked_devices WHERE id = ? AND owner_id = ?`,
    [blockId, ownerId],
  );
  return result.affectedRows > 0;
}
