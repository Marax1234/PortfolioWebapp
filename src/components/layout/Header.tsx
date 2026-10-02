'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { LogIn, Menu, Settings, X } from 'lucide-react';

import { LogoutButton } from '@/components/auth/logout-button';
import { useCurrentUser } from '@/components/auth/session-check';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useCurrentUser();

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center space-x-2'>
              <Image
                src='/images/logo.png'
                alt='Portfolio Logo'
                width={40}
                height={40}
                className='rounded-full'
                onError={() => {
                  // Fallback if logo doesn't exist
                }}
              />
              <span className='text-lg font-bold'>Kilian Siebert</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden items-center space-x-6 md:flex'>
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map(item => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className='group bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50'>
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth Section */}
            <div className='flex items-center space-x-2 border-l border-slate-200 pl-6'>
              {isAuthenticated ? (
                <div className='flex items-center space-x-2'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href='/admin'>
                      <Settings className='mr-2 h-4 w-4' />
                      Admin
                    </Link>
                  </Button>
                  <LogoutButton variant='dropdown' />
                </div>
              ) : (
                <Button asChild size='sm'>
                  <Link href='/auth/signin'>
                    <LogIn className='mr-2 h-4 w-4' />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='inline-flex items-center justify-center p-2'
            >
              <span className='sr-only'>Open main menu</span>
              {mobileMenuOpen ? (
                <X className='h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='h-6 w-6' aria-hidden='true' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className='md:hidden'>
            <div className='space-y-1 border-t border-slate-200 px-2 pt-2 pb-3'>
              {navigation.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='text-foreground hover:bg-accent hover:text-accent-foreground block rounded-md px-3 py-2 text-base font-medium'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className='mt-4 border-t border-slate-200 pt-4'>
                {isAuthenticated ? (
                  <div className='space-y-2'>
                    <Link
                      href='/admin'
                      className='text-foreground hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-base font-medium'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className='mr-2 h-4 w-4' />
                      Admin Dashboard
                    </Link>
                    <div className='px-3'>
                      <LogoutButton
                        variant='dropdown'
                        className='w-full justify-start'
                      />
                    </div>
                  </div>
                ) : (
                  <Link
                    href='/auth/signin'
                    className='text-primary hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-base font-medium'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className='mr-2 h-4 w-4' />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
