'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MessageCircle, 
  BarChart3, 
  Inbox,
  ArrowLeft
} from 'lucide-react'
import TicketList from '@/components/TicketList'
import TicketDetail from '@/components/TicketDetail'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

type Tab = 'tickets' | 'analytics'

interface Ticket {
  id: string
  subject: string
  status: string
  priority: string
  category: string | null
  sentiment: number
  confidenceScore: number
  createdAt: string
  escalatedAt: string | null
  resolvedAt: string | null
  resolution: string | null
  messages: {
    id: string
    role: string
    content: string
    createdAt: string
    metadata?: string
  }[]
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tickets')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  
  const handleTicketUpdate = () => {
    setRefreshKey(prev => prev + 1)
    if (selectedTicket) {
      // Refresh the selected ticket
      fetch(`/api/tickets/${selectedTicket.id}`)
        .then(res => res.json())
        .then(data => setSelectedTicket(data))
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold">Support Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'tickets'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Inbox className="w-4 h-4" />
              Tickets
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>
      </header>
      
      {/* Content */}
      {activeTab === 'analytics' ? (
        <AnalyticsDashboard />
      ) : (
        <div className="flex h-[calc(100vh-73px)]">
          {/* Ticket List */}
          <div className="w-1/3 border-r border-gray-200 bg-white">
            <TicketList
              key={refreshKey}
              onSelectTicket={setSelectedTicket}
              selectedTicketId={selectedTicket?.id}
            />
          </div>
          
          {/* Ticket Detail */}
          <div className="flex-1 bg-white">
            {selectedTicket ? (
              <TicketDetail
                ticket={selectedTicket}
                onUpdate={handleTicketUpdate}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Select a ticket to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
