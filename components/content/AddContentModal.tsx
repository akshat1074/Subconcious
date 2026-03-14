'use client'
import { useState } from 'react'
import { X, Youtube, Twitter, FileText, Link as LinkIcon, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector, useToast } from '@/hooks'
import { createContent, fetchStats } from '@/store/slices/contentSlice'
import { fetchCategories } from '@/store/slices/categorySlice'
import { setAddContentOpen } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'

const TYPES = [
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-400', active: 'border-red-400/30 bg-red-400/5' },
  { value: 'tweet', label: 'Tweet', icon: Twitter, color: 'text-sky-400', active: 'border-sky-400/30 bg-sky-400/5' },
  { value: 'note', label: 'Note', icon: FileText, color: 'text-emerald-400', active: 'border-emerald-400/30 bg-emerald-400/5' },
  { value: 'link', label: 'Link', icon: LinkIcon, color: 'text-violet-400', active: 'border-violet-400/30 bg-violet-400/5' },
]
const placeholders: Record<string, string> = {
  youtube: 'https://youtube.com/watch?v=...',
  tweet: 'https://x.com/user/status/...',
  link: 'https://example.com',
}

export default function AddContentModal() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { items: categories } = useAppSelector((s) => s.categories)
  const [type, setType] = useState('youtube')
  const [form, setForm] = useState({ title: '', url: '', content: '', tags: '', categoryId: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const close = () => dispatch(setAddContentOpen(false))
  const upd = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      await dispatch(createContent({ type, title: form.title, url: form.url || undefined, content: form.content || undefined, tags, categoryId: form.categoryId || undefined })).unwrap()
      dispatch(fetchStats()); dispatch(fetchCategories())
      toast('Saved to your vault', 'success'); close()
    } catch (err: any) { setError(typeof err === 'string' ? err : 'Failed to save') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={close}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full sm:max-w-md bg-card border border-border sm:rounded-2xl shadow-2xl animate-slide-up max-h-[95dvh] flex flex-col rounded-t-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
          <h2 className="font-semibold text-foreground">Add to Vault</h2>
          <button onClick={close} className="btn-ghost p-1.5 h-auto rounded-full"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-5 pt-4 pb-3 border-b border-border flex-shrink-0">
          <div className="grid grid-cols-4 gap-2">
            {TYPES.map(({ value, label, icon: Icon, color, active }) => (
              <button key={value} type="button" onClick={() => setType(value)}
                className={cn('flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-150', type === value ? active : 'border-border hover:bg-accent')}>
                <Icon className={cn('w-4 h-4', color)} />
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Title *</label>
            <input required value={form.title} onChange={(e) => upd('title', e.target.value)} placeholder="Give it a memorable name" className="input-field" autoFocus />
          </div>
          {type !== 'note' && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">URL *</label>
              <input required value={form.url} onChange={(e) => upd('url', e.target.value)} placeholder={placeholders[type] || 'https://'} className="input-field font-mono text-sm" type="url" />
            </div>
          )}
          {type === 'note' && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Content</label>
              <textarea value={form.content} onChange={(e) => upd('content', e.target.value)} placeholder="Write your note..." rows={4} className="input-field resize-none" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Tags</label>
              <input value={form.tags} onChange={(e) => upd('tags', e.target.value)} placeholder="ai, design" className="input-field text-sm" />
              <p className="text-[10px] text-muted-foreground mt-1">Comma separated</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
              <select value={form.categoryId} onChange={(e) => upd('categoryId', e.target.value)} className="input-field">
                <option value="">No category</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
          {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"><p className="text-xs text-destructive">{error}</p></div>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={close} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 gap-2">
              {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</> : 'Save to Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
