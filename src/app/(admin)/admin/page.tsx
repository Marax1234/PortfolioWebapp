"use client"

import { useEffect, useState } from "react"
import { useCurrentUser } from "@/components/auth/session-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Images, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Eye
} from "lucide-react"

interface DashboardStats {
  totalPortfolioItems: number
  publishedItems: number
  draftItems: number
  totalInquiries: number
  newInquiries: number
  totalViews: number
  recentActivity: string[]
}

export default function AdminDashboard() {
  const { user } = useCurrentUser()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Mock data - in real app, fetch from API
        const mockStats: DashboardStats = {
          totalPortfolioItems: 8,
          publishedItems: 8,
          draftItems: 0,
          totalInquiries: 2,
          newInquiries: 1,
          totalViews: 1247,
          recentActivity: [
            "New inquiry from Maria Schmidt",
            "Portfolio item 'Alpenglow in the Bavarian Alps' published",
            "Category 'Nature Photography' updated",
            "New portfolio item draft saved"
          ]
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStats(mockStats)
      } catch (err) {
        setError('Failed to load dashboard statistics')
        console.error('Dashboard error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getCurrentTime = () => {
    return new Date().toLocaleString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome back, {user?.firstName || user?.email}! Here&apos;s your portfolio overview.
        </p>
        <div className="flex items-center space-x-2 mt-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">{getCurrentTime()}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button>
          <Images className="w-4 h-4 mr-2" />
          New Portfolio Item
        </Button>
        <Button variant="outline">
          <Users className="w-4 h-4 mr-2" />
          View Inquiries
        </Button>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Statistics Cards */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-8 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Portfolio Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
              <Images className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPortfolioItems}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedItems} published, {stats.draftItems} drafts
              </p>
            </CardContent>
          </Card>

          {/* Published Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedItems}</div>
              <p className="text-xs text-muted-foreground">
                Live on your portfolio
              </p>
            </CardContent>
          </Card>

          {/* Inquiries */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInquiries}</div>
              <p className="text-xs text-muted-foreground">
                {stats.newInquiries} new this week
              </p>
            </CardContent>
          </Card>

          {/* Total Views */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Portfolio views this month
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentActivity ? (
              <div className="space-y-3">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-slate-600">{activity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recent activity</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Portfolio performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Featured Items</span>
                <span className="text-sm font-medium">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Active Categories</span>
                <span className="text-sm font-medium">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Newsletter Subscribers</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Account Status</span>
                <span className="text-sm font-medium text-green-600">
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-green-600 font-semibold">✓ Database</div>
              <div className="text-xs text-slate-500">Connected</div>
            </div>
            <div className="text-center">
              <div className="text-green-600 font-semibold">✓ Authentication</div>
              <div className="text-xs text-slate-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-green-600 font-semibold">✓ File Storage</div>
              <div className="text-xs text-slate-500">Available</div>
            </div>
            <div className="text-center">
              <div className="text-green-600 font-semibold">✓ API</div>
              <div className="text-xs text-slate-500">Operational</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}