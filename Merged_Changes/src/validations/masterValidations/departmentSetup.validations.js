const { z } = require('zod');

const coursesOfferedSchema = z
  .object({
    undergraduate: z.boolean().optional(),
    postgraduate: z.boolean().optional(),
    phd: z.boolean().optional(),
    diploma: z.boolean().optional(),
  })
  .passthrough()
  .optional();

const departmentBasicSchema = z.object({
  depart_name: z.string().min(1).max(200),
  depart_code: z.string().max(20).optional().nullable(),
  total_faculties: z.coerce.number().int().nonnegative(),
  total_students: z.coerce.number().int().nonnegative(),
  courses_offered: coursesOfferedSchema,
});

const hodSchema = z.object({
  hod_id: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  employee_code: z.string().min(1).max(100),
  mobile_number: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\d+$/, 'Mobile number must contain only digits'),
  email: z.string().email().max(255),
  personal_email: z.string().email().max(255).optional().nullable(),
  gender: z.enum(['Male', 'Female', 'Other']),
  qualification: z.string().min(1).max(255),
  specialization: z.string().min(1).max(255),
  designation: z.string().min(1).max(100),
  experience_years: z.coerce.number().int().nonnegative(),
  joining_date: z.string().min(1),
  profile_photo: z.string().optional().nullable(),
});

const teacherSchema = z.object({
  faculty_id: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  mobile_number: z
    .string()
    .min(10)
    .max(15)
    .regex(/^\d+$/, 'Mobile number must contain only digits'),
  college_email: z.string().email().max(255),
  personal_email: z.string().email().max(255).optional().nullable(),
  gender: z.enum(['Male', 'Female', 'Other']),
  qualification: z.string().min(1).max(255),
  specialization: z.string().min(1).max(255),
  designation: z.string().min(1).max(100),
  experience_years: z.coerce.number().int().nonnegative(),
  subjects_assigned: z.string().min(1),
  joining_date: z.string().min(1),
  profile_photo: z.string().optional().nullable(),
  branch_id: z.string().uuid().optional(),
});

const submitDepartmentSetupSchema = z.object({
  institution_id: z.string().uuid(),
  department: departmentBasicSchema,
  hod: hodSchema,
  faculty_members: z.array(teacherSchema).min(0).default([]),
});

const updateDepartmentSetupSchema = z.object({
  institution_id: z.string().uuid().optional(),
  department: departmentBasicSchema.partial().optional(),
  hod: hodSchema.partial().optional(),
  faculty_members: z.array(teacherSchema).optional(),
});

module.exports = {
  submitDepartmentSetupSchema,
  updateDepartmentSetupSchema,
  departmentBasicSchema,
  hodSchema,
  teacherSchema,
};
