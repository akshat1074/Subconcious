import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/session'
import { apiError, apiSuccess } from '@/lib/utils'

export async function GET() {
  try {
    const session = await requireSession()
    const cats = await db.category.findMany({
      where: { userId: session.user.id }, orderBy: { name: 'asc' },
      include: { _count: { select: { contents: { where: { isArchived: false } } } } },
    })
    return apiSuccess(cats.map((c) => ({ ...c, count: c._count.contents, _count: undefined })))
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Internal error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const { name, color = '#6366f1', icon = 'folder' } = await req.json()
    if (!name?.trim()) return apiError('Name is required')
    const existing = await db.category.findFirst({ where: { userId: session.user.id, name: name.trim() } })
    if (existing) return apiError('Category already exists', 409)
    const cat = await db.category.create({ data: { userId: session.user.id, name: name.trim(), color, icon } })
    return apiSuccess({ ...cat, count: 0 }, 201)
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Internal error', 500)
  }
}
