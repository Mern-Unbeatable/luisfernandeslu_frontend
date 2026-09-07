import { baseApi } from '../../services/api/baseApi'

export const factoryProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFactoryProfile: builder.query({
      query: () => ({
        url: '/api/factory/profile',
        method: 'GET',
      }),
      providesTags: [{ type: 'Factory', id: 'PROFILE' }],
    }),
    updateFactoryProfile: builder.mutation({
      query: (body) => ({
        url: '/api/factory/profile',
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: [{ type: 'Factory', id: 'PROFILE' }],
    }),
    updateFactoryWarehouses: builder.mutation({
      query: (warehouses) => ({
        url: '/api/factory/profile/warehouses',
        method: 'PUT',
        data: { warehouses },
      }),
      invalidatesTags: [{ type: 'Factory', id: 'PROFILE' }],
    }),
    changeFactoryPassword: builder.mutation({
      query: (body) => ({
        url: '/api/factory/profile/password',
        method: 'POST',
        data: body,
      }),
    }),
    updateFactoryIban: builder.mutation({
      query: (body) => ({
        url: '/api/factory/profile/iban',
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: [{ type: 'Factory', id: 'PROFILE' }],
    }),
  }),
})

export const {
  useGetFactoryProfileQuery,
  useUpdateFactoryProfileMutation,
  useUpdateFactoryWarehousesMutation,
  useChangeFactoryPasswordMutation,
  useUpdateFactoryIbanMutation,
} = factoryProfileApi
