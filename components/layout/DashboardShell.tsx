'use client'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchCategories } from '@/store/slices/categorySlice'
import { fetchStats } from '@/store/slices/contentSlice'
import { setSidebarOpen } from '@/store/slices/uiSlice'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import ToastContainer from '../ui/ToastContainer'
import AddContentModal from '../content/AddContentModal'
import ChatPanel from '../chat/ChatPanel'

interface Props {
  children: React.ReactNode
  user: { id: string; name: string; email: string; image?: string | null }
}

export default function DashboardShell({ children, user }: Props) {
  const dispatch = useAppDispatch()
  const { sidebarOpen, addContentOpen, chatOpen } = useAppSelector((s) => s.ui)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchStats())
  }, [])

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto lg:flex w-[248px] flex-shrink-0 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar user={user} />
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
      {chatOpen && <ChatPanel />}
      {addContentOpen && <AddContentModal />}
      <ToastContainer />
    </div>
  )
}
