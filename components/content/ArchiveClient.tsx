'use client'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchContent, setFilters } from '@/store/slices/contentSlice'
import ContentGrid from './ContentGrid'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function ArchiveClient() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.content)
  const { activeView } = useAppSelector((s) => s.ui)
  const [unlocked, setUnlocked] = useState(false)
  const [hasPIN, setHasPIN] = useState(false)
  const [checking, setChecking] = useState(true)
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const fetched = useRef(false)

  useEffect(() => {
    fetch('/api/user/archive-pin')
      .then((r) => r.json())
      .then((d) => {
        const has = d.data?.hasPIN
        setHasPIN(has)
        if (!has) setUnlocked(true)
      })
      .catch(() => setUnlocked(true))
      .finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    if (!unlocked || fetched.current) return
    fetched.current = true
    const f = { archived: 'true', favorite: '', type: '', category: '', search: '', sortBy: 'newest', page: 1 }
    dispatch(setFilters(f))
    dispatch(fetchContent({ filters: f, fetchId: Date.now() }))
  }, [unlocked])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setVerifying(true)
    try {
      const res = await fetch('/api/user/archive-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, action: 'verify' }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.message || 'Incorrect PIN') }
      else setUnlocked(true)
    } catch { setError('Failed to verify') }
    finally { setVerifying(false) }
  }

  if (checking) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  )

  if (!unlocked) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-6 shadow-xl">
        <Lock className="w-7 h-7 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-1">Archive is locked</h2>
      <p className="text-sm text-muted-foreground mb-8">Enter your PIN to access archived content</p>
      <form onSubmit={handleVerify} className="w-full max-w-xs space-y-3">
        <div className="relative">
          <input
            type={showPin ? 'text' : 'password'}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="Enter PIN"
            className="input-field text-center text-xl tracking-[0.5em] font-mono pr-10"
            autoFocus
            maxLength={8}
          />
          <button type="button" onClick={() => setShowPin((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="text-xs text-destructive text-center">{error}</p>}
        <button type="submit" disabled={!pin || verifying} className="btn-primary w-full gap-2">
          {verifying ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Verifying...</> : 'Unlock Archive'}
        </button>
      </form>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Archive</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Out of sight, not deleted</p>
        </div>
        {hasPIN && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-1.5">
            <Lock className="w-3 h-3 text-primary" />PIN protected
          </div>
        )}
      </div>
      <ContentGrid items={items} loading={loading} view={activeView} emptyMessage="Archive is empty" />
    </div>
  )
}
