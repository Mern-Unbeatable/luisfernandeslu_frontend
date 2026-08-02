import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { apiMiddlewares } from './middleware'

import '../../features/auth/api/authApi'
import '../../features/users/api/userApi'
import '../../features/products/api/productApi'
import '../../features/orders/api/orderApi'

export const store = configureStore({
  reducer: rootReducer,
  middleware: apiMiddlewares,
  devTools: import.meta.env.DEV,
})