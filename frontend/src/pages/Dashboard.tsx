import { useAuth } from '@/hooks/useAuth'
import { StatCard } from '@/components'
import { MainLayout } from '@/layouts'

export function Dashboard() {
  const { user } = useAuth()

  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Welcome, {user?.username}!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Email" value={user?.email} color="blue" />
          <StatCard label="Level" value={user?.level} color="green" />
          <StatCard label="Experience Points" value={`${user?.experiencePoints} XP`} color="purple" />
          <StatCard label="Trust Points" value={user?.trustPoints} color="yellow" />
          <StatCard label="Role" value={<span className="capitalize">{user?.role}</span>} color="red" />
          <StatCard
            label="Email Verified"
            value={user?.emailVerified ? '✓ Verified' : '✗ Not Verified'}
            color="indigo"
          />
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
    </MainLayout>
  )
}
