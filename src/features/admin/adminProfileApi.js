import { baseApi } from '../../services/api/baseApi'

export const adminProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query({
      query: () => ({
        url: '/api/admin/profile',
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'ADMIN_PROFILE' }],
    }),
    updateAdminProfile: builder.mutation({
      query: (body) => ({
        url: '/api/admin/profile',
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'ADMIN_PROFILE' }],
    }),
    changeAdminProfilePassword: builder.mutation({
      query: (body) => ({
        url: '/api/admin/profile/password',
        method: 'POST',
        data: body,
      }),
    }),
    updateAdminProfileIban: builder.mutation({
      query: (body) => ({
        url: '/api/admin/profile/iban',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'ADMIN_PROFILE' }],
    }),
  }),
})

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangeAdminProfilePasswordMutation,
  useUpdateAdminProfileIbanMutation,
} = adminProfileApi
