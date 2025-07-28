"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsApi, type DailyViews, type TrafficSource, type CategoryPerformance } from "@/lib/analytics-api"

interface ChartProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

function ChartContainer({ title, description, children, className = "" }: ChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  maxValue?: number
  height?: number
  showValues?: boolean
  formatValue?: (value: number) => string
}

export function SimpleBarChart({ 
  data, 
  maxValue, 
  height = 200, 
  showValues = true,
  formatValue = (value) => value.toString()
}: BarChartProps) {
  const maxVal = maxValue || Math.max(...data.map(d => d.value))
  
  if (maxVal === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500">
        Keine Daten verfügbar
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = (item.value / maxVal) * 100
        const barColor = item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`
        
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-700 truncate max-w-[120px]" title={item.label}>
                {item.label}
              </span>
              {showValues && (
                <span className="text-slate-900 font-medium">
                  {formatValue(item.value)}
                </span>
              )}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: barColor
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface LineChartProps {
  data: Array<{ date: string; value: number }>
  height?: number
  color?: string
  showDots?: boolean
  formatValue?: (value: number) => string
}

export function SimpleLineChart({ 
  data, 
  height = 200, 
  color = "#3b82f6",
  showDots = true,
  formatValue = (value) => value.toString()
}: LineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500">
        Keine Daten verfügbar
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  // Create SVG path
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((point.value - minValue) / range) * 100
    return `${x},${y}`
  }).join(' ')

  const pathData = data.length > 1 ? `M ${points.split(' ').join(' L ')}` : ''

  return (
    <div className="space-y-4">
      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="25" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 25" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Area under curve */}
          {data.length > 1 && (
            <path
              d={`${pathData} L 100,100 L 0,100 Z`}
              fill={color}
              fillOpacity="0.1"
            />
          )}
          
          {/* Line */}
          {data.length > 1 && (
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
          )}
          
          {/* Data points */}
          {showDots && data.map((point, index) => {
            const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100
            const y = range === 0 ? 50 : 100 - ((point.value - minValue) / range) * 100
            
            return (
              <circle
                key={index}
                cx={isNaN(x) ? 0 : x}
                cy={isNaN(y) ? 50 : y}
                r="2"
                fill="white"
                stroke={color}
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            )
          })}
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-slate-500">
        {data.map((point, index) => {
          // Show only every few labels to avoid crowding
          const showLabel = data.length <= 7 || index % Math.ceil(data.length / 7) === 0 || index === data.length - 1
          
          return (
            <span key={index} className={showLabel ? "" : "opacity-0"}>
              {showLabel ? new Date(point.date).toLocaleDateString('de-DE', { 
                month: 'short', 
                day: 'numeric' 
              }) : ""}
            </span>
          )
        })}
      </div>
    </div>
  )
}

interface DonutChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  size?: number
  thickness?: number
  showLegend?: boolean
  formatValue?: (value: number) => string
}

export function SimpleDonutChart({ 
  data, 
  size = 200, 
  thickness = 20,
  showLegend = true,
  formatValue = (value) => value.toString()
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-slate-500" style={{ height: size }}>
        Keine Daten verfügbar
      </div>
    )
  }

  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  let currentAngle = 0

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const angle = (item.value / total) * 360
    const color = item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`
    
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle += angle

    // Calculate arc path
    const startX = radius + radius * Math.cos((startAngle - 90) * Math.PI / 180)
    const startY = radius + radius * Math.sin((startAngle - 90) * Math.PI / 180)
    const endX = radius + radius * Math.cos((endAngle - 90) * Math.PI / 180)
    const endY = radius + radius * Math.sin((endAngle - 90) * Math.PI / 180)
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const pathData = `
      M ${radius} ${radius}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `

    return {
      ...item,
      percentage,
      color,
      pathData
    }
  })

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
      <div className="relative mx-auto lg:mx-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              fill={segment.color}
              className="hover:opacity-80 transition-opacity"
            />
          ))}
          {/* Inner circle to create donut effect */}
          <circle
            cx={radius}
            cy={radius}
            r={radius - thickness}
            fill="white"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl lg:text-2xl font-bold text-slate-900">
              {AnalyticsApi.formatNumber(total)}
            </div>
            <div className="text-xs text-slate-500">Gesamt</div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="space-y-2 flex-1">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-slate-700 truncate" title={segment.label}>
                  {segment.label}
                </span>
              </div>
              <span className="text-slate-900 font-medium shrink-0">
                <span className="hidden sm:inline">
                  {formatValue(segment.value)} ({segment.percentage.toFixed(1)}%)
                </span>
                <span className="sm:hidden">
                  {formatValue(segment.value)}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
  icon?: ReactNode
  color?: string
  formatValue?: (value: number | string) => string
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel = "vs. voriger Zeitraum",
  icon,
  color = "blue",
  formatValue = (val) => val.toString()
}: MetricCardProps) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
    red: "text-red-600 bg-red-50"
  }

  const isPositiveChange = change !== undefined && change > 0
  const isNegativeChange = change !== undefined && change < 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div className="flex items-center space-x-1 mt-2">
                {isPositiveChange && (
                  <div className="flex items-center text-green-600 text-xs">
                    <span>↗</span>
                    <span>+{Math.abs(change).toFixed(1)}%</span>
                  </div>
                )}
                {isNegativeChange && (
                  <div className="flex items-center text-red-600 text-xs">
                    <span>↘</span>
                    <span>-{Math.abs(change).toFixed(1)}%</span>
                  </div>
                )}
                {change === 0 && (
                  <div className="flex items-center text-slate-500 text-xs">
                    <span>→</span>
                    <span>0%</span>
                  </div>
                )}
                <span className="text-xs text-slate-500">{changeLabel}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Pre-configured chart components for analytics
export function TrafficSourcesChart({ data }: { data: TrafficSource[] }) {
  const chartData = data.slice(0, 8).map(source => ({
    label: source.source === 'Direct' ? 'Direkt' : source.source,
    value: source.count
  }))

  return (
    <ChartContainer
      title="Traffic-Quellen"
      description="Herkunft der Website-Besucher"
    >
      <SimpleBarChart 
        data={chartData}
        formatValue={(value) => AnalyticsApi.formatNumber(value)}
      />
    </ChartContainer>
  )
}

export function CategoryPerformanceChart({ data }: { data: CategoryPerformance[] }) {
  const chartData = data.map(category => ({
    label: category.name,
    value: category.totalViews
  }))

  return (
    <ChartContainer
      title="Kategorie-Performance"
      description="Aufrufe nach Portfolio-Kategorien"
    >
      <SimpleDonutChart 
        data={chartData}
        formatValue={(value) => AnalyticsApi.formatNumber(value)}
      />
    </ChartContainer>
  )
}

export function DailyViewsChart({ data }: { data: DailyViews[] }) {
  return (
    <ChartContainer
      title="Tägliche Aufrufe"
      description="Entwicklung der Seitenaufrufe über Zeit"
    >
      <SimpleLineChart 
        data={data}
        formatValue={(value) => AnalyticsApi.formatNumber(value)}
      />
    </ChartContainer>
  )
}