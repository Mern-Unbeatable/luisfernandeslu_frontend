import { baseApi } from '../../services/api/baseApi'

export const customerProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerProfile: builder.query({
      query: () => ({
        url: '/api/customer/profile',
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'CUSTOMER_PROFILE' }],
    }),
    updateCustomerProfile: builder.mutation({
      query: (body) => ({
        url: '/api/customer/profile',
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'CUSTOMER_PROFILE' }],
    }),
    changeCustomerProfilePassword: builder.mutation({
      query: (body) => ({
        url: '/api/customer/profile/password',
        method: 'POST',
        data: body,
      }),
    }),
    updateCustomerProfileIban: builder.mutation({
      query: (body) => ({
        url: '/api/customer/profile/iban',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'CUSTOMER_PROFILE' }],
    }),
    updateCustomerBillingAddress: builder.mutation({
      query: (body) => ({
        url: '/api/customer/profile/billing-address',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'CUSTOMER_PROFILE' }],
    }),
    updateCustomerShippingAddress: builder.mutation({
      query: (body) => ({
        url: '/api/customer/profile/shipping-address',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'CUSTOMER_PROFILE' }],
    }),
    uploadCustomerProfileAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData()
        formData.append('avatar', file)
        return {
          url: '/api/customer/profile/avatar',
          method: 'POST',
          data: formData,
        }
      },
      invalidatesTags: [{ type: 'User', id: 'CUSTOMER_PROFILE' }],
    }),
    deleteCustomerProfileAvatar: builder.mutation({
      query: () => ({
        url: '/api/customer/profile/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'CUSTOMER_PROFILE' }],
    }),
  }),
})

export const {
  useGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useChangeCustomerProfilePasswordMutation,
  useUpdateCustomerProfileIbanMutation,
  useUpdateCustomerBillingAddressMutation,
  useUpdateCustomerShippingAddressMutation,
  useUploadCustomerProfileAvatarMutation,
  useDeleteCustomerProfileAvatarMutation,
} = customerProfileApi
