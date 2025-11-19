import { ReactNode } from 'react'

type StatCardColor = 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo' | 'orange'

interface StatCardProps {
  label: string
  value: ReactNode
  color?: StatCardColor
  className?: string
}

const colorStyles: Record<StatCardColor, string> = {
  blue: 'bg-blue-50 dark:bg-blue-900/20',
  green: 'bg-green-50 dark:bg-green-900/20',
  purple: 'bg-purple-50 dark:bg-purple-900/20',
  yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
  red: 'bg-red-50 dark:bg-red-900/20',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
  orange: 'bg-orange-50 dark:bg-orange-900/20',
}

export function StatCard({ label, value, color = 'blue', className = '' }: StatCardProps) {
  return (
    <div className={`p-4 ${colorStyles[color]} rounded-lg ${className}`}>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-lg font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}
