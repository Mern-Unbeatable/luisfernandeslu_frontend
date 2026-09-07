import { baseApi } from '../../services/api/baseApi'

export const adminRolesPermissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminRolesPermissions: builder.query({
      query: () => ({
        url: '/api/admin/roles-permissions',
        method: 'GET',
      }),
      providesTags: [{ type: 'RolePermission', id: 'ADMIN_MATRIX' }],
    }),
    updateAdminRolePermissions: builder.mutation({
      query: ({ role, edit }) => ({
        url: `/api/admin/roles-permissions/${role}`,
        method: 'PUT',
        data: { edit },
      }),
      invalidatesTags: [{ type: 'RolePermission', id: 'ADMIN_MATRIX' }],
    }),
    inviteAdminRoleMember: builder.mutation({
      query: (body) => ({
        url: '/api/admin/roles-permissions/invite',
        method: 'POST',
        data: body,
      }),
    }),
  }),
})

export const {
  useGetAdminRolesPermissionsQuery,
  useUpdateAdminRolePermissionsMutation,
  useInviteAdminRoleMemberMutation,
} = adminRolesPermissionsApi
