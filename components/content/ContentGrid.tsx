'use client'
import ContentCard from './ContentCard'
import ContentSkeleton from './ContentSkeleton'
import EmptyState from '../ui/EmptyState'
import { ContentItem } from '@/store/slices/contentSlice'

interface Props { items: ContentItem[]; loading: boolean; view: 'grid' | 'list'; emptyMessage?: string }

export default function ContentGrid({ items, loading, view, emptyMessage }: Props) {
  if (loading) return <ContentSkeleton view={view} />
  if (!items.length) return <EmptyState message={emptyMessage} />
  if (view === 'list') return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
      {items.map((item) => <ContentCard key={item.id} item={item} view="list" />)}
    </div>
  )
  return (
    <div className="masonry-grid animate-fade-in">
      {items.map((item) => (
        <div key={item.id} className="masonry-item group">
          <ContentCard item={item} view="grid" />
        </div>
      ))}
    </div>
  )
}
