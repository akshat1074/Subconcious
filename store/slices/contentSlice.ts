import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface ContentItem {
  id: string; type: 'youtube' | 'tweet' | 'note' | 'link'; title: string
  url: string | null; content: string | null; embedId: string | null
  shareToken: string | null; isPublic: boolean
  preview: { image: string | null; description: string | null; siteName: string | null; favicon: string | null }
  category: { id: string; name: string; color: string; icon: string } | null
  tags: string[]; isFavorite: boolean; isPinned: boolean; isArchived: boolean
  viewCount: number; createdAt: string; updatedAt: string
}

export interface ContentStats { total: number; byType: Record<string, number>; favorites: number; pinned: number; archived: number }
export interface Filters { search: string; type: string; category: string; favorite: string; archived: string; sortBy: string; page: number }

const defaultFilters: Filters = { search: '', type: '', category: '', favorite: '', archived: '', sortBy: 'newest', page: 1 }

interface ContentState {
  items: ContentItem[]; stats: ContentStats | null
  pagination: { page: number; limit: number; total: number; pages: number } | null
  filters: Filters; loading: boolean; statsLoading: boolean; fetchId: number
}

export const fetchContent = createAsyncThunk('content/fetch', async ({ filters, fetchId }: { filters: Partial<Filters>; fetchId: number }, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== null && String(v) !== '') params.append(k, String(v)) })
    const res = await axios.get(`/api/content?${params}`)
    return { ...res.data.data, fetchId }
  } catch (err: any) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const fetchStats = createAsyncThunk('content/stats', async () => {
  const res = await axios.get('/api/content/stats'); return res.data.data
})

export const createContent = createAsyncThunk('content/create', async (data: any, { rejectWithValue }) => {
  try { const res = await axios.post('/api/content', data); return res.data.data }
  catch (err: any) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const updateContent = createAsyncThunk('content/update', async ({ id, data }: { id: string; data: Partial<ContentItem> }, { rejectWithValue }) => {
  try { const res = await axios.put(`/api/content/${id}`, data); return res.data.data }
  catch (err: any) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const deleteContent = createAsyncThunk('content/delete', async (id: string, { rejectWithValue }) => {
  try { await axios.delete(`/api/content/${id}`); return id }
  catch (err: any) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const toggleShare = createAsyncThunk('content/share', async (id: string, { rejectWithValue }) => {
  try { const res = await axios.post(`/api/content/${id}/share`); return { id, ...res.data.data } }
  catch (err: any) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

const slice = createSlice({
  name: 'content',
  initialState: {
    items: [], stats: null, pagination: null, filters: defaultFilters,
    loading: false, statsLoading: false, fetchId: 0,
  } as ContentState,
  reducers: {
    setFilters: (s, a: PayloadAction<Partial<Filters>>) => {
      s.filters = { ...s.filters, ...a.payload, page: a.payload.page ?? 1 }
      s.fetchId += 1
    },
    resetFilters: (s) => { s.filters = defaultFilters; s.fetchId += 1 },
    optimisticToggleFavorite: (s, a: PayloadAction<string>) => {
      const i = s.items.find((x) => x.id === a.payload); if (i) i.isFavorite = !i.isFavorite
    },
    optimisticTogglePin: (s, a: PayloadAction<string>) => {
      const i = s.items.find((x) => x.id === a.payload); if (i) i.isPinned = !i.isPinned
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchContent.pending, (s) => { s.loading = true })
    b.addCase(fetchContent.fulfilled, (s, a) => {
      if (a.payload.fetchId < s.fetchId) return
      s.loading = false; s.items = a.payload.items; s.pagination = a.payload.pagination
    })
    b.addCase(fetchContent.rejected, (s) => { s.loading = false })
    b.addCase(fetchStats.pending, (s) => { s.statsLoading = true })
    b.addCase(fetchStats.fulfilled, (s, a) => { s.statsLoading = false; s.stats = a.payload })
    b.addCase(fetchStats.rejected, (s) => { s.statsLoading = false })
    b.addCase(createContent.fulfilled, (s, a) => {
      if (!s.filters.archived && !s.filters.favorite) s.items.unshift(a.payload)
      if (s.stats) { s.stats.total += 1; s.stats.byType[a.payload.type] = (s.stats.byType[a.payload.type] || 0) + 1 }
    })
    b.addCase(updateContent.fulfilled, (s, a) => {
      const idx = s.items.findIndex((i) => i.id === a.payload.id)
      if (idx === -1) return
      if (a.payload.isArchived && !s.filters.archived) s.items.splice(idx, 1)
      else if (!a.payload.isArchived && s.filters.archived === 'true') s.items.splice(idx, 1)
      else if (!a.payload.isFavorite && s.filters.favorite === 'true') s.items.splice(idx, 1)
      else s.items[idx] = a.payload
    })
    b.addCase(deleteContent.fulfilled, (s, a) => {
      s.items = s.items.filter((i) => i.id !== a.payload)
      if (s.stats) s.stats.total = Math.max(0, s.stats.total - 1)
    })
    b.addCase(toggleShare.fulfilled, (s, a) => {
      const i = s.items.find((x) => x.id === a.payload.id)
      if (i) { i.isPublic = a.payload.isPublic; i.shareToken = a.payload.shareToken }
    })
  },
})

export const { setFilters, resetFilters, optimisticToggleFavorite, optimisticTogglePin } = slice.actions
export default slice.reducer
