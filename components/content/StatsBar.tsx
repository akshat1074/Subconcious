'use client'
import { Youtube, Twitter, FileText, Link as LinkIcon } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { setFilters } from '@/store/slices/contentSlice'
import { cn } from '@/lib/utils'

const ITEMS = [
  { key: 'youtube', label: 'Videos', icon: Youtube, color: 'text-red-400', active: 'border-red-400/30 bg-red-400/5' },
  { key: 'tweet', label: 'Tweets', icon: Twitter, color: 'text-sky-400', active: 'border-sky-400/30 bg-sky-400/5' },
  { key: 'note', label: 'Notes', icon: FileText, color: 'text-emerald-400', active: 'border-emerald-400/30 bg-emerald-400/5' },
  { key: 'link', label: 'Links', icon: LinkIcon, color: 'text-violet-400', active: 'border-violet-400/30 bg-violet-400/5' },
]

export default function StatsBar() {
  const dispatch = useAppDispatch()
  const { stats, statsLoading, filters } = useAppSelector((s) => s.content)

  const handleClick = (type: string) => {
    dispatch(setFilters({ type: filters.type === type ? '' : type, page: 1 }))
  }

  if (statsLoading && !stats) return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-xl skeleton" />)}
    </div>
  )
  if (!stats) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ITEMS.map(({ key, label, icon: Icon, color, active }) => {
        const isActive = filters.type === key
        return (
          <button
            key={key}
            onClick={() => handleClick(key)}
            className={cn('bg-card border border-border rounded-xl p-3.5 flex items-center gap-3 text-left w-full transition-all duration-150 hover:border-border/80 hover:bg-accent/50', isActive && active)}
          >
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', isActive ? 'bg-current/10' : 'bg-muted/60')}>
              <Icon className={cn('w-4 h-4', color)} />
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground leading-none font-mono tabular-nums">{stats.byType[key] || 0}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
