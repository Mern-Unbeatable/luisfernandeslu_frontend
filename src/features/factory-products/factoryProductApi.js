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
    createFactoryProduct: builder.mutation({
      query: (formData) => ({
        url: '/api/factory/products',
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'FACTORY_LIST' }],
    }),
    updateFactoryProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/factory/products/${id}`,
        method: 'PATCH',
        data: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id: 'FACTORY_LIST' },
        { type: 'Product', id: `FACTORY_${id}` },
      ],
    }),
    deleteFactoryProduct: builder.mutation({
      query: (factoryProductId) => {
        const id =
          typeof factoryProductId === 'object' && factoryProductId !== null
            ? factoryProductId.id
            : factoryProductId

        return {
          url: `/api/factory/products/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (result, error, factoryProductId) => {
        if (error) return []
        const id =
          typeof factoryProductId === 'object' && factoryProductId !== null
            ? factoryProductId.id
            : factoryProductId
        return [
          { type: 'Product', id: 'FACTORY_LIST' },
          { type: 'Product', id: `FACTORY_${id}` },
        ]
      },
    }),
    cancelFactoryProduct: builder.mutation({
      query: (id) => ({
        url: `/api/factory/products/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id: 'FACTORY_LIST' },
        { type: 'Product', id: `FACTORY_${id}` },
      ],
    }),
    resubmitFactoryProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/factory/products/${id}/resubmit`,
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id: 'FACTORY_LIST' },
        { type: 'Product', id: `FACTORY_${id}` },
      ],
    }),
    generateFactoryProductAi: builder.mutation({
      query: ({ title, field }) => ({
        url: '/api/factory/products/ai-generate',
        method: 'POST',
        data: { title, field },
      }),
    }),
    downloadFactoryProductsCsvTemplate: builder.mutation({
      query: () => ({
        url: '/api/factory/products/csv-template',
        method: 'GET',
        responseType: 'blob',
      }),
    }),
    downloadFactoryProductsCsvCategoryGuide: builder.mutation({
      query: () => ({
        url: '/api/factory/products/csv-category-guide',
        method: 'GET',
        responseType: 'blob',
      }),
    }),
    uploadFactoryProductsCsv: builder.mutation({
      query: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: '/api/factory/products/csv-upload',
          method: 'POST',
          data: formData,
        }
      },
      invalidatesTags: [{ type: 'Product', id: 'FACTORY_LIST' }],
    }),
  }),
})

export const {
  useGetFactoryProductsQuery,
  useGetFactoryProductByIdQuery,
  useCreateFactoryProductMutation,
  useUpdateFactoryProductMutation,
  useDeleteFactoryProductMutation,
  useCancelFactoryProductMutation,
  useResubmitFactoryProductMutation,
  useGenerateFactoryProductAiMutation,
  useDownloadFactoryProductsCsvTemplateMutation,
  useDownloadFactoryProductsCsvCategoryGuideMutation,
  useUploadFactoryProductsCsvMutation,
} = factoryProductApi
