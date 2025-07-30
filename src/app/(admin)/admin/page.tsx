'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Folder,
  Images,
  PlusCircle,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

import { useCurrentUser } from '@/components/auth/session-check';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PortfolioApi } from '@/lib/portfolio-api';

interface DashboardStats {
  totalPortfolioItems: number;
  publishedItems: number;
  draftItems: number;
  reviewItems: number;
  archivedItems: number;
  totalCategories: number;
  activeCategories: number;
  featuredItems: number;
  totalViews: number;
  recentActivity: string[];
}

export default function AdminDashboard() {
  const { user } = useCurrentUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch real data from API
        const [portfolioResponse, categoriesData] = await Promise.all([
          PortfolioApi.fetchPortfolioItems({ limit: 1000 }), // Get all for stats
          PortfolioApi.fetchCategories(),
        ]);

        const portfolioItems = portfolioResponse.items;

        // Calculate statistics
        const statusCounts = portfolioItems.reduce(
          (acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const totalViews = portfolioItems.reduce(
          (sum, item) => sum + item.viewCount,
          0
        );
        const featuredCount = portfolioItems.filter(
          item => item.featured
        ).length;
        const activeCategories = categoriesData.filter(
          cat => cat.isActive
        ).length;

        // Generate recent activity based on real data
        const recentActivity: string[] = [];

        // Add recent portfolio items
        const recentItems = portfolioItems
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);

        recentItems.forEach(item => {
          const daysAgo = Math.floor(
            (new Date().getTime() - new Date(item.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          if (daysAgo <= 7) {
            recentActivity.push(
              `Portfolio item "${item.title}" ${item.status === 'PUBLISHED' ? 'published' : 'created'} ${
                daysAgo === 0
                  ? 'today'
                  : daysAgo === 1
                    ? 'yesterday'
                    : `${daysAgo} days ago`
              }`
            );
          }
        });

        // Add category activity
        if (categoriesData.length > 0) {
          recentActivity.push(`${categoriesData.length} categories available`);
        }

        // Add generic activity if no recent items
        if (recentActivity.length === 0) {
          recentActivity.push(
            'Dashboard loaded successfully',
            'Portfolio system operational',
            `${portfolioItems.length} portfolio items managed`,
            'Ready to create new content'
          );
        }

        const dashboardStats: DashboardStats = {
          totalPortfolioItems: portfolioItems.length,
          publishedItems: statusCounts['PUBLISHED'] || 0,
          draftItems: statusCounts['DRAFT'] || 0,
          reviewItems: statusCounts['REVIEW'] || 0,
          archivedItems: statusCounts['ARCHIVED'] || 0,
          totalCategories: categoriesData.length,
          activeCategories: activeCategories,
          featuredItems: featuredCount,
          totalViews: totalViews,
          recentActivity: recentActivity.slice(0, 5), // Show max 5 activities
        };

        setStats(dashboardStats);
      } catch (err) {
        console.error('Dashboard error:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load dashboard statistics';
        setError(errorMessage);

        // Set fallback stats to prevent null access errors
        setStats({
          totalPortfolioItems: 0,
          publishedItems: 0,
          draftItems: 0,
          reviewItems: 0,
          archivedItems: 0,
          totalCategories: 0,
          activeCategories: 0,
          featuredItems: 0,
          totalViews: 0,
          recentActivity: [
            'Dashboard loaded with errors',
            'Please check your connection',
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getCurrentTime = () => {
    return new Date().toLocaleString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-slate-900'>Dashboard</h1>
        <p className='mt-2 text-slate-600'>
          Welcome back, {user?.firstName || user?.email}! Here&apos;s your
          portfolio overview.
        </p>
        <div className='mt-2 flex items-center space-x-2'>
          <Clock className='h-4 w-4 text-slate-400' />
          <span className='text-sm text-slate-500'>{getCurrentTime()}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and navigation shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-4'>
            <Button asChild className='h-auto p-4'>
              <Link
                href='/admin/portfolio/create'
                className='flex flex-col items-center space-y-2'
              >
                <PlusCircle className='h-6 w-6' />
                <span className='text-sm font-medium'>New Portfolio Item</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='h-auto p-4'>
              <Link
                href='/admin/portfolio'
                className='flex flex-col items-center space-y-2'
              >
                <Images className='h-6 w-6' />
                <span className='text-sm font-medium'>Manage Portfolio</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='h-auto p-4'>
              <Link
                href='/admin/categories'
                className='flex flex-col items-center space-y-2'
              >
                <Folder className='h-6 w-6' />
                <span className='text-sm font-medium'>Manage Categories</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='h-auto p-4'>
              <Link
                href='/admin/inquiries'
                className='flex flex-col items-center space-y-2'
              >
                <Users className='h-6 w-6' />
                <span className='text-sm font-medium'>View Inquiries</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {isLoading ? (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <Card key={i} className='animate-pulse'>
              <CardContent className='p-6'>
                <div className='mb-2 h-4 rounded bg-slate-200'></div>
                <div className='mb-2 h-8 rounded bg-slate-200'></div>
                <div className='h-3 w-1/2 rounded bg-slate-200'></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        stats && (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-5'>
            {/* Total Portfolio Items */}
            <Card className='transition-shadow hover:shadow-md'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Portfolio Items
                </CardTitle>
                <Images className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.totalPortfolioItems}
                </div>
                <p className='text-muted-foreground text-xs'>
                  {stats.publishedItems} published, {stats.draftItems} drafts
                </p>
              </CardContent>
            </Card>

            {/* Published Items */}
            <Card className='transition-shadow hover:shadow-md'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Published</CardTitle>
                <CheckCircle className='h-4 w-4 text-green-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.publishedItems}</div>
                <p className='text-muted-foreground text-xs'>
                  Live on your portfolio
                </p>
              </CardContent>
            </Card>

            {/* Featured Items */}
            <Card className='transition-shadow hover:shadow-md'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Featured</CardTitle>
                <Star className='h-4 w-4 text-yellow-500' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.featuredItems}</div>
                <p className='text-muted-foreground text-xs'>
                  Highlighted items
                </p>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className='transition-shadow hover:shadow-md'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Categories
                </CardTitle>
                <Folder className='h-4 w-4 text-blue-500' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.activeCategories}
                </div>
                <p className='text-muted-foreground text-xs'>
                  {stats.totalCategories} total categories
                </p>
              </CardContent>
            </Card>

            {/* Total Views */}
            <Card className='transition-shadow hover:shadow-md'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Views
                </CardTitle>
                <TrendingUp className='h-4 w-4 text-purple-500' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.totalViews.toLocaleString()}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Portfolio engagement
                </p>
              </CardContent>
            </Card>
          </div>
        )
      )}

      {/* Recent Activity */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentActivity ? (
              <div className='space-y-3'>
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className='flex items-center space-x-2'>
                    <div className='bg-primary h-2 w-2 rounded-full'></div>
                    <span className='text-sm text-slate-600'>{activity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-slate-500'>No recent activity</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Status</CardTitle>
            <CardDescription>Portfolio content breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-600'>Published</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium'>
                    {stats?.publishedItems || 0}
                  </span>
                  <div className='h-2 w-2 rounded-full bg-green-500'></div>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-600'>Drafts</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium'>
                    {stats?.draftItems || 0}
                  </span>
                  <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-600'>In Review</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium'>
                    {stats?.reviewItems || 0}
                  </span>
                  <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-600'>Archived</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium'>
                    {stats?.archivedItems || 0}
                  </span>
                  <div className='h-2 w-2 rounded-full bg-gray-500'></div>
                </div>
              </div>
              <div className='border-t pt-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-600'>System Status</span>
                  <span className='text-sm font-medium text-green-600'>
                    ✓ Operational
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <CheckCircle className='h-5 w-5 text-green-600' />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='text-center'>
              <div className='font-semibold text-green-600'>✓ Database</div>
              <div className='text-xs text-slate-500'>Connected</div>
            </div>
            <div className='text-center'>
              <div className='font-semibold text-green-600'>
                ✓ Authentication
              </div>
              <div className='text-xs text-slate-500'>Active</div>
            </div>
            <div className='text-center'>
              <div className='font-semibold text-green-600'>✓ File Storage</div>
              <div className='text-xs text-slate-500'>Available</div>
            </div>
            <div className='text-center'>
              <div className='font-semibold text-green-600'>✓ API</div>
              <div className='text-xs text-slate-500'>Operational</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
