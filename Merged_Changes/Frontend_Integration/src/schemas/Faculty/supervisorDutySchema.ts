import { z } from "zod";

/**
 * Zod schema for updating a supervisor allocation record.
 * Maps to the supervisor_allocation DB table schema.
 */
export const supervisorAllocationSchema = z.object({
  duty_id: z.number().int().positive(),
  
  timetable_id: z.number().int().positive().optional(),
  
  room_id: z.number().int().positive().optional(),
  
  faculty_id: z.number().int().positive().optional(),
  
  duty_status: z.enum(
    ["Pending", "Accepted", "Conflict", "Hold"] as const,
    { message: "Please specify a valid duty status" }
  ),
  
  assigned_at: z.string().datetime().optional(),
  
  accepted_at: z.string().datetime().optional(),
  
  remarks: z.string().max(1000, "Remarks cannot exceed 1000 characters").optional()
});

export type SupervisorAllocationFormValues = z.infer<typeof supervisorAllocationSchema>;
