import { useAuth } from '@/hooks/useAuth'
import { ToggleThemeButton } from '@/components'

export function Dashboard() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Boulder Strava
          </h1>
          <div className="flex items-center gap-4">
            <ToggleThemeButton />
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Welcome, {user?.username}!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.email}</p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.level}</p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Experience Points</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.experiencePoints} XP</p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Trust Points</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.trustPoints}</p>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">{user?.role}</p>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Email Verified</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {user?.emailVerified ? '✓ Verified' : '✗ Not Verified'}
              </p>
            </div>
          </div>

          {user?.setter && (
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                🏆 Community Setter Badge
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You have earned the Community Setter badge! (25+ approved submissions)
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
