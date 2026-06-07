import { z } from 'zod';

export const semesterSchema = z.object({
    programmeId: z.string().min(1, 'Programme is required'),
    academicId: z.string().min(1, 'Academic Year is required'),
    branchId: z.string().optional().nullable(),
    schemeId: z.string().optional().nullable(),
    semesterNumber: z.string().min(1, 'Semester Number is required'),
    semesterName: z.string().optional(),
    term_type: z.string().min(1, 'Term Type is required'),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    isActive: z.enum(['active', 'inactive']).default('inactive'),
    totalSubjects: z.string()
        .refine((val) => !val || !isNaN(Number(val)), 'Must be a valid number')
        .optional()
        .nullable(),
    totalCredits: z.string()
        .refine((val) => !val || !isNaN(Number(val)), 'Must be a valid number')
        .optional()
        .nullable(),
}).refine(data => {
    if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
});

export type SemesterFormData = z.infer<typeof semesterSchema>;
