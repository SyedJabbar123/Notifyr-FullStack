import { z } from "zod";

// Any valid email is accepted now (gmail/personal etc) — no domain restriction.
// Field is still named email to match the DB column; rename later if you want.
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(150),
  phone: z.string().max(30).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const fcmTokenSchema = z.object({
  fcm_token: z.string().min(1),
});
