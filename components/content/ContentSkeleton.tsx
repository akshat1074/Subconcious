interface Props { view: 'grid' | 'list' }
export default function ContentSkeleton({ view }: Props) {
  if (view === 'list') return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border">
          <div className="w-7 h-7 rounded-lg skeleton flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 skeleton rounded-md w-3/4" />
            <div className="h-2.5 skeleton rounded-md w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
  return (
    <div className="masonry-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="masonry-item">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="skeleton" style={{ height: `${[160,200,140,180,220,150,190,170][i % 8]}px` }} />
            <div className="p-3.5 space-y-2.5">
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-md skeleton flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 skeleton rounded-md" />
                  <div className="h-3.5 skeleton rounded-md w-4/5" />
                </div>
              </div>
              <div className="flex gap-1"><div className="h-5 w-12 skeleton rounded-full" /><div className="h-5 w-16 skeleton rounded-full" /></div>
              <div className="h-px bg-border/50" />
              <div className="h-2.5 skeleton rounded-md w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
