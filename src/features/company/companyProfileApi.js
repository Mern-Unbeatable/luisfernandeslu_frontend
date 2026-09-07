import { baseApi } from '../../services/api/baseApi'

export const companyProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyProfile: builder.query({
      query: () => ({
        url: '/api/company/profile',
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'COMPANY_PROFILE' }],
    }),
    updateCompanyProfile: builder.mutation({
      query: (body) => ({
        url: '/api/company/profile',
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'COMPANY_PROFILE' }],
    }),
    changeCompanyProfilePassword: builder.mutation({
      query: (body) => ({
        url: '/api/company/profile/password',
        method: 'POST',
        data: body,
      }),
    }),
    updateCompanyProfileIban: builder.mutation({
      query: (body) => ({
        url: '/api/company/profile/iban',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'COMPANY_PROFILE' }],
    }),
    updateCompanyBillingAddress: builder.mutation({
      query: (body) => ({
        url: '/api/company/profile/billing-address',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'COMPANY_PROFILE' }],
    }),
    updateCompanyShippingAddress: builder.mutation({
      query: (body) => ({
        url: '/api/company/profile/shipping-address',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'COMPANY_PROFILE' }],
    }),
    uploadCompanyProfileAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData()
        formData.append('avatar', file)

        return {
          url: '/api/company/profile/avatar',
          method: 'POST',
          data: formData,
        }
      },
      invalidatesTags: [{ type: 'User', id: 'COMPANY_PROFILE' }],
    }),
    deleteCompanyProfileAvatar: builder.mutation({
      query: () => ({
        url: '/api/company/profile/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'COMPANY_PROFILE' }],
    }),
  }),
})

export const {
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
  useChangeCompanyProfilePasswordMutation,
  useUpdateCompanyProfileIbanMutation,
  useUpdateCompanyBillingAddressMutation,
  useUpdateCompanyShippingAddressMutation,
  useUploadCompanyProfileAvatarMutation,
  useDeleteCompanyProfileAvatarMutation,
} = companyProfileApi
