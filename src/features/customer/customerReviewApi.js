import { baseApi } from '../../services/api/baseApi'

export const customerReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerPendingReviews: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/api/customer/reviews/pending',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: [{ type: 'Order', id: 'CUSTOMER_PENDING_REVIEWS' }],
    }),
    getCustomerPendingReviewById: builder.query({
      query: (reviewLineItemId) => ({
        url: `/api/customer/reviews/pending/${reviewLineItemId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, reviewLineItemId) => [
        { type: 'Order', id: `CUSTOMER_PENDING_REVIEW_${reviewLineItemId}` },
      ],
    }),
    submitCustomerReview: builder.mutation({
      query: ({ orderLineItemId, rating, review }) => ({
        url: '/api/customer/reviews',
        method: 'POST',
        data: { orderLineItemId, rating, review },
      }),
      invalidatesTags: (_result, _error, { orderLineItemId }) => [
        { type: 'Order', id: 'CUSTOMER_PENDING_REVIEWS' },
        { type: 'Order', id: `CUSTOMER_PENDING_REVIEW_${orderLineItemId}` },
      ],
    }),
  }),
})

export const {
  useGetCustomerPendingReviewsQuery,
  useGetCustomerPendingReviewByIdQuery,
  useSubmitCustomerReviewMutation,
} = customerReviewApi
