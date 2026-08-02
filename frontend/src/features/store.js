import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../app/apiSlice'
import authReducer from './auth/authSlice'
import productReducer from './products/productSlice'
import orderReducer from './orders/orderSlice'
import userReducer from './users/userSlice'

import './auth/authApi'
import './products/productApi'
import './orders/orderApi'
import './users/userApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    users: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.DEV,
})
