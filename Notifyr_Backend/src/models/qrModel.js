import pool from "../config/db.js";

export async function findById(qrId) {
  const [rows] = await pool.query(`SELECT * FROM qr_codes WHERE id = ?`, [
    qrId,
  ]);
  return rows[0] || null;
}

export async function insertBatch(qrCodes) {
  const values = qrCodes.map((q) => [q.id, "unassigned", q.pin_code]);
  await pool.query(`INSERT INTO qr_codes (id, status, pin_code) VALUES ?`, [
    values,
  ]);
}

export async function setStatus(qrId, status, conn = pool) {
  await conn.query(`UPDATE qr_codes SET status = ? WHERE id = ?`, [
    status,
    qrId,
  ]);
}

// Admin QR list — left join against items so we can show which item (if any) a tag is bound to.
export async function listAll(statusFilter) {
  const params = [];
  let sql = `
    SELECT q.id AS qr_id, q.status, q.pin_code, q.created_at, i.id AS item_id, i.nickname AS item_nickname
    FROM qr_codes q
    LEFT JOIN items i ON i.qr_id = q.id
  `;
  if (statusFilter) {
    sql += ` WHERE q.status = ?`;
    params.push(statusFilter);
  }
  sql += ` ORDER BY q.created_at DESC`;
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function findManyByIds(ids) {
  if (ids.length === 0) return [];
  const [rows] = await pool.query(`SELECT * FROM qr_codes WHERE id IN (?)`, [
    ids,
  ]);
  return rows;
}

// Counts for the admin dashboard's basic stats (spec section A4).
export async function getStatusCounts() {
  const [rows] = await pool.query(
    `SELECT status, COUNT(*) AS cnt FROM qr_codes GROUP BY status`,
  );
  const counts = { unassigned: 0, assigned: 0 };
  for (const row of rows) counts[row.status] = row.cnt;
  counts.total = counts.unassigned + counts.assigned;
  return counts;
}
