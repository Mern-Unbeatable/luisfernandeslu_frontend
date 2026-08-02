import { apiSlice } from '../../app/apiSlice'

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: '/orders',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Order', id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
} = orderApi
