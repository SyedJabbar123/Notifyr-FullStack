import { Router } from "express";
import * as itemController from "../controllers/itemController.js";
import { requireOwnerAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  createItemSchema,
  updateItemSchema,
  bindQrSchema,
  updateStatusSchema,
  unbindQrSchema,
} from "../validators/itemValidators.js";

const router = Router();
router.use(requireOwnerAuth); // every route below requires a logged-in owner

router.get("/", itemController.list);
router.post("/", validateBody(createItemSchema), itemController.create);
router.get("/:id", itemController.getOne);
router.patch("/:id", validateBody(updateItemSchema), itemController.update);
router.patch(
  "/:id/status",
  validateBody(updateStatusSchema),
  itemController.updateStatus,
);
router.post("/:id/bind-qr", validateBody(bindQrSchema), itemController.bindQr);
router.post(
  "/:id/unbind-qr",
  validateBody(unbindQrSchema),
  itemController.unbindQr,
);
router.delete("/:id", itemController.deleteOne);

export default router;
