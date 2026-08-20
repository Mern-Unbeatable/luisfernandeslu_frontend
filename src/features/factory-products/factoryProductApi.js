import { baseApi } from '../../services/api/baseApi'

export const factoryProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFactoryProducts: builder.query({
      query: ({ tab = 'all', page = 1, limit = 12, categoryId, category, search } = {}) => ({
        url: '/api/factory/products',
        method: 'GET',
        params: {
          tab,
          page,
          limit,
          ...(categoryId ? { categoryId } : {}),
          ...(category ? { category } : {}),
          ...(search ? { search } : {}),
        },
      }),
      providesTags: [{ type: 'Product', id: 'FACTORY_LIST' }],
    }),
    getFactoryProductById: builder.query({
      query: (factoryProductId) => ({
        url: `/api/factory/products/${factoryProductId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, factoryProductId) => [
        { type: 'Product', id: `FACTORY_${factoryProductId}` },
      ],
    }),
  }),
})

export const { useGetFactoryProductsQuery, useGetFactoryProductByIdQuery } =
  factoryProductApi
