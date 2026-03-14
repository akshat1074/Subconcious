import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, apiError, apiSuccess } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return apiError(parsed.error.errors[0].message)

    const { name, email, password } = parsed.data
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) return apiError('Email already registered', 409)

    const hashed = await hashPassword(password)
    const user = await db.user.create({
      data: { name, email, password: hashed, provider: 'credentials' },
      select: { id: true, name: true, email: true },
    })

    return apiSuccess(user, 201)
  } catch {
    return apiError('Registration failed', 500)
  }
}
