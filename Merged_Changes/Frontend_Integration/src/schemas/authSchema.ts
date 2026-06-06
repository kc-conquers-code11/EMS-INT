import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
    studentName: z.string().min(2, 'Student Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signUpStepTwoSchema = z.object({
    stud_clg_id: z.string().min(1, 'Student College ID is required'),
    enrollment_number: z.string().min(1, 'Enrollment number is required'),
    uid: z.string().optional(),
    gr_number: z.string().min(1, 'GR Number is required'),
    programm_id: z.string().min(1, 'Please select a program'),
    branch_id: z.string().min(1, 'Please select a branch'),
    academic_year: z.string().min(1, 'Please select an academic year'),
    cat_id: z.string().min(1, 'Please select a category'),
    gender: z.string().min(1, 'Please select gender'),
    seat_type_id: z.string().optional(),
    physically_handicap: z.string().min(1, 'Please select handicap status'),
    defence_status: z.string().min(1, 'Please select defence status'),
    contactNo: z.string().regex(/^\d{10}$/, 'Must be a 10-digit number'),
});

export type SignUpStepTwoFormData = z.infer<typeof signUpStepTwoSchema>;

export const signUpStepThreeSchema = z.object({
    otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers')
});

export type SignUpStepThreeFormData = z.infer<typeof signUpStepThreeSchema>;

// --- Faculty Schemas ---

export const facultySignUpSchema = z.object({
    name: z.string().min(2, 'Faculty Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export type FacultySignUpFormData = z.infer<typeof facultySignUpSchema>;

export const facultySignUpStepTwoSchema = z.object({
    faculty_clg_id: z.string().min(1, 'Faculty ID is required'),
    contact: z.string().regex(/^\d{10,11}$/, 'Must be a 10 or 11-digit number'),
    department: z.string().min(1, 'Department is required'),
    designation: z.string().min(1, 'Designation is required'),
    role: z.enum(['Examiner', 'Invigilator', 'Admin', 'Paper Setter'], {
        errorMap: () => ({ message: 'Please select a valid role' })
    } as any),
    qualification: z.string().min(1, 'Qualification is required'),
    pan_no: z.string().min(10, 'PAN should be 10 characters').max(10),
    aadhar_card: z.string().min(12, 'Aadhar should be 12 digits').max(12),
    permanent_address: z.string().min(1, 'Permanent address is required'),
    current_address: z.string().min(1, 'Current address is required'),
    dob: z.string().min(1, 'Date of Birth is required').refine(val => new Date(val) < new Date(), { message: 'Date of birth must be in the past' }),
    gender: z.string().min(1, 'Gender is required'),
});

export type FacultySignUpStepTwoFormData = z.infer<typeof facultySignUpStepTwoSchema>;

