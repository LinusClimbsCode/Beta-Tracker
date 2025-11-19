import api from './api.service'
import { API_ENDPOINTS } from '@/constants'
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from '@/types'

/**
 * Register a new user
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data)
  return response.data
}

/**
 * Login user
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data)
  return response.data
}

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.LOGOUT)
}

/**
 * Verify email with token
 */
export const verifyEmail = async (data: VerifyEmailRequest): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data)
  return response.data
}

/**
 * Resend verification email
 */
export const resendVerification = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION)
  return response.data
}

/**
 * Request password reset
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
  return response.data
}

/**
 * Reset password with token
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
  return response.data
}

/**
 * Get current authenticated user (check if still logged in)
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<{ success: boolean; user: User }>('/auth/me')
  return response.data.user
}
