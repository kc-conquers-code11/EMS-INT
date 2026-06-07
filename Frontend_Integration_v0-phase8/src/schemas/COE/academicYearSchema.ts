// src/schemas/COE/academicYearSchema.ts
import { z } from "zod";

export const academicYearSchema = z.object({
  academic_name: z.string().min(1, "Academic year is required").max(10, "Academic name too long"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  is_admission: z.number().min(0).max(1),
  current_ay: z.number().min(0).max(1),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.start_date) < new Date(data.end_date);
  }
  return true;
}, {
  message: "Start date must be before end date",
  path: ["end_date"],
});

export type AcademicYearFormValues = z.infer<typeof academicYearSchema>;