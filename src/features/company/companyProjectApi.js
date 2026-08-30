import { baseApi } from '../../services/api/baseApi'

export const companyProjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyProjects: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/api/company/projects',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: [{ type: 'CompanyProject', id: 'LIST' }],
    }),
    getCompanyProjectById: builder.query({
      query: ({ projectId, page = 1, limit = 20 }) => ({
        url: `/api/company/projects/${projectId}`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (_result, _error, { projectId }) => [
        { type: 'CompanyProject', id: projectId },
      ],
    }),
    getCompanyProjectOrderById: builder.query({
      query: ({ projectId, orderId }) => ({
        url: `/api/company/projects/${projectId}/orders/${orderId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { projectId, orderId }) => [
        { type: 'CompanyProject', id: `${projectId}_${orderId}` },
      ],
    }),
  }),
})

export const {
  useGetCompanyProjectsQuery,
  useGetCompanyProjectByIdQuery,
  useGetCompanyProjectOrderByIdQuery,
} = companyProjectApi
