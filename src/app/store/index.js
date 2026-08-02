import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { apiMiddlewares } from './middleware'

import '../../services/api/authApi'
import '../../services/api/userApi'
import '../../services/api/productApi'
import '../../services/api/orderApi'

export const store = configureStore({
  reducer: rootReducer,
  middleware: apiMiddlewares,
  devTools: import.meta.env.DEV,
})