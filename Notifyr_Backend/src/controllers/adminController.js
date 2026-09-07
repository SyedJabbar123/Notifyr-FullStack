import * as adminService from "../services/adminService.js";
import { AppError } from "../utils/AppError.js";

export async function getStats(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

export async function generateQrCodes(req, res, next) {
  try {
    const generated = await adminService.generateQrBatch(req.body.count);
    res.status(201).json({ generated });
  } catch (err) {
    next(err);
  }
}

export async function listQrCodes(req, res, next) {
  try {
    const qrCodes = await adminService.listQrCodes(req.query.status);
    res.status(200).json({ qrCodes });
  } catch (err) {
    next(err);
  }
}

export async function getQrImage(req, res, next) {
  try {
    const png = await adminService.getQrPng(req.params.qrId);
    res.set("Content-Type", "image/png");
    res.status(200).send(png);
  } catch (err) {
    next(err);
  }
}

export async function downloadBatch(req, res, next) {
  try {
    const idsParam = req.query.ids;
    if (!idsParam)
      return next(
        new AppError("VALIDATION_ERROR", "ids query param is required", 400),
      );
    const ids = String(idsParam)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const pdfBuffer = await adminService.buildBatchPdf(ids);
    res.set("Content-Type", "application/pdf");
    res.set(
      "Content-Disposition",
      'attachment; filename="notifyr-qr-batch.pdf"',
    );
    res.status(200).send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}

export async function downloadBatchZip(req, res, next) {
  try {
    const idsParam = req.query.ids;
    if (!idsParam)
      return next(
        new AppError("VALIDATION_ERROR", "ids query param is required", 400),
      );
    const ids = String(idsParam)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const zipBuffer = await adminService.buildBatchZip(ids);
    res.set("Content-Type", "application/zip");
    res.set(
      "Content-Disposition",
      'attachment; filename="notifyr-qr-batch.zip"',
    );
    res.status(200).send(zipBuffer);
  } catch (err) {
    next(err);
  }
}

export async function unassignQr(req, res, next) {
  try {
    const result = await adminService.unassignQr(req.params.qrId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}
