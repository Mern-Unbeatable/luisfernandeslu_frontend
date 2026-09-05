import { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'

/**
 * useDisputeChat — dedicated real-time hook for dispute communication.
 * Handles connecting to `dispute:<disputeId>` room via socket,
 * receiving live messages from admin, supplier, and buyer,
 * sending new messages, and syncing dispute status changes in real-time.
 */
export default function useDisputeChat({
  disputeId,
  initialMessages = [],
  initialStatus = 'under_review',
  onStatusUpdated,
}) {
  const { accessToken, user } = useSelector((state) => state.auth)
  const [messages, setMessages] = useState(initialMessages)
  const [status, setStatus] = useState(initialStatus)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef(null)

  // Sync initial messages/status if dispute is loaded asynchronously
  useEffect(() => {
    if (initialMessages?.length > 0) {
      setMessages((prev) => {
        if (prev.length === 0) return initialMessages
        const existingIds = new Set(prev.map((m) => String(m.id)))
        const incomingNew = initialMessages.filter((m) => !existingIds.has(String(m.id)))
        return incomingNew.length > 0 ? [...prev, ...incomingNew] : prev
      })
    }
  }, [initialMessages])

  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus)
    }
  }, [initialStatus])

  useEffect(() => {
    if (!disputeId) return

    const token = accessToken || localStorage.getItem('accessToken') || ''

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      socket.emit('dispute:join', { disputeId }, (ack) => {
        if (ack?.ok && Array.isArray(ack.messages) && ack.messages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => String(m.id)))
            const missing = ack.messages.filter((m) => !existingIds.has(String(m.id)))
            return missing.length > 0 ? [...prev, ...missing] : prev
          })
        }
      })
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('dispute:message', (payload) => {
      if (payload?.disputeId === disputeId && payload?.message) {
        setMessages((prev) => {
          const exists = prev.some((m) => String(m.id) === String(payload.message.id))
          if (exists) return prev
          return [...prev, payload.message]
        })
      }
    })

    socket.on('dispute:status', (payload) => {
      if (payload?.disputeId === disputeId && payload?.status) {
        setStatus(payload.status)
        onStatusUpdated?.(payload.status)
      }
    })

    return () => {
      socket.emit('dispute:leave', { disputeId })
      socket.disconnect()
      socketRef.current = null
    }
  }, [disputeId, accessToken, onStatusUpdated])

  const sendMessage = useCallback(
    (text, attachments = []) => {
      if (!text?.trim() && (!attachments || attachments.length === 0)) return

      const socket = socketRef.current
      const trimmedText = (text || '').trim()

      if (socket && socket.connected) {
        socket.emit(
          'dispute:message',
          {
            disputeId,
            text: trimmedText,
            attachments,
          },
          (ack) => {
            if (ack?.ok && ack.message) {
              setMessages((prev) => {
                const exists = prev.some((m) => String(m.id) === String(ack.message.id))
                if (exists) return prev
                return [...prev, ack.message]
              })
            }
          }
        )
      } else {
        // Fallback optimistic message if socket temporarily disconnected
        const role = user?.role || 'buyer'
        const isBuyerRole = role === 'customer' || role === 'company' || role === 'buyer'
        const isSupplierRole = role === 'supplier' || role === 'seller'
        const fallbackMsg = {
          id: `local-${Date.now()}`,
          disputeId,
          senderId: user?.id || 'me',
          author: user?.name || (isBuyerRole ? 'Buyer' : isSupplierRole ? 'Seller' : 'Admin'),
          roleLabel: isBuyerRole ? 'Buyer' : isSupplierRole ? 'Seller' : 'Admin',
          role: isBuyerRole ? 'buyer' : isSupplierRole ? 'supplier' : 'admin',
          align: isBuyerRole ? 'right' : 'left',
          at: new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }).format(new Date()),
          text: trimmedText,
          attachments,
        }
        setMessages((prev) => [...prev, fallbackMsg])
      }
    },
    [disputeId, user]
  )

  return {
    messages,
    status,
    setStatus,
    isConnected,
    sendMessage,
  }
}
