import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { requireAdminAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { generateQrSchema } from "../validators/adminValidators.js";

const router = Router();
router.use(requireAdminAuth); // every route below requires is_admin = true

router.post(
  "/qr-codes/generate",
  validateBody(generateQrSchema),
  adminController.generateQrCodes,
);
router.get("/qr-codes", adminController.listQrCodes);
router.patch("/qr-codes/:qrId/unassign", adminController.unassignQr);
router.get("/stats", adminController.getStats);
router.get("/qr-codes/download-batch", adminController.downloadBatch); // before /:qrId/image, more specific path first
router.get("/qr-codes/download-batch-zip", adminController.downloadBatchZip);
router.get("/qr-codes/:qrId/image", adminController.getQrImage);

export default router;
