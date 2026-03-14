'use client'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchContent, setFilters } from '@/store/slices/contentSlice'
import ContentGrid from './ContentGrid'

export default function FavoritesClient() {
  const dispatch = useAppDispatch()
  const { items, loading } = useAppSelector((s) => s.content)
  const { activeView } = useAppSelector((s) => s.ui)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    const f = { favorite: 'true', archived: '', type: '', category: '', search: '', sortBy: 'newest', page: 1 }
    dispatch(setFilters(f))
    dispatch(fetchContent({ filters: f, fetchId: Date.now() }))
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Favorites</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Content you love most</p>
      </div>
      <ContentGrid items={items} loading={loading} view={activeView} emptyMessage="No favorites yet — heart something to save it here" />
    </div>
  )
}
