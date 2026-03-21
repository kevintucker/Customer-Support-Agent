'use client'

import ChatWidget from '@/components/ChatWidget'

export default function WidgetPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Embeddable Widget Preview
        </h1>
        <p className="text-gray-600 mb-8">
          This is how the chat widget will appear on your website. 
          Click the chat bubble to interact.
        </p>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Embed Code</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- Add to your website -->
<script src="https://your-domain.com/widget.js"></script>
<script>
  SupportAgent.init({
    companyName: 'Your Company',
    primaryColor: '#2563eb',
    position: 'bottom-right'
  });
</script>`}
          </pre>
        </div>
      </div>
      
      <ChatWidget 
        companyName="Widget Demo"
        primaryColor="#2563eb"
        position="bottom-right"
      />
    </div>
  )
}
