import { Router } from "express";
import * as blockController from "../controllers/blockController.js";
import { requireOwnerAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { blockDeviceSchema } from "../validators/blockValidators.js";

const router = Router();
router.use(requireOwnerAuth);
router.post("/", validateBody(blockDeviceSchema), blockController.create);
router.get("/", blockController.list);
router.delete("/:id", blockController.remove);
router.post("/message/:id", blockController.blockByMessage);

export default router;
