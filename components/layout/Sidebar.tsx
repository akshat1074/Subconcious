'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Heart, Archive, Plus, LogOut, X, MessageSquare, Settings } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setAddContentOpen, setSidebarOpen, setChatOpen } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'

interface Props { user: { name: string; email: string; image?: string | null } }

export default function Sidebar({ user }: Props) {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const { items: categories } = useAppSelector((s) => s.categories)
  const { stats } = useAppSelector((s) => s.content)
  const { chatOpen } = useAppSelector((s) => s.ui)
  const close = () => dispatch(setSidebarOpen(false))
  const initials = user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const navItems = [
    { href: '/vault', icon: Home, label: 'Vault', count: stats?.total },
    { href: '/favorites', icon: Heart, label: 'Favorites', count: stats?.favorites },
    { href: '/archive', icon: Archive, label: 'Archive', count: stats?.archived || undefined },
  ]

  return (
    <div className="w-full h-full bg-card border-r border-border flex flex-col">
      <div className="h-14 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
            <div className="w-2.5 h-2.5 bg-primary-foreground rounded-sm opacity-90" />
          </div>
          <span className="font-semibold text-foreground text-sm tracking-tight">Subconscious</span>
        </div>
        <button onClick={close} className="lg:hidden btn-ghost p-1.5 h-auto"><X className="w-4 h-4" /></button>
      </div>

      <div className="p-3">
        <button
          onClick={() => { dispatch(setAddContentOpen(true)); close() }}
          className="w-full btn-primary py-2 justify-start gap-2"
        >
          <Plus className="w-4 h-4" />Add to Vault
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label, count }) => (
          <Link key={href} href={href} onClick={close} className={cn('nav-item', pathname === href && 'active')}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {count !== undefined && count > 0 && (
              <span className="text-xs text-muted-foreground font-mono tabular-nums">{count}</span>
            )}
          </Link>
        ))}

        <button
          onClick={() => { dispatch(setChatOpen(!chatOpen)); close() }}
          className={cn('nav-item w-full text-left', chatOpen && 'active')}
        >
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">Ask AI</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
            RAG
          </span>
        </button>

        {categories.length > 0 && (
          <div className="pt-3">
            <p className="px-2.5 pb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Categories
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                onClick={close}
                className={cn('nav-item', pathname === `/category/${cat.id}` && 'active')}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="truncate flex-1">{cat.name}</span>
                <span className="text-xs text-muted-foreground font-mono tabular-nums">{cat.count}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-border px-2 py-2 space-y-0.5">
        <Link href="/profile" onClick={close} className={cn('nav-item', pathname === '/profile' && 'active')}>
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground text-[10px] font-bold">{initials}</span>
          </div>
          <span className="truncate flex-1 text-sm">{user.name}</span>
          <Settings className="w-3.5 h-3.5 text-muted-foreground" />
        </Link>
        <button
          onClick={handleLogout}
          className="nav-item w-full text-left text-destructive/80 hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" /><span>Sign out</span>
        </button>
      </div>
    </div>
  )
}
