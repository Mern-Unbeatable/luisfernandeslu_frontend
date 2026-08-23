import { baseApi } from '../../services/api/baseApi'

export const affiliateOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliateOverview: builder.query({
      query: ({ year } = {}) => ({
        url: '/api/affiliate/overview',
        method: 'GET',
        params: {
          ...(year != null ? { year } : {}),
        },
      }),
      providesTags: [{ type: 'User', id: 'AFFILIATE_OVERVIEW' }],
    }),
  }),
})

export const { useGetAffiliateOverviewQuery } = affiliateOverviewApi
