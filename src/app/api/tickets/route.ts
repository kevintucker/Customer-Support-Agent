import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const where = status ? { status } : {}
    
    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    
    return Response.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return Response.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const ticket = await prisma.ticket.create({
      data: {
        customerEmail: body.email || null,
        customerName: body.name || null,
        subject: body.subject || 'New Support Request',
        status: 'open',
        priority: 'normal'
      }
    })
    
    // Create initial system message
    await prisma.message.create({
      data: {
        ticketId: ticket.id,
        role: 'system',
        content: 'Ticket created'
      }
    })
    
    return Response.json(ticket)
  } catch (error) {
    console.error('Error creating ticket:', error)
    return Response.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}
