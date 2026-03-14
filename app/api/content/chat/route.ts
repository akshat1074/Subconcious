import { NextRequest } from 'next/server'
import { requireSession } from '@/lib/session'
import { ragChat } from '@/lib/ai'
import { apiError, apiSuccess } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const { question, history = [] } = await req.json()
    if (!question?.trim()) return apiError('Question is required')
    const answer = await ragChat(session.user.id, question.trim(), history)
    return apiSuccess({ answer })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    if (err.message?.includes('GROQ')) return apiError('AI service not configured', 503)
    return apiError('Internal error', 500)
  }
}
