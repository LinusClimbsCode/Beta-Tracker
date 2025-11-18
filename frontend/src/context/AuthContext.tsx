import { createContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '@/services'
import type { User, LoginRequest, RegisterRequest } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

// Create context with undefined default (will be provided by AuthProvider)
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = user !== null

  // Check authentication status on mount
  const checkAuth = async () => {
    try {
      setIsLoading(true)
      const userData = await authService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      // User is not authenticated or token expired
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Login user
  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials)
    setUser(response.user)
  }

  // Register user
  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data)
    setUser(response.user)
  }

  // Logout user
  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
