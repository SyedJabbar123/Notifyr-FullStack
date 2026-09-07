import pool from "../config/db.js";

// NOTE: includes owner_id/qr's pin_code for internal use (block checks, verify, notify).
// Controllers that expose this to the finder MUST strip owner_id and pin_code before responding —
// see publicController.js. private_details is never selected here at all.
export async function findPublicByQrId(qrId) {
  const [rows] = await pool.query(
    `SELECT i.id, i.owner_id, i.category, i.nickname, i.item_photo_url, i.status, i.hide_photo_public,
            q.pin_code, u.global_dnd_schedule
     FROM items i
     JOIN qr_codes q ON q.id = i.qr_id
     JOIN users u ON u.id = i.owner_id
     WHERE q.id = ? AND q.status = 'assigned'`,
    [qrId],
  );
  return rows[0] || null;
}

// OWNER read — full row, but caller must still check owner_id === req.ownerId.
export async function findById(id) {
  const [rows] = await pool.query(`SELECT * FROM items WHERE id = ?`, [id]);
  return rows[0] || null;
}

// Internal/admin use — full row, looked up by qr_id rather than item id.
// Not exposed publicly (unlike findPublicByQrId, which strips private fields).
export async function findByQrId(qrId) {
  const [rows] = await pool.query(`SELECT * FROM items WHERE qr_id = ?`, [
    qrId,
  ]);
  return rows[0] || null;
}

export async function listByOwner(ownerId) {
  const [rows] = await pool.query(
    `SELECT i.*,
       (SELECT COUNT(*) FROM messages m
        WHERE m.item_id = i.id AND m.sender_type = 'finder' AND m.read_by_owner = FALSE) AS unread_count
     FROM items i
     WHERE i.owner_id = ?
     ORDER BY i.created_at DESC`,
    [ownerId],
  );
  return rows;
}

export async function insert({
  id,
  ownerId,
  category,
  nickname,
  itemPhotoUrl,
  details,
  privateDetails,
}) {
  await pool.query(
    `INSERT INTO items (id, owner_id, category, nickname, item_photo_url, details, private_details)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      ownerId,
      category,
      nickname,
      itemPhotoUrl,
      JSON.stringify(details || {}),
      JSON.stringify(privateDetails || {}),
    ],
  );
}

export async function update(id, fields) {
  const allowed = [
    "nickname",
    "item_photo_url",
    "details",
    "private_details",
    "hide_photo_public",
    "dnd_schedule",
  ];
  const keys = Object.keys(fields).filter((k) => allowed.includes(k));
  if (keys.length === 0) return;

  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) =>
    ["details", "private_details", "dnd_schedule"].includes(k)
      ? JSON.stringify(fields[k])
      : fields[k],
  );
  values.push(id);

  await pool.query(`UPDATE items SET ${setClause} WHERE id = ?`, values);
}

export async function updateStatus(id, status) {
  await pool.query(`UPDATE items SET status = ? WHERE id = ?`, [status, id]);
}

export async function bindQr(itemId, qrId, conn = pool) {
  await conn.query(`UPDATE items SET qr_id = ? WHERE id = ?`, [qrId, itemId]);
}

export async function unbindQr(itemId, conn = pool) {
  await conn.query(`UPDATE items SET qr_id = NULL WHERE id = ?`, [itemId]);
}

// Admin dashboard stats.
export async function getStatusCounts() {
  const [rows] = await pool.query(
    `SELECT status, COUNT(*) AS cnt FROM items GROUP BY status`,
  );
  const counts = { active: 0, dnd: 0, lost: 0, deactivated: 0 };
  for (const row of rows) counts[row.status] = row.cnt;
  counts.total = counts.active + counts.dnd + counts.lost + counts.deactivated;
  return counts;
}

export async function unbindQrByQrId(qrId, conn = pool) {
  await conn.query(`UPDATE items SET qr_id = NULL WHERE qr_id = ?`, [qrId]);
}

export async function deleteById(id, conn = pool) {
  await conn.query(`DELETE FROM items WHERE id = ?`, [id]);
}

// Kept for databases created before the schema gained ON DELETE CASCADE.
export async function deleteDependencies(itemId, conn = pool) {
  await conn.query(`DELETE FROM messages WHERE item_id = ?`, [itemId]);
  await conn.query(`DELETE FROM message_rate_limits WHERE item_id = ?`, [
    itemId,
  ]);
  await conn.query(`DELETE FROM blocked_devices WHERE item_id = ?`, [itemId]);
}
