import { baseApi } from '../../services/api/baseApi'
import { setCredentials, logout as logoutAction } from './authSlice'
import { getLoginPathForRole, parseAuthPayload } from './authUtils'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ role, email, password }) => ({
        url: getLoginPathForRole(role),
        method: 'POST',
        data: { email, password },
        skipAuthRefresh: true,
      }),
      async onQueryStarted({ role }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (!data?.success || !data?.accessToken || !data?.user) return
          if (role && data.user.role !== role) return
          dispatch(setCredentials(parseAuthPayload(data)))
        } catch {}
      },
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: '/api/auth/register',
        method: 'POST',
        data: payload,
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: '/api/auth/me',
        method: 'GET',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(parseAuthPayload(data)))
        } catch {}
      },
      providesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          dispatch(logoutAction())
          dispatch(baseApi.util.resetApiState())
        }
      },
      invalidatesTags: ['Auth'],
    }),
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/api/auth/refresh',
        method: 'POST',
        data: { refreshToken },
        skipAuthRefresh: true,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi
