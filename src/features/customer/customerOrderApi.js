import { baseApi } from '../../services/api/baseApi'

export const customerOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerOrders: builder.query({
      query: ({ page = 1, limit = 20, status = '' } = {}) => ({
        url: '/api/customer/orders',
        method: 'GET',
        params: { page, limit, status },
      }),
      providesTags: [{ type: 'Order', id: 'CUSTOMER_LIST' }],
    }),
    getCustomerOrderById: builder.query({
      query: (orderId) => ({
        url: `/api/customer/orders/${orderId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, orderId) => [
        { type: 'Order', id: `CUSTOMER_${orderId}` },
        { type: 'Order', id: `CUSTOMER_TRACK_${orderId}` },
      ],
    }),
    getCustomerOrderTrack: builder.query({
      query: (orderId) => ({
        url: `/api/customer/orders/${orderId}/track`,
        method: 'GET',
      }),
      providesTags: (_result, _error, orderId) => [
        { type: 'Order', id: `CUSTOMER_TRACK_${orderId}` },
      ],
    }),
    getCustomerOrderInvoice: builder.query({
      query: (orderId) => ({
        url: `/api/customer/orders/${orderId}/invoice`,
        method: 'GET',
      }),
      providesTags: (_result, _error, orderId) => [
        { type: 'Order', id: `CUSTOMER_INVOICE_${orderId}` },
      ],
    }),
    downloadCustomerOrderInvoice: builder.mutation({
      query: (orderId) => ({
        url: `/api/customer/orders/${orderId}/invoice/download`,
        method: 'GET',
        responseType: 'blob',
      }),
    }),
    cancelCustomerOrder: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: `/api/customer/orders/${orderId}/cancel`,
        method: 'POST',
        data: { reason },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: 'Order', id: 'CUSTOMER_LIST' },
        { type: 'Order', id: `CUSTOMER_${orderId}` },
        { type: 'Order', id: `CUSTOMER_TRACK_${orderId}` },
      ],
    }),
  }),
})

export const {
  useGetCustomerOrdersQuery,
  useGetCustomerOrderByIdQuery,
  useGetCustomerOrderTrackQuery,
  useGetCustomerOrderInvoiceQuery,
  useLazyGetCustomerOrderInvoiceQuery,
  useDownloadCustomerOrderInvoiceMutation,
  useCancelCustomerOrderMutation,
} = customerOrderApi
