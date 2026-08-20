import { createApi } from '@reduxjs/toolkit/query/react'
import { API_TAG_TYPES } from '../../features/api/tagTypes'
import { axiosBaseQuery } from './axiosBaseQuery'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: API_TAG_TYPES,
  endpoints: () => ({}),
})
