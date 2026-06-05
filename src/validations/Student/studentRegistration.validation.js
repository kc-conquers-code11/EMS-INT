const { z } = require('zod');

// Step 1: Request OTP validation
const requestOTPSchema = z.object({
    email: z.string().email('Valid email is required').min(1, 'Email is required'),
});

// Step 2: Verify OTP validation
const verifyOTPSchema = z.object({
    email: z.string().email('Valid email is required'),
    otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

// Step 3: Complete registration validation
const registerStudentSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    first_name: z.string().min(1, 'First name is required').max(255, 'First name too long'),
    middle_name: z.string().max(255, 'Middle name too long').optional().nullable(),
    last_name: z.string().min(1, 'Last name is required').max(255, 'Last name too long'),
    contact: z.string().length(10, 'Contact number must be 10 digits').regex(/^\d+$/, 'Contact must contain only numbers'),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
    gender_id: z.number().int().positive('Gender ID is required'),
    email: z.string().email('Valid email is required'), // Should match the email used for OTP
    religion: z.string().max(400, 'Religion too long').optional().nullable(),
    community: z.string().max(400, 'Community too long').optional().nullable(),
    minority: z.string().max(100, 'Minority too long').optional().nullable(),
    caste: z.string().max(50, 'Caste too long').optional().nullable(),
    sub_caste: z.string().max(100, 'Sub caste too long').optional().nullable(),
    nationality: z.string().max(200, 'Nationality too long').optional().nullable(),
    place_of_birth: z.string().max(500, 'Place of birth too long').optional().nullable(),
    child_number: z.string().max(4, 'Child number too long').optional().nullable(),
    landline_number: z.string().max(10, 'Landline number too long').optional().nullable(),
    married_status: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).optional().nullable(),
    guardian_relation: z.string().max(50, 'Guardian relation too long').optional().nullable(),
    aadhar_number: z.string().max(100, 'Aadhar number too long').optional().nullable(),
    last_college_attended: z.string().max(500, 'Last college name too long').optional().nullable(),
    is_parent_have_domicile: z.enum(['Yes', 'No']).optional().nullable(),
    mother_name: z.string().max(255, 'Mother name too long').optional().nullable(),
    pan: z.string().max(255, 'PAN number too long').optional().nullable(),
    blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().nullable(),

    // Program and academic details (required for students table)
    program_id: z.string().uuid('Program ID must be a valid UUID'),
    cat_id: z.string().uuid().optional().nullable(),
    seat_type_id: z.string().uuid().optional().nullable(),
    branch_id: z.string().uuid('Branch ID must be a valid UUID'),
    academic_year: z.string().max(20, 'Academic year too long').optional().nullable(),

    // Parent details (father, mother, guardian)
    father: z.object({
        fullname: z.string().max(500, 'Father name too long'),
        contact: z.string().length(10, 'Contact must be 10 digits').regex(/^\d+$/, 'Contact must contain only numbers'),
        email: z.string().email('Valid email required').optional().nullable(),
        occupation: z.string().max(200, 'Occupation too long').optional().nullable(),
        designation: z.string().max(200, 'Designation too long').optional().nullable(),
        income: z.string().max(20, 'Income too long').optional().nullable(),
    }),
    mother: z.object({
        fullname: z.string().max(500, 'Mother name too long'),
        contact: z.string().length(10, 'Contact must be 10 digits').regex(/^\d+$/, 'Contact must contain only numbers'),
        email: z.string().email('Valid email required').optional().nullable(),
        occupation: z.string().max(200, 'Occupation too long').optional().nullable(),
        designation: z.string().max(200, 'Designation too long').optional().nullable(),
        income: z.string().max(20, 'Income too long').optional().nullable(),
    }),
    guardian: z.object({
        fullname: z.string().max(500, 'Guardian name too long'),
        contact: z.string().length(10, 'Contact must be 10 digits').regex(/^\d+$/, 'Contact must contain only numbers'),
        email: z.string().email('Valid email required').optional().nullable(),
        occupation: z.string().max(200, 'Occupation too long').optional().nullable(),
        designation: z.string().max(200, 'Designation too long').optional().nullable(),
        income: z.string().max(20, 'Income too long').optional().nullable(),
    }),
});

// Step 4: Confirm registration validation
const confirmRegistrationSchema = z.object({});

// Temp token param validation
const tempTokenParamSchema = z.object({
    temp_token: z.string().min(1, 'Temporary token is required'),
});

module.exports = {
    requestOTPSchema,
    verifyOTPSchema,
    registerStudentSchema,
    confirmRegistrationSchema,
    tempTokenParamSchema,
};