import { createSlice } from '@reduxjs/toolkit'
import { tokenStorage, storage } from '../../services/storage/localStorage'
import { parseAuthPayload } from './authUtils'

const USER_KEY = 'auth_user'

function readStoredUser() {
  try {
    const raw = storage.get(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistUser(user) {
  if (user) storage.set(USER_KEY, JSON.stringify(user))
  else storage.remove(USER_KEY)
}

function applyAuthPayload(state, payload) {
  const { user, accessToken, refreshToken } = parseAuthPayload(payload)

  if (user) state.user = user
  if (accessToken) state.accessToken = accessToken

  state.isAuthenticated = Boolean(
    (accessToken || state.accessToken) && state.user,
  )

  if (user) persistUser(state.user)

  if (accessToken || refreshToken) {
    tokenStorage.setTokens({
      accessToken: accessToken || tokenStorage.getAccessToken(),
      refreshToken: refreshToken || tokenStorage.getRefreshToken(),
    })
  }
}

const storedUser = readStoredUser()
const storedToken = tokenStorage.getAccessToken()

const initialState = {
  user: storedUser,
  accessToken: storedToken,
  isAuthenticated: Boolean(storedToken && storedUser),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      applyAuthPayload(state, action.payload)
    },
    logout(state) {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      persistUser(null)
      tokenStorage.clear()
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
