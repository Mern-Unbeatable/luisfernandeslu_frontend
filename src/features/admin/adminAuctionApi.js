import { baseApi } from '../../services/api/baseApi'

export const adminAuctionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAuctions: builder.query({
      query: ({ page = 1, limit = 20, filter = 'all' } = {}) => ({
        url: '/api/admin/auctions',
        method: 'GET',
        params: { page, limit, filter },
      }),
      providesTags: (result) =>
        result?.auctions?.length
          ? [
              ...result.auctions.map((auction) => ({
                type: 'Auction',
                id: auction.id,
              })),
              { type: 'Auction', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Auction', id: 'ADMIN_LIST' }],
    }),
  }),
})

export const { useGetAdminAuctionsQuery } = adminAuctionApi
