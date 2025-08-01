"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LogIn, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useCurrentUser } from "@/components/auth/session-check"
import { LogoutButton } from "@/components/auth/logout-button"
import Image from "next/image"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="Portfolio Logo"
                width={40}
                height={40}
                className="rounded-full"
                onError={() => {
                  // Fallback if logo doesn't exist
                }}
              />
              <span className="font-bold text-lg">Kilian Siebert</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth Section */}
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                  <LogoutButton variant="dropdown" />
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link href="/auth/signin">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 border-t border-slate-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      href="/admin"
                      className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Link>
                    <div className="px-3">
                      <LogoutButton variant="dropdown" className="w-full justify-start" />
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="flex items-center px-3 py-2 text-base font-medium text-primary hover:bg-accent hover:text-accent-foreground rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}