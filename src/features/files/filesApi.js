import { baseApi } from '../../services/api/baseApi'

export const filesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSignedFileUrl: builder.query({
      query: (url) => ({
        url: '/api/files/signed-url',
        method: 'GET',
        params: { url },
      }),
      transformResponse: (response) => response?.url,
      // Links expire after 10 minutes; drop cached ones well before that.
      keepUnusedDataFor: 240,
    }),
  }),
})

export const { useGetSignedFileUrlQuery, useLazyGetSignedFileUrlQuery } = filesApi
