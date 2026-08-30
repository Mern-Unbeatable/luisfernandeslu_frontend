import { baseApi } from '../../services/api/baseApi'

export const transporterProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransporterProfile: builder.query({
      query: () => ({
        url: '/api/transporter/profile',
        method: 'GET',
      }),
      providesTags: [{ type: 'Transporter', id: 'PROFILE' }],
    }),
    updateTransporterProfile: builder.mutation({
      query: (body) => ({
        url: '/api/transporter/profile',
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: [{ type: 'Transporter', id: 'PROFILE' }],
    }),
    changeTransporterPassword: builder.mutation({
      query: (body) => ({
        url: '/api/transporter/profile/password',
        method: 'POST',
        data: body,
      }),
    }),
    updateTransporterIban: builder.mutation({
      query: (body) => ({
        url: '/api/transporter/profile/iban',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'Transporter', id: 'PROFILE' }],
    }),
    uploadTransporterAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData()
        formData.append('image', file)
        return {
          url: '/api/transporter/profile/avatar',
          method: 'POST',
          data: formData,
        }
      },
      invalidatesTags: [{ type: 'Transporter', id: 'PROFILE' }],
    }),
    removeTransporterAvatar: builder.mutation({
      query: () => ({
        url: '/api/transporter/profile/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Transporter', id: 'PROFILE' }],
    }),
  }),
})

export const {
  useGetTransporterProfileQuery,
  useUpdateTransporterProfileMutation,
  useChangeTransporterPasswordMutation,
  useUpdateTransporterIbanMutation,
  useUploadTransporterAvatarMutation,
  useRemoveTransporterAvatarMutation,
} = transporterProfileApi
