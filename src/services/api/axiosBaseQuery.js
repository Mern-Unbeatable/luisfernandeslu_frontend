import { axiosInstance } from './axiosInstance'

export function axiosBaseQuery() {
  return async ({
    url,
    method = 'GET',
    data,
    params,
    headers,
    responseType,
    skipAuthRefresh,
  }) => {
    try {
      const isFormData =
        typeof FormData !== 'undefined' && data instanceof FormData

      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        responseType,
        skipAuthRefresh,
        headers: isFormData
          ? { ...headers, 'Content-Type': undefined }
          : headers,
      })

      return { data: result.data }
    } catch (axiosError) {
      const status = axiosError.response?.status
      const responseData = axiosError.response?.data

      return {
        error: {
          status: status ?? 'FETCH_ERROR',
          data: responseData ?? axiosError.message,
        },
      }
    }
  }
}
