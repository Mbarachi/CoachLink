import { z } from 'zod';

/**
 * Single source of truth for password strength — drives both the Zod schema
 * used for submit-time validation and the live checklist shown under the field.
 */
export const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw: string) => /[0-9]/.test(pw) },
  { label: 'One special character', test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
] as const;

export const isPasswordValid = (pw: string) => PASSWORD_RULES.every(rule => rule.test(pw));

export const unmetPasswordRules = (pw: string) => PASSWORD_RULES.filter(rule => !rule.test(pw));

/** Each rule becomes its own refinement so the first failure names the rule. */
export const passwordSchema = PASSWORD_RULES.reduce<z.ZodType<string>>(
  (schema, rule) => schema.refine(rule.test, { message: rule.label }),
  z.string().min(1, 'Password is required'),
);
