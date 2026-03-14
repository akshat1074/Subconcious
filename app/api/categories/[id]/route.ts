import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/session'
import { apiError, apiSuccess } from '@/lib/utils'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    await db.category.delete({ where: { id, userId: session.user.id } })
    return apiSuccess({ deleted: true })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Not found', 404)
  }
}
