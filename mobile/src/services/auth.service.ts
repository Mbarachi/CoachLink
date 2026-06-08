import api from './api';
import type { User } from '@/types';

export interface SignUpDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}

export const authService = {
  signUp: (dto: SignUpDto) =>
    api.post<AuthResponse>('/auth/signup', dto).then((r) => r.data),

  signIn: (dto: SignInDto) =>
    api.post<AuthResponse>('/auth/signin', dto).then((r) => r.data),

  verifyOtp: (dto: VerifyOtpDto) =>
    api.post<{ verified: boolean }>('/auth/verify-otp', dto).then((r) => r.data),

  forgotPassword: (dto: ForgotPasswordDto) =>
    api.post('/auth/forgot-password', dto).then((r) => r.data),

  resetPassword: (dto: ResetPasswordDto) =>
    api.post('/auth/reset-password', dto).then((r) => r.data),
};
