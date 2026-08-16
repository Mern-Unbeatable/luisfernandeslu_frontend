import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosInstance } from './axiosInstance'

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method = 'GET', data, params, headers }) => {
    try {
      const isFormData =
        typeof FormData !== 'undefined' && data instanceof FormData
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: isFormData
          ? { ...headers, 'Content-Type': undefined }
          : headers,
      })

      return { data: result.data }
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      }
    }
  }

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'User', 'Product', 'Order'],
  endpoints: () => ({}),
})