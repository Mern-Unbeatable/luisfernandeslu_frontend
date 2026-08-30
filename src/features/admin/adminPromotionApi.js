import { baseApi } from '../../services/api/baseApi'

export const adminPromotionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPromotions: builder.query({
      query: ({
        status = '',
        featured = '',
        search = '',
        page = 1,
        limit = 12,
      } = {}) => ({
        url: '/api/admin/promotions',
        method: 'GET',
        params: { status, featured, search, page, limit },
      }),
      providesTags: (result) =>
        result?.promotions?.length
          ? [
              ...result.promotions.map((promotion) => ({
                type: 'Promotion',
                id: promotion.id,
              })),
              { type: 'Promotion', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Promotion', id: 'ADMIN_LIST' }],
    }),
    updateAdminPromotion: builder.mutation({
      query: ({ promotionId, status, reason }) => ({
        url: `/api/admin/promotions/${promotionId}`,
        method: 'PATCH',
        data: reason != null && reason !== ''
          ? { status, reason }
          : { status },
      }),
      invalidatesTags: (_result, _error, { promotionId }) => [
        { type: 'Promotion', id: promotionId },
        { type: 'Promotion', id: 'ADMIN_LIST' },
      ],
    }),
  }),
})

export const {
  useGetAdminPromotionsQuery,
  useUpdateAdminPromotionMutation,
} = adminPromotionApi
