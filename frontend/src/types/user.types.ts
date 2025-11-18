import { UserRole, UserLevel } from './common.types'

// User type (as returned by API - no password!)
export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  emailVerified: boolean
  level: UserLevel
  experiencePoints: number
  trustPoints: number
  validationPower: number
  setter: boolean
  createdAt: string
  updatedAt: string
}

// Auth Request/Response Types
export interface RegisterRequest {
  email: string
  username: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user: User
}

export interface VerifyEmailRequest {
  token: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}
