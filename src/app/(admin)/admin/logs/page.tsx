'use client';

import { useCallback, useEffect, useState } from 'react';

// Tabs component not available - using simple state management
import {
  AlertTriangle,
  Bug,
  Clock,
  Database,
  ExternalLink,
  Globe,
  RefreshCw,
  Search,
  Shield,
  TrendingUp,
  User,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  category:
    | 'auth'
    | 'api'
    | 'database'
    | 'security'
    | 'performance'
    | 'error'
    | 'system';
  message: string;
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  metadata?: Record<string, unknown>;
}

interface SecurityEvent {
  timestamp: string;
  eventType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  ip?: string;
  userId?: string;
  details?: Record<string, unknown>;
}

interface PerformanceMetric {
  timestamp: string;
  route: string;
  responseTime: number;
  dbQueryTime?: number;
  memoryUsage?: number;
  requestId: string;
}

interface LogStats {
  total: number;
  byLevel: Record<string, number>;
  byCategory: Record<string, number>;
  errorRate: number;
  avgResponseTime: number;
  securityEvents: number;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<
    PerformanceMetric[]
  >([]);
  const [stats, setStats] = useState<LogStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'logs' | 'security' | 'performance'
  >('logs');

  // Mock data for development (replace with actual API calls)
  const generateMockLogs = useCallback((): LogEntry[] => {
    const levels: LogEntry['level'][] = ['error', 'warn', 'info', 'debug'];
    const categories: LogEntry['category'][] = [
      'auth',
      'api',
      'database',
      'security',
      'performance',
      'error',
      'system',
    ];
    const routes = [
      '/api/portfolio',
      '/api/categories',
      '/api/contact',
      '/api/auth/signin',
    ];
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];

    return Array.from({ length: 100 }, () => {
      const timestamp = new Date(
        Date.now() - Math.random() * 3600000
      ).toISOString();
      const level = levels[Math.floor(Math.random() * levels.length)];
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const route = routes[Math.floor(Math.random() * routes.length)];
      const method = methods[Math.floor(Math.random() * methods.length)];

      return {
        timestamp,
        level,
        category,
        message: `${method} ${route} - ${level === 'error' ? 'Operation failed' : 'Operation completed'}`,
        requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
        userId:
          Math.random() > 0.5
            ? `user_${Math.random().toString(36).substr(2, 9)}`
            : undefined,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        method,
        url: `https://portfolio.com${route}`,
        statusCode: level === 'error' ? 500 : level === 'warn' ? 400 : 200,
        responseTime: Math.floor(Math.random() * 2000) + 50,
        metadata: {
          userAgent: 'Mozilla/5.0 (compatible; Test)',
          category: category,
          timestamp,
        },
      };
    }).sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, []);

