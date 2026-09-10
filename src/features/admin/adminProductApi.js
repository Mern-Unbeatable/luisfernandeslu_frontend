import { baseApi } from '../../services/api/baseApi'

function moderationListParams({
  status = 'all',
  categoryId = '',
  search = '',
  page = 1,
  limit = 8,
} = {}) {
  const params = {
    status: status || 'all',
    page,
    limit,
  }
  if (categoryId) params.categoryId = categoryId
  if (search) params.search = search
  return params
}

export const adminProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query({
      query: (args) => ({
        url: '/api/admin/products',
        method: 'GET',
        params: moderationListParams(args),
      }),
      providesTags: (result) =>
        result?.products?.length
          ? [
              ...result.products.map((product) => ({
                type: 'Product',
                id: product.id,
              })),
              { type: 'Product', id: 'ADMIN_MODERATION_LIST' },
            ]
          : [{ type: 'Product', id: 'ADMIN_MODERATION_LIST' }],
    }),
    getAdminProductById: builder.query({
      query: (productId) => ({
        url: `/api/admin/products/${productId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, productId) => [
        { type: 'Product', id: productId },
      ],
    }),
    moderateAdminProduct: builder.mutation({
      query: ({ productId, status, reason }) => ({
        url: `/api/admin/products/${productId}`,
        method: 'PATCH',
        data:
          reason != null && reason !== ''
            ? { status, reason }
            : { status },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'ADMIN_MODERATION_LIST' },
      ],
    }),
    deleteAdminProduct: builder.mutation({
      query: (productId) => ({
        url: `/api/admin/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, productId) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'ADMIN_MODERATION_LIST' },
      ],
    }),
  }),
})

export const {
  useGetAdminProductsQuery,
  useGetAdminProductByIdQuery,
  useModerateAdminProductMutation,
  useDeleteAdminProductMutation,
} = adminProductApi
