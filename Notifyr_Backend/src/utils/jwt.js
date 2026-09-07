import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../config/env.js";

export function signOwnerToken(userId, email) {
  return jwt.sign({ sub: userId, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function verifyOwnerToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

export function signEmailVerifyToken(userId) {
  return jwt.sign({ sub: userId, purpose: "verify-email" }, env.JWT_SECRET, {
    expiresIn: `${env.VERIFY_EMAIL_TOKEN_EXP_MIN}m`,
  });
}

export function verifyEmailVerifyToken(token) {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (payload.purpose !== "verify-email")
    throw new Error("Wrong token purpose");
  return payload;
}

// Scoped, short-lived token proving a finder passed the presence check for a specific qr_id.
export function signVerifyToken(qrId) {
  return jwt.sign({ qr_id: qrId, purpose: "presence-verify" }, env.JWT_SECRET, {
    expiresIn: `${env.VERIFY_TOKEN_EXP_MIN}m`,
  });
}

export function verifyVerifyToken(token, expectedQrId) {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (payload.purpose !== "presence-verify" || payload.qr_id !== expectedQrId) {
    throw new Error("Invalid verify token for this item");
  }
  return payload;
}

// Password reset tokens are made single-use WITHOUT a separate revocation table:
// the token embeds a short fingerprint of the user's CURRENT password_hash at
// issue time. Once the password actually changes, the fingerprint no longer
// matches, and the old token stops working automatically — even if it hasn't
// expired yet. Cheap trick, no extra DB writes/table needed.
function pwFingerprint(passwordHash) {
  return crypto
    .createHash("sha256")
    .update(passwordHash || "")
    .digest("hex")
    .slice(0, 16);
}

export function signPasswordResetToken(userId, currentPasswordHash) {
  return jwt.sign(
    {
      sub: userId,
      purpose: "reset-password",
      pwv: pwFingerprint(currentPasswordHash),
    },
    env.JWT_SECRET,
    { expiresIn: "30m" },
  );
}

export function verifyPasswordResetToken(token, currentPasswordHash) {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (payload.purpose !== "reset-password")
    throw new Error("Wrong token purpose");
  if (payload.pwv !== pwFingerprint(currentPasswordHash)) {
    throw new Error("Reset link already used or expired");
  }
  return payload;
}
