import { baseApi } from '../../services/api/baseApi'

export const assistantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssistantHistory: builder.query({
      query: () => ({
        url: '/api/assistant/history',
        method: 'GET',
      }),
      transformResponse: (response) => response?.data?.messages || response?.messages || [],
      providesTags: ['AssistantChat'],
    }),
    sendAssistantMessage: builder.mutation({
      query: ({ message, history = [] }) => ({
        url: '/api/assistant/chat',
        method: 'POST',
        data: { message, history },
      }),
      transformResponse: (response) => ({
        reply: response?.data?.reply || response?.reply || '',
        products: response?.data?.products || response?.products || [],
      }),
      invalidatesTags: ['AssistantChat'],
    }),
  }),
})

export const { useGetAssistantHistoryQuery, useSendAssistantMessageMutation } = assistantApi

