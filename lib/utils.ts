import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import bcrypt from 'bcryptjs'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function formatDate(d: string | Date) {
  const date = new Date(d), now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}

export function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

export function buildShareUrl(token: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : process.env.NEXTAUTH_URL || ''
  return `${base}/share/${token}`
}

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10)
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function apiError(message: string, status = 400) {
  return Response.json({ success: false, message }, { status })
}

export function apiSuccess(data: unknown, status = 200) {
  return Response.json({ success: true, data }, { status })
}
