import { baseApi } from '../../services/api/baseApi'

export const customerDisputeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerDisputes: builder.query({
      query: () => ({
        url: '/api/customer/disputes',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.disputes?.length
          ? [
              ...result.disputes.map((dispute) => ({
                type: 'CustomerDispute',
                id: dispute.id,
              })),
              { type: 'CustomerDispute', id: 'LIST' },
            ]
          : [{ type: 'CustomerDispute', id: 'LIST' }],
    }),
    getCustomerDisputeOrders: builder.query({
      query: () => ({
        url: '/api/customer/disputes/orders',
        method: 'GET',
      }),
      providesTags: [{ type: 'CustomerDispute', id: 'ORDERS_LIST' }],
    }),
    getCustomerDisputeById: builder.query({
      query: (disputeId) => ({
        url: `/api/customer/disputes/${disputeId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, disputeId) => [
        { type: 'CustomerDispute', id: disputeId },
      ],
    }),
    createCustomerDispute: builder.mutation({
      query: ({
        orderNumber,
        itemIds = [],
        issueType,
        description,
        evidence = [],
      }) => {
        const formData = new FormData()
        formData.append('orderNumber', orderNumber)
        itemIds.forEach((itemId) => {
          formData.append('itemIds', itemId)
        })
        formData.append('issueType', issueType)
        formData.append('description', description)
        evidence.forEach((file) => {
          formData.append('evidence', file)
        })

        return {
          url: '/api/customer/disputes',
          method: 'POST',
          data: formData,
        }
      },
      invalidatesTags: (result) => {
        const disputeId =
          result?.dispute?.id
          ?? result?.id

        return [
          { type: 'CustomerDispute', id: 'LIST' },
          { type: 'CustomerDispute', id: 'ORDERS_LIST' },
          ...(disputeId ? [{ type: 'CustomerDispute', id: disputeId }] : []),
        ]
      },
    }),
  }),
})

export const {
  useGetCustomerDisputesQuery,
  useGetCustomerDisputeOrdersQuery,
  useGetCustomerDisputeByIdQuery,
  useCreateCustomerDisputeMutation,
} = customerDisputeApi
