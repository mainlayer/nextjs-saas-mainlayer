'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from 'next-auth'
import { cn } from '@/lib/utils'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { LayoutDashboard, Settings, CreditCard, Home } from 'lucide-react'

interface SidebarProps {
  user: User
}

const navItems = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Billing', href: ROUTES.billing, icon: CreditCard },
  { label: 'Settings', href: ROUTES.settings, icon: Settings },
]

/**
 * Dashboard sidebar with navigation and user info.
 */
export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 border-r bg-white flex flex-col">
      {/* Logo */}
      <div className="h-16 border-b flex items-center px-5">
        <Link href={ROUTES.home} className="text-lg font-bold text-gray-900">
          {APP_NAME}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <div className="pt-2 border-t mt-2">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Home className="h-4 w-4 shrink-0" />
            Back to site
          </Link>
        </div>
      </nav>

      {/* User info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? 'User'}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">
                {user.name?.[0] ?? user.email?.[0] ?? '?'}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
