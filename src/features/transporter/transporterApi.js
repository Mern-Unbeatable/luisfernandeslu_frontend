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
    placeTransporterBid: builder.mutation({
      query: ({ auctionId, bidAmount }) => ({
        url: `/api/transporter/auctions/${encodeURIComponent(auctionId)}/bids`,
        method: 'POST',
        data: { bidAmount: Number(bidAmount) },
      }),
      invalidatesTags: (_result, _error, { auctionId }) => [
        { type: 'Auction', id: auctionId },
        { type: 'Auction', id: 'LIST' },
      ],
    }),
    getTransporterDeliveries: builder.query({
      query: ({ page = 1, limit = 20, status = 'all' } = {}) => ({
        url: '/api/transporter/deliveries',
        method: 'GET',
        params: { page, limit, status },
      }),
      providesTags: (result) =>
        result?.deliveries?.length
          ? [
              ...result.deliveries.map((delivery) => ({
                type: 'Delivery',
                id: delivery.auctionId,
              })),
              { type: 'Delivery', id: 'LIST' },
            ]
          : [{ type: 'Delivery', id: 'LIST' }],
    }),
    getTransporterDelivery: builder.query({
      query: (auctionId) => ({
        url: `/api/transporter/deliveries/${encodeURIComponent(auctionId)}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, auctionId) => [
        { type: 'Delivery', id: auctionId },
      ],
    }),
    updateTransporterDeliveryStatus: builder.mutation({
      query: ({ auctionId, action }) => ({
        url: `/api/transporter/deliveries/${encodeURIComponent(auctionId)}/status`,
        method: 'PATCH',
        data: { action },
      }),
      invalidatesTags: (_result, _error, { auctionId }) => [
        { type: 'Delivery', id: auctionId },
        { type: 'Delivery', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetTransporterAuctionsQuery,
  usePlaceTransporterBidMutation,
  useGetTransporterDeliveriesQuery,
  useGetTransporterDeliveryQuery,
  useUpdateTransporterDeliveryStatusMutation,
} = transporterApi
