import { z } from "zod";

export const prayerRequestSchema = z.object({
  message: z.string().min(10, "Tell us a bit more — at least 10 characters.").max(2000),
  visibility: z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE"),
  // Only used for unauthenticated submissions; ignored if the user is signed in.
  guestName: z.string().max(100).optional(),
  guestEmail: z.string().email().optional().or(z.literal("")),
});

export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>;

export const counselingRequestSchema = z.object({
  category: z.string().min(1, "Choose a category."),
  description: z.string().min(10, "Tell us a bit more — at least 10 characters.").max(2000),
  preferredDate: z.string().optional(),
  guestName: z.string().max(100).optional(),
  guestEmail: z.string().email().optional().or(z.literal("")),
  guestPhone: z.string().max(30).optional(),
});

export type CounselingRequestInput = z.infer<typeof counselingRequestSchema>;
