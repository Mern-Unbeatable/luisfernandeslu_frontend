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
      const normalizedMethod = String(method).toUpperCase()
      const isDelete = normalizedMethod === 'DELETE'
      const hasJsonBody =
        !isDelete
        && data != null
        && !isFormData
        && typeof data === 'object'

      const result = await axiosInstance({
        url,
        method: normalizedMethod,
        data: isDelete ? undefined : data,
        params,
        responseType,
        skipAuthRefresh,
        responseType,
        headers: {
          ...headers,
          ...(isFormData || isDelete
            ? { 'Content-Type': undefined }
            : hasJsonBody
              ? { 'Content-Type': 'application/json' }
              : {}),
        },
      })

      return { data: result.data }
    } catch (axiosError) {
      const status = axiosError.response?.status
      let responseData = axiosError.response?.data

      // Blob error bodies from file endpoints — try to read JSON message
      if (responseData instanceof Blob) {
        try {
          const text = await responseData.text()
          responseData = JSON.parse(text)
        } catch {
          responseData = axiosError.message
        }
      }

      return {
        error: {
          status: status ?? 'FETCH_ERROR',
          data: responseData ?? axiosError.message,
        },
      }
    }
  }
}
