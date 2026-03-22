'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Clock,
  Bot,
  Download
} from 'lucide-react'

interface Analytics {
  totalTickets: number
  resolvedTickets: number
  escalatedTickets: number
  resolvedByAI: number
  avgResolutionTime: number
  avgSentiment: number
  costSaved: number
  resolutionRate: number
  escalationRate: number
  aiResolutionRate: number
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])
  
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics')
      const data = await res.json()
      // Verify the response has expected structure
      if (data && typeof data.totalTickets === 'number') {
        setAnalytics(data)
      } else if (data.error) {
        console.error('Analytics API error:', data.error)
        setAnalytics(null)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }
  
  const handleExport = async () => {
    try {
      const res = await fetch('/api/fine-tuning/export')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fine-tuning-data-${Date.now()}.jsonl`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }
  
  if (!analytics) {
    return (
      <div className="text-center py-8 text-gray-500">
        Failed to load analytics
      </div>
    )
  }
  
  const stats = [
    {
      name: 'Total Tickets',
      value: analytics.totalTickets,
      icon: MessageSquare,
      color: 'blue',
      trend: null
    },
    {
      name: 'Resolved by AI',
      value: analytics.resolvedByAI,
      icon: Bot,
      color: 'green',
      trend: analytics.aiResolutionRate,
      trendLabel: 'of total'
    },
    {
      name: 'Escalated',
      value: analytics.escalatedTickets,
      icon: AlertTriangle,
      color: 'orange',
      trend: analytics.escalationRate,
      trendLabel: 'escalation rate'
    },
    {
      name: 'Cost Saved',
      value: `$${analytics.costSaved.toLocaleString()}`,
      icon: DollarSign,
      color: 'emerald',
      trend: null
    },
    {
      name: 'Avg Resolution Time',
      value: `${analytics.avgResolutionTime} min`,
      icon: Clock,
      color: 'purple',
      trend: null
    },
    {
      name: 'Resolution Rate',
      value: `${analytics.resolutionRate}%`,
      icon: CheckCircle,
      color: 'teal',
      trend: null
    }
  ]
  
  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      orange: 'bg-orange-50 text-orange-600',
      emerald: 'bg-emerald-50 text-emerald-600',
      purple: 'bg-purple-50 text-purple-600',
      teal: 'bg-teal-50 text-teal-600'
    }
    return colors[color] || colors.blue
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-500">Track your support performance and ROI</p>
        </div>
        
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Training Data
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.trend !== null && (
                <div className="flex items-center gap-1 text-sm">
                  {stat.trend > 50 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={stat.trend > 50 ? 'text-green-600' : 'text-red-600'}>
                    {stat.trend}%
                  </span>
                  <span className="text-gray-400">{stat.trendLabel}</span>
                </div>
              )}
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-500 text-sm mt-1">{stat.name}</p>
          </div>
        ))}
      </div>
      
      {/* ROI Calculator */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">ROI Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-blue-200 text-sm">Tickets Automated</p>
            <p className="text-3xl font-bold">{analytics.resolvedByAI}</p>
          </div>
          
          <div>
            <p className="text-blue-200 text-sm">Cost per Human Ticket</p>
            <p className="text-3xl font-bold">$15</p>
          </div>
          
          <div>
            <p className="text-blue-200 text-sm">Total Savings</p>
            <p className="text-3xl font-bold">${analytics.costSaved.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-blue-500">
          <p className="text-sm text-blue-200">
            Based on {analytics.aiResolutionRate}% AI resolution rate. 
            Each ticket resolved by AI saves approximately $15 in human agent costs.
          </p>
        </div>
      </div>
      
      {/* Sentiment Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Sentiment</h3>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  analytics.avgSentiment > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.abs(analytics.avgSentiment * 100)}%`,
                  marginLeft: analytics.avgSentiment < 0 ? 'auto' : 0
                }}
              />
            </div>
          </div>
          
          <div className="text-right">
            <p className={`text-2xl font-bold ${
              analytics.avgSentiment > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.avgSentiment > 0 ? '+' : ''}{(analytics.avgSentiment * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-500">
              {analytics.avgSentiment > 0 ? 'Positive' : 'Needs Improvement'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
