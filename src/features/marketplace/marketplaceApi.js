import { baseApi } from '../../services/api/baseApi'
import {
  mapMarketplaceCatalogProduct,
  mapMarketplaceDetailProduct,
} from './marketplaceMappers'

export const SPONSORED_PRODUCTS_PAGE_SIZE = 8
/** Hard cap shared with backend `MAX_SPONSORED_SLOTS`. */
export const MAX_SPONSORED_SLOTS = 8

export const TOP_SELLING_PRODUCTS_PAGE_SIZE = 8
export const MARKETPLACE_PRODUCTS_PAGE_SIZE = 15

function serializeMarketplaceListQuery(endpointName, queryArgs, defaultLimit) {
  const page = queryArgs?.page ?? 1
  const limit = queryArgs?.limit ?? defaultLimit
  const pricingView = queryArgs?.pricingView ?? 'retail'
  const categoryId = queryArgs?.categoryId ?? null
  const search = queryArgs?.search ?? ''
  const minPrice = queryArgs?.minPrice ?? null
  const maxPrice = queryArgs?.maxPrice ?? null
  return `${endpointName}(${JSON.stringify({
    page,
    limit,
    pricingView,
    categoryId,
    search,
    minPrice,
    maxPrice,
  })})`
}

function serializeDetailQuery(endpointName, queryArgs) {
  const slug = String(queryArgs?.slug ?? queryArgs ?? '').toLowerCase()
  const pricingView = queryArgs?.pricingView ?? 'retail'
  return `${endpointName}(${JSON.stringify({ slug, pricingView })})`
}

function serializePricingQuery(endpointName, queryArgs, defaultLimit) {
  const page = queryArgs?.page ?? 1
  const limit = queryArgs?.limit ?? defaultLimit
  const pricingView = queryArgs?.pricingView ?? 'retail'
  return `${endpointName}(${JSON.stringify({ page, limit, pricingView })})`
}

function transformCatalogResponse(response, defaultLimit) {
  return {
    products: (response?.products ?? []).map(mapMarketplaceCatalogProduct),
    pagination: response?.pagination ?? {
      page: 1,
      limit: defaultLimit,
      total: 0,
      totalPages: 1,
    },
    viewer: response?.viewer ?? null,
    message: response?.message,
  }
}

export const marketplaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSponsoredProducts: builder.query({
      query: ({
        page = 1,
        limit = SPONSORED_PRODUCTS_PAGE_SIZE,
      } = {}) => ({
        url: '/api/marketplace/products/sponsored',
        method: 'GET',
        params: { page, limit },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        serializePricingQuery(endpointName, queryArgs, SPONSORED_PRODUCTS_PAGE_SIZE),
      transformResponse: (response) =>
        transformCatalogResponse(response, SPONSORED_PRODUCTS_PAGE_SIZE),
      providesTags: [{ type: 'Promotion', id: 'SPONSORED_LIST' }],
    }),
    getTopSellingProducts: builder.query({
      query: ({
        page = 1,
        limit = TOP_SELLING_PRODUCTS_PAGE_SIZE,
      } = {}) => ({
        url: '/api/marketplace/products/top-selling',
        method: 'GET',
        params: { page, limit },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        serializePricingQuery(endpointName, queryArgs, TOP_SELLING_PRODUCTS_PAGE_SIZE),
      transformResponse: (response) =>
        transformCatalogResponse(response, TOP_SELLING_PRODUCTS_PAGE_SIZE),
      providesTags: [{ type: 'Product', id: 'TOP_SELLING_LIST' }],
    }),
    getMarketplaceProducts: builder.query({
      query: ({
        page = 1,
        limit = MARKETPLACE_PRODUCTS_PAGE_SIZE,
        categoryId,
        search,
        minPrice,
        maxPrice,
      } = {}) => ({
        url: '/api/marketplace/products',
        method: 'GET',
        params: {
          page,
          limit,
          ...(categoryId ? { categoryId } : {}),
          ...(search ? { search } : {}),
          ...(minPrice != null && minPrice !== '' ? { minPrice } : {}),
          ...(maxPrice != null && maxPrice !== '' ? { maxPrice } : {}),
        },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        serializeMarketplaceListQuery(
          endpointName,
          queryArgs,
          MARKETPLACE_PRODUCTS_PAGE_SIZE,
        ),
      transformResponse: (response) => ({
        products: (response?.products ?? []).map(mapMarketplaceCatalogProduct),
        pagination: response?.pagination ?? {
          page: 1,
          limit: MARKETPLACE_PRODUCTS_PAGE_SIZE,
          total: 0,
          totalPages: 1,
        },
        viewer: response?.viewer ?? null,
        filters: response?.filters ?? null,
        message: response?.message,
      }),
      providesTags: [{ type: 'Product', id: 'MARKETPLACE_LIST' }],
    }),
    getMarketplaceProductBySlug: builder.query({
      query: ({ slug, pricingView = 'retail' } = {}) => ({
        url: `/api/marketplace/products/${encodeURIComponent(slug)}`,
        method: 'GET',
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        serializeDetailQuery(endpointName, queryArgs),
      transformResponse: (response) => ({
        product: mapMarketplaceDetailProduct(
          response?.product ?? {},
          response?.viewer ?? null,
        ),
        viewer: response?.viewer ?? null,
        message: response?.message,
      }),
      providesTags: (_result, _error, arg) => {
        const slug = String(arg?.slug ?? arg ?? '').toLowerCase()
        return [
          { type: 'Product', id: `MARKETPLACE_DETAIL_${slug}` },
          { type: 'Product', id: 'MARKETPLACE_DETAIL' },
        ]
      },
    }),
    createProductQuote: builder.mutation({
      query: ({ productId, data }) => ({
        url: `/api/marketplace/products/${productId}/quote`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Product', 'Quote', 'ChatThread'],
    }),
  }),
})

export const {
  useGetSponsoredProductsQuery,
  useGetTopSellingProductsQuery,
  useGetMarketplaceProductsQuery,
  useGetMarketplaceProductBySlugQuery,
  useCreateProductQuoteMutation,
} = marketplaceApi
