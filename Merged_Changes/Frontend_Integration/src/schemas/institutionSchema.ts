import { z } from 'zod';

export const institutionSchema = z.object({
    // Basic Details
    institutionName: z.string().min(1, 'Institution Name is required'),
    institutionCode: z.string().regex(/^\d+$/, 'Institution Code must be numeric'),
    institutionType: z.string().min(1, 'Type is required'),
    establishmentYear: z.string().regex(/^\d{4}$/, 'Must be a valid 4-digit year'),
    affiliatedUniversity: z.string().min(1, 'Affiliated University is required'),
    courses: z.object({
        postgraduate: z.boolean().optional(),
        undergraduate: z.boolean().optional(),
        phd: z.boolean().optional(),
        other: z.array(z.object({ value: z.string() })).optional(),
    }).optional(),
    accreditation: z.object({
        nba: z.boolean().optional(),
        naac: z.boolean().optional(),
        aicte: z.boolean().optional(),
        other: z.array(z.object({ value: z.string() })).optional(),
    }).optional(),
    logoUrl: z.string().url('Invalid Logo URL').optional().or(z.literal('')),

    // Contact Information
    road: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    officialEmail: z.string().email('Invalid email address'),
    websiteUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    phoneNumber: z.string().regex(/^\d{10,}$/, 'Phone number must be at least 10 digits'),
    alternatePhoneNumber: z.string().regex(/^\d{10,}$/, 'Phone number must be at least 10 digits').optional().or(z.literal('')),

    // COE Details
    coeName: z.string().min(1, 'COE Name is required'),
    coeEmployeeId: z.string().regex(/^\d+$/, 'Employee ID must be numeric'),
    coeEmail: z.string().email('Invalid COE email'),
    coeContactNumber: z.string().regex(/^\d{10,}$/, 'Phone number must be at least 10 digits'),
    coeQualification: z.string().min(1, 'Qualification is required'),
});