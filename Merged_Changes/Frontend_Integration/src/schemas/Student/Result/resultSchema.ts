import { z } from 'zod';

export const resultSubjectSchema = z.object({
  courseCode: z.string(),
  courseTitle: z.string(),
  courseCredits: z.object({
    value: z.string(),
    type: z.string(),
  }),
  ese: z.object({
    min: z.string(),
    max: z.string(),
    obtained: z.string(),
  }),
  iaTw: z.object({
    max: z.string(),
    obtained: z.string(),
  }),
  overall: z.object({
    max: z.string(),
    obtained: z.string(),
  }),
  creditsEarned: z.string(),
  gradePoints: z.object({
    points: z.string(),
    grade: z.string(),
  }),
  cxg: z.string(),
});

export const studentResultSchema = z.object({
  studentName: z.string(),
  semester: z.string(),
  examination: z.string(),
  academicYear: z.string(),
  seatNumber: z.string(),
  subjects: z.array(resultSubjectSchema),
  totalCredits: z.string(),
  totalCxg: z.string(),
  remark: z.string(),
  sgpi: z.string(),
  marksObtained: z.string(),
  totalMarks: z.string(),
});

export type ResultSubjectInput = z.infer<typeof resultSubjectSchema>;
export type StudentResultInput = z.infer<typeof studentResultSchema>;
