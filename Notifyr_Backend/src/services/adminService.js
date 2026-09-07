import PDFDocument from "pdfkit";
import archiver from "archiver";
import pool from "../config/db.js";
import * as qrModel from "../models/qrModel.js";
import * as itemModel from "../models/itemModel.js";
import * as messageModel from "../models/messageModel.js";
import * as userModel from "../models/userModel.js";
import * as qrService from "./qrService.js";
import { generateQrDataUrl, generateQrPng } from "../utils/qrImage.js";
import { AppError } from "../utils/AppError.js";

export async function generateQrBatch(count) {
  const codes = await qrService.generateBatch(count);
  // Attach a ready-to-render data URL per code, so the admin table doesn't need
  // a second request per row just to show thumbnails.
  const withImages = await Promise.all(
    codes.map(async (c) => ({
      qrId: c.id,
      pinCode: c.pin_code,
      status: "unassigned",
      imageDataUrl: await generateQrDataUrl(c.id),
    })),
  );
  return withImages;
}

export async function listQrCodes(statusFilter) {
  const rows = await qrModel.listAll(statusFilter);
  return rows.map((r) => ({
    qrId: r.qr_id,
    status: r.status,
    pinCode: r.pin_code,
    createdAt: r.created_at,
    itemId: r.item_id || null,
    itemNickname: r.item_nickname || null,
  }));
}

// Single QR PNG, generated fresh — used by a dedicated image endpoint if the frontend
// prefers <img src="/api/admin/qr-codes/:id/image"> over embedding data URLs.
export async function getQrPng(qrId) {
  const qr = await qrModel.findById(qrId);
  if (!qr) throw new AppError("NOT_FOUND", "QR code not found", 404);
  return generateQrPng(qrId);
}

// Builds a printable PDF sheet (grid layout) for a batch of QR codes, entirely in memory.
export async function buildBatchPdf(qrIds) {
  const rows = await qrModel.findManyByIds(qrIds);
  if (rows.length === 0)
    throw new AppError("NOT_FOUND", "No matching QR codes found", 404);

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const COLS = 3;
  const CELL_SIZE = 160;
  const GAP = 20;
  let col = 0;
  let row = 0;

  for (const qr of rows) {
    const png = await generateQrPng(qr.id);
    const x = doc.page.margins.left + col * (CELL_SIZE + GAP);
    const y = doc.page.margins.top + row * (CELL_SIZE + GAP + 20);

    doc.image(png, x, y, { width: CELL_SIZE, height: CELL_SIZE });
    doc.fontSize(9).text(`${qr.id}  PIN:${qr.pin_code}`, x, y + CELL_SIZE + 2, {
      width: CELL_SIZE,
      align: "center",
    });

    col += 1;
    if (col >= COLS) {
      col = 0;
      row += 1;
      if (
        y + (CELL_SIZE + GAP + 20) * 2 >
        doc.page.height - doc.page.margins.bottom
      ) {
        doc.addPage();
        row = 0;
      }
    }
  }

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

// Same idea as buildBatchPdf, but individual PNG files zipped together instead of
// laid out on a page — for when someone needs raw per-tag files (e.g. handing off
// to a print shop) rather than a ready-to-print sheet. Built entirely in memory.
export async function buildBatchZip(qrIds) {
  const rows = await qrModel.findManyByIds(qrIds);
  if (rows.length === 0)
    throw new AppError("NOT_FOUND", "No matching QR codes found", 404);

  const archive = archiver("zip", { zlib: { level: 9 } });
  const chunks = [];
  archive.on("data", (chunk) => chunks.push(chunk));

  const donePromise = new Promise((resolve, reject) => {
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", reject);
  });

  for (const qr of rows) {
    const png = await generateQrPng(qr.id);
    archive.append(png, { name: `${qr.id}_PIN-${qr.pin_code}.png` });
  }

  await archive.finalize();
  return donePromise;
}

// Dashboard stats — spec section A4 (basic stats, useful for tracking pilot rollout).
// Four cheap grouped-count queries, run in parallel.
export async function getDashboardStats() {
  const [qrCounts, itemCounts, messageCounts, userCount] = await Promise.all([
    qrModel.getStatusCounts(),
    itemModel.getStatusCounts(),
    messageModel.getCounts(),
    userModel.getCount(),
  ]);

  return {
    qrCodes: qrCounts,
    items: itemCounts,
    messages: messageCounts,
    totalUsers: userCount,
  };
}

// Global admin unassign — works on ANY qrId regardless of which owner's item it's
// bound to (admin already has full authority, no ownership check needed).
export async function unassignQr(qrId) {
  const qr = await qrModel.findById(qrId);
  if (!qr) throw new AppError("NOT_FOUND", "QR code not found", 404);

  if (qr.status === "unassigned") {
    return { alreadyUnassigned: true };
  }

  const item = await itemModel.findByQrId(qrId);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    if (item) {
      await itemModel.unbindQr(item.id, conn);
    }
    await qrModel.setStatus(qrId, "unassigned", conn);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  return { alreadyUnassigned: false };
}
