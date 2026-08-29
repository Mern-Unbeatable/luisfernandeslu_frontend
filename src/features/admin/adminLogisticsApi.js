import { baseApi } from '../../services/api/baseApi'

export const adminLogisticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminLogistics: builder.query({
      query: ({ status = 'all', search = '', page = 1, limit = 20 } = {}) => ({
        url: '/api/admin/logistics',
        method: 'GET',
        params: { status, search, page, limit },
      }),
      providesTags: (result) =>
        result?.deliveries?.length
          ? [
              ...result.deliveries.map((delivery) => ({
                type: 'Delivery',
                id: delivery.id,
              })),
              { type: 'Delivery', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Delivery', id: 'ADMIN_LIST' }],
    }),
    getAdminLogisticsById: builder.query({
      query: (logisticsId) => ({
        url: `/api/admin/logistics/${logisticsId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, logisticsId) => [
        { type: 'Delivery', id: logisticsId },
      ],
    }),
  }),
})

export const {
  useGetAdminLogisticsQuery,
  useGetAdminLogisticsByIdQuery,
} = adminLogisticsApi
