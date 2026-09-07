import { z } from "zod";

const CATEGORIES = ["bag", "laptop", "keys", "mobile", "wallet", "bottle"];

export const createItemSchema = z.object({
  category: z.enum(CATEGORIES),
  nickname: z.string().min(1).max(100),
  item_photo_url: z.string().url(),
  details: z.record(z.any()).default({}),
  private_details: z.record(z.any()).optional(),
});

export const updateItemSchema = createItemSchema.partial().extend({
  hide_photo_public: z.boolean().optional(),
  dnd_schedule: z.record(z.any()).optional(),
});

export const bindQrSchema = z.object({
  qr_id: z.string().min(1),
});

export const updateStatusSchema = z.object({
  status: z.enum(["active", "dnd", "lost", "deactivated"]),
});

export const unbindQrSchema = z.object({});
