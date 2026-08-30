import { baseApi } from '../../services/api/baseApi'

export const companyOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyOrders: builder.query({
      query: ({ page = 1, limit = 20, status = 'all' } = {}) => ({
        url: '/api/company/orders',
        method: 'GET',
        params: { page, limit, status },
      }),
      providesTags: [{ type: 'Order', id: 'COMPANY_LIST' }],
    }),
    getCompanyOrderById: builder.query({
      query: (orderId) => ({
        url: `/api/company/orders/${orderId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, orderId) => [
        { type: 'Order', id: `COMPANY_${orderId}` },
      ],
    }),
  }),
})

export const {
  useGetCompanyOrdersQuery,
  useGetCompanyOrderByIdQuery,
} = companyOrderApi
