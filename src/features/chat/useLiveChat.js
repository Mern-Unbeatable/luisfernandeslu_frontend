import { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { useGetChatThreadsQuery, useGetChatMessagesQuery, chatApi } from './chatApi'
import { useDispatch } from 'react-redux'

// The backend server URL for socket connection
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'

export default function useLiveChat(initialThreadId = null) {
  const dispatch = useDispatch()
  const { accessToken, user } = useSelector((state) => state.auth)

  const [activeThreadId, setActiveThreadId] = useState(initialThreadId)
  // Use ref so socket never causes re-renders or recreation from other state changes
  const socketRef = useRef(null)
  const activeThreadIdRef = useRef(activeThreadId)

  // Keep ref in sync with state
  useEffect(() => {
    activeThreadIdRef.current = activeThreadId
  }, [activeThreadId])

  const { data: inboxData, isLoading: isLoadingChats, refetch: refetchChats } = useGetChatThreadsQuery({ userId: user?.id })
  const { data: messagesData, isLoading: isLoadingMessages } = useGetChatMessagesQuery(
    { threadId: activeThreadId, userId: user?.id },
    { skip: !activeThreadId }
  )

  const activeThread = inboxData?.chats?.find((c) => c.id === activeThreadId) || null

  // Create socket ONCE when accessToken is available — never recreate on thread change
  useEffect(() => {
    if (!accessToken) return

    const newSocket = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket'],
    })

    newSocket.on('connect', () => {
      console.log('LiveChat socket connected', newSocket.id)
      // Re-join active thread if reconnected
      if (activeThreadIdRef.current) {
        newSocket.emit('chat:join', { threadId: activeThreadIdRef.current }, (ack) => {
          if (!ack?.ok) console.error('Failed to re-join room', ack?.message)
        })
      }
    })

    newSocket.on('chat:message', (payload) => {
      const { threadId, chatMessage } = payload

      // Update RTK Query cache manually for messages
      if (threadId) {
        dispatch(
          chatApi.util.updateQueryData('getChatMessages', { threadId, userId: user?.id }, (draft) => {
            // Avoid duplicate messages
            const alreadyExists = draft.some((m) => String(m.id) === String(chatMessage.id))
            if (alreadyExists) return

            const mapped = {
              id: String(chatMessage.id),
              text: chatMessage.text || chatMessage.messageText || chatMessage.message || '',
              sender: chatMessage.senderId === user?.id ? 'me' : 'them',
              senderId: chatMessage.senderId,
              time: new Date(chatMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: chatMessage.messageType || chatMessage.type || 'text',
              raw: chatMessage,
            }
            draft.push(mapped)
          })
        )
      }

      // Update thread list (move to top with last message preview)
      dispatch(
        chatApi.util.updateQueryData('getChatThreads', { userId: user?.id }, (draft) => {
          if (!draft?.chats) return
          const threadIndex = draft.chats.findIndex(c => c.id === String(threadId))
          if (threadIndex > -1) {
            const thread = draft.chats[threadIndex]
            thread.lastMessage = chatMessage.text || chatMessage.messageText || chatMessage.message || 'New message'
            thread.time = new Date(chatMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            if (activeThreadIdRef.current !== String(threadId)) {
              thread.unreadCount = (thread.unreadCount || 0) + 1
            }
            // Move to top
            draft.chats.splice(threadIndex, 1)
            draft.chats.unshift(thread)
          } else {
            // Unknown thread — refetch inbox to show new conversation
            refetchChats()
          }
        })
      )
    })

    newSocket.on('chat:error', (error) => {
      console.error('Chat Socket Error:', error)
    })

    socketRef.current = newSocket

    return () => {
      newSocket.disconnect()
      socketRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  // Join thread room when active thread changes (without recreating socket)
  useEffect(() => {
    const socket = socketRef.current
    if (socket && socket.connected && activeThreadId) {
      socket.emit('chat:join', { threadId: activeThreadId }, (ack) => {
        if (!ack?.ok) console.error('Failed to join room', ack?.message)
      })
    }
  }, [activeThreadId])

  const selectChat = useCallback((threadId) => {
    const socket = socketRef.current
    if (socket && activeThreadIdRef.current) {
      socket.emit('chat:leave', { threadId: activeThreadIdRef.current })
    }
    setActiveThreadId(String(threadId))

    // Clear unread count locally
    dispatch(
      chatApi.util.updateQueryData('getChatThreads', { userId: user?.id }, (draft) => {
        if (!draft?.chats) return
        const thread = draft.chats.find(c => c.id === String(threadId))
        if (thread) {
          thread.unreadCount = 0
        }
      })
    )
  }, [dispatch, user?.id])

  const openThread = useCallback(async (params) => {
    const socket = socketRef.current
    if (!socket) return null
    return new Promise((resolve) => {
      socket.emit('chat:open', params, (response) => {
        if (response?.ok && response?.thread) {
          selectChat(response.thread.id)
          resolve(response.thread.id)
        } else {
          console.error('openThread failed:', response?.message)
          resolve(null)
        }
      })
    })
  }, [selectChat])

  const sendMessage = useCallback((text, attachments = []) => {
    const socket = socketRef.current
    if (!socket || !activeThreadIdRef.current || !text?.trim()) return

    socket.emit('chat:message', {
      threadId: activeThreadIdRef.current,
      message: text,
      attachments,
    })
  }, [])

  return {
    chats: inboxData?.chats || [],
    messages: messagesData || [],
    activeChatId: activeThreadId,
    activeChat: activeThread,
    activePartnerId: activeThreadId,
    isLoading: isLoadingChats || isLoadingMessages,
    isSending: false,
    isPartnerTyping: false,
    actionMessageId: null,
    sharedInbox: false,

    selectChat,
    openThread,
    sendMessage,
    editMessage: async () => {},
    deleteMessage: async () => {},
    handleTyping: () => {
      const socket = socketRef.current
      if (socket && activeThreadIdRef.current) {
        socket.emit('chat:typing', { threadId: activeThreadIdRef.current, isTyping: true })
      }
    },
    stopTyping: () => {
      const socket = socketRef.current
      if (socket && activeThreadIdRef.current) {
        socket.emit('chat:typing', { threadId: activeThreadIdRef.current, isTyping: false })
      }
    },
    createOffer: async () => {},
  }
}
