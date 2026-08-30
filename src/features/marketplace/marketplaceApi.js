import { baseApi } from '../../services/api/baseApi'
import { mapSponsoredProduct } from './marketplaceMappers'

export const SPONSORED_PRODUCTS_PAGE_SIZE = 8
/** Hard cap shared with backend `MAX_SPONSORED_SLOTS`. */
export const MAX_SPONSORED_SLOTS = 8

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
      // `pricingView` is FE-only so guest/customer/company caches stay separate.
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const page = queryArgs?.page ?? 1
        const limit = queryArgs?.limit ?? SPONSORED_PRODUCTS_PAGE_SIZE
        const pricingView = queryArgs?.pricingView ?? 'retail'
        return `${endpointName}(${JSON.stringify({ page, limit, pricingView })})`
      },
      transformResponse: (response) => ({
        products: (response?.products ?? []).map(mapSponsoredProduct),
        pagination: response?.pagination ?? {
          page: 1,
          limit: SPONSORED_PRODUCTS_PAGE_SIZE,
          total: 0,
          totalPages: 1,
        },
        viewer: response?.viewer ?? null,
        message: response?.message,
      }),
      providesTags: [{ type: 'Promotion', id: 'SPONSORED_LIST' }],
    }),
  }),
})

export const { useGetSponsoredProductsQuery } = marketplaceApi
