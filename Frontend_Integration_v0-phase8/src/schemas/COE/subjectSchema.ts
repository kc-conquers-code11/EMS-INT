import * as z from "zod";

const positiveNumberString = z
  .string()
  .min(1, "Required")
  .refine(val => !isNaN(Number(val)) && Number(val) > 0, "Must be > 0");

export const subjectSchema = z.object({
  scheme_id:          z.string().min(1, "Scheme is required"),
  subject_name:       z.string().min(1, "Subject name is required"),
  subject_code:       z.string().min(1, "Subject code is required"),
  subject_type:       z.string().min(1, "Subject type is required"),
  semester:           z.string().min(1, "Semester is required"),
  status:             z.string().min(1, "Status is required"),
  credits:            positiveNumberString,
  max_theory:         positiveNumberString,
  max_practical:      positiveNumberString,
  max_oral:           positiveNumberString,
  max_tw:             positiveNumberString,
  min_pass_theory:    positiveNumberString,
  min_pass_practical: positiveNumberString,
  exam_duration_min:  positiveNumberString,
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;