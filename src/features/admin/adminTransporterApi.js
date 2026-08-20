import { baseApi } from '../../services/api/baseApi'

export const adminTransporterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTransporterStats: builder.query({
      query: () => ({
        url: '/api/admin/transporters/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'Transporter', id: 'ADMIN_STATS' }],
    }),
    getAdminTransporters: builder.query({
      query: ({ status = 'all', search = '', page = 1, limit = 20 }) => ({
        url: '/api/admin/transporters',
        method: 'GET',
        params: {
          status,
          search,
          page,
          limit,
        },
      }),
      providesTags: [{ type: 'Transporter', id: 'ADMIN_LIST' }],
    }),
    getAdminTransporterById: builder.query({
      query: (transporterId) => ({
        url: `/api/admin/transporters/${transporterId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, transporterId) => [
        { type: 'Transporter', id: transporterId },
      ],
    }),
    approveAdminTransporter: builder.mutation({
      query: (transporterId) => ({
        url: `/api/admin/transporters/${transporterId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, transporterId) => [
        { type: 'Transporter', id: 'ADMIN_LIST' },
        { type: 'Transporter', id: 'ADMIN_STATS' },
        { type: 'Transporter', id: transporterId },
      ],
    }),
    rejectAdminTransporter: builder.mutation({
      query: ({ transporterId, reason, invalidDocuments }) => ({
        url: `/api/admin/transporters/${transporterId}/reject`,
        method: 'POST',
        data: { reason, invalidDocuments },
      }),
      invalidatesTags: (_result, _error, { transporterId }) => [
        { type: 'Transporter', id: 'ADMIN_LIST' },
        { type: 'Transporter', id: 'ADMIN_STATS' },
        { type: 'Transporter', id: transporterId },
      ],
    }),
    updateAdminTransporterStatus: builder.mutation({
      query: ({ transporterId, status }) => ({
        url: `/api/admin/transporters/${transporterId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (_result, _error, { transporterId }) => [
        { type: 'Transporter', id: 'ADMIN_LIST' },
        { type: 'Transporter', id: 'ADMIN_STATS' },
        { type: 'Transporter', id: transporterId },
      ],
    }),
    updateAdminTransporterCommission: builder.mutation({
      query: ({ transporterId, commissionPercent }) => ({
        url: `/api/admin/transporters/${transporterId}/commission`,
        method: 'PATCH',
        data: { commissionPercent },
      }),
      invalidatesTags: (_result, _error, { transporterId }) => [
        { type: 'Transporter', id: 'ADMIN_LIST' },
        { type: 'Transporter', id: transporterId },
      ],
    }),
    deleteAdminTransporter: builder.mutation({
      query: (transporterId) => ({
        url: `/api/admin/transporters/${transporterId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, transporterId) => [
        { type: 'Transporter', id: 'ADMIN_LIST' },
        { type: 'Transporter', id: 'ADMIN_STATS' },
        { type: 'Transporter', id: transporterId },
      ],
    }),
  }),
})

export const {
  useGetAdminTransporterStatsQuery,
  useGetAdminTransportersQuery,
  useGetAdminTransporterByIdQuery,
  useApproveAdminTransporterMutation,
  useRejectAdminTransporterMutation,
  useUpdateAdminTransporterStatusMutation,
  useUpdateAdminTransporterCommissionMutation,
  useDeleteAdminTransporterMutation,
} = adminTransporterApi
