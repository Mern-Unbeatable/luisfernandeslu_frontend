import { baseApi } from '../../services/api/baseApi'

export const factoryAuctionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveFactoryAuctions: builder.query({
      query: ({ page = 1, limit = 4 } = {}) => ({
        url: '/api/factory/auctions/active',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: [{ type: 'Order', id: 'FACTORY_AUCTIONS_ACTIVE' }],
    }),
    getActiveFactoryAuctionById: builder.query({
      query: (auctionId) => ({
        url: `/api/factory/auctions/active/${auctionId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, auctionId) => [
        { type: 'Order', id: `FACTORY_AUCTION_ACTIVE_${auctionId}` },
      ],
    }),
    getAssignedFactoryAuctions: builder.query({
      query: ({ page = 1, limit = 4 } = {}) => ({
        url: '/api/factory/auctions/assigned',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: [{ type: 'Order', id: 'FACTORY_AUCTIONS_ASSIGNED' }],
    }),
    getAssignedFactoryAuctionById: builder.query({
      query: (auctionId) => ({
        url: `/api/factory/auctions/assigned/${auctionId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, auctionId) => [
        { type: 'Order', id: `FACTORY_AUCTION_ASSIGNED_${auctionId}` },
      ],
    }),
    getFactoryAuctionCreateInfo: builder.query({
      query: (factoryOrderId) => ({
        url: `/api/factory/auctions/order/${factoryOrderId}`,
        method: 'GET',
      }),
    }),
    createFactoryAuction: builder.mutation({
      query: (body) => ({
        url: '/api/factory/auctions',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [
        { type: 'Order', id: 'FACTORY_AUCTIONS_ACTIVE' },
        { type: 'Order', id: 'FACTORY_AUCTIONS_ASSIGNED' },
      ],
    }),
  }),
})

export const {
  useGetActiveFactoryAuctionsQuery,
  useGetActiveFactoryAuctionByIdQuery,
  useGetAssignedFactoryAuctionsQuery,
  useGetAssignedFactoryAuctionByIdQuery,
  useGetFactoryAuctionCreateInfoQuery,
  useLazyGetFactoryAuctionCreateInfoQuery,
  useCreateFactoryAuctionMutation,
} = factoryAuctionApi
