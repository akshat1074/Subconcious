import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/session'
import { apiError, apiSuccess } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    const item = await db.content.findFirst({ where: { id, userId: session.user.id } })
    if (!item) return apiError('Not found', 404)
    const updated = await db.content.update({
      where: { id },
      data: item.isPublic ? { isPublic: false, shareToken: null } : { isPublic: true, shareToken: uuidv4() },
    })
    return apiSuccess({ isPublic: updated.isPublic, shareToken: updated.shareToken })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Internal error', 500)
  }
}
