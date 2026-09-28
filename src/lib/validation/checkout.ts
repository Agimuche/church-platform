import { z } from "zod";

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().max(50).default(1),
      })
    )
    .min(1, "Your cart is empty."),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
