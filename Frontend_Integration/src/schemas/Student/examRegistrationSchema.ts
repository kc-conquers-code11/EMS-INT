import { z } from "zod";

export const examRegistrationSchema = z.object({
  sid: z.string().min(1, "Student ID is required"),
  event_id: z.number({ message: "Exam Event must be a valid number" }),
  reg_type: z.string().min(1, "Registration type is required"),
  reg_status: z.string().optional(),
  selected_subjects: z.array(z.number()).min(1, "At least one subject must be selected for registration").max(10, "Maximum allowed subjects is 10"),
});

export type ExamRegistrationFormValues = z.infer<typeof examRegistrationSchema>;

export const backlogRegistrationSchema = z.object({
  sid: z.string().min(1, "Student ID is required"),
  event_id: z.number({ message: "Exam Event must be a valid number" }),
  selected_subjects: z
    .array(z.number())
    .min(1, "At least one subject must be selected for backlog registration")
    .max(10, "Maximum allowed subjects is 10"),
  total_fee: z.number().min(0, "Total fee cannot be negative"),
  payment_status: z.string().optional(),
});

export type BacklogRegistrationFormValues = z.infer<
  typeof backlogRegistrationSchema
>;
