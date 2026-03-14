import jwt from 'jsonwebtoken'

const SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production'

export function signToken(payload: { id: string; email: string }): string {
  return jwt.sign(payload, SECRET, { expiresIn: '15m' })
}

export function verifyToken(token: string): { id: string; email: string } | null {
  try {
    return jwt.verify(token, SECRET) as { id: string; email: string }
  } catch {
    return null
  }
}
