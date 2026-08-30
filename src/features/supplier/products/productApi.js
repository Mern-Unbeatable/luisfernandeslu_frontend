import { baseApi } from '../../../services/api/baseApi'
import { axiosInstance } from '../../../services/api/axiosInstance'
import {
  mapProductDetail,
  mapPromotionPlans,
  mapSupplierProductList,
  toApiProductTab,
} from './productMappers'

export const supplierProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    lookupSupplierProductBySku: builder.query({
      query: (sku) => ({
        url: '/api/products/lookup',
        method: 'GET',
        params: { sku },
      }),
    }),
    generateSupplierProductAi: builder.mutation({
      query: ({ title, field }) => ({
        url: '/api/products/ai-generate',
        method: 'POST',
        data: { title, field },
      }),
    }),
    getSupplierProducts: builder.query({
      query: (params = {}) => ({
        url: '/api/products',
        method: 'GET',
        params: {
          tab: toApiProductTab(params.tab),
          page: params.page ?? 1,
          limit: params.limit ?? 12,
          ...(params.categoryId && params.categoryId !== 'all'
            ? { categoryId: params.categoryId }
            : {}),
          ...(params.search ? { search: params.search } : {}),
        },
      }),
      transformResponse: (response, _meta, arg) =>
        mapSupplierProductList(response, arg?.page ?? 1),
      providesTags: (result) =>
        result?.products?.length
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getSupplierProductById: builder.query({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: 'GET',
      }),
      transformResponse: mapProductDetail,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    createSupplierProduct: builder.mutation({
      query: (formData) => ({
        url: '/api/products',
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: [
        { type: 'Product', id: 'LIST' },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'STATS' },
      ],
    }),
    updateSupplierProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/products/${id}`,
        method: 'PATCH',
        data: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    cancelSupplierProductListing: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}/cancel-listing`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Inventory', id: 'LIST' },
        { type: 'Inventory', id: 'STATS' },
      ],
    }),
    deleteSupplierProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    resubmitSupplierProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/products/${id}/resubmit`,
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    uploadSupplierProductsCsv: builder.mutation({
      query: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: '/api/products/csv-upload',
          method: 'POST',
          data: formData,
        }
      },
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    getPromotionPlans: builder.query({
      query: () => ({
        url: '/api/promotions/plans',
        method: 'GET',
      }),
      transformResponse: mapPromotionPlans,
      providesTags: [{ type: 'Promotion', id: 'PLANS' }],
    }),
    promoteSupplierProduct: builder.mutation({
      query: ({ id, planId }) => ({
        url: `/api/products/${id}/promote`,
        method: 'POST',
        data: { planId },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Promotion', id: 'LIST' },
      ],
    }),
    paySupplierProductPromotion: builder.mutation({
      query: ({ productId, promotionId, paymentRef }) => ({
        url: `/api/products/${productId}/promotions/${promotionId}/pay`,
        method: 'POST',
        data: { paymentRef },
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
        { type: 'Promotion', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useLookupSupplierProductBySkuQuery,
  useLazyLookupSupplierProductBySkuQuery,
  useGenerateSupplierProductAiMutation,
  useGetSupplierProductsQuery,
  useGetSupplierProductByIdQuery,
  useCreateSupplierProductMutation,
  useUpdateSupplierProductMutation,
  useCancelSupplierProductListingMutation,
  useDeleteSupplierProductMutation,
  useResubmitSupplierProductMutation,
  useUploadSupplierProductsCsvMutation,
  useGetPromotionPlansQuery,
  usePromoteSupplierProductMutation,
  usePaySupplierProductPromotionMutation,
} = supplierProductApi

export async function downloadSupplierProductCsvTemplate() {
  const response = await axiosInstance.get('/api/products/csv-template', {
    responseType: 'blob',
  })
  return response.data
}

export async function downloadSupplierProductCsvGuide() {
  const response = await axiosInstance.get('/api/products/csv-category-guide', {
    responseType: 'blob',
  })
  return response.data
}
