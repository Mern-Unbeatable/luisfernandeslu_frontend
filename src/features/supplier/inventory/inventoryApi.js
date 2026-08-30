import { baseApi } from '../../../services/api/baseApi'
import { pickList } from '../apiError'
import { mapInventoryList, mapInventoryStats } from './inventoryMappers'

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: '/api/categories',
        method: 'GET',
      }),
      transformResponse: (response) => pickList(response, ['categories']),
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    getSubcategories: builder.query({
      query: (categoryId) => ({
        url: `/api/categories/${categoryId}/subcategories`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        pickList(response, ['subCategories', 'subcategories']),
      providesTags: (_result, _error, categoryId) => [
        { type: 'Category', id: `SUB-${categoryId}` },
      ],
    }),
    getProductTypes: builder.query({
      query: (subCategoryId) => ({
        url: `/api/subcategories/${subCategoryId}/product-types`,
        method: 'GET',
      }),
      transformResponse: (response) =>
        pickList(response, ['productTypes', 'types']),
      providesTags: (_result, _error, subCategoryId) => [
        { type: 'Category', id: `TYPE-${subCategoryId}` },
      ],
    }),
    getInventoryStats: builder.query({
      query: () => ({
        url: '/api/inventory/stats',
        method: 'GET',
      }),
      transformResponse: mapInventoryStats,
      providesTags: [{ type: 'Inventory', id: 'STATS' }],
    }),
    getInventoryProducts: builder.query({
      query: (params = {}) => ({
        url: '/api/inventory',
        method: 'GET',
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          ...(params.search ? { search: params.search } : {}),
        },
      }),
      transformResponse: (response, _meta, arg) =>
        mapInventoryList(response, arg?.page ?? 1),
      providesTags: (result) =>
        result?.products?.length
          ? [
              ...result.products.map(({ id }) => ({ type: 'Inventory', id })),
              { type: 'Inventory', id: 'LIST' },
            ]
          : [{ type: 'Inventory', id: 'LIST' }],
    }),
    createInventoryProduct: builder.mutation({
      query: (body) => ({
        url: '/api/inventory',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'STATS' },
      ],
    }),
    restockInventoryProduct: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/api/inventory/${id}/restock`,
        method: 'PATCH',
        data: { quantity },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Inventory', id },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'STATS' },
      ],
    }),
    deleteInventoryProduct: builder.mutation({
      query: (id) => ({
        url: `/api/inventory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'STATS' },
      ],
    }),
    getErpApiKeys: builder.query({
      query: () => ({
        url: '/api/supplier/erp/api-keys',
        method: 'GET',
      }),
      providesTags: [{ type: 'Inventory', id: 'ERP_KEYS' }],
    }),
    createErpApiKey: builder.mutation({
      query: (body) => ({
        url: '/api/supplier/erp/api-keys',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [{ type: 'Inventory', id: 'ERP_KEYS' }],
    }),
    revokeErpApiKey: builder.mutation({
      query: (id) => ({
        url: `/api/supplier/erp/api-keys/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Inventory', id: 'ERP_KEYS' }],
    }),
    getErpInventoryProducts: builder.query({
      query: ({ apiKey, ...params } = {}) => ({
        url: '/api/supplier/erp/inventory',
        method: 'GET',
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 20,
          ...(params.search ? { search: params.search } : {}),
        },
        headers: apiKey ? { 'x-erp-api-key': apiKey } : undefined,
      }),
      providesTags: [{ type: 'Inventory', id: 'ERP_LIST' }],
    }),
    getErpInventoryProductById: builder.query({
      query: ({ id, apiKey }) => ({
        url: `/api/supplier/erp/inventory/${id}`,
        method: 'GET',
        headers: apiKey ? { 'x-erp-api-key': apiKey } : undefined,
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'Inventory', id }],
    }),
    createErpInventoryProduct: builder.mutation({
      query: ({ apiKey, ...body }) => ({
        url: '/api/supplier/erp/inventory',
        method: 'POST',
        data: body,
        headers: apiKey ? { 'x-erp-api-key': apiKey } : undefined,
      }),
      invalidatesTags: [
        { type: 'Inventory', id: 'ERP_LIST' },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'STATS' },
      ],
    }),
    restockErpInventoryProduct: builder.mutation({
      query: ({ id, quantity, apiKey }) => ({
        url: `/api/supplier/erp/inventory/${id}/restock`,
        method: 'PATCH',
        data: { quantity },
        headers: apiKey ? { 'x-erp-api-key': apiKey } : undefined,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Inventory', id },
        { type: 'Inventory', id: 'ERP_LIST' },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'STATS' },
      ],
    }),
    deleteErpInventoryProduct: builder.mutation({
      query: ({ id, apiKey }) => ({
        url: `/api/supplier/erp/inventory/${id}`,
        method: 'DELETE',
        headers: apiKey ? { 'x-erp-api-key': apiKey } : undefined,
      }),
      invalidatesTags: [
        { type: 'Inventory', id: 'ERP_LIST' },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'STATS' },
      ],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
  useGetProductTypesQuery,
  useGetInventoryStatsQuery,
  useGetInventoryProductsQuery,
  useCreateInventoryProductMutation,
  useRestockInventoryProductMutation,
  useDeleteInventoryProductMutation,
  useGetErpApiKeysQuery,
  useCreateErpApiKeyMutation,
  useRevokeErpApiKeyMutation,
  useGetErpInventoryProductsQuery,
  useGetErpInventoryProductByIdQuery,
  useCreateErpInventoryProductMutation,
  useRestockErpInventoryProductMutation,
  useDeleteErpInventoryProductMutation,
} = inventoryApi
