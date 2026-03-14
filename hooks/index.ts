import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { useCallback } from 'react'
import { addToast } from '@/store/slices/uiSlice'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function useToast() {
  const dispatch = useAppDispatch()
  const toast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      dispatch(addToast({ message, type }))
    }, [dispatch]
  )
  return { toast }
}
