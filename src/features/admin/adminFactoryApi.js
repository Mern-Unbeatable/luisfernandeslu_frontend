import { baseApi } from '../../services/api/baseApi'

export const adminFactoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminFactoryStats: builder.query({
      query: () => ({
        url: '/api/admin/factories/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'Factory', id: 'ADMIN_STATS' }],
    }),
    getAdminFactories: builder.query({
      query: ({ status = 'all', search = '', page = 1, limit = 20 }) => ({
        url: '/api/admin/factories',
        method: 'GET',
        params: {
          status,
          search,
          page,
          limit,
        },
      }),
      providesTags: [{ type: 'Factory', id: 'ADMIN_LIST' }],
    }),
    getAdminFactoryById: builder.query({
      query: (factoryId) => ({
        url: `/api/admin/factories/${factoryId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, factoryId) => [
        { type: 'Factory', id: factoryId },
      ],
    }),
    approveAdminFactory: builder.mutation({
      query: (factoryId) => ({
        url: `/api/admin/factories/${factoryId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, factoryId) => [
        { type: 'Factory', id: 'ADMIN_LIST' },
        { type: 'Factory', id: 'ADMIN_STATS' },
        { type: 'Factory', id: factoryId },
      ],
    }),
    rejectAdminFactory: builder.mutation({
      query: ({ factoryId, reason, invalidDocuments }) => ({
        url: `/api/admin/factories/${factoryId}/reject`,
        method: 'POST',
        data: { reason, invalidDocuments },
      }),
      invalidatesTags: (_result, _error, { factoryId }) => [
        { type: 'Factory', id: 'ADMIN_LIST' },
        { type: 'Factory', id: 'ADMIN_STATS' },
        { type: 'Factory', id: factoryId },
      ],
    }),
    updateAdminFactoryStatus: builder.mutation({
      query: ({ factoryId, status }) => ({
        url: `/api/admin/factories/${factoryId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (_result, _error, { factoryId }) => [
        { type: 'Factory', id: 'ADMIN_LIST' },
        { type: 'Factory', id: 'ADMIN_STATS' },
        { type: 'Factory', id: factoryId },
      ],
    }),
    updateAdminFactoryCommission: builder.mutation({
      query: ({ factoryId, commissionPercent }) => ({
        url: `/api/admin/factories/${factoryId}/commission`,
        method: 'PATCH',
        data: { commissionPercent },
      }),
      invalidatesTags: (_result, _error, { factoryId }) => [
        { type: 'Factory', id: 'ADMIN_LIST' },
        { type: 'Factory', id: factoryId },
      ],
    }),
    deleteAdminFactory: builder.mutation({
      query: (factoryId) => ({
        url: `/api/admin/factories/${factoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, factoryId) => [
        { type: 'Factory', id: 'ADMIN_LIST' },
        { type: 'Factory', id: 'ADMIN_STATS' },
        { type: 'Factory', id: factoryId },
      ],
    }),
  }),
})

export const {
  useGetAdminFactoryStatsQuery,
  useGetAdminFactoriesQuery,
  useGetAdminFactoryByIdQuery,
  useApproveAdminFactoryMutation,
  useRejectAdminFactoryMutation,
  useUpdateAdminFactoryStatusMutation,
  useUpdateAdminFactoryCommissionMutation,
  useDeleteAdminFactoryMutation,
} = adminFactoryApi
