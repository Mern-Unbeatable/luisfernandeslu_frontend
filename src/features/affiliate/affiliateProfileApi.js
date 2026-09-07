import { baseApi } from '../../services/api/baseApi'

export const affiliateProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliateProfile: builder.query({
      query: () => ({
        url: '/api/affiliate/profile',
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'AFFILIATE_PROFILE' }],
    }),
    updateAffiliateProfile: builder.mutation({
      query: (body) => ({
        url: '/api/affiliate/profile',
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'AFFILIATE_PROFILE' }],
    }),
    changeAffiliatePassword: builder.mutation({
      query: (body) => ({
        url: '/api/affiliate/password',
        method: 'POST',
        data: body,
      }),
    }),
    getAffiliateIban: builder.query({
      query: () => ({
        url: '/api/affiliate/iban',
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'AFFILIATE_IBAN' }],
    }),
    updateAffiliateIban: builder.mutation({
      query: (body) => ({
        url: '/api/affiliate/iban',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [
        { type: 'User', id: 'AFFILIATE_IBAN' },
        { type: 'User', id: 'AFFILIATE_PROFILE' },
        { type: 'User', id: 'AFFILIATE_EARNINGS' },
      ],
    }),
  }),
})

export const {
  useGetAffiliateProfileQuery,
  useUpdateAffiliateProfileMutation,
  useChangeAffiliatePasswordMutation,
  useGetAffiliateIbanQuery,
  useUpdateAffiliateIbanMutation,
} = affiliateProfileApi
