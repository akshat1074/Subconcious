import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireSession } from '@/lib/session'
import { apiError, apiSuccess, hashPin, verifyPin } from '@/lib/utils'

export async function GET() {
  try {
    const session = await requireSession()
    const user = await db.user.findUnique({ where: { id: session.user.id }, select: { archivePin: true } })
    return apiSuccess({ hasPIN: !!user?.archivePin })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Internal error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const { pin, action } = await req.json()

    if (action === 'verify') {
      const user = await db.user.findUnique({ where: { id: session.user.id }, select: { archivePin: true } })
      if (!user?.archivePin) return apiSuccess({ verified: true })
      const valid = await verifyPin(String(pin), user.archivePin)
      if (!valid) return apiError('Incorrect PIN', 401)
      return apiSuccess({ verified: true })
    }

    const pinStr = String(pin)
    if (!pinStr || pinStr.length < 4 || pinStr.length > 8 || !/^\d+$/.test(pinStr)) {
      return apiError('PIN must be 4-8 digits')
    }
    const hashed = await hashPin(pinStr)
    await db.user.update({ where: { id: session.user.id }, data: { archivePin: hashed } })
    return apiSuccess({ set: true })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401)
    return apiError('Internal error', 500)
  }
}
