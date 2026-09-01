import { baseApi } from '../../services/api/baseApi'

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCheckout: builder.query({
      query: (id) => ({
        url: `/api/checkout/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Checkout', id }],
    }),
    quoteShipping: builder.mutation({
      query: (body) => ({
        url: '/api/checkout/shipping-quote',
        method: 'POST',
        data: body,
      }),
    }),
    placeCheckout: builder.mutation({
      query: (body) => ({
        url: '/api/checkout',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Cart'], // Placing checkout clears cart
    }),
    confirmMockPayment: builder.mutation({
      query: (id) => ({
        url: `/api/checkout/${id}/pay`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Checkout', id }],
    }),
    suggestLocations: builder.query({
      query: (searchParams) => ({
        url: '/api/checkout/suggest-locations',
        method: 'GET',
        params: searchParams,
      }),
    }),
  }),
})

export const {
  useGetCheckoutQuery,
  useQuoteShippingMutation,
  usePlaceCheckoutMutation,
  useConfirmMockPaymentMutation,
  useSuggestLocationsQuery,
  useLazySuggestLocationsQuery,
} = checkoutApi
