'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { TrendingUp, LayoutDashboard, List, LogOut, Menu, X, Sun, Moon } from 'lucide-react'
import { signOut } from '@/app/actions/transactions'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

interface AppNavProps {
  userEmail: string
}

export function AppNav({ userEmail }: AppNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle } = useTheme()

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transações', icon: List },
  ]

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white hidden sm:block">FinançasPessoais</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === href
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block truncate max-w-[180px]">
              {userEmail}
            </span>

            <button
              onClick={toggle}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>

            <button
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === href
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      )}
    </header>
  )
}
