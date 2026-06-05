import { z } from 'zod';

export const searchStudentSchema = z.object({
  enrollmentId: z.string().optional(),
  studentName: z.string().optional(),
  semester: z.string().min(1, 'Semester is required'),
  branch: z.string().min(1, 'Branch is required'),
  scheme: z.string().min(1, 'Scheme is required'),
  examType: z.string().min(1, 'Exam Type is required'),
  academicYear: z.string().min(1, 'Academic Year is required'),
});

export const feeConfigurationSchema = z.object({
  examType: z.string().min(1, 'Exam Type is required'),
  semester: z.string().min(1, 'Semester is required'),
  branch: z.string().min(1, 'Branch is required'),
  amount: z.number().min(0, 'Amount must be a positive number'),
  backlogAmountPerSubject: z.number().min(0, 'Backlog Amount must be a positive number'),
  lateFee: z.number().min(0, 'Late Fee must be a positive number'),
  isActive: z.boolean(),
});

export const notificationSchema = z.object({
  targetGroup: z.string().min(1, 'Target Group is required'),
  branch: z.string().optional(),
  semester: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  methods: z.array(z.string()).min(1, 'Select at least one notification method'),
});

export type SearchStudentFormData = z.infer<typeof searchStudentSchema>;
export type FeeConfigurationFormData = z.infer<typeof feeConfigurationSchema>;
export type NotificationFormData = z.infer<typeof notificationSchema>;
