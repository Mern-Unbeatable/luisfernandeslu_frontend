import { baseApi } from '../../services/api/baseApi'
import { setCredentials, logout as logoutAction } from './authSlice'
import {
  getLoginPathForRole,
  getRegisterPathForRole,
  parseAuthPayload,
} from './authUtils'

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
      invalidatesTags: [
        'Auth',
        { type: 'Promotion', id: 'SPONSORED_LIST' },
        { type: 'Product', id: 'TOP_SELLING_LIST' },
      ],
    }),
    register: builder.mutation({
      query: ({ role, payload }) => ({
        url: getRegisterPathForRole(role),
        method: 'POST',
        data: payload,
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
      invalidatesTags: [
        'Auth',
        { type: 'Promotion', id: 'SPONSORED_LIST' },
        { type: 'Product', id: 'TOP_SELLING_LIST' },
      ],
    }),
    verifyOtp: builder.mutation({
      query: ({ email, otp, role }) => ({
        url: '/api/auth/verify-otp',
        method: 'POST',
        data: { email, otp, role },
        skipAuthRefresh: true,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (!data?.success || !data?.accessToken || !data?.user) return
          dispatch(setCredentials(parseAuthPayload(data)))
        } catch {}
      },
      invalidatesTags: ['Auth'],
    }),
    resendOtp: builder.mutation({
      query: ({ email, role }) => ({
        url: '/api/auth/resend-otp',
        method: 'POST',
        data: { email, role },
        skipAuthRefresh: true,
      }),
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: '/api/auth/forgot-password',
        method: 'POST',
        data: { email },
        skipAuthRefresh: true,
      }),
    }),
    verifyResetOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: '/api/auth/verify-reset-otp',
        method: 'POST',
        data: { email, otp },
        skipAuthRefresh: true,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ resetToken, password, confirmPassword }) => ({
        url: '/api/auth/reset-password',
        method: 'POST',
        data: { resetToken, password, confirmPassword },
        skipAuthRefresh: true,
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
        skipAuthRefresh: true,
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
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi
