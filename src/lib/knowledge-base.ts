export interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
}

// Default knowledge base for demo purposes
export const DEFAULT_KNOWLEDGE_BASE: Omit<KnowledgeItem, 'id'>[] = [
  {
    title: 'Password Reset',
    content: `To reset your password:
1. Go to the login page and click "Forgot Password"
2. Enter your email address
3. Check your inbox for a reset link (also check spam folder)
4. Click the link and create a new password
5. Password must be at least 8 characters with one number and one special character

If you don't receive the email within 5 minutes, please try again or contact support.`,
    category: 'account',
    tags: ['password', 'reset', 'login', 'access']
  },
  {
    title: 'Refund Policy',
    content: `Our refund policy:
- Full refund within 30 days of purchase for unused products
- Partial refund (50%) within 30-60 days
- No refunds after 60 days
- Digital products are non-refundable once downloaded
- Subscription refunds are prorated

To request a refund, provide your order number and reason for the refund.`,
    category: 'billing',
    tags: ['refund', 'money', 'return', 'cancel']
  },
  {
    title: 'Shipping Information',
    content: `Shipping details:
- Standard shipping: 5-7 business days
- Express shipping: 2-3 business days
- Overnight shipping: Next business day

Track your order using the tracking number in your confirmation email.
International shipping may take 10-21 business days depending on destination.`,
    category: 'shipping',
    tags: ['shipping', 'delivery', 'track', 'order']
  },
  {
    title: 'Account Deletion',
    content: `To delete your account:
1. Log into your account
2. Go to Settings > Privacy
3. Click "Delete Account"
4. Confirm by entering your password
5. Your account will be scheduled for deletion in 30 days

Note: This action is irreversible. All your data will be permanently deleted.`,
    category: 'account',
    tags: ['delete', 'remove', 'account', 'gdpr', 'privacy']
  },
  {
    title: 'Subscription Management',
    content: `To manage your subscription:
- Upgrade/Downgrade: Settings > Subscription > Change Plan
- Cancel: Settings > Subscription > Cancel (keeps access until end of billing period)
- Update payment method: Settings > Billing > Payment Methods

Changes take effect at your next billing cycle. No prorated charges for upgrades.`,
    category: 'billing',
    tags: ['subscription', 'plan', 'upgrade', 'cancel', 'billing']
  },
  {
    title: 'Technical Issues',
    content: `Common troubleshooting steps:
1. Clear your browser cache and cookies
2. Try a different browser (Chrome, Firefox, Safari)
3. Disable browser extensions
4. Check your internet connection
5. Try incognito/private browsing mode

If issues persist, please provide:
- Browser type and version
- Operating system
- Screenshot of any error messages
- Steps to reproduce the issue`,
    category: 'technical',
    tags: ['error', 'bug', 'issue', 'technical', 'help']
  }
]

export function findRelevantKnowledge(query: string, knowledgeBase: KnowledgeItem[]): KnowledgeItem[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/)
  
  const scored = knowledgeBase.map(item => {
    let score = 0
    
    // Check title match
    if (item.title.toLowerCase().includes(queryLower)) {
      score += 10
    }
    
    // Check tag matches
    for (const tag of item.tags) {
      if (queryLower.includes(tag)) {
        score += 5
      }
      for (const word of queryWords) {
        if (tag.includes(word) || word.includes(tag)) {
          score += 2
        }
      }
    }
    
    // Check content matches
    for (const word of queryWords) {
      if (word.length > 3 && item.content.toLowerCase().includes(word)) {
        score += 1
      }
    }
    
    return { item, score }
  })
  
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item)
}
