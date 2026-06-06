import * as z from "zod";

export const programmeSchema = z.object({
  institution_id: z.string().uuid("Institution ID is required"),
  depart_id: z.string().uuid("Department ID is required"),
  programme_name: z.string().min(1, "Programme name is required").max(255, "Programme name must be less than 255 characters"),
  programme_code: z.string().max(20, "Programme code must be less than 20 characters").optional().nullable(),
  degree_type: z.string().max(50, "Degree type must be less than 50 characters").optional().nullable(),
  duration_years: z.coerce.number().int().positive().optional().nullable(),
  total_semesters: z.coerce.number().int().positive().optional().nullable(),
  approved_intake: z.coerce.number().int().nonnegative().optional().nullable(),
  status: z.boolean().default(true),
});

export type ProgrammeFormValues = z.infer<typeof programmeSchema>;
