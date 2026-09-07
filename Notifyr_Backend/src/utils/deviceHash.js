import crypto from 'crypto';

// Fingerprint, not identity — no login on the finder side, so this is best-effort
// anti-spam, not a real user ID. Rotates daily so it isn't a permanent tracking id.
export function getDeviceHash(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || 'unknown';
  const daySalt = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return crypto.createHash('sha256').update(`${ip}|${ua}|${daySalt}`).digest('hex');
}
