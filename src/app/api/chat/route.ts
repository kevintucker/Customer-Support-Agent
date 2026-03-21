import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { prisma } from '@/lib/db'
import { analyzeMessage } from '@/lib/escalation'
import { findRelevantKnowledge, DEFAULT_KNOWLEDGE_BASE, KnowledgeItem } from '@/lib/knowledge-base'

export const runtime = 'nodejs'
export const maxDuration = 30

const SYSTEM_PROMPT = `You are a helpful, friendly customer support agent for a SaaS company. Your goal is to:

1. Understand the customer's issue quickly and empathetically
2. Provide clear, actionable solutions
3. Use the knowledge base information when relevant
4. Be concise but thorough
5. If you cannot resolve an issue, acknowledge it clearly

Guidelines:
- Always be polite and professional
- Acknowledge the customer's frustration if they express it
- Provide step-by-step instructions when helpful
- Ask clarifying questions if the issue is unclear
- Never make up information - if unsure, say so
- End with asking if there's anything else you can help with

If the customer asks to speak with a human, requests a refund over $100, or has a complex issue you cannot resolve, indicate that you'll connect them with a human agent.`

export async function POST(req: Request) {
  try {
    const { messages, ticketId } = await req.json()
    
    const lastUserMessage = messages[messages.length - 1]?.content || ''
    
    // Analyze the message for escalation
    const conversationHistory = messages
      .filter((m: { role: string }) => m.role === 'user')
      .map((m: { content: string }) => m.content)
    
    const analysis = analyzeMessage(lastUserMessage, conversationHistory)
    
    // Find relevant knowledge base articles
    const kbItems = await prisma.knowledgeBase.findMany()
    const knowledgeItems: KnowledgeItem[] = kbItems.length > 0 
      ? kbItems.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          category: item.category,
          tags: item.tags.split(',').map(t => t.trim())
        }))
      : DEFAULT_KNOWLEDGE_BASE.map((item, i) => ({ ...item, id: `default-${i}` }))
    
    const relevantKnowledge = findRelevantKnowledge(lastUserMessage, knowledgeItems)
    
    // Build context with knowledge base
    let contextPrompt = SYSTEM_PROMPT
    if (relevantKnowledge.length > 0) {
      contextPrompt += '\n\nRelevant knowledge base articles:\n'
      for (const item of relevantKnowledge) {
        contextPrompt += `\n--- ${item.title} ---\n${item.content}\n`
      }
    }
    
    // Add escalation context if needed
    if (analysis.shouldEscalate) {
      contextPrompt += `\n\nIMPORTANT: This conversation may need escalation to a human agent. Reasons: ${analysis.reasons.join(', ')}. 
Please acknowledge the customer's concern and let them know you're connecting them with a human support specialist who can better assist them.`
    }
    
    // Update ticket with analysis
    if (ticketId) {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          sentiment: analysis.sentiment,
          confidenceScore: analysis.confidence,
          category: analysis.category,
          priority: analysis.suggestedPriority,
          status: analysis.shouldEscalate ? 'escalated' : 'open',
          escalatedAt: analysis.shouldEscalate ? new Date() : undefined,
        }
      })
      
      // Save user message
      await prisma.message.create({
        data: {
          ticketId,
          role: 'user',
          content: lastUserMessage,
          metadata: JSON.stringify({
            sentiment: analysis.sentiment,
            intent: analysis.detectedIntent,
            confidence: analysis.confidence
          })
        }
      })
    }
    
    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: contextPrompt,
      messages,
      onFinish: async ({ text }) => {
        // Save assistant response
        if (ticketId) {
          await prisma.message.create({
            data: {
              ticketId,
              role: 'assistant',
              content: text,
            }
          })
        }
      }
    })
    
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
