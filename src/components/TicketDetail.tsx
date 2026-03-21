'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { 
  User, 
  Bot, 
  CheckCircle, 
  AlertTriangle,
  ArrowUp,
  Clock,
  Tag
} from 'lucide-react'

interface Message {
  id: string
  role: string
  content: string
  createdAt: string
  metadata?: string
}

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
  messages: Message[]
}

interface TicketDetailProps {
  ticket: Ticket
  onUpdate: () => void
}

export default function TicketDetail({ ticket, onUpdate }: TicketDetailProps) {
  const [resolution, setResolution] = useState(ticket.resolution || '')
  const [updating, setUpdating] = useState(false)
  
  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    try {
      await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          resolution: newStatus === 'resolved' ? resolution : undefined
        })
      })
      onUpdate()
    } catch (error) {
      console.error('Failed to update ticket:', error)
    } finally {
      setUpdating(false)
    }
  }
  
  const handlePriorityChange = async (newPriority: string) => {
    try {
      await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority })
      })
      onUpdate()
    } catch (error) {
      console.error('Failed to update priority:', error)
    }
  }
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.7) return 'text-green-600 bg-green-50'
    if (confidence > 0.4) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{ticket.subject}</h2>
            <p className="text-sm text-gray-500">
              Created {format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {ticket.status !== 'resolved' && (
              <>
                {ticket.status !== 'escalated' && (
                  <button
                    onClick={() => handleStatusChange('escalated')}
                    disabled={updating}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 disabled:opacity-50"
                  >
                    <ArrowUp className="w-4 h-4" />
                    Escalate
                  </button>
                )}
                <button
                  onClick={() => handleStatusChange('resolved')}
                  disabled={updating}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Resolve
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1">
            <span className={`px-2 py-1 rounded-lg ${
              ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
              ticket.status === 'escalated' ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {ticket.status}
            </span>
          </div>
          
          <select
            value={ticket.priority}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="px-2 py-1 rounded-lg border border-gray-200 text-sm bg-white"
          >
            <option value="low">Low Priority</option>
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
          
          {ticket.category && (
            <div className="flex items-center gap-1 text-gray-600">
              <Tag className="w-4 h-4" />
              {ticket.category}
            </div>
          )}
          
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getConfidenceColor(ticket.confidenceScore)}`}>
            {ticket.confidenceScore < 0.5 ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            AI Confidence: {(ticket.confidenceScore * 100).toFixed(0)}%
          </div>
        </div>
        
        {ticket.escalatedAt && (
          <div className="mt-2 flex items-center gap-1 text-sm text-orange-600">
            <Clock className="w-4 h-4" />
            Escalated {format(new Date(ticket.escalatedAt), 'MMM d, h:mm a')}
          </div>
        )}
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {ticket.messages
          .filter(m => m.role !== 'system')
          .map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
              
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(message.createdAt), 'h:mm a')}
                </p>
              </div>
            </div>
          ))}
      </div>
      
      {/* Resolution Notes */}
      {ticket.status !== 'resolved' && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resolution Notes
          </label>
          <textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Add notes about how this ticket was resolved..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
      )}
      
      {ticket.resolution && (
        <div className="p-4 border-t border-gray-200 bg-green-50">
          <p className="text-sm font-medium text-green-800 mb-1">Resolution</p>
          <p className="text-sm text-green-700">{ticket.resolution}</p>
          {ticket.resolvedAt && (
            <p className="text-xs text-green-600 mt-2">
              Resolved {format(new Date(ticket.resolvedAt), 'MMM d, yyyy h:mm a')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
