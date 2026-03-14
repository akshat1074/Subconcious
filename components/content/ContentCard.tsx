'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Heart, Pin, MoreHorizontal, Trash2, Archive, ExternalLink, Youtube, FileText, Link as LinkIcon, Twitter, Play, Share2, Copy, Check, RotateCcw } from 'lucide-react'
import { ContentItem, updateContent, deleteContent, fetchStats, toggleShare, optimisticToggleFavorite, optimisticTogglePin } from '@/store/slices/contentSlice'
import { fetchCategories } from '@/store/slices/categorySlice'
import { useAppDispatch, useToast } from '@/hooks'
import { formatDate, cn, buildShareUrl } from '@/lib/utils'

const typeIcons = { youtube: Youtube, tweet: Twitter, note: FileText, link: LinkIcon }
const typeColors = { youtube: 'text-red-400', tweet: 'text-sky-400', note: 'text-emerald-400', link: 'text-violet-400' }
const typeBg = { youtube: 'bg-red-400/5', tweet: 'bg-sky-400/5', note: 'bg-emerald-400/5', link: 'bg-violet-400/5' }

function YouTubeEmbed({ embedId, title }: { embedId: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  if (playing) return (
    <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${embedId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
  return (
    <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden cursor-pointer group/yt" onClick={() => setPlaying(true)}>
      <img
        src={`https://img.youtube.com/vi/${embedId}/mqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover/yt:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-center justify-center">
        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 group-hover/yt:scale-110 group-hover/yt:bg-red-500">
          <Play className="w-6 h-6 text-white fill-white ml-1" />
        </div>
      </div>
    </div>
  )
}

function TweetEmbed({ embedId, url }: { embedId: string; url: string | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const rendered = useRef(false)

  useEffect(() => {
    if (rendered.current) return
    rendered.current = true
    const render = () => {
      const tw = (window as any).twttr
      if (!tw?.widgets || !ref.current) { setError(true); return }
      ref.current.innerHTML = ''
      tw.widgets.createTweet(embedId, ref.current, { theme: 'dark', dnt: true, align: 'center', conversation: 'none' })
        .then((el: any) => { if (el) setLoaded(true); else setError(true) })
        .catch(() => setError(true))
    }
    const existing = document.getElementById('twitter-wjs')
    if (existing) {
      if ((window as any).twttr?.widgets) render()
      else existing.addEventListener('load', render, { once: true })
    } else {
      const script = document.createElement('script')
      script.id = 'twitter-wjs'; script.src = 'https://platform.twitter.com/widgets.js'; script.async = true
      script.onload = render; script.onerror = () => setError(true)
      document.head.appendChild(script)
    }
    return () => { rendered.current = false }
  }, [embedId])

  if (error) return (
    <div className="p-4 flex items-center gap-3 border-b border-sky-900/20 bg-sky-950/20 rounded-t-xl">
      <Twitter className="w-4 h-4 text-sky-400 flex-shrink-0" />
      <a href={url || `https://twitter.com/i/status/${embedId}`} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-400 hover:underline truncate" onClick={(e) => e.stopPropagation()}>View on X</a>
    </div>
  )
  return (
    <div className="relative rounded-t-xl overflow-hidden" style={{ minHeight: loaded ? undefined : 140 }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-sky-950/10">
          <div className="flex items-center gap-2 text-sky-400/60 text-xs"><Twitter className="w-4 h-4 animate-pulse" />Loading tweet...</div>
        </div>
      )}
      <div ref={ref} className="tweet-container" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s' }} />
    </div>
  )
}

function CardMenu({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    const t = setTimeout(() => document.addEventListener('mousedown', h), 50)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', h) }
  }, [onClose])

  const handleArchive = async () => {
    try {
      await dispatch(updateContent({ id: item.id, data: { isArchived: !item.isArchived } })).unwrap()
      dispatch(fetchStats()); dispatch(fetchCategories())
      toast(item.isArchived ? 'Restored from archive' : 'Moved to archive', 'success')
    } catch { toast('Failed to update', 'error') }
    onClose()
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteContent(item.id)).unwrap()
      dispatch(fetchStats()); dispatch(fetchCategories())
      toast('Deleted', 'success')
    } catch { toast('Failed to delete', 'error') }
    onClose()
  }

  const handleShare = async () => {
    try {
      const result = await dispatch(toggleShare(item.id)).unwrap()
      if (result.isPublic && result.shareToken) {
        await navigator.clipboard.writeText(buildShareUrl(result.shareToken))
        toast('Share link copied!', 'success')
      } else {
        toast('Sharing disabled', 'info')
      }
    } catch { toast('Failed', 'error') }
    onClose()
  }

  const handleCopyLink = async () => {
    if (!item.shareToken) return
    await navigator.clipboard.writeText(buildShareUrl(item.shareToken))
    toast('Link copied!', 'success')
    onClose()
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1.5 w-48 bg-card border border-border rounded-xl shadow-2xl z-[100] overflow-hidden animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-1">
        <button onClick={handleShare} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
          <Share2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          {item.isPublic ? 'Disable sharing' : 'Share publicly'}
        </button>
        {item.isPublic && item.shareToken && (
          <button onClick={handleCopyLink} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
            <Copy className="w-3.5 h-3.5 flex-shrink-0" />Copy share link
          </button>
        )}
        <button onClick={handleArchive} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
          {item.isArchived ? <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" /> : <Archive className="w-3.5 h-3.5 flex-shrink-0" />}
          {item.isArchived ? 'Restore' : 'Archive'}
        </button>
        <div className="h-px bg-border my-1" />
        <button onClick={handleDelete} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
          <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />Delete permanently
        </button>
      </div>
    </div>
  )
}

interface Props { item: ContentItem; view: 'grid' | 'list' }

export default function ContentCard({ item, view }: Props) {
  const dispatch = useAppDispatch()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuClose = useCallback(() => setMenuOpen(false), [])
  const TypeIcon = typeIcons[item.type]

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(optimisticToggleFavorite(item.id))
    dispatch(updateContent({ id: item.id, data: { isFavorite: !item.isFavorite } }))
  }

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(optimisticTogglePin(item.id))
    dispatch(updateContent({ id: item.id, data: { isPinned: !item.isPinned } }))
  }

  const openUrl = () => { if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer') }

  if (view === 'list') return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border hover:bg-accent/40 transition-colors group cursor-pointer" onClick={openUrl}>
      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', typeBg[item.type])}>
        <TypeIcon className={cn('w-3.5 h-3.5', typeColors[item.type])} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary/90 transition-colors">{item.title}</p>
        {item.category && <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.category.color }} />{item.category.name}</span>}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-muted-foreground hidden md:block mr-2">{formatDate(item.createdAt)}</span>
        <button onClick={handlePin} className={cn('p-1.5 rounded-lg transition-colors', item.isPinned ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}><Pin className={cn('w-3.5 h-3.5', item.isPinned && 'fill-current')} /></button>
        <button onClick={handleFavorite} className={cn('p-1.5 rounded-lg transition-colors', item.isFavorite ? 'text-red-400' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}><Heart className={cn('w-3.5 h-3.5', item.isFavorite && 'fill-current')} /></button>
        {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>}
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
          {menuOpen && <CardMenu item={item} onClose={menuClose} />}
        </div>
      </div>
    </div>
  )

  return (
    <div className="content-card animate-slide-up">
      <div className="card-inner">
        {item.type === 'youtube' && item.embedId && <YouTubeEmbed embedId={item.embedId} title={item.title} />}
        {item.type === 'tweet' && item.embedId && <TweetEmbed embedId={item.embedId} url={item.url} />}
        {item.type === 'link' && item.preview.image && (
          <div className="relative h-40 bg-secondary overflow-hidden cursor-pointer rounded-t-xl" onClick={openUrl}>
            <img src={item.preview.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).closest('div')!.style.display = 'none' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        {item.type === 'note' && (
          <div className="h-28 bg-emerald-950/20 border-b border-emerald-900/20 p-4 flex items-start overflow-hidden rounded-t-xl">
            <p className="text-xs text-emerald-300/60 font-mono leading-relaxed line-clamp-5">{item.content || 'No content'}</p>
          </div>
        )}
        <div className="p-3.5 flex flex-col gap-2.5">
          {item.isPinned && <div className="flex items-center gap-1 -mt-1"><Pin className="w-2.5 h-2.5 text-primary fill-current" /><span className="text-[9px] font-semibold text-primary uppercase tracking-widest">Pinned</span></div>}
          <div className="flex items-start gap-2">
            <div className={cn('w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5', typeBg[item.type])}>
              <TypeIcon className={cn('w-3 h-3', typeColors[item.type])} />
            </div>
            <p className={cn('text-sm font-medium text-foreground leading-snug line-clamp-2 flex-1', item.url && 'cursor-pointer hover:text-primary/80 transition-colors')} onClick={openUrl}>{item.title}</p>
          </div>
          {item.preview.description && item.type === 'link' && <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.preview.description}</p>}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 4).map((tag: string) => <span key={tag} className="tag-pill">#{tag}</span>)}
              {item.tags.length > 4 && <span className="tag-pill">+{item.tags.length - 4}</span>}
            </div>
          )}
          <div className="flex items-center justify-between pt-1 border-t border-border/50">
            <div className="flex items-center gap-2 min-w-0">
              {item.category && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground max-w-[90px] truncate">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.category.color }} />
                  <span className="truncate">{item.category.name}</span>
                </span>
              )}
              <span className="text-[11px] text-muted-foreground/70 flex-shrink-0">{formatDate(item.createdAt)}</span>
              {item.isPublic && <span className="text-[9px] font-semibold text-primary/80 uppercase tracking-widest bg-primary/10 px-1.5 py-0.5 rounded-full flex-shrink-0">Shared</span>}
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={handlePin} className={cn('p-1.5 rounded-lg transition-colors', item.isPinned ? 'text-primary opacity-100' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}><Pin className={cn('w-3.5 h-3.5', item.isPinned && 'fill-current')} /></button>
              <button onClick={handleFavorite} className={cn('p-1.5 rounded-lg transition-colors', item.isFavorite ? 'text-red-400 opacity-100' : 'text-muted-foreground hover:text-foreground hover:bg-accent')}><Heart className={cn('w-3.5 h-3.5', item.isFavorite && 'fill-current')} /></button>
              {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><ExternalLink className="w-3 h-3" /></a>}
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o) }} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                {menuOpen && <CardMenu item={item} onClose={menuClose} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
