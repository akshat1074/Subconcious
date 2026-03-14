import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Category { id: string; name: string; color: string; icon: string; count: number }

export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
  const res = await axios.get('/api/categories')
  return res.data.data as Category[]
})

export const createCategory = createAsyncThunk('categories/create', async (data: { name: string; color: string; icon: string }, { rejectWithValue }) => {
  try { const res = await axios.post('/api/categories', data); return res.data.data as Category }
  catch (err: any) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

export const deleteCategory = createAsyncThunk('categories/delete', async (id: string, { rejectWithValue }) => {
  try { await axios.delete(`/api/categories/${id}`); return id }
  catch (err: any) { return rejectWithValue(err.response?.data?.message || 'Failed') }
})

const slice = createSlice({
  name: 'categories',
  initialState: { items: [] as Category[], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCategories.pending, (s) => { s.loading = true })
    b.addCase(fetchCategories.fulfilled, (s, a) => { s.items = a.payload; s.loading = false })
    b.addCase(createCategory.fulfilled, (s, a) => {
      s.items.push(a.payload)
      s.items.sort((a, b) => a.name.localeCompare(b.name))
    })
    b.addCase(deleteCategory.fulfilled, (s, a) => { s.items = s.items.filter((c) => c.id !== a.payload) })
  },
})

export default slice.reducer
