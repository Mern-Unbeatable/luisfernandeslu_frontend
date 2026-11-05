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
    uploadAdminProfileAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData()
        formData.append('avatar', file)
        return {
          url: '/api/admin/profile/avatar',
          method: 'POST',
          data: formData,
        }
      },
      invalidatesTags: [{ type: 'User', id: 'ADMIN_PROFILE' }],
    }),
    deleteAdminProfileAvatar: builder.mutation({
      query: () => ({
        url: '/api/admin/profile/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'ADMIN_PROFILE' }],
    }),
    getAdminSmtp: builder.query({
      query: () => ({
        url: '/api/admin/profile/smtp',
        method: 'GET',
      }),
      providesTags: [{ type: 'User', id: 'ADMIN_SMTP' }],
    }),
    updateAdminSmtp: builder.mutation({
      query: (body) => ({
        url: '/api/admin/profile/smtp',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'User', id: 'ADMIN_SMTP' }],
    }),
    testAdminSmtp: builder.mutation({
      query: (body) => ({
        url: '/api/admin/profile/smtp/test',
        method: 'POST',
        data: body,
      }),
    }),
  }),
})

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangeAdminProfilePasswordMutation,
  useUpdateAdminProfileIbanMutation,
  useUploadAdminProfileAvatarMutation,
  useDeleteAdminProfileAvatarMutation,
  useGetAdminSmtpQuery,
  useUpdateAdminSmtpMutation,
  useTestAdminSmtpMutation,
} = adminProfileApi
