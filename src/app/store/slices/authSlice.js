import { createSlice } from '@reduxjs/toolkit'
import { tokenStorage } from '../../../services/storage/localStorage'

const initialState = {
  user: null,
  accessToken: tokenStorage.getAccessToken(),
  isAuthenticated: Boolean(tokenStorage.getAccessToken()),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, accessToken, refreshToken } = action.payload

      state.user = user ?? state.user
      state.accessToken = accessToken ?? state.accessToken
      state.isAuthenticated = Boolean(accessToken || state.accessToken)

      if (accessToken || refreshToken) {
        tokenStorage.setTokens({
          accessToken: accessToken || tokenStorage.getAccessToken(),
          refreshToken: refreshToken || tokenStorage.getRefreshToken(),
        })
      }
    },
    logout(state) {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      tokenStorage.clear()
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer