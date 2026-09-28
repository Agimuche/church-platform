import { z } from "zod";

export const createStreamSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  scheduledStart: z.string().min(1, "Choose a date and time."),
});

export type CreateStreamInput = z.infer<typeof createStreamSchema>;
