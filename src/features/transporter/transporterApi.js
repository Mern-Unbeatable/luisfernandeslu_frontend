import { baseApi } from '../../services/api/baseApi'

export const transporterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransporterAuctions: builder.query({
      query: ({ page = 1, limit = 20, filter = 'all' } = {}) => ({
        url: '/api/transporter/auctions',
        method: 'GET',
        params: { page, limit, filter },
      }),
      providesTags: (result) =>
        result?.auctions?.length
          ? [
              ...result.auctions.map((auction) => ({
                type: 'Auction',
                id: auction.auctionId,
              })),
              { type: 'Auction', id: 'LIST' },
            ]
          : [{ type: 'Auction', id: 'LIST' }],
    }),
  }),
})

export const { useGetTransporterAuctionsQuery } = transporterApi
