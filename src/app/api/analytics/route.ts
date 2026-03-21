import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get all-time stats
    const totalTickets = await prisma.ticket.count()
    const resolvedTickets = await prisma.ticket.count({
      where: { status: 'resolved' }
    })
    const escalatedTickets = await prisma.ticket.count({
      where: { status: 'escalated' }
    })
    
    // Get tickets resolved by AI (resolved without escalation)
    const resolvedByAI = await prisma.ticket.count({
      where: {
        status: 'resolved',
        escalatedAt: null
      }
    })
    
    // Calculate average sentiment
    const sentimentAgg = await prisma.ticket.aggregate({
      _avg: {
        sentiment: true
      }
    })
    
    // Calculate average resolution time for resolved tickets
    const resolvedTicketsWithTime = await prisma.ticket.findMany({
      where: {
        status: 'resolved',
        resolvedAt: { not: null }
      },
      select: {
        createdAt: true,
        resolvedAt: true
      }
    })
    
    let avgResolutionTime = 0
    if (resolvedTicketsWithTime.length > 0) {
      const totalMinutes = resolvedTicketsWithTime.reduce((sum, ticket) => {
        if (ticket.resolvedAt) {
          return sum + (ticket.resolvedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60)
        }
        return sum
      }, 0)
      avgResolutionTime = totalMinutes / resolvedTicketsWithTime.length
    }
    
    // Get daily analytics for chart
    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)
    
    const dailyAnalytics = await prisma.analytics.findMany({
      where: {
        date: { gte: last30Days }
      },
      orderBy: { date: 'asc' }
    })
    
    // Cost saved calculation
    const costSaved = resolvedByAI * 15 // $15 per ticket
    
    const resolutionRate = totalTickets > 0 
      ? (resolvedTickets / totalTickets) * 100 
      : 0
      
    const escalationRate = totalTickets > 0 
      ? (escalatedTickets / totalTickets) * 100 
      : 0
    
    const aiResolutionRate = totalTickets > 0
      ? (resolvedByAI / totalTickets) * 100
      : 0
    
    return Response.json({
      totalTickets,
      resolvedTickets,
      escalatedTickets,
      resolvedByAI,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      avgSentiment: sentimentAgg._avg.sentiment || 0,
      costSaved,
      resolutionRate: Math.round(resolutionRate * 10) / 10,
      escalationRate: Math.round(escalationRate * 10) / 10,
      aiResolutionRate: Math.round(aiResolutionRate * 10) / 10,
      dailyAnalytics
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
