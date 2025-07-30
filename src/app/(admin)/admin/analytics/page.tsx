'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  FileImage,
  Folder,
  RefreshCw,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

import {
  CategoryPerformanceChart,
  DailyViewsChart,
  TrafficSourcesChart,
} from '@/components/analytics/charts';
import { useCurrentUser } from '@/components/auth/session-check';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AnalyticsApi,
  type FetchAnalyticsParams,
  useAnalytics,
} from '@/lib/analytics-api';

export default function AnalyticsPage() {
  const { user } = useCurrentUser();
  const {
    data: analytics,
    isLoading,
    error,
    fetchAnalytics,
    clearError,
  } = useAnalytics();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load initial analytics data
  useEffect(() => {
    const loadInitialData = async () => {
      const params: FetchAnalyticsParams = {
        period: selectedPeriod as '7d' | '30d' | '90d' | '1y',
      };
      await fetchAnalytics(params);
    };
    loadInitialData();
  }, [fetchAnalytics, selectedPeriod]);

  const handlePeriodChange = async (period: string) => {
    setSelectedPeriod(period);
    const params: FetchAnalyticsParams = {
      period: period as '7d' | '30d' | '90d' | '1y',
    };
    await fetchAnalytics(params);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    clearError();
    await fetchAnalytics({
      period: selectedPeriod as '7d' | '30d' | '90d' | '1y',
    });
    setIsRefreshing(false);
  };

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

  // Loading state
  if (isLoading && !analytics) {
    return (
      <div className='space-y-6'>
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900'>Analytics</h1>
            <p className='mt-2 text-slate-600'>
              Portfolio-Performance und Benutzerstatistiken
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
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
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold'>Analytics</h1>
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div className='flex-1'>
          <h1 className='text-2xl font-bold text-slate-900 lg:text-3xl'>
            Analytics
          </h1>
          <p className='mt-2 text-sm text-slate-600 lg:text-base'>
            Portfolio-Performance und Benutzerstatistiken für{' '}
            {user?.firstName || user?.email}
          </p>
          <div className='mt-2 flex items-center space-x-2'>
            <Clock className='h-4 w-4 text-slate-400' />
            <span className='text-sm text-slate-500'>{getCurrentTime()}</span>
          </div>
        </div>

        <div className='flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3'>
          {/* Period selector */}
          <select
            value={selectedPeriod}
            onChange={e => handlePeriodChange(e.target.value)}
            className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:w-auto'
            disabled={isLoading}
          >
            <option value='7d'>Letzte 7 Tage</option>
            <option value='30d'>Letzte 30 Tage</option>
            <option value='90d'>Letzte 90 Tage</option>
            <option value='1y'>Letztes Jahr</option>
          </select>

          {/* Refresh button */}
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant='outline'
            size='sm'
            className='w-full sm:w-auto'
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span className='hidden sm:inline'>Aktualisieren</span>
            <span className='sm:hidden'>Laden</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {/* Total Views */}
        <Card className='transition-shadow hover:shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Gesamtaufrufe</CardTitle>
            <Eye className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {AnalyticsApi.formatNumber(analytics.overview.totalViews)}
            </div>
            <p className='text-muted-foreground text-xs'>
              Portfolio-Aufrufe insgesamt
            </p>
          </CardContent>
        </Card>

        {/* Unique Visitors */}
        <Card className='transition-shadow hover:shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Eindeutige Besucher
            </CardTitle>
            <Users className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {AnalyticsApi.formatNumber(analytics.overview.uniqueVisitors)}
            </div>
            <p className='text-muted-foreground text-xs'>
              Verschiedene Besucher
            </p>
          </CardContent>
        </Card>

        {/* Published Items */}
        <Card className='transition-shadow hover:shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Veröffentlicht
            </CardTitle>
            <FileImage className='h-4 w-4 text-purple-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analytics.overview.publishedItems}
            </div>
            <p className='text-muted-foreground text-xs'>
              von {analytics.overview.totalPortfolioItems} Elementen
            </p>
          </CardContent>
        </Card>

        {/* Featured Items */}
        <Card className='transition-shadow hover:shadow-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Hervorgehoben</CardTitle>
            <Star className='h-4 w-4 text-yellow-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analytics.overview.featuredItems}
            </div>
            <p className='text-muted-foreground text-xs'>
              Hervorgehobene Inhalte
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Analysis */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Top Content */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2 text-base lg:text-lg'>
              <TrendingUp className='h-4 w-4 lg:h-5 lg:w-5' />
              <span>Top Inhalte</span>
            </CardTitle>
            <CardDescription className='text-sm'>
              Meistgesehene Portfolio-Elemente im gewählten Zeitraum
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topContent.length > 0 ? (
              <div className='space-y-4'>
                {analytics.topContent.slice(0, 5).map((item, index) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between gap-3'
                  >
                    <div className='flex min-w-0 flex-1 items-center space-x-2'>
                      <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium'>
                        {index + 1}
                      </span>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium'>
                          {item.title}
                        </p>
                        <p className='truncate text-xs text-slate-500'>
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <div className='flex shrink-0 items-center space-x-1'>
                      <Badge
                        variant='secondary'
                        className='hidden text-xs sm:inline-flex'
                      >
                        {AnalyticsApi.formatNumber(item.viewCount)} Aufrufe
                      </Badge>
                      <Badge variant='secondary' className='text-xs sm:hidden'>
                        {AnalyticsApi.formatNumber(item.viewCount)}
                      </Badge>
                      <Button
                        asChild
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0'
                      >
                        <Link href={`/admin/portfolio/${item.id}/edit`}>
                          <ExternalLink className='h-3 w-3' />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-slate-500'>Keine Daten verfügbar</p>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2 text-base lg:text-lg'>
              <BarChart3 className='h-4 w-4 lg:h-5 lg:w-5' />
              <span>Traffic-Quellen</span>
            </CardTitle>
            <CardDescription className='text-sm'>
              Herkunft der Besucher
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.trafficSources.length > 0 ? (
              <div className='space-y-3'>
                {analytics.trafficSources.slice(0, 5).map((source, index) => {
                  const percentage = AnalyticsApi.formatPercentage(
                    source.count,
                    analytics.trafficSources.reduce(
                      (sum, s) => sum + s.count,
                      0
                    )
                  );

                  return (
                    <div
                      key={index}
                      className='flex items-center justify-between gap-3'
                    >
                      <div className='flex min-w-0 flex-1 items-center space-x-2'>
                        <div className='h-2 w-2 shrink-0 rounded-full bg-blue-500'></div>
                        <span className='truncate text-sm'>
                          {source.source}
                        </span>
                      </div>
                      <div className='flex shrink-0 items-center space-x-2'>
                        <span className='text-sm font-medium'>
                          {AnalyticsApi.formatNumber(source.count)}
                        </span>
                        <span className='min-w-[35px] text-right text-xs text-slate-500'>
                          {percentage}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className='text-sm text-slate-500'>
                Keine Traffic-Daten verfügbar
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Performance & Recent Activity */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Folder className='h-5 w-5' />
              <span>Kategorie-Performance</span>
            </CardTitle>
            <CardDescription>
              Leistung nach Portfolio-Kategorien
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.categoryPerformance.length > 0 ? (
              <div className='space-y-4'>
                {analytics.categoryPerformance.map(category => (
                  <div
                    key={category.id}
                    className='flex items-center justify-between'
                  >
                    <div>
                      <p className='text-sm font-medium'>{category.name}</p>
                      <p className='text-xs text-slate-500'>
                        {category.itemCount} Element
                        {category.itemCount !== 1 ? 'e' : ''}
                      </p>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-medium'>
                        {AnalyticsApi.formatNumber(category.totalViews)}
                      </div>
                      <div className='text-xs text-slate-500'>Aufrufe</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-slate-500'>
                Keine Kategorie-Daten verfügbar
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Activity className='h-5 w-5' />
              <span>Neueste Aktivitäten</span>
            </CardTitle>
            <CardDescription>Kürzlich veröffentlichte Inhalte</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.recentActivity.length > 0 ? (
              <div className='space-y-3'>
                {analytics.recentActivity.slice(0, 5).map(activity => (
                  <div
                    key={activity.id}
                    className='flex items-center space-x-3'
                  >
                    <div className='h-2 w-2 rounded-full bg-green-500'></div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm'>
                        <span className='font-medium'>{activity.title}</span>
                        <span className='text-slate-500'>
                          {' '}
                          wurde veröffentlicht
                        </span>
                      </p>
                      <div className='flex items-center space-x-2 text-xs text-slate-500'>
                        <span>{activity.category}</span>
                        <span>•</span>
                        <span>
                          {AnalyticsApi.getRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-slate-500'>
                Keine neuesten Aktivitäten
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Daily Views Chart */}
        {analytics.timeRangeStats.dailyViews.length > 0 && (
          <DailyViewsChart data={analytics.timeRangeStats.dailyViews} />
        )}

        {/* Category Performance Chart */}
        {analytics.categoryPerformance.length > 0 && (
          <CategoryPerformanceChart data={analytics.categoryPerformance} />
        )}
      </div>

      {/* Traffic Sources Chart - full width */}
      {analytics.trafficSources.length > 0 && (
        <TrafficSourcesChart data={analytics.trafficSources} />
      )}

      {/* Time Range Summary */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <Calendar className='h-5 w-5' />
            <span>Zeitraum-Zusammenfassung</span>
          </CardTitle>
          <CardDescription>
            Statistiken für {AnalyticsApi.getPeriodDisplayText(selectedPeriod)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 text-center md:grid-cols-4'>
            <div>
              <div className='text-2xl font-bold text-blue-600'>
                {AnalyticsApi.formatNumber(analytics.overview.pageViews)}
              </div>
              <div className='text-xs text-slate-500'>Seitenaufrufe</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-green-600'>
                {AnalyticsApi.formatNumber(analytics.overview.uniqueVisitors)}
              </div>
              <div className='text-xs text-slate-500'>Eindeutige Besucher</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-purple-600'>
                {analytics.timeRangeStats.totalEvents}
              </div>
              <div className='text-xs text-slate-500'>Gesamte Events</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-orange-600'>
                {analytics.overview.totalCategories}
              </div>
              <div className='text-xs text-slate-500'>Aktive Kategorien</div>
            </div>
          </div>

          <div className='mt-4 border-t pt-4 text-center'>
            <p className='text-sm text-slate-600'>
              Daten vom{' '}
              {AnalyticsApi.formatDate(analytics.timeRangeStats.startDate)} bis{' '}
              {AnalyticsApi.formatDate(analytics.timeRangeStats.endDate)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
