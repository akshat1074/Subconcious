export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:flex-1 bg-card border-r border-border flex-col p-12 justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-primary-foreground rounded-sm opacity-90" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">Subconscious</span>
          </div>
          <div className="space-y-5 max-w-sm">
            <h2 className="text-3xl font-light text-foreground leading-snug">
              Your second brain — organized, searchable, always within reach.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Save YouTube videos, tweets, notes, and links. Chat with your vault.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 max-w-xs">
          {[
            { label: 'YouTube', color: 'bg-red-400/10 text-red-400' },
            { label: 'Tweets', color: 'bg-sky-400/10 text-sky-400' },
            { label: 'Notes', color: 'bg-emerald-400/10 text-emerald-400' },
            { label: 'Links', color: 'bg-violet-400/10 text-violet-400' },
          ].map(({ label, color }) => (
            <div key={label} className={`rounded-lg px-3 py-2 text-xs font-medium ${color}`}>{label}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-primary-foreground rounded-sm opacity-90" />
            </div>
            <span className="font-semibold text-foreground">Subconscious</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
