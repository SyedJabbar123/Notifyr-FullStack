import { Router } from "express";
import * as publicController from "../controllers/publicController.js";
import { validateBody } from "../middleware/validate.js";
import { attachDeviceHash } from "../middleware/deviceFingerprint.js";
import { publicRouteThrottle } from "../middleware/rateLimiter.js";
import {
  verifySchema,
  publicMessageSchema,
} from "../validators/publicValidators.js";

const router = Router();
router.use(publicRouteThrottle, attachDeviceHash); // no auth — every route here is finder-facing

router.get("/items/:qrId", publicController.getItemLanding);
router.post(
  "/verify",
  validateBody(verifySchema),
  publicController.verifyPresence,
);
router.post(
  "/messages",
  validateBody(publicMessageSchema),
  publicController.sendMessage,
);
// Phase 2 (reply-status page) intentionally not built yet — not in the current handoff scope.

export default router;
