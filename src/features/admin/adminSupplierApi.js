import { baseApi } from '../../services/api/baseApi'

export const adminSupplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSupplierStats: builder.query({
      query: () => ({
        url: '/api/admin/suppliers/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'Supplier', id: 'ADMIN_STATS' }],
    }),
    getAdminSuppliers: builder.query({
      query: ({ status = 'all', search = '', page = 1, limit = 20 }) => ({
        url: '/api/admin/suppliers',
        method: 'GET',
        params: {
          status,
          search,
          page,
          limit,
        },
      }),
      providesTags: [{ type: 'Supplier', id: 'ADMIN_LIST' }],
    }),
    getAdminSupplierById: builder.query({
      query: (supplierId) => ({
        url: `/api/admin/suppliers/${supplierId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, supplierId) => [
        { type: 'Supplier', id: supplierId },
      ],
    }),
    approveAdminSupplier: builder.mutation({
      query: (supplierId) => ({
        url: `/api/admin/suppliers/${supplierId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, supplierId) => [
        { type: 'Supplier', id: 'ADMIN_LIST' },
        { type: 'Supplier', id: 'ADMIN_STATS' },
        { type: 'Supplier', id: supplierId },
      ],
    }),
    rejectAdminSupplier: builder.mutation({
      query: (supplierId) => ({
        url: `/api/admin/suppliers/${supplierId}/reject`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, supplierId) => [
        { type: 'Supplier', id: 'ADMIN_LIST' },
        { type: 'Supplier', id: 'ADMIN_STATS' },
        { type: 'Supplier', id: supplierId },
      ],
    }),
    updateAdminSupplierStatus: builder.mutation({
      query: ({ supplierId, status }) => ({
        url: `/api/admin/suppliers/${supplierId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (_result, _error, { supplierId }) => [
        { type: 'Supplier', id: 'ADMIN_LIST' },
        { type: 'Supplier', id: 'ADMIN_STATS' },
        { type: 'Supplier', id: supplierId },
      ],
    }),
    updateAdminSupplierCommission: builder.mutation({
      query: ({ supplierId, commissionPercent }) => ({
        url: `/api/admin/suppliers/${supplierId}/commission`,
        method: 'PATCH',
        data: { commissionPercent },
      }),
      invalidatesTags: (_result, _error, { supplierId }) => [
        { type: 'Supplier', id: 'ADMIN_LIST' },
        { type: 'Supplier', id: supplierId },
      ],
    }),
    deleteAdminSupplier: builder.mutation({
      query: (supplierId) => ({
        url: `/api/admin/suppliers/${supplierId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, supplierId) => [
        { type: 'Supplier', id: 'ADMIN_LIST' },
        { type: 'Supplier', id: 'ADMIN_STATS' },
        { type: 'Supplier', id: supplierId },
      ],
    }),
  }),
})

export const {
  useGetAdminSupplierStatsQuery,
  useGetAdminSuppliersQuery,
  useGetAdminSupplierByIdQuery,
  useApproveAdminSupplierMutation,
  useRejectAdminSupplierMutation,
  useUpdateAdminSupplierStatusMutation,
  useUpdateAdminSupplierCommissionMutation,
  useDeleteAdminSupplierMutation,
} = adminSupplierApi
