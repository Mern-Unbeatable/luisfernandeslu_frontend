import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { apiMiddlewares } from './middleware'

import '../../features/auth/authApi'
import '../../features/users/userApi'
import '../../features/products/productApi'
import '../../features/orders/orderApi'

export const store = configureStore({
  reducer: rootReducer,
  middleware: apiMiddlewares,
  devTools: import.meta.env.DEV,
})
