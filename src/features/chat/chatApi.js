import { baseApi } from '../../services/api/baseApi'

function parseDate(value) {
  if (!value) return new Date()
  const date = new Date(value)
  return isNaN(date.getTime()) ? new Date() : date
}

function formatChatTime(dateObj) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(dateObj)
}

function resolveParticipant(thread) {
  // If 1-on-1, usually we can just find the participant that is NOT the current user
  // However, the backend mappers.js `mapThreadSummary` should have already populated `partner`
  // or `title` / `name` properly if it's a group or contextual thread.
  return {
    id: thread.id,
    name: thread.title || thread.name || 'Chat',
    avatar: thread.avatar || null,
  }
}

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatThreads: builder.query({
      query: (params) => ({
        url: '/api/chat/threads',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 20,
        },
      }),
      providesTags: ['ChatThread'],
      transformResponse: (response, meta, arg) => {
        const threads = response?.data?.threads || []
        const currentUserId = arg?.userId
        
        const mapped = threads.map((thread) => {
          const lastMsg = thread.lastMessage || {}
          
          // Find partner name from participants
          let partnerName = 'Conversation'
          if (thread.participants && thread.participants.length > 0) {
            const partner = thread.participants.find(p => p.id !== currentUserId)
            if (partner) {
              partnerName = partner.name || 'Conversation'
            }
          }
          
          return {
            id: String(thread.id),
            name: thread.title || thread.name || partnerName,
            avatar: null,
            lastMessage: typeof lastMsg === 'string' ? lastMsg : (lastMsg.text || lastMsg.messageText || lastMsg.message || 'New conversation'),
            time: formatChatTime(parseDate(thread.updatedAt)),
            unreadCount: 0,
            online: false,
            raw: thread,
          }
        })
        return {
          chats: mapped,
          pagination: response?.pagination,
        }
      },
    }),
    
    getChatMessages: builder.query({
      query: ({ threadId, cursor, limit = 50, userId }) => ({
        url: `/api/chat/threads/${threadId}/messages`,
        params: { cursor, limit },
      }),
      providesTags: (_result, _error, arg) => [{ type: 'ChatMessage', id: arg.threadId }],
      transformResponse: (response, meta, arg) => {
        const msgs = response?.data?.messages || []
        return msgs.map((msg) => ({
          id: String(msg.id),
          text: msg.text || msg.messageText || msg.message || '',
          sender: msg.senderId === arg?.userId ? 'me' : (msg.senderId || 'system'),
          senderId: msg.senderId,
          time: formatChatTime(parseDate(msg.createdAt)),
          type: msg.messageType || msg.type || 'text',
          raw: msg,
        }))
      },
    }),
  }),
})

export const {
  useGetChatThreadsQuery,
  useGetChatMessagesQuery,
} = chatApi
