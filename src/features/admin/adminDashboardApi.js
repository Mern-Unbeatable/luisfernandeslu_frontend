import { baseApi } from '../../services/api/baseApi'

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardOverview: builder.query({
      query: (params) => ({
        url: '/api/admin/dashboard',
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'AdminDashboard', id: 'OVERVIEW' }],
    }),
  }),
})

export const { useGetAdminDashboardOverviewQuery } = adminDashboardApi
