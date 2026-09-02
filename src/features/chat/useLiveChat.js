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
  const [isPartnerTyping, setIsPartnerTyping] = useState(false)
  // Use ref so socket never causes re-renders or recreation from other state changes
  const socketRef = useRef(null)
  const activeThreadIdRef = useRef(activeThreadId)
  const typingTimerRef = useRef(null)
  const userIdRef = useRef(user?.id)

  // Keep ref in sync with state
  useEffect(() => {
    activeThreadIdRef.current = activeThreadId
  }, [activeThreadId])

  useEffect(() => {
    userIdRef.current = user?.id
  }, [user?.id])

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

    newSocket.on('connect_error', (err) => {
      console.error('Chat socket connect error:', err)
    })

    // Listen for presence updates
    newSocket.on('user:presence', (payload) => {
      const { userId, status } = payload
      dispatch(
        chatApi.util.updateQueryData('getChatThreads', { userId: userIdRef.current }, (draft) => {
          if (!draft?.chats) return
          draft.chats.forEach(chat => {
            // Find partner in chat participants (mapped by backend)
            const isPartner = chat.raw?.participants?.some(p => p.id === userId && p.id !== userIdRef.current)
            if (isPartner) {
              chat.online = status === 'online'
            }
          })
        })
      )
    })

    newSocket.on('chat:message', (payload) => {
      const { threadId, chatMessage } = payload

      // Update RTK Query cache manually for messages
      if (threadId) {
        dispatch(
          chatApi.util.updateQueryData('getChatMessages', { threadId, userId: userIdRef.current }, (draft) => {
            // Avoid duplicate messages
            const alreadyExists = draft.some((m) => String(m.id) === String(chatMessage.id))
            if (alreadyExists) return

            const mapped = {
              id: String(chatMessage.id),
              text: chatMessage.text || chatMessage.messageText || chatMessage.message || '',
              sender: chatMessage.senderId === userIdRef.current ? 'me' : 'them',
              senderId: chatMessage.senderId,
              time: new Date(chatMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: String(chatMessage.messageType || chatMessage.type || 'text').toLowerCase(),
              offer: chatMessage.offer,
              raw: chatMessage,
            }
            draft.push(mapped)
          })
        )
      }

      // Update thread list (move to top with last message preview)
      dispatch(
        chatApi.util.updateQueryData('getChatThreads', { userId: userIdRef.current }, (draft) => {
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

    // Handle message edit from server
    newSocket.on('chat:edited', (payload) => {
      console.log('Received chat:edited', payload, 'User ID in closure:', userIdRef.current)
      const { threadId, chatMessage } = payload
      if (!threadId || !chatMessage) return
      
      // Update messages cache
      dispatch(
        chatApi.util.updateQueryData('getChatMessages', { threadId, userId: userIdRef.current }, (draft) => {
          console.log('chat:edited updating draft. Current messages:', draft.length)
          const idx = draft.findIndex((m) => String(m.id) === String(chatMessage.id))
          if (idx !== -1) {
            draft[idx] = {
              ...draft[idx],
              text: chatMessage.messageText || '',
              editedAt: chatMessage.editedAt,
              raw: chatMessage,
            }
            console.log('chat:edited updated message successfully', draft[idx])
          } else {
            console.warn('chat:edited: Message not found in draft', chatMessage.id)
          }
        })
      )

      // Update thread list
      dispatch(
        chatApi.util.updateQueryData('getChatThreads', { userId: userIdRef.current }, (draft) => {
          if (!draft?.chats) return
          const thread = draft.chats.find(c => c.id === String(threadId))
          if (thread) {
            thread.lastMessage = chatMessage.messageText || 'New message'
          }
        })
      )
    })

    // Handle message delete from server
    newSocket.on('chat:deleted', (payload) => {
      console.log('Received chat:deleted', payload, 'User ID in closure:', userIdRef.current)
      const { threadId, messageId } = payload
      if (!threadId || !messageId) return

      // Update messages cache
      dispatch(
        chatApi.util.updateQueryData('getChatMessages', { threadId, userId: userIdRef.current }, (draft) => {
          const idx = draft.findIndex((m) => String(m.id) === String(messageId))
          if (idx !== -1) {
            draft[idx] = {
              ...draft[idx],
              text: 'This message was deleted',
              isDeleted: true,
            }
          }
        })
      )

      // Update thread list
      dispatch(
        chatApi.util.updateQueryData('getChatThreads', { userId: userIdRef.current }, (draft) => {
          if (!draft?.chats) return
          const thread = draft.chats.find(c => c.id === String(threadId))
          if (thread) {
            // We assume it might be the last message.
            thread.lastMessage = 'This message was deleted'
          }
        })
      )
    })


    // Handle typing indicator from other user
    newSocket.on('chat:typing', (payload) => {
      // Only show typing if it's for the currently active thread and not from ourselves
      if (
        String(payload.threadId) === String(activeThreadIdRef.current) &&
        payload.userId !== user?.id
      ) {
        if (payload.isTyping) {
          setIsPartnerTyping(true)
          // Auto-clear typing after 3 seconds (in case stop event is missed)
          clearTimeout(typingTimerRef.current)
          typingTimerRef.current = setTimeout(() => setIsPartnerTyping(false), 3000)
        } else {
          clearTimeout(typingTimerRef.current)
          setIsPartnerTyping(false)
        }
      }
    })

    newSocket.on('chat:error', (error) => {
      console.error('Chat Socket Error:', error)
    })

    socketRef.current = newSocket

    return () => {
      newSocket.disconnect()
      socketRef.current = null
      clearTimeout(typingTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  // Helper: emit to socket, waiting for connect if needed
  const safeJoin = useCallback((threadId) => {
    const socket = socketRef.current
    if (!socket) return
    const doJoin = () => {
      socket.emit('chat:join', { threadId }, (ack) => {
        if (!ack?.ok) console.error('Failed to join room', ack?.message)
      })
    }
    if (socket.connected) {
      doJoin()
    } else {
      socket.once('connect', doJoin)
    }
  }, [])

  // Join thread room when active thread changes (without recreating socket)
  useEffect(() => {
    if (activeThreadId) safeJoin(activeThreadId)
    // Clear typing indicator when switching threads
    setIsPartnerTyping(false)
  }, [activeThreadId, safeJoin])

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

  const editMessage = useCallback(async (messageId, text) => {
    const socket = socketRef.current
    if (!socket || !messageId || !text?.trim()) return false

    // Optimistic local cache update immediately
    const threadId = activeThreadIdRef.current
    if (threadId) {
      dispatch(
        chatApi.util.updateQueryData('getChatMessages', { threadId, userId: userIdRef.current }, (draft) => {
          const idx = draft.findIndex((m) => String(m.id) === String(messageId))
          if (idx !== -1) {
            draft[idx] = { ...draft[idx], text, editedAt: new Date().toISOString() }
          }
        })
      )
    }

    // Fire-and-forget to server (with 5s timeout)
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(true), 5000)
      socket.emit('chat:edit', { messageId, text }, (ack) => {
        clearTimeout(timer)
        if (!ack?.ok) console.error('Failed to edit message:', ack?.message)
        resolve(true) // always resolve — UI already updated optimistically
      })
    })
  }, [dispatch])

  const deleteMessage = useCallback(async (messageId) => {
    const socket = socketRef.current
    if (!socket || !messageId) return false

    // Optimistic local cache update immediately
    const threadId = activeThreadIdRef.current
    if (threadId) {
      dispatch(
        chatApi.util.updateQueryData('getChatMessages', { threadId, userId: userIdRef.current }, (draft) => {
          const idx = draft.findIndex((m) => String(m.id) === String(messageId))
          if (idx !== -1) {
            draft[idx] = { ...draft[idx], text: 'This message was deleted', isDeleted: true }
          }
        })
      )
    }

    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(true), 5000)
      socket.emit('chat:delete', { messageId }, (ack) => {
        clearTimeout(timer)
        if (!ack?.ok) console.error('Failed to delete message:', ack?.message)
        resolve(true)
      })
    })
  }, [dispatch, user?.id])

  return {
    chats: inboxData?.chats || [],
    messages: messagesData || [],
    activeChatId: activeThreadId,
    activeChat: activeThread,
    activePartnerId: activeThreadId,
    isLoading: isLoadingChats || isLoadingMessages,
    isSending: false,
    isPartnerTyping,
    actionMessageId: null,
    sharedInbox: false,

    selectChat,
    openThread,
    sendMessage,
    editMessage,
    deleteMessage,
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
