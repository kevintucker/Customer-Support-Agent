export interface EscalationAnalysis {
  shouldEscalate: boolean
  confidence: number
  sentiment: number
  reasons: string[]
  suggestedPriority: 'low' | 'normal' | 'high' | 'urgent'
  detectedIntent: string
  category: string
}

const ESCALATION_KEYWORDS = [
  'speak to human', 'talk to someone', 'real person', 'manager',
  'supervisor', 'cancel', 'refund', 'lawsuit', 'lawyer', 'attorney',
  'unacceptable', 'ridiculous', 'terrible', 'worst', 'hate',
  'urgent', 'emergency', 'asap', 'immediately'
]

const NEGATIVE_SENTIMENT_WORDS = [
  'angry', 'frustrated', 'upset', 'annoyed', 'furious', 'terrible',
  'horrible', 'awful', 'worst', 'hate', 'disgusted', 'disappointed',
  'unacceptable', 'ridiculous', 'pathetic', 'useless', 'incompetent'
]

const POSITIVE_SENTIMENT_WORDS = [
  'thanks', 'thank you', 'helpful', 'great', 'awesome', 'excellent',
  'perfect', 'wonderful', 'appreciate', 'happy', 'satisfied', 'good'
]

const INTENT_PATTERNS: Record<string, RegExp[]> = {
  billing: [/bill/i, /charge/i, /invoice/i, /payment/i, /refund/i, /subscription/i],
  technical: [/error/i, /bug/i, /crash/i, /not working/i, /broken/i, /issue/i],
  account: [/password/i, /login/i, /account/i, /access/i, /locked/i],
  shipping: [/ship/i, /deliver/i, /track/i, /order/i, /package/i],
  general: [/how/i, /what/i, /where/i, /when/i, /help/i]
}

export function analyzeMessage(message: string, conversationHistory: string[] = []): EscalationAnalysis {
  const lowerMessage = message.toLowerCase()
  const fullContext = [...conversationHistory, message].join(' ').toLowerCase()
  
  const reasons: string[] = []
  let confidence = 0.85
  
  // Check for explicit escalation requests
  const hasEscalationKeyword = ESCALATION_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword)
  )
  if (hasEscalationKeyword) {
    reasons.push('Customer requested human assistance')
    confidence = 0.3
  }
  
  // Sentiment analysis
  const negativeCount = NEGATIVE_SENTIMENT_WORDS.filter(word => 
    lowerMessage.includes(word)
  ).length
  const positiveCount = POSITIVE_SENTIMENT_WORDS.filter(word => 
    lowerMessage.includes(word)
  ).length
  
  const sentiment = (positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount)
  
  if (negativeCount >= 2) {
    reasons.push('Detected strong negative sentiment')
    confidence = Math.min(confidence, 0.5)
  }
  
  // Check message length and complexity
  if (message.length > 500) {
    reasons.push('Complex issue requiring detailed attention')
    confidence = Math.min(confidence, 0.6)
  }
  
  // Check for repeated messages (frustration indicator)
  const messageCount = conversationHistory.length
  if (messageCount > 5) {
    reasons.push('Extended conversation without resolution')
    confidence = Math.min(confidence, 0.5)
  }
  
  // Detect intent
  let detectedIntent = 'general'
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some(pattern => pattern.test(lowerMessage))) {
      detectedIntent = intent
      break
    }
  }
  
  // Determine category
  const category = detectedIntent
  
  // Determine priority
  let suggestedPriority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency')) {
    suggestedPriority = 'urgent'
    reasons.push('Marked as urgent by customer')
  } else if (confidence < 0.4 || negativeCount >= 2) {
    suggestedPriority = 'high'
  } else if (sentiment > 0.5) {
    suggestedPriority = 'low'
  }
  
  // Final escalation decision
  const shouldEscalate = confidence < 0.5 || hasEscalationKeyword || negativeCount >= 3
  
  return {
    shouldEscalate,
    confidence,
    sentiment,
    reasons,
    suggestedPriority,
    detectedIntent,
    category
  }
}

export function calculateROI(resolvedByAI: number, avgHumanCostPerTicket: number = 15): number {
  return resolvedByAI * avgHumanCostPerTicket
}
