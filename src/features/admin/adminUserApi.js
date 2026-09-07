import { baseApi } from '../../services/api/baseApi'

export const adminUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUserStats: builder.query({
      query: () => ({
        url: '/api/admin/users/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'ADMIN_STATS' }],
    }),
    getAdminUsers: builder.query({
      query: ({ type, status = 'all', search = '', page = 1, limit = 20 }) => ({
        url: '/api/admin/users',
        method: 'GET',
        params: {
          type,
          status,
          search,
          page,
          limit,
        },
      }),
      providesTags: [{ type: 'User', id: 'ADMIN_LIST' }],
    }),
    getAdminUserById: builder.query({
      query: (userId) => ({
        url: `/api/admin/users/${userId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, userId) => [{ type: 'User', id: userId }],
    }),
    updateAdminUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/api/admin/users/${userId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'User', id: 'ADMIN_LIST' },
        { type: 'User', id: 'ADMIN_STATS' },
        { type: 'User', id: userId },
      ],
    }),
    deleteAdminUser: builder.mutation({
      query: (userId) => ({
        url: `/api/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'User', id: 'ADMIN_LIST' },
        { type: 'User', id: 'ADMIN_STATS' },
        { type: 'User', id: userId },
      ],
    }),
  }),
})

export const {
  useGetAdminUserStatsQuery,
  useGetAdminUsersQuery,
  useGetAdminUserByIdQuery,
  useUpdateAdminUserStatusMutation,
  useDeleteAdminUserMutation,
} = adminUserApi
