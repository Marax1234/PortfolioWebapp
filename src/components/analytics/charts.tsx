'use client';

import { ReactNode } from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  AnalyticsApi,
  type CategoryPerformance,
  type DailyViews,
  type TrafficSource,
} from '@/lib/analytics-api';

interface ChartProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

function ChartWrapper({
  title,
  description,
  children,
  className = '',
}: ChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='text-lg'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  maxValue?: number;
  height?: number;
  showValues?: boolean;
  formatValue?: (value: number) => string;
}

export function SimpleBarChart({
  data,
  formatValue = value => value.toString(),
}: BarChartProps) {
  if (data.length === 0) {
    return (
      <div className='flex h-32 items-center justify-center text-slate-500'>
        Keine Daten verfügbar
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }));

  const chartConfig: ChartConfig = data.reduce((config, item, index) => {
    const key = item.label.toLowerCase().replace(/\s+/g, '_');
    return {
      ...config,
      [key]: {
        label: item.label,
        color: item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
      },
    };
  }, {} as ChartConfig);

  return (
    <ChartContainer config={chartConfig} className='h-[300px] w-full'>
      <BarChart data={chartData} width={600} height={300}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='name'
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={value => [formatValue(Number(value)), '']}
            />
          }
        />
        <Bar dataKey='value' radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

interface LineChartProps {
  data: Array<{ date: string; value: number }>;
  height?: number;
  color?: string;
  showDots?: boolean;
  formatValue?: (value: number) => string;
}

export function SimpleLineChart({
  data,
  color = '#3b82f6',
  showDots = false,
  formatValue = value => value.toString(),
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className='flex h-32 items-center justify-center text-slate-500'>
        Keine Daten verfügbar
      </div>
    );
  }

  const chartData = data.map(point => ({
    date: new Date(point.date).toLocaleDateString('de-DE', {
      month: 'short',
      day: 'numeric',
    }),
    value: point.value,
  }));

  const chartConfig: ChartConfig = {
    value: {
      label: 'Aufrufe',
      color: color,
    },
  };

  return (
    <ChartContainer config={chartConfig} className='h-[300px] w-full'>
      <LineChart
        data={chartData}
        width={800}
        height={300}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='date'
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={value => [formatValue(Number(value)), '']}
            />
          }
        />
        <Line
          type='monotone'
          dataKey='value'
          stroke={color}
          strokeWidth={2}
          dot={showDots ? { fill: color, strokeWidth: 2, r: 3 } : false}
        />
      </LineChart>
    </ChartContainer>
  );
}

interface DonutChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  formatValue?: (value: number) => string;
}

