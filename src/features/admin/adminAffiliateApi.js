import { baseApi } from '../../services/api/baseApi'

export const adminAffiliateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAffiliateStats: builder.query({
      query: () => ({
        url: '/api/admin/affiliates/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'Affiliate', id: 'ADMIN_STATS' }],
    }),
    getAdminAffiliates: builder.query({
      query: ({ status = 'all', search = '', page = 1, limit = 7 } = {}) => ({
        url: '/api/admin/affiliates',
        method: 'GET',
        params: { status, search, page, limit },
      }),
      providesTags: (result) =>
        result?.affiliates?.length
          ? [
              ...result.affiliates.map((affiliate) => ({
                type: 'Affiliate',
                id: affiliate.id,
              })),
              { type: 'Affiliate', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Affiliate', id: 'ADMIN_LIST' }],
    }),
    updateAdminAffiliateStatus: builder.mutation({
      query: ({ affiliateId, status }) => ({
        url: `/api/admin/affiliates/${affiliateId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (_result, _error, { affiliateId }) => [
        { type: 'Affiliate', id: affiliateId },
        { type: 'Affiliate', id: 'ADMIN_LIST' },
        { type: 'Affiliate', id: 'ADMIN_STATS' },
      ],
    }),
    getAdminAffiliateById: builder.query({
      query: (affiliateId) => ({
        url: `/api/admin/affiliates/${affiliateId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, affiliateId) => [
        { type: 'Affiliate', id: affiliateId },
      ],
    }),
    deleteAdminAffiliate: builder.mutation({
      query: (affiliateId) => ({
        url: `/api/admin/affiliates/${affiliateId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, affiliateId) => [
        { type: 'Affiliate', id: affiliateId },
        { type: 'Affiliate', id: 'ADMIN_LIST' },
        { type: 'Affiliate', id: 'ADMIN_STATS' },
      ],
    }),
    getAdminAffiliateClients: builder.query({
      query: ({
        affiliateId,
        status = 'all',
        plan = 'all',
        sort = 'latest',
        search = '',
        page = 1,
        limit = 7,
      }) => ({
        url: `/api/admin/affiliates/${affiliateId}/clients`,
        method: 'GET',
        params: { status, plan, sort, search, page, limit },
      }),
      providesTags: (_result, _error, { affiliateId }) => [
        { type: 'Affiliate', id: `${affiliateId}_CLIENTS` },
      ],
    }),
    getAdminAffiliateAnalytics: builder.query({
      query: ({ affiliateId, period = 'thisYear' }) => ({
        url: `/api/admin/affiliates/${affiliateId}/analytics`,
        method: 'GET',
        params: { period },
      }),
      providesTags: (_result, _error, { affiliateId }) => [
        { type: 'Affiliate', id: `${affiliateId}_ANALYTICS` },
      ],
    }),
    getAdminAffiliateCommissions: builder.query({
      query: ({
        affiliateId,
        status = 'all',
        page = 1,
        limit = 7,
      }) => ({
        url: `/api/admin/affiliates/${affiliateId}/commissions`,
        method: 'GET',
        params: { status, page, limit },
      }),
      providesTags: (_result, _error, { affiliateId }) => [
        { type: 'Affiliate', id: `${affiliateId}_COMMISSIONS` },
      ],
    }),
    getAdminAffiliatePayouts: builder.query({
      query: ({
        affiliateId,
        status = 'all',
        page = 1,
        limit = 7,
      }) => ({
        url: `/api/admin/affiliates/${affiliateId}/payouts`,
        method: 'GET',
        params: { status, page, limit },
      }),
      providesTags: (_result, _error, { affiliateId }) => [
        { type: 'Affiliate', id: `${affiliateId}_PAYOUTS` },
      ],
    }),
    getAdminAffiliatePayoutRequests: builder.query({
      query: ({ status = 'all', search = '', page = 1, limit = 7 } = {}) => ({
        url: '/api/admin/affiliates/payouts',
        method: 'GET',
        params: { status, search, page, limit },
      }),
      providesTags: [{ type: 'Affiliate', id: 'ADMIN_PAYOUT_REQUESTS' }],
    }),
    updateAdminAffiliatePayoutStatus: builder.mutation({
      query: ({ payoutId, status }) => ({
        url: `/api/admin/affiliates/payouts/${payoutId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: [{ type: 'Affiliate', id: 'ADMIN_PAYOUT_REQUESTS' }],
    }),
    getAdminAffiliateLevels: builder.query({
      query: () => ({
        url: '/api/admin/affiliate-tiers',
        method: 'GET',
      }),
      providesTags: [{ type: 'Affiliate', id: 'ADMIN_LEVELS' }],
    }),
    createAdminAffiliateLevel: builder.mutation({
      query: (body) => ({
        url: '/api/admin/affiliate-tiers',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [{ type: 'Affiliate', id: 'ADMIN_LEVELS' }],
    }),
    updateAdminAffiliateLevel: builder.mutation({
      query: ({ tierId, ...body }) => ({
        url: `/api/admin/affiliate-tiers/${tierId}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: [{ type: 'Affiliate', id: 'ADMIN_LEVELS' }],
    }),
    deleteAdminAffiliateLevel: builder.mutation({
      query: (tierId) => ({
        url: `/api/admin/affiliate-tiers/${tierId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Affiliate', id: 'ADMIN_LEVELS' }],
    }),
    reorderAdminAffiliateLevels: builder.mutation({
      query: ({ ids }) => ({
        url: '/api/admin/affiliate-tiers/reorder',
        method: 'PUT',
        data: { ids },
      }),
      invalidatesTags: [{ type: 'Affiliate', id: 'ADMIN_LEVELS' }],
    }),
  }),
})

export const {
  useGetAdminAffiliateStatsQuery,
  useGetAdminAffiliatesQuery,
  useGetAdminAffiliateByIdQuery,
  useGetAdminAffiliateClientsQuery,
  useGetAdminAffiliateAnalyticsQuery,
  useGetAdminAffiliateCommissionsQuery,
  useGetAdminAffiliatePayoutsQuery,
  useGetAdminAffiliatePayoutRequestsQuery,
  useUpdateAdminAffiliatePayoutStatusMutation,
  useGetAdminAffiliateLevelsQuery,
  useCreateAdminAffiliateLevelMutation,
  useUpdateAdminAffiliateLevelMutation,
  useDeleteAdminAffiliateLevelMutation,
  useReorderAdminAffiliateLevelsMutation,
  useUpdateAdminAffiliateStatusMutation,
  useDeleteAdminAffiliateMutation,
} = adminAffiliateApi
