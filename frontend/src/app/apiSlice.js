import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../lib/axios'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'User', 'Product', 'Order'],
  endpoints: () => ({}),
})
