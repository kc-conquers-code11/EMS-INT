import { z } from 'zod';

export const branchSchema = z.object({
    programm_id: z.string().uuid('Programme ID is required'),
    depart_id: z.string().uuid('Department ID is required'),
    branch_name: z.string().min(1, 'Branch name is required').max(200, 'Branch name must be less than 200 characters'),
    branch_code: z.string().max(20, 'Branch code must be less than 20 characters').optional().nullable(),
    total_intake: z.coerce.number().int().nonnegative().optional().nullable(),
    accreditation_status: z.string().max(100).optional().nullable(),
    established_year: z.coerce.number().int().positive().optional().nullable(),
    status: z.boolean().default(true),
});

export type BranchFormData = z.input<typeof branchSchema>;
