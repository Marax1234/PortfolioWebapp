"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SessionCheck } from "@/components/auth/session-check"
import { LogoutButton } from "@/components/auth/logout-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Images,
  Users,
  Settings,
  FileText,
  BarChart3,
  PlusCircle,
  MessageSquare
} from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'Portfolio',
    href: '/admin/portfolio',
    icon: Images
  },
  {
    name: 'Create Post',
    href: '/admin/portfolio/create',
    icon: PlusCircle
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: FileText
  },
  {
    name: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  // Add Logs page navigation
  {
    name: 'Logs',
    href: '/admin/logs',
    icon: FileText
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  const isActiveRoute = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <SessionCheck requireAdmin={true}>
      <div className="min-h-screen bg-slate-50">
        {/* Top Navigation */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <Link href="/admin" className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-slate-900">Admin Portal</h1>
                    <p className="text-xs text-slate-500">Portfolio Management</p>
                  </div>
                </Link>
              </div>

              {/* User Actions */}
              <div className="flex items-center space-x-4">
                {/* View Site Link */}
                <Button asChild variant="ghost" size="sm">
                  <Link href="/" target="_blank">
                    View Site
                  </Link>
                </Button>

                {/* User Menu */}
                <LogoutButton variant="dropdown" showUserInfo={true} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] sticky top-16">
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = isActiveRoute(item.href, item.exact)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionCheck>
  )
}