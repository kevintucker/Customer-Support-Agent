export interface Ticket {
  id: string
  customerEmail: string | null
  customerName: string | null
  subject: string
  status: 'open' | 'escalated' | 'resolved'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  category: string | null
  sentiment: number
  confidenceScore: number
  escalatedAt: Date | null
  resolvedAt: Date | null
  resolution: string | null
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

export interface Message {
  id: string
  ticketId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata: string | null
  createdAt: Date
}

export interface AnalyticsData {
  totalTickets: number
  resolvedByAI: number
  escalatedToHuman: number
  avgResolutionTime: number
  avgSentiment: number
  costSaved: number
  resolutionRate: number
  escalationRate: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
