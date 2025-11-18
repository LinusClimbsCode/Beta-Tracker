import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

/**
 * Custom hook to access Auth context
 * Throws error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
