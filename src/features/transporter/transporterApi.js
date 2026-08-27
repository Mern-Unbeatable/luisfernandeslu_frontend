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
    getTransporterCompletedDeliveries: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/api/transporter/deliveries/completed',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (result) =>
        result?.deliveries?.length
          ? [
              ...result.deliveries.map((delivery) => ({
                type: 'Delivery',
                id: delivery.auctionId,
              })),
              { type: 'Delivery', id: 'COMPLETED' },
            ]
          : [{ type: 'Delivery', id: 'COMPLETED' }],
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
        { type: 'Delivery', id: 'COMPLETED' },
      ],
    }),
    getTransporterPaymentsPayouts: builder.query({
      query: ({ period = 'thisYear', page = 1, limit = 7 } = {}) => ({
        url: '/api/transporter/payments-payouts',
        method: 'GET',
        params: { period, page, limit },
      }),
      providesTags: [{ type: 'Payment', id: 'LIST' }],
    }),
    requestTransporterWithdrawal: builder.mutation({
      query: ({ amount, businessName, routingNumber, accountNumber }) => ({
        url: '/api/transporter/payments-payouts/withdrawals',
        method: 'POST',
        data: {
          amount: Number(amount),
          businessName,
          routingNumber,
          accountNumber,
        },
      }),
      invalidatesTags: [{ type: 'Payment', id: 'LIST' }],
    }),
    getTransporterInsurance: builder.query({
      query: () => ({
        url: '/api/transporter/insurance',
        method: 'GET',
      }),
      providesTags: [{ type: 'Insurance', id: 'LIST' }],
    }),
    uploadTransporterInsurance: builder.mutation({
      query: (formData) => ({
        url: '/api/transporter/insurance',
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: [{ type: 'Insurance', id: 'LIST' }],
    }),
    downloadTransporterInsurancePdf: builder.mutation({
      query: (kind) => ({
        url: `/api/transporter/insurance/${encodeURIComponent(kind)}/pdf`,
        method: 'GET',
        responseType: 'blob',
      }),
    }),
    getTransporterCommissionInvoices: builder.query({
      query: ({ search = '', page = 1, limit = 7 } = {}) => ({
        url: '/api/transporter/commission-invoices',
        method: 'GET',
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
        },
      }),
      providesTags: (result) =>
        result?.invoices?.length
          ? [
              ...result.invoices.map((invoice) => ({
                type: 'Invoice',
                id: invoice.id,
              })),
              { type: 'Invoice', id: 'LIST' },
            ]
          : [{ type: 'Invoice', id: 'LIST' }],
    }),
    getTransporterCommissionInvoice: builder.query({
      query: (invoiceId) => ({
        url: `/api/transporter/commission-invoices/${encodeURIComponent(invoiceId)}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, invoiceId) => [
        { type: 'Invoice', id: invoiceId },
      ],
    }),
    downloadTransporterCommissionInvoicePdf: builder.mutation({
      query: (invoiceId) => ({
        url: `/api/transporter/commission-invoices/${encodeURIComponent(invoiceId)}/pdf`,
        method: 'GET',
        responseType: 'blob',
      }),
    }),
  }),
})

export const {
  useGetTransporterAuctionsQuery,
  usePlaceTransporterBidMutation,
  useGetTransporterDeliveriesQuery,
  useGetTransporterCompletedDeliveriesQuery,
  useGetTransporterDeliveryQuery,
  useUpdateTransporterDeliveryStatusMutation,
  useGetTransporterPaymentsPayoutsQuery,
  useRequestTransporterWithdrawalMutation,
  useGetTransporterInsuranceQuery,
  useUploadTransporterInsuranceMutation,
  useDownloadTransporterInsurancePdfMutation,
  useGetTransporterCommissionInvoicesQuery,
  useGetTransporterCommissionInvoiceQuery,
  useDownloadTransporterCommissionInvoicePdfMutation,
} = transporterApi
