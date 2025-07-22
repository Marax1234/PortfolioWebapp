"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Settings, Loader2 } from "lucide-react"
import { useCurrentUser } from "./session-check"

interface LogoutButtonProps {
  variant?: "button" | "dropdown"
  showUserInfo?: boolean
  className?: string
}

export function LogoutButton({ 
  variant = "button", 
  showUserInfo = false,
  className = ""
}: LogoutButtonProps) {
  const { user, isLoading } = useCurrentUser()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut({ 
        callbackUrl: "/auth/signin",
        redirect: false 
      })
      // Manually redirect to ensure clean state
      window.location.href = "/auth/signin"
    } catch (error) {
      console.error('Sign out error:', error)
      setIsSigningOut(false)
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (!user) {
    return null
  }

  if (variant === "button") {
    return (
      <Button 
        variant="ghost" 
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={className}
      >
        {isSigningOut ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <LogOut className="h-4 w-4 mr-2" />
        )}
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </Button>
    )
  }

  // Dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`h-8 w-8 rounded-full ${className}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src="" // Add user avatar if available
              alt={user.firstName || user.email}
            />
            <AvatarFallback>
              {user.firstName 
                ? user.firstName[0].toUpperCase()
                : user.email[0].toUpperCase()
              }
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {showUserInfo && (
          <>
            <div className="flex items-center space-x-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src="" // Add user avatar if available
                  alt={user.firstName || user.email}
                />
                <AvatarFallback>
                  {user.firstName 
                    ? user.firstName[0].toUpperCase()
                    : user.email[0].toUpperCase()
                  }
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.email
                  }
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => router.push('/admin/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => router.push('/admin/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}