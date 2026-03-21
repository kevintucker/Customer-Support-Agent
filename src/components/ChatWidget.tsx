'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { MessageCircle, X, Send, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react'

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left'
  primaryColor?: string
  companyName?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget({
  position = 'bottom-right',
  primaryColor = '#2563eb',
  companyName = 'Support'
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [isResolved, setIsResolved] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const startNewChat = async () => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: 'New Support Request' })
      })
      const ticket = await res.json()
      setTicketId(ticket.id)
      setMessages([])
      setIsResolved(false)
      setShowFeedback(false)
    } catch (error) {
      console.error('Failed to create ticket:', error)
    }
  }
  
  const handleOpen = async () => {
    setIsOpen(true)
    if (!ticketId) {
      await startNewChat()
    }
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          ticketId
        })
      })
      
      if (!res.ok) throw new Error('Failed to send message')
      
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: ''
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          assistantMessage = {
            ...assistantMessage,
            content: assistantMessage.content + chunk
          }
          
          setMessages(prev => 
            prev.map(m => m.id === assistantMessage.id ? assistantMessage : m)
          )
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setIsLoading(false)
      scrollToBottom()
    }
  }
  
  const handleResolve = async (wasHelpful: boolean) => {
    if (!ticketId) return
    
    try {
      await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'resolved',
          wasHelpful
        })
      })
      
      await fetch('/api/fine-tuning/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, wasHelpful })
      })
      
      setIsResolved(true)
      setShowFeedback(false)
    } catch (error) {
      console.error('Failed to resolve ticket:', error)
    }
  }
  
  const positionClasses = position === 'bottom-right' 
    ? 'right-4 sm:right-6' 
    : 'left-4 sm:left-6'
  
  return (
    <>
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-50 p-4 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2`}
          style={{ backgroundColor: primaryColor }}
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}
      
      {isOpen && (
        <div className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-50 w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200`}>
          <div 
            className="flex items-center justify-between p-4 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-semibold">{companyName} Support</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">How can we help you today?</p>
                <p className="text-sm mt-1">Send us a message and we will respond shortly.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {messages.length > 2 && !isResolved && !showFeedback && (
            <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
              <button
                onClick={() => setShowFeedback(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Was this helpful? Let us know
              </button>
            </div>
          )}
          
          {showFeedback && !isResolved && (
            <div className="px-4 py-3 bg-gray-100 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Was this conversation helpful?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResolve(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                >
                  <ThumbsUp className="w-4 h-4" /> Yes
                </button>
                <button
                  onClick={() => handleResolve(false)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                >
                  <ThumbsDown className="w-4 h-4" /> No
                </button>
              </div>
            </div>
          )}
          
          {isResolved && (
            <div className="px-4 py-3 bg-green-50 border-t border-green-200">
              <p className="text-sm text-green-700">Thanks for your feedback!</p>
              <button
                onClick={startNewChat}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1"
              >
                Start a new conversation
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading || isResolved}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || isResolved}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
