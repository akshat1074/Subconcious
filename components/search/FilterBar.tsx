'use client'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setFilters, resetFilters, Filters } from '@/store/slices/contentSlice'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const TYPES = [
  { value: '', label: 'All' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tweet', label: 'Tweets' },
  { value: 'note', label: 'Notes' },
  { value: 'link', label: 'Links' },
]
const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'viewed', label: 'Most viewed' },
  { value: 'alpha', label: 'A to Z' },
]

export default function FilterBar() {
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((s) => s.content)
  const { items: categories } = useAppSelector((s) => s.categories)
  const update = (partial: Partial<Filters>) => dispatch(setFilters({ ...partial, page: 1 }))
  const hasActive = !!(filters.type || filters.category || filters.search)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-0.5 bg-secondary p-0.5 rounded-lg flex-shrink-0">
        {TYPES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => update({ type: value })}
            className={cn('px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap', filters.type === value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
          >
            {label}
          </button>
        ))}
      </div>

      {categories.length > 0 && (
        <select value={filters.category} onChange={(e) => update({ category: e.target.value })} className="input-field h-8 text-xs py-0 max-w-[160px] bg-secondary border-transparent">
          <option value="">All Categories</option>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      )}

      <select value={filters.sortBy} onChange={(e) => update({ sortBy: e.target.value })} className="input-field h-8 text-xs py-0 max-w-[140px] bg-secondary border-transparent ml-auto">
        {SORTS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
      </select>

      {hasActive && (
        <button onClick={() => dispatch(resetFilters())} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
          <X className="w-3 h-3" />Clear
        </button>
      )}
    </div>
  )
}
