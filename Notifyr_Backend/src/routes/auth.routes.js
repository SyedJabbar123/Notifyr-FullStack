import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { requireOwnerAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  signupSchema,
  loginSchema,
  fcmTokenSchema,
} from "../validators/authValidators.js";
import {
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  globalDndSchema,
  changePasswordSchema,
} from "../validators/profileValidators.js";
import { authRouteThrottle } from "../middleware/rateLimiter.js";

const router = Router();

router.post(
  "/signup",
  authRouteThrottle,
  validateBody(signupSchema),
  authController.signup,
);
router.get("/verify-email/:token", authController.verifyEmail);
router.post(
  "/login",
  authRouteThrottle,
  validateBody(loginSchema),
  authController.login,
);
router.post(
  "/forgot-password",
  authRouteThrottle,
  validateBody(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  authRouteThrottle,
  validateBody(resetPasswordSchema),
  authController.resetPassword,
);

router.patch(
  "/fcm-token",
  requireOwnerAuth,
  validateBody(fcmTokenSchema),
  authController.updateFcmToken,
);
router.get("/me", requireOwnerAuth, authController.getMe);
router.patch(
  "/me",
  requireOwnerAuth,
  validateBody(updateProfileSchema),
  authController.updateMe,
);
router.delete("/me", requireOwnerAuth, authController.deleteMe);
router.get("/export", requireOwnerAuth, authController.exportMe);
router.patch(
  "/global-dnd",
  requireOwnerAuth,
  validateBody(globalDndSchema),
  authController.updateGlobalDnd,
);
router.patch(
  "/change-password",
  requireOwnerAuth,
  validateBody(changePasswordSchema),
  authController.changePassword,
);

export default router;
