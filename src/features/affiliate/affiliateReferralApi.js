import { baseApi } from '../../services/api/baseApi'

export const affiliateReferralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliateReferral: builder.query({
      query: () => ({
        url: '/api/affiliate/referral',
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'AFFILIATE_REFERRAL' }],
    }),
  }),
})

export const { useGetAffiliateReferralQuery } = affiliateReferralApi
