import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const data = await prisma.fineTuningData.findMany({
      where: {
        exported: false,
        wasHelpful: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Format for Claude fine-tuning (JSONL format)
    const formattedData = data.map(item => {
      const conversation = JSON.parse(item.conversation)
      
      // Convert to Claude fine-tuning format
      const messages = conversation
        .filter((msg: { role: string }) => msg.role !== 'system')
        .map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      
      return {
        messages,
        metadata: {
          ticketId: item.ticketId,
          resolution: item.resolution,
          feedback: item.feedback
        }
      }
    })
    
    // Mark as exported
    await prisma.fineTuningData.updateMany({
      where: {
        id: { in: data.map(d => d.id) }
      },
      data: { exported: true }
    })
    
    // Return as JSONL
    const jsonl = formattedData.map(d => JSON.stringify(d)).join('\n')
    
    return new Response(jsonl, {
      headers: {
        'Content-Type': 'application/jsonl',
        'Content-Disposition': `attachment; filename="fine-tuning-data-${Date.now()}.jsonl"`
      }
    })
  } catch (error) {
    console.error('Error exporting fine-tuning data:', error)
    return Response.json({ error: 'Failed to export data' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { ticketId, wasHelpful, feedback } = await req.json()
    
    await prisma.fineTuningData.updateMany({
      where: { ticketId },
      data: { wasHelpful, feedback }
    })
    
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error updating feedback:', error)
    return Response.json({ error: 'Failed to update feedback' }, { status: 500 })
  }
}
