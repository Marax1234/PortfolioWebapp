'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BarChart3,
  FileText,
  Images,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Settings,
  Users,
} from 'lucide-react';

import { LogoutButton } from '@/components/auth/logout-button';
import { SessionCheck } from '@/components/auth/session-check';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'Portfolio',
    href: '/admin/portfolio',
    icon: Images,
  },
  {
    name: 'Create Post',
    href: '/admin/portfolio/create',
    icon: PlusCircle,
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: FileText,
  },
  {
    name: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  // Add Logs page navigation
  {
    name: 'Logs',
    href: '/admin/logs',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <SessionCheck requireAdmin={true}>
      <div className='min-h-screen bg-slate-50'>
        {/* Top Navigation */}
        <header className='sticky top-0 z-40 border-b border-slate-200 bg-white'>
          <div className='px-4 sm:px-6 lg:px-8'>
            <div className='flex h-16 items-center justify-between'>
              {/* Logo/Brand */}
              <div className='flex items-center'>
                <Link href='/admin' className='flex items-center space-x-3'>
                  <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
                    <LayoutDashboard className='text-primary-foreground h-4 w-4' />
                  </div>
                  <div>
                    <h1 className='text-lg font-semibold text-slate-900'>
                      Admin Portal
                    </h1>
                    <p className='text-xs text-slate-500'>
                      Portfolio Management
                    </p>
                  </div>
                </Link>
              </div>

              {/* User Actions */}
              <div className='flex items-center space-x-4'>
                {/* View Site Link */}
                <Button asChild variant='ghost' size='sm'>
                  <Link href='/' target='_blank'>
                    View Site
                  </Link>
                </Button>

                {/* User Menu */}
                <LogoutButton variant='dropdown' showUserInfo={true} />
              </div>
            </div>
          </div>
        </header>

        <div className='flex'>
          {/* Sidebar */}
          <aside className='sticky top-16 min-h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white'>
            <nav className='space-y-2 p-4'>
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href, item.exact);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    <Icon className='h-4 w-4' />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className='flex-1 p-6'>
            <div className='mx-auto max-w-7xl'>{children}</div>
          </main>
        </div>
      </div>
    </SessionCheck>
  );
}