export function SimpleDonutChart({
  data,
  size = 200,
  showLegend = true,
  formatValue = value => value.toString(),
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div
        className='flex items-center justify-center text-slate-500'
        style={{ height: size }}
      >
        Keine Kategorien verfügbar
      </div>
    );
  }

  if (total === 0) {
    return (
      <div
        className='flex items-center justify-center text-slate-500'
        style={{ height: size }}
      >
        <div className='text-center'>
          <div className='text-lg font-medium'>Keine Views verfügbar</div>
          <div className='mt-1 text-sm'>
            {data.length} Kategorie{data.length !== 1 ? 'n' : ''} gefunden, aber
            keine Aufrufe
          </div>
        </div>
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }));

  const chartConfig: ChartConfig = data.reduce((config, item, index) => {
    const key = item.label.toLowerCase().replace(/\s+/g, '_');
    return {
      ...config,
      [key]: {
        label: item.label,
        color: item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
      },
    };
  }, {} as ChartConfig);

  // const COLORS = data.map(
  //   (_, index) => `hsl(${(index * 137.5) % 360}, 70%, 50%)`
  // );

  return (
    <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6'>
      <div className='relative h-[300px] w-[300px]'>
        <ChartContainer config={chartConfig} className='h-full w-full'>
          <PieChart width={300} height={300}>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={value => [
                    `${formatValue(Number(value))} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                    '',
                  ]}
                />
              }
            />
            <Pie
              data={chartData}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey='value'
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
          </PieChart>
        </ChartContainer>

        {/* Center text overlay */}
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='text-center'>
            <div className='text-xl font-bold text-slate-900'>
              {AnalyticsApi.formatNumber(total)}
            </div>
            <div className='text-xs text-slate-500'>Gesamt</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className='flex-1 space-y-2'>
          {chartData.map((item, index) => (
            <div
              key={index}
              className='flex items-center justify-between gap-3 text-sm'
            >
              <div className='flex min-w-0 flex-1 items-center space-x-2'>
                <div
                  className='h-3 w-3 shrink-0 rounded-full'
                  style={{ backgroundColor: item.fill }}
                />
                <span className='truncate text-slate-700' title={item.name}>
                  {item.name}
                </span>
              </div>
              <span className='shrink-0 font-medium text-slate-900'>
                <span className='hidden sm:inline'>
                  {formatValue(item.value)} (
                  {((item.value / total) * 100).toFixed(1)}%)
                </span>
                <span className='sm:hidden'>{formatValue(item.value)}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  color?: string;
  formatValue?: (value: number | string) => string;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs. voriger Zeitraum',
  icon,
  color = 'blue',
  formatValue = val => val.toString(),
}: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
  };

  const isPositiveChange = change !== undefined && change > 0;
  const isNegativeChange = change !== undefined && change < 0;

  return (
    <Card className='transition-shadow hover:shadow-md'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <p className='text-sm font-medium text-slate-600'>{title}</p>
            <p className='mt-1 text-2xl font-bold text-slate-900'>
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div className='mt-2 flex items-center space-x-1'>
                {isPositiveChange && (
                  <div className='flex items-center text-xs text-green-600'>
                    <span>↗</span>
                    <span>+{Math.abs(change).toFixed(1)}%</span>
                  </div>
                )}
                {isNegativeChange && (
                  <div className='flex items-center text-xs text-red-600'>
                    <span>↘</span>
                    <span>-{Math.abs(change).toFixed(1)}%</span>
                  </div>
                )}
                {change === 0 && (
                  <div className='flex items-center text-xs text-slate-500'>
                    <span>→</span>
                    <span>0%</span>
                  </div>
                )}
                <span className='text-xs text-slate-500'>{changeLabel}</span>
              </div>
            )}
          </div>
          {icon && (
            <div
              className={`rounded-lg p-3 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Pre-configured chart components for analytics
export function TrafficSourcesChart({ data }: { data: TrafficSource[] }) {
  const chartData = data.slice(0, 8).map(source => ({
    label: source.source === 'Direct' ? 'Direkt' : source.source,
    value: source.count,
  }));

  return (
    <ChartWrapper
      title='Traffic-Quellen'
      description='Herkunft der Website-Besucher'
    >
      <SimpleBarChart
        data={chartData}
        formatValue={value => AnalyticsApi.formatNumber(value)}
      />
    </ChartWrapper>
  );
}

export function CategoryPerformanceChart({
  data,
}: {
  data: CategoryPerformance[];
}) {
  const chartData = data.map(category => ({
    label: category.name,
    value: category.totalViews,
  }));

  return (
    <ChartWrapper
      title='Kategorie-Performance'
      description='Aufrufe nach Portfolio-Kategorien'
    >
      <SimpleDonutChart
        data={chartData}
        formatValue={value => AnalyticsApi.formatNumber(value)}
      />
    </ChartWrapper>
  );
}

export function DailyViewsChart({ data }: { data: DailyViews[] }) {
  return (
    <ChartWrapper
      title='Tägliche Aufrufe'
      description='Entwicklung der Seitenaufrufe über Zeit'
    >
      <SimpleLineChart
        data={data}
        formatValue={value => AnalyticsApi.formatNumber(value)}
      />
    </ChartWrapper>
  );
}
