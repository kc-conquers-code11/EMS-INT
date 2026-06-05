import { z } from 'zod';

export const emergencyActionSchema = z.object({
  eventId: z.string().min(1, "Please select an exam event"),
  action: z.enum(["Cancel", "Interrupt", "Reschedule"]),
  reason: z.string().min(10, "Please provide a detailed reason (minimum 10 characters)"),
});

export type EmergencyActionFormValues = z.infer<typeof emergencyActionSchema>;
