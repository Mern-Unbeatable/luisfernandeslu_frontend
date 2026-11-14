import { baseApi } from '../../services/api/baseApi'

export const adminTransportPaymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTransportPayments: builder.query({
      query: ({ page = 1, limit = 7, status = 'all', search } = {}) => ({
        url: '/api/admin/transport-payments',
        method: 'GET',
        params: {
          page,
          limit,
          ...(status && status !== 'all' ? { status } : {}),
          ...(search ? { search } : {}),
        },
      }),
    }),
  }),
})

export const { useGetAdminTransportPaymentsQuery } = adminTransportPaymentApi
