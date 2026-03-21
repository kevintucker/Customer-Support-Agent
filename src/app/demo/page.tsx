'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import ChatWidget from '@/components/ChatWidget'

const DEMO_SCENARIOS = [
  {
    title: 'Password Reset',
    description: 'Test how the agent handles common account issues',
    prompt: 'I forgot my password and can\'t log in to my account'
  },
  {
    title: 'Refund Request',
    description: 'See how billing inquiries are processed',
    prompt: 'I want a refund for my last order #12345'
  },
  {
    title: 'Technical Issue',
    description: 'Watch the agent troubleshoot problems',
    prompt: 'The app keeps crashing whenever I try to upload a file'
  },
  {
    title: 'Escalation Test',
    description: 'See how frustrated customers trigger escalation',
    prompt: 'This is ridiculous! I\'ve been waiting for 3 days and nobody has helped me. I want to speak to a manager NOW!'
  }
]

export default function DemoPage() {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null)
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold">SupportAgent Demo</span>
            </div>
          </div>
          
          <Link 
            href="/dashboard" 
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Interactive Demo
          </h1>
          <p className="text-gray-600 mb-8">
            Try out the support agent with these sample scenarios, or start your own conversation
            using the chat widget in the bottom right corner.
          </p>
          
          {/* Scenario Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {DEMO_SCENARIOS.map((scenario, index) => (
              <button
                key={index}
                onClick={() => setSelectedScenario(index)}
                className={`p-6 text-left rounded-xl border-2 transition-all ${
                  selectedScenario === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {scenario.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {scenario.description}
                </p>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-700 italic">
                    "{scenario.prompt}"
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              How to Test
            </h2>
            
            <ol className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <span>
                  Click the chat bubble in the bottom-right corner to open the support widget
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <span>
                  Type one of the sample prompts above, or ask your own question
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <span>
                  Notice how the agent uses knowledge base articles to provide accurate responses
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </span>
                <span>
                  Try the "Escalation Test" to see how negative sentiment triggers human escalation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  5
                </span>
                <span>
                  Check the <Link href="/dashboard" className="text-blue-600 hover:underline">dashboard</Link> to see your conversation tracked in real-time
                </span>
              </li>
            </ol>
          </div>
          
          {/* Technical Details */}
          <div className="mt-8 p-6 bg-gray-900 rounded-xl text-gray-300">
            <h3 className="text-lg font-semibold text-white mb-4">
              Under the Hood
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• <span className="text-blue-400">AI Model:</span> Claude (Anthropic) via Vercel AI SDK</li>
              <li>• <span className="text-blue-400">Escalation:</span> Sentiment analysis + confidence scoring + keyword detection</li>
              <li>• <span className="text-blue-400">Knowledge Base:</span> RAG-style retrieval from stored articles</li>
              <li>• <span className="text-blue-400">Learning:</span> Resolved conversations exported for fine-tuning</li>
              <li>• <span className="text-blue-400">Database:</span> SQLite (Prisma ORM) - production would use PostgreSQL</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Chat Widget */}
      <ChatWidget companyName="Demo Support" />
    </main>
  )
}
