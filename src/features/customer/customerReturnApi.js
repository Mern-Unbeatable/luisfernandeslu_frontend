import { baseApi } from '../../services/api/baseApi'

export const customerReturnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerReturnOrders: builder.query({
      query: () => ({
        url: '/api/customer/returns/orders',
        method: 'GET',
      }),
      providesTags: [{ type: 'CustomerReturn', id: 'ORDERS_LIST' }],
    }),
    getCustomerReturnOrderById: builder.query({
      query: (returnOrderId) => ({
        url: `/api/customer/returns/orders/${returnOrderId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, returnOrderId) => [
        { type: 'CustomerReturn', id: `ORDER_${returnOrderId}` },
      ],
    }),
    getCustomerReturnRequests: builder.query({
      query: () => ({
        url: '/api/customer/returns/requests',
        method: 'GET',
      }),
      providesTags: [{ type: 'CustomerReturn', id: 'REQUESTS_LIST' }],
    }),
    getCustomerReturnRequestById: builder.query({
      query: (returnRequestId) => ({
        url: `/api/customer/returns/requests/${returnRequestId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, returnRequestId) => [
        { type: 'CustomerReturn', id: `REQUEST_${returnRequestId}` },
      ],
    }),
    createCustomerReturnRequest: builder.mutation({
      query: ({
        orderId,
        itemId,
        reason,
        description,
        damagedCount,
        refundAccount,
        evidence = [],
      }) => {
        const formData = new FormData()
        formData.append('orderId', orderId)
        formData.append('itemId', itemId)
        formData.append('reason', reason)
        formData.append('description', description)
        formData.append('damagedCount', damagedCount)
        formData.append('refundAccount', refundAccount)
        evidence.forEach((file) => {
          formData.append('evidence', file)
        })

        return {
          url: '/api/customer/returns/requests',
          method: 'POST',
          data: formData,
        }
      },
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: 'CustomerReturn', id: 'REQUESTS_LIST' },
        { type: 'CustomerReturn', id: 'ORDERS_LIST' },
        { type: 'CustomerReturn', id: `ORDER_${orderId}` },
      ],
    }),
  }),
})

export const {
  useGetCustomerReturnOrdersQuery,
  useGetCustomerReturnOrderByIdQuery,
  useGetCustomerReturnRequestsQuery,
  useGetCustomerReturnRequestByIdQuery,
  useCreateCustomerReturnRequestMutation,
} = customerReturnApi
