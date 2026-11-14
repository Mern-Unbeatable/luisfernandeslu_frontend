import { baseApi } from '../../services/api/baseApi'

export const factoryOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFactoryOrders: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status = 'all',
        search,
        companyId,
      } = {}) => ({
        url: '/api/factory/orders',
        method: 'GET',
        params: {
          page,
          limit,
          status,
          ...(search ? { search } : {}),
          ...(companyId ? { companyId } : {}),
        },
      }),
      providesTags: [{ type: 'Order', id: 'FACTORY_LIST' }],
    }),
    getFactoryOrderById: builder.query({
      query: (factoryOrderId) => ({
        url: `/api/factory/orders/${factoryOrderId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'Order', id: `FACTORY_${id}` },
      ],
    }),
    getFactoryOrderCompanies: builder.query({
      query: () => ({
        url: '/api/factory/orders/companies',
        method: 'GET',
      }),
      providesTags: [{ type: 'Order', id: 'FACTORY_COMPANIES' }],
    }),
    updateFactoryOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/factory/orders/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id: 'FACTORY_LIST' },
        { type: 'Order', id: `FACTORY_${id}` },
      ],
    }),
    getFactoryTransportQuote: builder.query({
      query: ({ orderId, vehicleType }) => ({
        url: `/api/factory/auctions/order/${orderId}`,
        method: 'GET',
        params: vehicleType ? { vehicleType } : {},
      }),
    }),
    chooseFactoryTransport: builder.mutation({
      query: ({ id, mode, requiredVehicleType }) => ({
        url: `/api/factory/transport/${id}`,
        method: 'POST',
        data: mode === 'PLATFORM' ? { mode, requiredVehicleType } : { mode },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id: 'FACTORY_LIST' },
        { type: 'Order', id: `FACTORY_${id}` },
      ],
    }),
    markFactoryOrderDelivered: builder.mutation({
      query: (id) => ({
        url: `/api/factory/transport/${id}/delivered`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Order', id: 'FACTORY_LIST' },
        { type: 'Order', id: `FACTORY_${id}` },
      ],
    }),
    reopenFactoryAuction: builder.mutation({
      query: (orderId) => ({
        url: '/api/factory/auctions',
        method: 'POST',
        data: { orderId },
      }),
      invalidatesTags: [
        { type: 'Order', id: 'FACTORY_LIST' },
        { type: 'Order', id: 'FACTORY_AUCTIONS_ACTIVE' },
      ],
    }),
  }),
})

export const {
  useGetFactoryOrdersQuery,
  useGetFactoryOrderByIdQuery,
  useGetFactoryOrderCompaniesQuery,
  useUpdateFactoryOrderStatusMutation,
  useGetFactoryTransportQuoteQuery,
  useChooseFactoryTransportMutation,
  useMarkFactoryOrderDeliveredMutation,
  useReopenFactoryAuctionMutation,
} = factoryOrderApi
