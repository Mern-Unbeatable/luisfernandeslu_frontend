import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { apiMiddlewares } from './middleware'
import '../../features/api/registerApis'

export const store = configureStore({
  reducer: rootReducer,
  middleware: apiMiddlewares,
  devTools: import.meta.env.DEV,
})

export default store
