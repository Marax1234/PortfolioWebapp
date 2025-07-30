/**
 * React Hook für Analytics API Calls mit Error Handling
 */
import { useCallback, useState } from 'react';

/**
 * Analytics API Client - Frontend API Utilities
 * Interagiert mit Analytics Backend API Endpunkten
 */

export interface AnalyticsOverview {
  totalViews: number;
  uniqueVisitors: number;
  pageViews: number;
  totalPortfolioItems: number;
  publishedItems: number;
  featuredItems: number;
  totalCategories: number;
}

export interface TopContentItem {
  id: string;
  title: string;
  viewCount: number;
  category: string;
  thumbnail?: string | null;
}

export interface TrafficSource {
  source: string;
  count: number;
}

export interface CategoryPerformance {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  totalViews: number;
}

export interface RecentActivity {
  id: string;
  title: string;
  action: string;
  timestamp: Date;
  category: string;
}

export interface DailyViews {
  date: string;
  value: number;
}

export interface TimeRangeStats {
  startDate: Date;
  endDate: Date;
  totalEvents: number;
  dailyViews: DailyViews[];
}

export interface AnalyticsDashboardData {
  overview: AnalyticsOverview;
  topContent: TopContentItem[];
  trafficSources: TrafficSource[];
  categoryPerformance: CategoryPerformance[];
  recentActivity: RecentActivity[];
  timeRangeStats: TimeRangeStats;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

type AnalyticsApiResponse = ApiResponse<AnalyticsDashboardData>;

export interface FetchAnalyticsParams {
  period?: '7d' | '30d' | '90d' | '1y';
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

/**
 * Base API configuration
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Generic API fetch utility with admin authentication
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle specific HTTP status codes
      if (response.status === 401) {
        throw new Error(
          'Authentifizierung erforderlich - Bitte melden Sie sich an'
        );
      }

      if (response.status === 403) {
        throw new Error(
          'Zugriff verweigert - Administratorrechte erforderlich'
        );
      }

      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Netzwerkfehler beim Laden der Analytics-Daten');
  }
}

/**
 * Analytics API Client
 */
export class AnalyticsApi {
  /**
   * Fetch analytics dashboard data
   */
  static async fetchDashboardData(
    params: FetchAnalyticsParams = {}
  ): Promise<AnalyticsDashboardData> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const endpoint = `/api/analytics${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response: AnalyticsApiResponse = await apiRequest(endpoint);

    if (!response.success) {
      throw new Error(
        response.error || 'Fehler beim Laden der Analytics-Daten'
      );
    }

    // Process dates in the response
    const processedData: AnalyticsDashboardData = {
      ...response.data,
      recentActivity: response.data.recentActivity.map(activity => ({
        ...activity,
        timestamp: new Date(activity.timestamp),
      })),
      timeRangeStats: {
        ...response.data.timeRangeStats,
        startDate: new Date(response.data.timeRangeStats.startDate),
        endDate: new Date(response.data.timeRangeStats.endDate),
      },
    };

    return processedData;
  }

  /**
   * Fetch analytics for last 7 days
   */
  static async fetchWeeklyAnalytics(): Promise<AnalyticsDashboardData> {
    return this.fetchDashboardData({ period: '7d' });
  }

  /**
   * Fetch analytics for last 30 days
   */
  static async fetchMonthlyAnalytics(): Promise<AnalyticsDashboardData> {
    return this.fetchDashboardData({ period: '30d' });
  }

  /**
   * Fetch analytics for last 90 days
   */
  static async fetchQuarterlyAnalytics(): Promise<AnalyticsDashboardData> {
    return this.fetchDashboardData({ period: '90d' });
  }

  /**
   * Fetch analytics for custom date range
   */
  static async fetchAnalyticsForRange(
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsDashboardData> {
    return this.fetchDashboardData({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  /**
   * Get formatted period display text in German
   */
  static getPeriodDisplayText(period: string): string {
    const periodTexts: Record<string, string> = {
      '7d': 'Letzte 7 Tage',
      '30d': 'Letzte 30 Tage',
      '90d': 'Letzte 90 Tage',
      '1y': 'Letztes Jahr',
    };
    return periodTexts[period] || 'Benutzerdefiniert';
  }

  /**
   * Format number for display
   */
  static formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString('de-DE');
  }

  /**
   * Format percentage for display
   */
  static formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
  }

  /**
   * Calculate growth rate between two values
   */
  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Format growth rate for display
   */
  static formatGrowthRate(growthRate: number): string {
    const sign = growthRate > 0 ? '+' : '';
    return `${sign}${growthRate.toFixed(1)}%`;
  }

  /**
   * Get trend direction based on growth rate
   */
  static getTrendDirection(growthRate: number): 'up' | 'down' | 'neutral' {
    if (growthRate > 2) return 'up';
    if (growthRate < -2) return 'down';
    return 'neutral';
  }

  /**
   * Format date for German locale
   */
  static formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Format date and time for German locale
   */
  static formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get relative time text in German
   */
  static getRelativeTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - dateObj.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Gerade eben';
    if (diffInMinutes < 60) return `vor ${diffInMinutes} Min.`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `vor ${diffInHours} Std.`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `vor ${diffInDays} Tag${diffInDays === 1 ? '' : 'en'}`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4)
      return `vor ${diffInWeeks} Woche${diffInWeeks === 1 ? '' : 'n'}`;

    return this.formatDate(dateObj);
  }
}

export interface UseAnalyticsResult {
  data: AnalyticsDashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: (params?: FetchAnalyticsParams) => Promise<void>;
  clearError: () => void;
}

export function useAnalytics(): UseAnalyticsResult {
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(
    async (params: FetchAnalyticsParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const analyticsData = await AnalyticsApi.fetchDashboardData(params);
        setData(analyticsData);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Fehler beim Laden der Analytics-Daten';
        setError(errorMessage);
        console.error('Analytics fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchAnalytics,
    clearError,
  };
}
