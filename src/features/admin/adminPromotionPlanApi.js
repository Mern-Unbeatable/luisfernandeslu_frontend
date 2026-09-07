import { baseApi } from '../../services/api/baseApi'

export const adminPromotionPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPromotionPlans: builder.query({
      query: () => ({
        url: '/api/admin/promotion-plans',
        method: 'GET',
      }),
      providesTags: [{ type: 'PromotionPlan', id: 'ADMIN_LIST' }],
    }),
    createAdminPromotionPlan: builder.mutation({
      query: (body) => ({
        url: '/api/admin/promotion-plans',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: [{ type: 'PromotionPlan', id: 'ADMIN_LIST' }],
    }),
    updateAdminPromotionPlan: builder.mutation({
      query: ({ planId, ...body }) => ({
        url: `/api/admin/promotion-plans/${planId}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: [{ type: 'PromotionPlan', id: 'ADMIN_LIST' }],
    }),
  }),
})

export const {
  useGetAdminPromotionPlansQuery,
  useCreateAdminPromotionPlanMutation,
  useUpdateAdminPromotionPlanMutation,
} = adminPromotionPlanApi
