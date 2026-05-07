import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ToggleThemeButton } from './ToggleThemeButton'
import { Button } from './Button'
import { ROUTES } from '@/constants'

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Title */}
          <Link to={ROUTES.HOME}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Beta Tracker
            </h1>
          </Link>

          {/* Right side: Nav links + Theme + Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-4">
                  <Link
                    to={ROUTES.GYMS}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    Gyms
                  </Link>
                  <Link
                    to={ROUTES.BOULDERS}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    Boulders
                  </Link>
                  <Link
                    to={ROUTES.PROFILE}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    Profile
                  </Link>
                </nav>

                {/* User info */}
                <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">
                  {user?.username}
                </span>
              </>
            )}

            {/* Theme Toggle */}
            <ToggleThemeButton />

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Button variant="danger" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
