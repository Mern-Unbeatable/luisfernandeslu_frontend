import { baseApi } from '../../services/api/baseApi'

export const affiliateEarningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliateEarnings: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/api/affiliate/earnings',
        method: 'GET',
        params: {
          page,
          limit,
        },
      }),
      providesTags: [{ type: 'User', id: 'AFFILIATE_EARNINGS' }],
    }),
    createAffiliateWithdrawal: builder.mutation({
      query: (body) => ({
        url: '/api/affiliate/withdrawals',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'AFFILIATE_EARNINGS' }],
    }),
  }),
})

export const {
  useGetAffiliateEarningsQuery,
  useCreateAffiliateWithdrawalMutation,
} = affiliateEarningsApi
