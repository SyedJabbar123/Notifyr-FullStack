import pool from "../config/db.js";

export async function insertUser({ id, email, passwordHash, name, phone }) {
  await pool.query(
    `INSERT INTO users (id, email, password_hash, name, phone) VALUES (?, ?, ?, ?, ?)`,
    [id, email, passwordHash, name, phone || null],
  );
}

export async function findByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  return rows[0] || null;
}

export async function findById(id) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
}

export async function markEmailVerified(id) {
  await pool.query(`UPDATE users SET email_verified = TRUE WHERE id = ?`, [id]);
}

export async function setFcmToken(id, fcmToken) {
  await pool.query(`UPDATE users SET fcm_token = ? WHERE id = ?`, [
    fcmToken,
    id,
  ]);
}

// Called when FCM reports the token is no longer registered — see notificationService.
export async function clearFcmToken(id) {
  await pool.query(`UPDATE users SET fcm_token = NULL WHERE id = ?`, [id]);
}

export async function updateProfile(id, fields) {
  const allowed = ["name", "phone", "profile_photo_url"];
  const keys = Object.keys(fields).filter((k) => allowed.includes(k));
  if (keys.length === 0) return;
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => fields[k]);
  values.push(id);
  await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
}

export async function updatePasswordHash(id, passwordHash) {
  await pool.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [
    passwordHash,
    id,
  ]);
}

export async function updateGlobalDndSchedule(id, schedule) {
  await pool.query(`UPDATE users SET global_dnd_schedule = ? WHERE id = ?`, [
    JSON.stringify(schedule),
    id,
  ]);
}

// Full cascading delete — schema has no ON DELETE CASCADE, so this is done manually,
// in dependency order, inside a transaction (see authService.deleteAccount).
export async function deleteCascade(conn, userId) {
  const [items] = await conn.query(
    `SELECT id, qr_id FROM items WHERE owner_id = ?`,
    [userId],
  );
  const itemIds = items.map((i) => i.id);

  if (itemIds.length > 0) {
    await conn.query(`DELETE FROM messages WHERE item_id IN (?)`, [itemIds]);
    await conn.query(`DELETE FROM message_rate_limits WHERE item_id IN (?)`, [
      itemIds,
    ]);
    const qrIds = items.map((i) => i.qr_id).filter(Boolean);
    if (qrIds.length > 0) {
      await conn.query(
        `UPDATE qr_codes SET status = 'unassigned' WHERE id IN (?)`,
        [qrIds],
      );
    }
    await conn.query(`DELETE FROM items WHERE owner_id = ?`, [userId]);
  }

  await conn.query(`DELETE FROM blocked_devices WHERE owner_id = ?`, [userId]);
  await conn.query(`DELETE FROM users WHERE id = ?`, [userId]);
}

// Full data export — profile + items + messages, everything this user owns.
export async function getFullExport(userId) {
  const [[user]] = await pool.query(
    `SELECT id, email, name, phone, profile_photo_url, email_verified, created_at FROM users WHERE id = ?`,
    [userId],
  );
  const [items] = await pool.query(`SELECT * FROM items WHERE owner_id = ?`, [
    userId,
  ]);
  const itemIds = items.map((i) => i.id);
  let messages = [];
  if (itemIds.length > 0) {
    [messages] = await pool.query(
      `SELECT * FROM messages WHERE item_id IN (?)`,
      [itemIds],
    );
  }
  return { user, items, messages };
}

// Admin dashboard stats.
export async function getCount() {
  const [[row]] = await pool.query(`SELECT COUNT(*) AS total FROM users`);
  return row.total;
}
