import { combineReducers } from '@reduxjs/toolkit'
import { baseApi } from '../../services/api/baseApi'
import authReducer from '../../features/auth/authSlice'
import userReducer from '../../features/users/userSlice'
import productReducer from '../../features/products/productSlice'
import orderReducer from '../../features/orders/orderSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  products: productReducer,
  orders: orderReducer,
  [baseApi.reducerPath]: baseApi.reducer,
})

export default rootReducer
