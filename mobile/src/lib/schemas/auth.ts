import { z } from 'zod';

import { passwordSchema } from './password';

const NIGERIAN_PHONE = /^0\d{10}$/;

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, 'Full name is required'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    phoneNumber: z
      .string()
      .trim()
      .min(1, 'Phone number is required')
      .refine(v => NIGERIAN_PHONE.test(v.replace(/\s/g, '')), 'Enter a valid 11-digit phone number'),
    address: z.string().trim().min(1, 'Address is required'),
    state: z.string().min(1, 'State is required'),
    lga: z.string().min(1, 'LGA is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(v => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpValues = z.infer<typeof signUpSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(v => v.newPassword === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
