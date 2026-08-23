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
  }),
})

export const {
  useGetFactoryOrdersQuery,
  useGetFactoryOrderByIdQuery,
  useGetFactoryOrderCompaniesQuery,
  useUpdateFactoryOrderStatusMutation,
} = factoryOrderApi
