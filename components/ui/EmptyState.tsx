'use client'
import { Brain } from 'lucide-react'
import { useAppDispatch } from '@/hooks'
import { setAddContentOpen } from '@/store/slices/uiSlice'

export default function EmptyState({ message }: { message?: string }) {
  const dispatch = useAppDispatch()
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-5 shadow-lg">
        <Brain className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-1.5">{message || 'Your vault is empty'}</h3>
      {!message && (
        <>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">Start building your second brain by saving what matters</p>
          <button onClick={() => dispatch(setAddContentOpen(true))} className="btn-primary">Add your first item</button>
        </>
      )}
    </div>
  )
}
