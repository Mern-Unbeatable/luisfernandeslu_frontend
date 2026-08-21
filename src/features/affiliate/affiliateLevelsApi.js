import { baseApi } from '../../services/api/baseApi'

export const affiliateLevelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliateLevels: builder.query({
      query: () => ({
        url: '/api/affiliate/levels',
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'AFFILIATE_LEVELS' }],
    }),
  }),
})

export const { useGetAffiliateLevelsQuery } = affiliateLevelsApi
