import { baseApi } from '../../services/api/baseApi'
import { mapMarketplaceCatalogProduct } from './marketplaceMappers'

export const SPONSORED_PRODUCTS_PAGE_SIZE = 8
/** Hard cap shared with backend `MAX_SPONSORED_SLOTS`. */
export const MAX_SPONSORED_SLOTS = 8

export const TOP_SELLING_PRODUCTS_PAGE_SIZE = 8

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
  }),
})

export const {
  useGetSponsoredProductsQuery,
  useGetTopSellingProductsQuery,
} = marketplaceApi
