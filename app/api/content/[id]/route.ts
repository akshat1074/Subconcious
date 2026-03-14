import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/session'
import { apiError, apiSuccess } from '@/lib/utils'
import { serializeContent } from '@/lib/serialize'
import { buildVectorText } from '@/lib/metadata'
import { upsertEmbedding } from '@/lib/ai'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    const item = await db.content.findFirst({ where: { id, userId: session.user.id }, include: { category: { select: { id: true, name: true, color: true, icon: true } } } })
    if (!item) return apiError('Not found', 404)
    await db.content.update({ where: { id }, data: { viewCount: { increment: 1 } } })
    return apiSuccess(serializeContent(item))
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Internal error', 500)
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    const { title, content, tags, categoryId, isFavorite, isPinned, isArchived } = await req.json()
    const item = await db.content.update({
      where: { id, userId: session.user.id },
      data: { ...(title !== undefined && { title }), ...(content !== undefined && { content }), ...(tags !== undefined && { tags }), ...(categoryId !== undefined && { categoryId }), ...(isFavorite !== undefined && { isFavorite }), ...(isPinned !== undefined && { isPinned }), ...(isArchived !== undefined && { isArchived }) },
      include: { category: { select: { id: true, name: true, color: true, icon: true } } },
    })
    if (title || content || tags) {
      setImmediate(() => upsertEmbedding(item.id, buildVectorText({ title: item.title, type: item.type, url: item.url, content: item.content, tags: item.tags, description: item.previewDescription })).catch(() => {}))
    }
    return apiSuccess(serializeContent(item))
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Not found or internal error', 404)
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession()
    const { id } = await params
    await db.content.delete({ where: { id, userId: session.user.id } })
    return apiSuccess({ deleted: true })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Not found', 404)
  }
}
