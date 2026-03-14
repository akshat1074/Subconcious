import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { apiError, apiSuccess } from '@/lib/utils'
import { serializeContent } from '../../route'

export async function GET(_: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const item = await db.content.findFirst({ where: { shareToken: token, isPublic: true }, include: { category: { select: { id: true, name: true, color: true, icon: true } } } })
  if (!item) return apiError('Not found or not shared', 404)
  await db.content.update({ where: { id: item.id }, data: { viewCount: { increment: 1 } } })
  return apiSuccess(serializeContent(item))
}
