import { baseApi } from '../api/index'

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: '/api/cart',
        method: 'GET',
      }),
      providesTags: ['Cart'],
    }),
    addCartItem: builder.mutation({
      query: (data) => ({
        url: '/api/cart/items',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/cart/items/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation({
      query: (id) => ({
        url: `/api/cart/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    applyPromoCode: builder.mutation({
      query: (data) => ({
        url: '/api/cart/promo',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Cart'],
    }),
    removePromoCode: builder.mutation({
      query: (data) => ({
        url: '/api/cart/promo',
        method: 'DELETE',
        data,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useApplyPromoCodeMutation,
  useRemovePromoCodeMutation,
} = cartApi
