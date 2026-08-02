import { tokenStorage } from './tokenStorage'

let isRefreshing = false
let refreshQueue = []

function resolveRefreshQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
      return
    }
    resolve(token)
  })
  refreshQueue = []
}

async function refreshAccessToken(client) {
  const refreshToken = tokenStorage.getRefreshToken()

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const { data } = await client.post(
    '/auth/refresh',
    { refreshToken },
    { skipAuthRefresh: true },
  )

  const accessToken = data?.accessToken || data?.data?.accessToken
  const nextRefreshToken = data?.refreshToken || data?.data?.refreshToken

  if (!accessToken) {
    throw new Error('Refresh response missing access token')
  }

  tokenStorage.setTokens({
    accessToken,
    refreshToken: nextRefreshToken || refreshToken,
  })

  return accessToken
}

export function setupInterceptors(client) {
  client.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken()

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (
        !originalRequest
        || error.response?.status !== 401
        || originalRequest._retry
        || originalRequest.skipAuthRefresh
        || !tokenStorage.getRefreshToken()
      ) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(client(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const accessToken = await refreshAccessToken(client)
        resolveRefreshQueue(null, accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return client(originalRequest)
      } catch (refreshError) {
        resolveRefreshQueue(refreshError, null)
        tokenStorage.clear()

        if (window.location.pathname !== '/login') {
          window.location.assign('/login')
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    },
  )
}
