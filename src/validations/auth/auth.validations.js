const { z } = require('zod');

const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

module.exports = { loginSchema };
