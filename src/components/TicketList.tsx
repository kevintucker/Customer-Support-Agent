'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight,
  User,
  Bot
} from 'lucide-react'

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
  messages: { role: string; content: string; id: string; createdAt: string; metadata?: string }[]
}

interface TicketListProps {
  onSelectTicket: (ticket: Ticket) => void
  selectedTicketId?: string
}

export default function TicketList({ onSelectTicket, selectedTicketId }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchTickets()
    const interval = setInterval(fetchTickets, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [filter])
  
  const fetchTickets = async () => {
    try {
      const url = filter === 'all' ? '/api/tickets' : `/api/tickets?status=${filter}`
      const res = await fetch(url)
      const data = await res.json()
      setTickets(data)
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'escalated':
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />
    }
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'normal':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-600'
    if (sentiment < -0.3) return 'text-red-600'
    return 'text-gray-600'
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex gap-2">
          {['all', 'open', 'escalated', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No tickets found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <button
                  onClick={() => onSelectTicket(ticket)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedTicketId === ticket.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(ticket.status)}
                        <span className="font-medium text-gray-900 truncate">
                          {ticket.subject}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={getSentimentColor(ticket.sentiment)}>
                          Sentiment: {(ticket.sentiment * 100).toFixed(0)}%
                        </span>
                        <span>
                          {format(new Date(ticket.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      
                      {/* Preview of last message */}
                      {ticket.messages.length > 0 && (
                        <div className="mt-2 flex items-start gap-1 text-sm text-gray-600">
                          {ticket.messages[ticket.messages.length - 1].role === 'user' ? (
                            <User className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Bot className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          )}
                          <p className="truncate">
                            {ticket.messages[ticket.messages.length - 1].content.slice(0, 80)}...
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
