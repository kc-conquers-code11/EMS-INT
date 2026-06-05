import { z } from 'zod';

export const cardPaymentSchema = z.object({
  cardNumber: z.string()
    .min(16, 'Card number must be 16 digits')
    .max(19, 'Card number must be 16-19 digits')
    .regex(/^\d[\d\s]*$/, 'Invalid card number format'),
  expiry: z.string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry must be in MM/YY format'),
  cvv: z.string()
    .min(3, 'CVV must be 3 digits')
    .max(4, 'CVV must be 3-4 digits')
    .regex(/^\d+$/, 'CVV must contain only numbers'),
});

export type CardPaymentInput = z.infer<typeof cardPaymentSchema>;
