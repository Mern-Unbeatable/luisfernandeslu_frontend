import { baseApi } from '../../services/api/baseApi'

export const factoryInvoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFactoryCommissionInvoices: builder.query({
      query: ({ search = '', page = 1, limit = 7 } = {}) => ({
        url: '/api/factory/commission-invoices',
        method: 'GET',
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
        },
      }),
      providesTags: (result) =>
        result?.invoices?.length
          ? [
              ...result.invoices.map((invoice) => ({
                type: 'Invoice',
                id: `FACTORY_${invoice.id}`,
              })),
              { type: 'Invoice', id: 'FACTORY_LIST' },
            ]
          : [{ type: 'Invoice', id: 'FACTORY_LIST' }],
    }),
    getFactoryCommissionInvoice: builder.query({
      query: (invoiceId) => ({
        url: `/api/factory/commission-invoices/${encodeURIComponent(invoiceId)}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, invoiceId) => [
        { type: 'Invoice', id: `FACTORY_${invoiceId}` },
      ],
    }),
    downloadFactoryCommissionInvoicePdf: builder.mutation({
      query: (invoiceId) => ({
        url: `/api/factory/commission-invoices/${encodeURIComponent(invoiceId)}/pdf`,
        method: 'GET',
        responseType: 'blob',
      }),
    }),
  }),
})

export const {
  useGetFactoryCommissionInvoicesQuery,
  useGetFactoryCommissionInvoiceQuery,
  useDownloadFactoryCommissionInvoicePdfMutation,
} = factoryInvoiceApi