  const generateMockSecurityEvents = useCallback((): SecurityEvent[] => {
    const eventTypes = [
      'LOGIN_SUCCESS',
      'LOGIN_FAILURE',
      'UNAUTHORIZED_ACCESS',
      'SUSPICIOUS_ACTIVITY',
    ];
    const severities: SecurityEvent['severity'][] = [
      'LOW',
      'MEDIUM',
      'HIGH',
      'CRITICAL',
    ];

    return Array.from({ length: 20 }, () => ({
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      message: `Security event detected`,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userId:
        Math.random() > 0.5
          ? `user_${Math.random().toString(36).substr(2, 9)}`
          : undefined,
      details: {
        timestamp: new Date().toISOString(),
        riskScore: Math.random(),
      },
    })).sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, []);

  const generateMockPerformanceMetrics =
    useCallback((): PerformanceMetric[] => {
      const routes = ['/api/portfolio', '/api/categories', '/api/contact'];

      return Array.from({ length: 50 }, () => ({
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        route: routes[Math.floor(Math.random() * routes.length)],
        responseTime: Math.floor(Math.random() * 2000) + 50,
        dbQueryTime: Math.floor(Math.random() * 500) + 10,
        memoryUsage: Math.floor(Math.random() * 100000000) + 50000000,
        requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
      })).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }, []);

  const calculateStats = useCallback((logs: LogEntry[]): LogStats => {
    const total = logs.length;
    const byLevel = logs.reduce(
      (acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byCategory = logs.reduce(
      (acc, log) => {
        acc[log.category] = (acc[log.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const errorCount = (byLevel.error || 0) + (byLevel.warn || 0);
    const errorRate = total > 0 ? (errorCount / total) * 100 : 0;

    const responseTimes = logs
      .filter(log => log.responseTime)
      .map(log => log.responseTime!);
    const avgResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((sum, time) => sum + time, 0) /
          responseTimes.length
        : 0;

    return {
      total,
      byLevel,
      byCategory,
      errorRate,
      avgResponseTime,
      securityEvents: logs.filter(log => log.category === 'security').length,
    };
  }, []);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, these would be API calls
      const mockLogs = generateMockLogs();
      const mockSecurity = generateMockSecurityEvents();
      const mockPerformance = generateMockPerformanceMetrics();

      setLogs(mockLogs);
      setSecurityEvents(mockSecurity);
      setPerformanceMetrics(mockPerformance);
      setStats(calculateStats(mockLogs));
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    generateMockLogs,
    generateMockSecurityEvents,
    generateMockPerformanceMetrics,
    calculateStats,
  ]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchLogs]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      !searchTerm ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.requestId?.includes(searchTerm) ||
      log.userId?.includes(searchTerm);

    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesCategory =
      categoryFilter === 'all' || log.category === categoryFilter;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'error':
        return 'destructive';
      case 'warn':
        return 'default';
      case 'info':
        return 'secondary';
      case 'debug':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <Shield className='h-4 w-4' />;
      case 'api':
        return <Globe className='h-4 w-4' />;
      case 'database':
        return <Database className='h-4 w-4' />;
      case 'security':
        return <AlertTriangle className='h-4 w-4' />;
      case 'performance':
        return <TrendingUp className='h-4 w-4' />;
      case 'error':
        return <Bug className='h-4 w-4' />;
      default:
        return <Clock className='h-4 w-4' />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'default';
      case 'LOW':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className='container mx-auto space-y-6 py-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>System Logs</h1>
          <p className='text-muted-foreground'>
            Monitor application performance, security events, and system health
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size='sm'
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`}
            />
            Auto Refresh
          </Button>
          <Button onClick={fetchLogs} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Logs</CardTitle>
              <Clock className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats.total.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Error Rate</CardTitle>
              <AlertTriangle className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {stats.errorRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Avg Response Time
              </CardTitle>
              <TrendingUp className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {Math.round(stats.avgResponseTime)}ms
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Security Events
              </CardTitle>
              <Shield className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.securityEvents}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex flex-wrap gap-4'>
            <div className='min-w-[200px] flex-1'>
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  placeholder='Search logs, request IDs, user IDs...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className='w-[120px]'>
                <SelectValue placeholder='Level' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Levels</SelectItem>
                <SelectItem value='error'>Error</SelectItem>
                <SelectItem value='warn'>Warning</SelectItem>
                <SelectItem value='info'>Info</SelectItem>
                <SelectItem value='debug'>Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                <SelectItem value='auth'>Authentication</SelectItem>
                <SelectItem value='api'>API</SelectItem>
                <SelectItem value='database'>Database</SelectItem>
                <SelectItem value='security'>Security</SelectItem>
                <SelectItem value='performance'>Performance</SelectItem>
                <SelectItem value='error'>Error</SelectItem>
                <SelectItem value='system'>System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <div className='space-y-4'>
        {/* Simple tab navigation */}
        <div className='bg-muted flex space-x-1 rounded-lg p-1'>
          <button
            onClick={() => setActiveTab('logs')}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'logs'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Application Logs
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Security Events
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'performance'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Performance
          </button>
        </div>

        {activeTab === 'logs' && (
          <div className='space-y-4'>
            {filteredLogs.map((log, index) => (
              <Card key={`${log.requestId}-${index}`}>
                <CardContent className='p-4'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-center gap-2'>
                        {getCategoryIcon(log.category)}
                        <Badge variant={getLevelBadgeVariant(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <Badge variant='outline'>{log.category}</Badge>
                        {log.statusCode && (
                          <Badge
                            variant={
                              log.statusCode >= 400
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {log.statusCode}
                          </Badge>
                        )}
                        <span className='text-muted-foreground text-sm'>
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className='text-sm font-medium'>{log.message}</p>

                      <div className='text-muted-foreground grid grid-cols-2 gap-2 text-xs md:grid-cols-4'>
                        {log.requestId && (
                          <div>
                            <strong>Request ID:</strong> {log.requestId}
                          </div>
                        )}
                        {log.userId && (
                          <div>
                            <User className='mr-1 inline h-3 w-3' />
                            {log.userId}
                          </div>
                        )}
                        {log.ip && (
                          <div>
                            <strong>IP:</strong> {log.ip}
                          </div>
                        )}
                        {log.responseTime && (
                          <div>
                            <strong>Response:</strong> {log.responseTime}ms
                          </div>
                        )}
                      </div>

                      {log.url && (
                        <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                          <ExternalLink className='h-3 w-3' />
                          <span>
                            {log.method} {log.url}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className='space-y-4'>
            {securityEvents.map((event, index) => (
              <Card key={index}>
                <CardContent className='p-4'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Shield className='h-4 w-4' />
                        <Badge
                          variant={getSeverityBadgeVariant(event.severity)}
                        >
                          {event.severity}
                        </Badge>
                        <Badge variant='outline'>{event.eventType}</Badge>
                        <span className='text-muted-foreground text-sm'>
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className='text-sm font-medium'>{event.message}</p>

                      <div className='text-muted-foreground grid grid-cols-2 gap-2 text-xs'>
                        {event.ip && (
                          <div>
                            <strong>IP:</strong> {event.ip}
                          </div>
                        )}
                        {event.userId && (
                          <div>
                            <User className='mr-1 inline h-3 w-3' />
                            {event.userId}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Response times and resource usage across API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='text-muted-foreground text-sm'>
                  Performance monitoring data would be displayed here with
                  charts and metrics. This is a development interface for
                  monitoring system performance.
                </div>
              </CardContent>
            </Card>

            {performanceMetrics.slice(0, 10).map((metric, index) => (
              <Card key={index}>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <TrendingUp className='h-4 w-4' />
                        <span className='font-medium'>{metric.route}</span>
                        <Badge
                          variant={
                            metric.responseTime > 1000
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {metric.responseTime}ms
                        </Badge>
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        Request ID: {metric.requestId} •
                        {metric.dbQueryTime &&
                          ` DB: ${metric.dbQueryTime}ms • `}
                        {new Date(metric.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
