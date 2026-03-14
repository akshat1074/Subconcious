import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Toast { id: string; type: 'success' | 'error' | 'info'; message: string }

interface UIState {
  sidebarOpen: boolean
  addContentOpen: boolean
  chatOpen: boolean
  toasts: Toast[]
  activeView: 'grid' | 'list'
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: false, addContentOpen: false, chatOpen: false, toasts: [], activeView: 'grid' } as UIState,
  reducers: {
    toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen },
    setSidebarOpen: (s, a: PayloadAction<boolean>) => { s.sidebarOpen = a.payload },
    setAddContentOpen: (s, a: PayloadAction<boolean>) => { s.addContentOpen = a.payload },
    setChatOpen: (s, a: PayloadAction<boolean>) => { s.chatOpen = a.payload },
    addToast: (s, a: PayloadAction<Omit<Toast, 'id'>>) => {
      s.toasts.push({ ...a.payload, id: `${Date.now()}-${Math.random()}` })
    },
    removeToast: (s, a: PayloadAction<string>) => { s.toasts = s.toasts.filter((t) => t.id !== a.payload) },
    setActiveView: (s, a: PayloadAction<'grid' | 'list'>) => { s.activeView = a.payload },
  },
})

export const { toggleSidebar, setSidebarOpen, setAddContentOpen, setChatOpen, addToast, removeToast, setActiveView } = uiSlice.actions
export default uiSlice.reducer
