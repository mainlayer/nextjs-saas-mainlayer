import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  trend: { value: number; direction: 'up' | 'down' } | null
}

/**
 * A single stat card for the dashboard overview.
 */
export function StatsCard({ title, value, subtitle, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      </div>

      <p className="text-3xl font-bold text-gray-900">{value}</p>

      <div className="mt-2 flex items-center gap-2">
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              trend.direction === 'up' ? 'text-green-600' : 'text-red-500',
            )}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value}%
          </span>
        )}
        <span className="text-xs text-gray-500">{subtitle}</span>
      </div>
    </div>
  )
}
