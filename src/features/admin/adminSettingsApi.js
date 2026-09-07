import { baseApi } from '../../services/api/baseApi'

export const adminSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSettings: builder.query({
      query: () => ({
        url: '/api/admin/settings',
        method: 'GET',
      }),
      providesTags: [{ type: 'AdminSettings', id: 'CONFIG' }],
    }),
    updateAdminSettingsShipping: builder.mutation({
      query: (body) => ({
        url: '/api/admin/settings/shipping',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'AdminSettings', id: 'CONFIG' }],
    }),
    resetAdminSettingsShipping: builder.mutation({
      query: () => ({
        url: '/api/admin/settings/shipping/reset',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'AdminSettings', id: 'CONFIG' }],
    }),
    updateAdminSettingsVat: builder.mutation({
      query: (body) => ({
        url: '/api/admin/settings/vat',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'AdminSettings', id: 'CONFIG' }],
    }),
    resetAdminSettingsVat: builder.mutation({
      query: () => ({
        url: '/api/admin/settings/vat/reset',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'AdminSettings', id: 'CONFIG' }],
    }),
    updateAdminSettingsAuction: builder.mutation({
      query: (body) => ({
        url: '/api/admin/settings/auction',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'AdminSettings', id: 'CONFIG' }],
    }),
    resetAdminSettingsAuction: builder.mutation({
      query: () => ({
        url: '/api/admin/settings/auction/reset',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'AdminSettings', id: 'CONFIG' }],
    }),
  }),
})

export const {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsShippingMutation,
  useResetAdminSettingsShippingMutation,
  useUpdateAdminSettingsVatMutation,
  useResetAdminSettingsVatMutation,
  useUpdateAdminSettingsAuctionMutation,
  useResetAdminSettingsAuctionMutation,
} = adminSettingsApi
