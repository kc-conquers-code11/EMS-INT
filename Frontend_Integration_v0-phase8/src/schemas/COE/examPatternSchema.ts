// src/schemas/COE/examPatternSchema.ts
import { z } from "zod";

export const examPatternSchema = z.object({
  programm_id: z
    .string({ message: "Please select a valid Program ID / Applicable Scheme" })
    .min(1, "Please select a valid Program ID / Applicable Scheme"),
  pattern_name: z
    .string()
    .min(2, "Pattern Name must be between 2 and 200 characters")
    .max(200, "Pattern Name must be between 2 and 200 characters"),
  grading_type: z
    .string()
    .min(1, "Please choose a valid Grading Type")
    .max(20, "Grading Type must be under 20 characters"),
  grace_marks_allowed: z.number().min(0).max(1),
  grace_marks_max: z
    .number({ message: "Max grace marks must be between 0 and 50" })
    .min(0, "Max grace marks must be between 0 and 50")
    .max(50, "Max grace marks must be between 0 and 50"),
  atkt_rule: z
    .string()
    .min(4, "ATKT rule description is required (min 4 characters)"),
  rounding_rule: z
    .string()
    .max(100, "Rounding rule cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),
  passing_criteria: z
    .string()
    .min(4, "Passing criteria description is required (min 4 characters)"),
  detention_criteria: z
    .string()
    .min(4, "Detention criteria description is required (min 4 characters)"),
  semester: z.string().min(1, "Please select a semester"),
  academic_year: z.string().min(1, "Please select an academic year").optional(),
  fa_marks: z
    .number({ message: "Must be a number" })
    .min(0, "FA marks must be between 0 and 100")
    .max(100, "FA marks must be between 0 and 100")
    .optional(),
  sa_marks: z
    .number({ message: "Must be a number" })
    .min(0, "SA marks must be between 0 and 100")
    .max(100, "SA marks must be between 0 and 100")
    .optional(),
  term_work: z
    .number({ message: "Must be a number" })
    .min(0, "Term Work must be between 0 and 100")
    .max(100, "Term Work must be between 0 and 100")
    .optional(),
  practical: z
    .number({ message: "Must be a number" })
    .min(0, "Practical marks must be between 0 and 100")
    .max(100, "Practical marks must be between 0 and 100")
    .optional(),
  oral: z
    .number({ message: "Must be a number" })
    .min(0, "Oral marks must be between 0 and 100")
    .max(100, "Oral marks must be between 0 and 100")
    .optional(),
});

export type ExamPatternFormValues = z.infer<typeof examPatternSchema>;
