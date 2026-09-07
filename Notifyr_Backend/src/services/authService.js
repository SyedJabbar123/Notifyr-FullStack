import { v4 as uuidv4 } from "uuid";
import * as userModel from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import {
  signOwnerToken,
  signEmailVerifyToken,
  verifyEmailVerifyToken,
  signPasswordResetToken,
  verifyPasswordResetToken,
} from "../utils/jwt.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./emailService.js";
import { AppError } from "../utils/AppError.js";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

export async function signup({ email, password, name, phone }) {
  const existing = await userModel.findByEmail(email);
  if (existing)
    throw new AppError(
      "EMAIL_TAKEN",
      "An account with this email already exists",
      409,
    );

  const id = uuidv4();
  const passwordHash = await hashPassword(password);
  await userModel.insertUser({ id, email, passwordHash, name, phone });

  const emailToken = signEmailVerifyToken(id);
  await sendVerificationEmail(email, emailToken);

  return { userId: id, emailVerifyToken: emailToken };
}

export async function verifyEmail(token) {
  const payload = verifyEmailVerifyToken(token); // throws if invalid/expired/wrong purpose
  await userModel.markEmailVerified(payload.sub);
}

export async function login({ email, password }) {
  const user = await userModel.findByEmail(email);
  if (!user || !user.password_hash) {
    throw new AppError(
      "INVALID_CREDENTIALS",
      "Incorrect email or password",
      401,
    );
  }
  const ok = await comparePassword(password, user.password_hash);
  if (!ok)
    throw new AppError(
      "INVALID_CREDENTIALS",
      "Incorrect email or password",
      401,
    );

  if (!user.email_verified) {
    throw new AppError(
      "EMAIL_NOT_VERIFIED",
      "Please verify your email first",
      403,
    );
  }

  const token = signOwnerToken(user.id, user.email);
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      is_admin: !!user.is_admin,
    },
  };
}

export async function updateFcmToken(ownerId, fcmToken) {
  await userModel.setFcmToken(ownerId, fcmToken);
}

export async function getProfile(ownerId) {
  const user = await userModel.findById(ownerId);
  if (!user) throw new AppError("NOT_FOUND", "User not found", 404);
  const { password_hash, ...safe } = user;
  return safe;
}

export async function updateProfile(ownerId, fields) {
  await userModel.updateProfile(ownerId, fields);
}

export async function forgotPassword(email) {
  const user = await userModel.findByEmail(email);
  if (!user) return { sent: true };
  const resetToken = signPasswordResetToken(user.id, user.password_hash);
  await sendPasswordResetEmail(email, resetToken);

  return { sent: true, resetToken };
}

export async function resetPassword(token, newPassword) {
  const decoded = jwt.decode(token);
  if (!decoded?.sub)
    throw new AppError("INVALID_TOKEN", "Invalid or expired reset link", 401);

  const user = await userModel.findById(decoded.sub);
  if (!user)
    throw new AppError("INVALID_TOKEN", "Invalid or expired reset link", 401);

  try {
    verifyPasswordResetToken(token, user.password_hash);
  } catch {
    throw new AppError("INVALID_TOKEN", "Invalid or expired reset link", 401);
  }

  const newHash = await hashPassword(newPassword);
  await userModel.updatePasswordHash(user.id, newHash);
}

export async function updateGlobalDnd(ownerId, schedule) {
  await userModel.updateGlobalDndSchedule(ownerId, schedule);
}

export async function deleteAccount(ownerId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await userModel.deleteCascade(conn, ownerId);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function exportData(ownerId) {
  return userModel.getFullExport(ownerId);
}

export async function changePassword(ownerId, currentPassword, newPassword) {
  const user = await userModel.findById(ownerId);
  if (!user) throw new AppError("NOT_FOUND", "User not found", 404);

  const ok = await comparePassword(currentPassword, user.password_hash);
  if (!ok)
    throw new AppError(
      "INVALID_CREDENTIALS",
      "Current password is incorrect",
      401,
    );

  const newHash = await hashPassword(newPassword);
  await userModel.updatePasswordHash(ownerId, newHash);
}
