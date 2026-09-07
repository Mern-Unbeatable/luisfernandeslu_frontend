import { baseApi } from '../../services/api/baseApi'

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierAnalytics: builder.query({
      query: (params) => ({
        url: '/supplier/analytics',
        method: 'GET',
        params,
      }),
      transformResponse: (response) => ({
        stats: response.stats,
        revenueExpensesProfit: response.revenueExpensesProfit,
        revenueBreakdown: response.revenueBreakdown,
        salesByCustomerType: response.salesByCustomerType,
        insight: response.insight,
      }),
      providesTags: [{ type: 'SupplierAnalytics', id: 'DASHBOARD' }],
    }),
  }),
})

export const { useGetSupplierAnalyticsQuery } = analyticsApi
