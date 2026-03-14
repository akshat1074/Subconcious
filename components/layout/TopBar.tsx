'use client'
import { useCallback } from 'react'
import { LayoutGrid, List, Menu, Plus, Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setFilters } from '@/store/slices/contentSlice'
import { setActiveView, toggleSidebar, setAddContentOpen } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'

function debounce(fn: (v: string) => void, ms: number) {
  let t: ReturnType<typeof setTimeout>
  return (v: string) => { clearTimeout(t); t = setTimeout(() => fn(v), ms) }
}

export default function TopBar() {
  const dispatch = useAppDispatch()
  const { activeView } = useAppSelector((s) => s.ui)
  const debouncedSearch = useCallback(
    debounce((v: string) => dispatch(setFilters({ search: v, page: 1 })), 350), []
  )

  return (
    <header className="h-14 border-b border-border bg-card/95 backdrop-blur-sm flex items-center gap-3 px-4 sm:px-6 sticky top-0 z-30 flex-shrink-0">
      <button onClick={() => dispatch(toggleSidebar())} className="lg:hidden btn-ghost p-2 h-auto flex-shrink-0">
        <Menu className="w-5 h-5" />
      </button>

      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search vault..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="input-field pl-9 h-9 text-sm bg-input/50"
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <div className="hidden sm:flex items-center gap-0.5 p-0.5 bg-secondary rounded-lg">
          {(['grid', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => dispatch(setActiveView(v))}
              className={cn('p-1.5 rounded-md transition-all', activeView === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
            >
              {v === 'grid' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
          ))}
        </div>
        <button onClick={() => dispatch(setAddContentOpen(true))} className="lg:hidden btn-primary p-2 h-auto">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
