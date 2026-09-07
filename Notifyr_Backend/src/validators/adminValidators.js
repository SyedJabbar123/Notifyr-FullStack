import { z } from "zod";

export const generateQrSchema = z.object({
  count: z.number().int().min(1).max(500),
});
