import { Router } from "express";
import * as messageController from "../controllers/messageController.js";
import { requireOwnerAuth } from "../middleware/auth.js";

const router = Router();
// Auth applied per-route, not router-wide — this router is mounted at '/' in index.js,
// so a router.use(requireOwnerAuth) here would run on EVERY request that passes through
// it (including unrelated public routes registered later), regardless of whether it
// actually matches a route defined below. That was the exact bug that caused
// /api/public/items/:qrId to 401 — scoping auth per-route makes it immune to mount order.
router.get(
  "/items/:id/messages",
  requireOwnerAuth,
  messageController.listForItem,
);
router.patch(
  "/messages/:id/read",
  requireOwnerAuth,
  messageController.markRead,
);
router.get("/messages", requireOwnerAuth, messageController.list);

router.delete("/messages/:id", requireOwnerAuth, messageController.deleteOne);
router.delete("/messages", requireOwnerAuth, messageController.deleteAll);

export default router;
