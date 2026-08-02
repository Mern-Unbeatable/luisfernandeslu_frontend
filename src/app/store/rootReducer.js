import { combineReducers } from '@reduxjs/toolkit'
import { baseApi } from '../../services/api/baseApi'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  products: productReducer,
  orders: orderReducer,
  [baseApi.reducerPath]: baseApi.reducer,
})

export default rootReducer