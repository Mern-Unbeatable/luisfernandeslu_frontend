import { baseApi } from '../../services/api/baseApi'

export const adminOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query({
      query: ({
        tab = 'supplier',
        customerType = 'all',
        status = 'all',
        search = '',
        page = 1,
        limit = 20,
      } = {}) => {
        const params = { tab, status, search, page, limit }
        if (tab === 'supplier') {
          params.customerType = customerType
        }
        return {
          url: '/api/admin/orders',
          method: 'GET',
          params,
        }
      },
      providesTags: (result) =>
        result?.orders?.length
          ? [
              ...result.orders.map((order) => ({
                type: 'Order',
                id: order.id,
              })),
              { type: 'Order', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Order', id: 'ADMIN_LIST' }],
    }),
    getAdminOrderById: builder.query({
      query: (orderId) => ({
        url: `/api/admin/orders/${orderId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, orderId) => [
        { type: 'Order', id: orderId },
      ],
    }),
    updateAdminOrderStatus: builder.mutation({
      query: ({ orderId, status, reason }) => ({
        url: `/api/admin/orders/${orderId}/status`,
        method: 'PATCH',
        data: reason ? { status, reason } : { status },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'ADMIN_LIST' },
      ],
    }),
    deleteAdminOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/admin/orders/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, orderId) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'ADMIN_LIST' },
      ],
    }),
  }),
})

export const {
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
  useDeleteAdminOrderMutation,
} = adminOrderApi
