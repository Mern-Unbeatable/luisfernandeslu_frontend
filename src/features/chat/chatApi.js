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
          
          // Find partner from participants (mapped by backend)
          let partnerUser = null
          if (thread.participants && thread.participants.length > 0) {
            const partnerRow = thread.participants.find(p => p.id !== currentUserId)
            if (partnerRow) {
              partnerUser = partnerRow
            }
          }
          
          const partnerName = partnerUser?.name || 'Conversation'
          const partnerAvatar = partnerUser?.avatar || partnerUser?.image || null
          const isOnline = partnerUser?.online || false

          // Handle last message logic properly
          let lastMessageText = 'New conversation'
          if (typeof lastMsg === 'string') {
            lastMessageText = lastMsg
          } else if (lastMsg.isDeleted) {
            lastMessageText = 'This message was deleted'
          } else if (lastMsg.text || lastMsg.messageText || lastMsg.message) {
            lastMessageText = lastMsg.text || lastMsg.messageText || lastMsg.message
          }

          return {
            id: String(thread.id),
            name: thread.title || thread.name || partnerName,
            avatar: partnerAvatar,
            partner: partnerUser,
            lastMessage: lastMessageText,
            time: formatChatTime(parseDate(thread.updatedAt)),
            unreadCount: thread.unreadCount || 0,
            online: isOnline,
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
          text: msg.isDeleted ? 'This message was deleted' : (msg.text || msg.messageText || msg.message || ''),
          sender: msg.senderId === arg?.userId ? 'me' : (msg.senderId || 'system'),
          senderId: msg.senderId,
          time: formatChatTime(parseDate(msg.createdAt)),
          type: String(msg.messageType || msg.type || 'text').toLowerCase(),
          offer: msg.offer,
          isDeleted: Boolean(msg.isDeleted),
          editedAt: msg.editedAt || null,
          raw: msg,
        }))
      },
    }),

    markAsRead: builder.mutation({
      query: ({ threadId }) => ({
        url: `/api/chat/threads/${threadId}/read`,
        method: 'POST',
      }),
      async onQueryStarted({ threadId, userId }, { dispatch, queryFulfilled }) {
        // Optimistically update unreadCount to 0
        const patchResult = dispatch(
          chatApi.util.updateQueryData('getChatThreads', { userId }, (draft) => {
            const thread = draft.chats.find((t) => t.id === String(threadId))
            if (thread) {
              thread.unreadCount = 0
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetChatThreadsQuery,
  useGetChatMessagesQuery,
  useMarkAsReadMutation,
} = chatApi
