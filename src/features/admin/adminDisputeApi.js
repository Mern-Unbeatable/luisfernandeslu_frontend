import { baseApi } from '../../services/api/baseApi'

export const adminDisputeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDisputes: builder.query({
      query: () => ({
        url: '/api/admin/disputes',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.disputes?.length
          ? [
              ...result.disputes.map((dispute) => ({
                type: 'Dispute',
                id: dispute.id,
              })),
              { type: 'Dispute', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Dispute', id: 'ADMIN_LIST' }],
    }),
    getAdminDisputeById: builder.query({
      query: (disputeId) => ({
        url: `/api/admin/disputes/${disputeId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, disputeId) => [
        { type: 'Dispute', id: disputeId },
      ],
    }),
    updateAdminDisputeStatus: builder.mutation({
      query: ({ disputeId, status }) => ({
        url: `/api/admin/disputes/${disputeId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (_result, _error, { disputeId }) => [
        { type: 'Dispute', id: disputeId },
        { type: 'Dispute', id: 'ADMIN_LIST' },
      ],
    }),
  }),
})

export const {
  useGetAdminDisputesQuery,
  useGetAdminDisputeByIdQuery,
  useUpdateAdminDisputeStatusMutation,
} = adminDisputeApi
