import Link from 'next/link'
import { MessageCircle, BarChart3, Settings, Zap, Shield, TrendingUp } from 'lucide-react'
import ChatWidget from '@/components/ChatWidget'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-8 h-8" />
            <span className="text-xl font-bold">SupportAgent</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="px-4 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/demo" 
              className="px-4 py-2 text-sm bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Try Demo
            </Link>
          </div>
        </nav>
        
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            AI-Powered Customer Support
            <br />
            <span className="text-blue-200">That Actually Works</span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Resolve 70% of support tickets automatically. Intelligent escalation 
            ensures complex issues reach human agents. Learn from every interaction.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/demo"
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Try Live Demo
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 border border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Built for Scale, Designed for ROI
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Instant Resolution
            </h3>
            <p className="text-gray-600">
              Powered by Claude, our agent understands context and resolves 
              common issues in seconds, not hours.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Escalation
            </h3>
            <p className="text-gray-600">
              Sentiment analysis and confidence scoring ensure complex or 
              sensitive issues reach human agents immediately.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Continuous Learning
            </h3>
            <p className="text-gray-600">
              Every resolved ticket improves the model. Export training data 
              for fine-tuning to match your specific needs.
            </p>
          </div>
        </div>
      </div>
      
      {/* Pricing Preview */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            Pay only for what you use. No hidden fees, no long-term contracts.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-xl border border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Starter</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                $0.10<span className="text-lg text-gray-500">/ticket</span>
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>Up to 1,000 tickets/month</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
            </div>
            
            <div className="p-6 bg-blue-600 rounded-xl text-white text-center transform scale-105">
              <h3 className="text-lg font-semibold mb-2">Growth</h3>
              <p className="text-4xl font-bold mb-4">
                $0.07<span className="text-lg text-blue-200">/ticket</span>
              </p>
              <ul className="text-sm text-blue-100 space-y-2 mb-6">
                <li>Up to 10,000 tickets/month</li>
                <li>Advanced analytics + ROI</li>
                <li>Priority support</li>
                <li>Custom knowledge base</li>
              </ul>
            </div>
            
            <div className="p-6 bg-white rounded-xl border border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                Custom
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>Unlimited tickets</li>
                <li>Fine-tuning included</li>
                <li>Dedicated support</li>
                <li>SLA guarantees</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Support?
        </h2>
        <p className="text-gray-600 mb-8">
          Start resolving tickets automatically in minutes, not months.
        </p>
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Try the Demo
        </Link>
      </div>
      
      {/* Chat Widget */}
      <ChatWidget companyName="SupportAgent" />
    </main>
  )
}
