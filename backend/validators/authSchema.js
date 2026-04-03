const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
    phone: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

module.exports = { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema };
