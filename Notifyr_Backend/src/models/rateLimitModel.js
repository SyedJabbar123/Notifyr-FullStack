import pool from '../config/db.js';

export async function countRecentSends(itemId, deviceHash) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM message_rate_limits
     WHERE item_id = ? AND device_hash = ? AND sent_at > (NOW() - INTERVAL 1 HOUR)`,
    [itemId, deviceHash]
  );
  return rows[0].cnt;
}

export async function logSend({ id, itemId, deviceHash }) {
  await pool.query(`INSERT INTO message_rate_limits (id, item_id, device_hash) VALUES (?, ?, ?)`, [id, itemId, deviceHash]);
}

// Called by the daily cron so this table doesn't grow indefinitely on a 1GB tier.
export async function pruneOlderThan24h() {
  const [result] = await pool.query(`DELETE FROM message_rate_limits WHERE sent_at < (NOW() - INTERVAL 24 HOUR)`);
  return result.affectedRows;
}
