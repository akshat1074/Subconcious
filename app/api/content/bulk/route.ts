import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/session'
import { apiError, apiSuccess } from '@/lib/utils'

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireSession()
    const { ids } = await req.json()
    if (!ids || !Array.isArray(ids)) return apiError('ids array required')
    const result = await db.content.deleteMany({ where: { id: { in: ids }, userId: session.user.id } })
    return apiSuccess({ deleted: result.count })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Internal error', 500)
  }
}
