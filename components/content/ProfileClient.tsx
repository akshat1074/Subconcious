'use client'
import { useState } from 'react'
import { useAppDispatch, useAppSelector, useToast } from '@/hooks'
import { fetchCategories, createCategory, deleteCategory } from '@/store/slices/categorySlice'
import { Plus, Trash2, Loader2, Lock, Eye, EyeOff, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16']

export default function ProfileClient() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { items: categories } = useAppSelector((s) => s.categories)
  const [newCat, setNewCat] = useState({ name: '', color: '#6366f1' })
  const [addingCat, setAddingCat] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [savingPin, setSavingPin] = useState(false)
  const [pinSaved, setPinSaved] = useState(false)

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault(); if (!pin || pin.length < 4) return; setSavingPin(true)
    try {
      const res = await fetch('/api/user/archive-pin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin }) })
      if (!res.ok) throw new Error()
      toast('Archive PIN set', 'success'); setPin(''); setPinSaved(true); setTimeout(() => setPinSaved(false), 2000)
    } catch { toast('Failed to set PIN', 'error') } finally { setSavingPin(false) }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newCat.name.trim()) return; setAddingCat(true)
    try {
      await dispatch(createCategory({ name: newCat.name.trim(), color: newCat.color, icon: 'folder' })).unwrap()
      await dispatch(fetchCategories()); setNewCat({ name: '', color: '#6366f1' }); toast('Category created', 'success')
    } catch (err: any) { toast(typeof err === 'string' ? err : 'Failed', 'error') } finally { setAddingCat(false) }
  }

  const handleDeleteCategory = async (id: string) => {
    setDeletingId(id)
    try { await dispatch(deleteCategory(id)).unwrap(); await dispatch(fetchCategories()); toast('Deleted', 'success') }
    catch { toast('Failed to delete', 'error') } finally { setDeletingId(null) }
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your preferences</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /><h2 className="text-sm font-semibold text-foreground">Archive PIN</h2></div>
        <p className="text-xs text-muted-foreground">Set a 4-8 digit PIN to lock your archive.</p>
        <form onSubmit={handleSavePin} className="flex gap-2">
          <div className="relative flex-1 max-w-xs">
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="4-8 digit PIN"
              className="input-field font-mono tracking-widest pr-10"
              maxLength={8}
            />
            <button type="button" onClick={() => setShowPin((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button type="submit" disabled={savingPin || pin.length < 4} className="btn-primary gap-2 flex-shrink-0">
            {savingPin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : pinSaved ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {pinSaved ? 'Saved!' : 'Set PIN'}
          </button>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Categories</h2>
          <span className="text-xs text-muted-foreground font-mono">{categories.length} total</span>
        </div>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No categories yet</p>
        ) : (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-accent/50 transition-colors group">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-foreground flex-1 truncate">{cat.name}</span>
                <span className="text-xs text-muted-foreground font-mono mr-2">{cat.count}</span>
                <button onClick={() => handleDeleteCategory(cat.id)} disabled={deletingId === cat.id} className="btn-ghost p-1 h-auto text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50">
                  {deletingId === cat.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleAddCategory} className="space-y-3 pt-2 border-t border-border">
          <div className="flex gap-2">
            <input value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} placeholder="New category name" className="input-field flex-1" maxLength={50} />
            <button type="submit" disabled={addingCat || !newCat.name.trim()} className="btn-primary px-3 py-2 h-auto">
              {addingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button key={color} type="button" onClick={() => setNewCat({ ...newCat, color })}
                className={cn('w-6 h-6 rounded-full transition-all duration-150 hover:scale-110 border-2', newCat.color === color ? 'border-white scale-110' : 'border-transparent')}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </form>
      </div>
    </div>
  )
}
