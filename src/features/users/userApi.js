import { apiSlice } from '../../app/apiSlice'

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'User', id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = userApi
