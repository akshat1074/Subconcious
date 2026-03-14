'use client'
import { useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { removeToast } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'

const icons = { success: CheckCircle2, error: XCircle, info: Info }
const colors = { success: 'text-emerald-400', error: 'text-destructive', info: 'text-primary' }
const borders = { success: 'border-emerald-400/20', error: 'border-destructive/20', info: 'border-primary/20' }

function ToastItem({ id, message, type }: { id: string; message: string; type: 'success' | 'error' | 'info' }) {
  const dispatch = useAppDispatch()
  const Icon = icons[type]
  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(id)), 3500)
    return () => clearTimeout(t)
  }, [id])
  return (
    <div className={cn('flex items-center gap-3 bg-card border rounded-xl px-4 py-3 shadow-2xl min-w-[260px] max-w-[360px] animate-slide-up', borders[type])}>
      <Icon className={cn('w-4 h-4 flex-shrink-0', colors[type])} />
      <p className="text-sm text-foreground flex-1 leading-snug">{message}</p>
      <button onClick={() => dispatch(removeToast(id))} className="text-muted-foreground hover:text-foreground flex-shrink-0"><X className="w-3.5 h-3.5" /></button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts } = useAppSelector((s) => s.ui)
  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 items-end">
      {toasts.map((t) => <ToastItem key={t.id} {...t} />)}
    </div>
  )
}
