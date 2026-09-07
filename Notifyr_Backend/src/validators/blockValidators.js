import { z } from 'zod';

export const blockDeviceSchema = z.object({
  device_hash: z.string().min(1),
  item_id: z.string().uuid().optional(), // omit => global block for this owner
});
