import { z } from "zod";

/*
 * Zod schema for assigning / editing a user-finalization record.
 *
 * The admin selects a faculty member (uid from the `users` table)
 * and assigns them a specific role for a subject exam session.
 */
export const userFinalizationSchema = z.object({
  uid: z
    .number({ message: "Please select a faculty member" })
    .min(1, "Please select a faculty member"),

  role: z.enum(
    ["Evaluator", "Paper Setter", "Moderator", "Scanning Operator"] as const,
    { message: "Please select a valid role" }
  ),

  exam_session: z
    .string({ message: "Please select an exam session" })
    .min(1, "Please select an exam session")
    .refine(
      (val) => /^(Summer|Winter)\s\d{4}$/.test(val),
      { message: "Exam session must be in format 'Summer 2026' or 'Winter 2026'" }
    ),

  subject_name: z
    .string({ message: "Please select a subject" })
    .min(1, "Please select a subject")
    .max(255, "Subject name must be under 255 characters"),
});

export type UserFinalizationFormValues = z.infer<typeof userFinalizationSchema>;
