'use client'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchContent, setFilters, resetFilters } from '@/store/slices/contentSlice'
import ContentGrid from './ContentGrid'
import StatsBar from './StatsBar'
import FilterBar from '../search/FilterBar'

export default function VaultClient() {
  const dispatch = useAppDispatch()
  const { items, loading, filters, pagination } = useAppSelector((s) => s.content)
  const { activeView } = useAppSelector((s) => s.ui)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; dispatch(resetFilters()) }
  }, [])

  useEffect(() => {
    if (filters.archived !== '' || filters.favorite !== '') return
    dispatch(fetchContent({ filters, fetchId: Date.now() }))
  }, [filters])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Vault</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {pagination ? `${pagination.total.toLocaleString()} saved item${pagination.total !== 1 ? 's' : ''}` : 'Your knowledge base'}
        </p>
      </div>
      <StatsBar />
      <FilterBar />
      <ContentGrid items={items} loading={loading} view={activeView} />
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4 pb-8">
          <button onClick={() => dispatch(setFilters({ page: filters.page - 1 }))} disabled={filters.page <= 1} className="btn-ghost px-4 disabled:opacity-40">Previous</button>
          <span className="text-sm text-muted-foreground font-mono">{filters.page} / {pagination.pages}</span>
          <button onClick={() => dispatch(setFilters({ page: filters.page + 1 }))} disabled={filters.page >= pagination.pages} className="btn-ghost px-4 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  )
}
