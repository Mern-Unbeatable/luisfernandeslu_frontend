import { baseApi } from '../../services/api/baseApi'

export const factoryDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFactoryDashboard: builder.query({
      query: () => ({
        url: '/api/factory/dashboard',
        method: 'GET',
      }),
      providesTags: [{ type: 'Factory', id: 'DASHBOARD' }],
    }),
  }),
})

export const { useGetFactoryDashboardQuery } = factoryDashboardApi
