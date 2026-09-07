import crypto from "crypto";
import * as qrModel from "../models/qrModel.js";
import { AppError } from "../utils/AppError.js";

function randomQrId() {
  return `QR_${crypto.randomBytes(4).toString("hex")}`;
}

function randomPin() {
  return String(Math.floor(1000 + Math.random() * 9000)); // 4-digit PIN
}

// Generates a pre-printed batch, e.g. for a semester's worth of tags.
// Checks for qrId collisions before accepting — astronomically unlikely at 4 random
// bytes, but cheap to check, so no reason not to.
export async function generateBatch(count) {
  if (count < 1 || count > 500) {
    throw new AppError("INVALID_COUNT", "count must be between 1 and 500", 400);
  }

  const codes = [];
  const seen = new Set();

  while (codes.length < count) {
    const id = randomQrId();
    if (seen.has(id)) continue; // in-batch collision, retry
    const existing = await qrModel.findById(id);
    if (existing) continue; // DB collision, retry

    seen.add(id);
    codes.push({ id, pin_code: randomPin() });
  }

  await qrModel.insertBatch(codes);
  return codes;
}
