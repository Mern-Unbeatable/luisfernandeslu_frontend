import { baseApi } from '../../services/api/baseApi'

export const affiliateClientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliateClients: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/api/affiliate/clients',
        method: 'GET',
        params: {
          page,
          limit,
        },
      }),
      providesTags: [{ type: 'User', id: 'AFFILIATE_CLIENTS' }],
    }),
  }),
})

export const { useGetAffiliateClientsQuery } = affiliateClientsApi
