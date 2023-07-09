import { configureStore } from '@reduxjs/toolkit'
import loadingSlice from './slices/LoadingSlice'
import errorSlice from './slices/ErrorSlice'
import tokenSlice from './slices/TokenSlice'

export const store = configureStore({
  reducer: {
    loading: loadingSlice,
    error: errorSlice,
    token: tokenSlice,
  },
})