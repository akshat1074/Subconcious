import { requireSession } from '@/lib/session'
import { db } from '@/lib/db'
import { apiError, apiSuccess } from '@/lib/utils'

export async function GET() {
  try {
    const session = await requireSession()
    const userId = session.user.id
    const [total, byType, favorites, pinned, archived] = await Promise.all([
      db.content.count({ where: { userId, isArchived: false } }),
      db.content.groupBy({ by: ['type'], where: { userId, isArchived: false }, _count: { type: true } }),
      db.content.count({ where: { userId, isFavorite: true, isArchived: false } }),
      db.content.count({ where: { userId, isPinned: true, isArchived: false } }),
      db.content.count({ where: { userId, isArchived: true } }),
    ])
    const typeMap = byType.reduce((acc: Record<string, number>, row) => { acc[row.type] = row._count.type; return acc }, {})
    return apiSuccess({ total, byType: typeMap, favorites, pinned, archived })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Internal error', 500)
  }
}
