import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    
    if (!ticket) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 })
    }
    
    return Response.json(ticket)
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return Response.json({ error: 'Failed to fetch ticket' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    
    const updateData: Record<string, unknown> = {}
    
    if (body.status) {
      updateData.status = body.status
      if (body.status === 'resolved') {
        updateData.resolvedAt = new Date()
      }
      if (body.status === 'escalated') {
        updateData.escalatedAt = new Date()
      }
    }
    
    if (body.priority) updateData.priority = body.priority
    if (body.resolution) updateData.resolution = body.resolution
    
    const ticket = await prisma.ticket.update({
      where: { id: params.id },
      data: updateData,
      include: {
        messages: true
      }
    })
    
    // If resolved, save for fine-tuning
    if (body.status === 'resolved') {
      const messages = await prisma.message.findMany({
        where: { ticketId: params.id },
        orderBy: { createdAt: 'asc' }
      })
      
      await prisma.fineTuningData.create({
        data: {
          ticketId: params.id,
          conversation: JSON.stringify(messages),
          resolution: body.resolution || 'Resolved by AI',
          wasHelpful: body.wasHelpful
        }
      })
      
      // Update analytics
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const existingAnalytics = await prisma.analytics.findFirst({
        where: {
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      })
      
      if (existingAnalytics) {
        await prisma.analytics.update({
          where: { id: existingAnalytics.id },
          data: {
            totalTickets: { increment: 1 },
            resolvedByAI: ticket.status === 'resolved' && !ticket.escalatedAt 
              ? { increment: 1 } 
              : undefined,
            costSaved: ticket.status === 'resolved' && !ticket.escalatedAt
              ? { increment: 15 } // $15 per ticket saved
              : undefined
          }
        })
      } else {
        await prisma.analytics.create({
          data: {
            date: today,
            totalTickets: 1,
            resolvedByAI: ticket.status === 'resolved' && !ticket.escalatedAt ? 1 : 0,
            costSaved: ticket.status === 'resolved' && !ticket.escalatedAt ? 15 : 0
          }
        })
      }
    }
    
    return Response.json(ticket)
  } catch (error) {
    console.error('Error updating ticket:', error)
    return Response.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}
