'use client'
import { use, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchContent, setFilters } from '@/store/slices/contentSlice'
import ContentGrid from './ContentGrid'
import FilterBar from '../search/FilterBar'

export default function CategoryClient({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise)
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.content)
  const { items: categories } = useAppSelector((s) => s.categories)
  const { activeView } = useAppSelector((s) => s.ui)
  const lastId = useRef<string | undefined>(undefined)
  const category = categories.find((c) => c.id === id)

  useEffect(() => {
    if (!id || id === lastId.current) return
    lastId.current = id
    const f = { category: id, archived: '', favorite: '', type: '', search: '', sortBy: 'newest', page: 1 }
    dispatch(setFilters(f))
    dispatch(fetchContent({ filters: f, fetchId: Date.now() }))
  }, [id])

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        {category && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-border" style={{ backgroundColor: `${category.color}15` }}>
            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: category.color }} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">{category?.name || 'Category'}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{category?.count || 0} items</p>
        </div>
      </div>
      <FilterBar />
      <ContentGrid items={items} loading={loading} view={activeView} emptyMessage="No content in this category" />
    </div>
  )
}
