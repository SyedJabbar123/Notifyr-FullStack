import { z } from "zod";

// Field names match the admin/finder handoff doc exactly (qrId/input/sessionToken,
// camelCase) — two frontend devs are already building against that contract.
export const verifySchema = z.object({
  qrId: z.string().min(1),
  input: z.string().min(1).max(20),
});

export const publicMessageSchema = z.object({
  qrId: z.string().min(1),
  sessionToken: z.string().min(1),
  presetType: z.string().min(1).max(30),
  freeText: z.string().max(150).optional(),
  location: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});
