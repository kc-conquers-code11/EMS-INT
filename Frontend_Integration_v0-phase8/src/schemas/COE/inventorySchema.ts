import { z } from 'zod';

export const inventorySchema = z.object({
    item: z.string().min(1, 'Item name is required'),
    batch: z.string().min(1, 'Batch is required'),
    examSession: z.string().min(1, 'Exam Session is required'),
    quantity: z.string().regex(/^\d+$/, 'Quantity must be numeric'),
    distributed: z.string().regex(/^\d+$/, 'Distributed must be numeric'),
    remaining: z.string().regex(/^\d+$/, 'Remaining must be numeric'),
});

type InventoryFormData = z.infer<typeof inventorySchema>;
export type { InventoryFormData };
