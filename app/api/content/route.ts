import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/session'
import { extractYouTubeId, extractTweetId, fetchLinkMetadata, buildVectorText } from '@/lib/metadata'
import { upsertEmbedding } from '@/lib/ai'
import { apiError, apiSuccess } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'
import { Prisma } from '@prisma/client'

export function serializeContent(item: any) {
  const { previewImage, previewDescription, previewSiteName, previewFavicon, embedding, ...rest } = item
  return { ...rest, preview: { image: previewImage, description: previewDescription, siteName: previewSiteName, favicon: previewFavicon } }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession()
    const { searchParams: p } = new URL(req.url)
    const search = p.get('search') || ''
    const type = p.get('type') || ''
    const category = p.get('category') || ''
    const favorite = p.get('favorite') || ''
    const archived = p.get('archived') === 'true'
    const sortBy = p.get('sortBy') || 'newest'
    const page = Math.max(1, parseInt(p.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(p.get('limit') || '24')))
    const skip = (page - 1) * limit

    const where: Prisma.ContentWhereInput = {
      userId: session.user.id,
      isArchived: archived,
      ...(type && { type: type as any }),
      ...(category && { categoryId: category }),
      ...(favorite === 'true' && { isFavorite: true }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { previewDescription: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ],
      }),
    }

    const orderBy: Prisma.ContentOrderByWithRelationInput[] = [
      { isPinned: 'desc' },
      sortBy === 'oldest' ? { createdAt: 'asc' }
      : sortBy === 'viewed' ? { viewCount: 'desc' }
      : sortBy === 'alpha' ? { title: 'asc' }
      : { createdAt: 'desc' },
    ]

    const [items, total] = await Promise.all([
      db.content.findMany({ where, orderBy, skip, take: limit, include: { category: { select: { id: true, name: true, color: true, icon: true } } } }),
      db.content.count({ where }),
    ])

    return apiSuccess({ items: items.map(serializeContent), pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Internal error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const { type, title, url, content, tags, categoryId } = await req.json()
    if (!type || !title) return apiError('type and title are required')
    if (!['youtube', 'tweet', 'note', 'link'].includes(type)) return apiError('Invalid content type')

    let embedId: string | null = null
    let previewImage: string | null = null
    let previewDescription: string | null = null
    let previewSiteName: string | null = null
    let previewFavicon: string | null = null

    if (type === 'youtube' && url) {
      embedId = extractYouTubeId(url)
      if (!embedId) return apiError('Invalid YouTube URL')
      previewImage = `https://img.youtube.com/vi/${embedId}/mqdefault.jpg`
    } else if (type === 'tweet' && url) {
      embedId = extractTweetId(url)
      if (!embedId) return apiError('Invalid Twitter/X URL')
    } else if (type === 'link' && url) {
      const meta = await fetchLinkMetadata(url)
      previewImage = meta.image; previewDescription = meta.description
      previewSiteName = meta.siteName; previewFavicon = meta.favicon
    }

    const item = await db.content.create({
      data: { userId: session.user.id, type, title, url: url || null, content: content || null, embedId, previewImage, previewDescription, previewSiteName, previewFavicon, tags: tags || [], categoryId: categoryId || null },
      include: { category: { select: { id: true, name: true, color: true, icon: true } } },
    })

    setImmediate(() => upsertEmbedding(item.id, buildVectorText({ title, type, url, content, tags, description: previewDescription })).catch(() => {}))
    return apiSuccess(serializeContent(item), 201)
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Internal error', 500)
  }
}
