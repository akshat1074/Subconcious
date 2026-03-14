'use client'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ContentItem } from '@/store/slices/contentSlice'
import { ExternalLink, Youtube, Twitter, FileText, Link as LinkIcon } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

const typeIcons = { youtube: Youtube, tweet: Twitter, note: FileText, link: LinkIcon }
const typeColors = { youtube: 'text-red-400', tweet: 'text-sky-400', note: 'text-emerald-400', link: 'text-violet-400' }

export default function ShareClient({ paramsPromise }: { paramsPromise: Promise<{ token: string }> }) {
  const { token } = use(paramsPromise)
  const [item, setItem] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/content/public/${token}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setItem(d.data); else setError(true) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
  if (error || !item) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">Content not found or no longer shared.</p>
      <Link href="/" className="btn-ghost">Go to Subconscious</Link>
    </div>
  )

  const TypeIcon = typeIcons[item.type]
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center"><div className="w-2.5 h-2.5 bg-primary-foreground rounded-sm opacity-90" /></div>
          <span className="font-semibold text-foreground text-sm">Subconscious</span>
        </div>
        <Link href="/register" className="btn-primary text-xs px-3 py-1.5">Start for free</Link>
      </header>
      <main className="flex-1 flex items-start justify-center p-6 pt-12">
        <div className="w-full max-w-2xl">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
            {item.type === 'youtube' && item.embedId && (
              <div className="aspect-video bg-black">
                <iframe src={`https://www.youtube.com/embed/${item.embedId}?rel=0`} title={item.title} allowFullScreen className="w-full h-full" />
              </div>
            )}
            {item.type === 'link' && item.preview.image && <img src={item.preview.image} alt={item.title} className="w-full h-56 object-cover" />}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
                  <TypeIcon className={cn('w-4 h-4', typeColors[item.type])} />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-semibold text-foreground leading-snug">{item.title}</h1>
                  {item.preview.siteName && <p className="text-sm text-muted-foreground mt-0.5">{item.preview.siteName}</p>}
                </div>
              </div>
              {item.preview.description && <p className="text-sm text-muted-foreground leading-relaxed">{item.preview.description}</p>}
              {item.content && item.type === 'note' && <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{item.content}</p>}
              {item.tags.length > 0 && <div className="flex flex-wrap gap-1.5">{item.tags.map((tag: string) => <span key={tag} className="tag-pill">#{tag}</span>)}</div>}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-3 py-1.5 gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />Open original
                  </a>
                )}
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">Shared via <Link href="/" className="text-primary hover:underline">Subconscious</Link></p>
        </div>
      </main>
    </div>
  )
}
