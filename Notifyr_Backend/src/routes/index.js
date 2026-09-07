import { Router } from "express";
import authRoutes from "./auth.routes.js";
import itemRoutes from "./items.routes.js";
import messageRoutes from "./messages.routes.js";
import publicRoutes from "./public.routes.js";
import blockRoutes from "./blocks.routes.js";
import uploadRoutes from "./uploads.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/items", itemRoutes);
router.use("/", messageRoutes); // defines its own /items/:id/messages and /messages/:id/read
router.use("/public", publicRoutes);
router.use("/blocks", blockRoutes);
router.use("/uploads", uploadRoutes);
router.use("/admin", adminRoutes);

export default router;
