import { configureStore } from '@reduxjs/toolkit'
import contentReducer from './slices/contentSlice'
import categoryReducer from './slices/categorySlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: { content: contentReducer, categories: categoryReducer, ui: uiReducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
