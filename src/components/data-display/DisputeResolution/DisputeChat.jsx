import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Messenger from '@/components/common/messenger/Messenger'
import useLiveChat from '@/features/chat/useLiveChat'

/**
 * DisputeChat — group live chat panel without sidebar.
 * Allows admin, supplier, and buyer to participate in a group chat
 * to resolve a dispute about an order/product.
 * Pass `disputeId` to open/create the thread automatically.
 * Full-width chat panel — no sidebar on md+ screens.
 */
export default function DisputeChat({ disputeId }) {
  const { user } = useSelector((state) => state.auth)
  const state = useLiveChat()
  const openedRef = useRef(false)

  useEffect(() => {
    if (!disputeId || openedRef.current) return
    openedRef.current = true
    state.openThread({ type: 'DISPUTE', disputeId })
  }, [disputeId, state.openThread])

  // Use the current user's ID as activePartnerId to hide sidebar on md+ screens
  // while keeping the chat panel visible. The Messenger component logic:
  // - activePartnerId truthy → sidebar hidden on md+ screens, chat visible
  // - activePartnerId falsy → sidebar visible on all screens
  const partnerId = user?.id || 'dispute-chat'

  return (
    <div className="h-[min(520px,calc(100dvh-16rem))] min-h-[360px] w-full rounded-xl shadow-sm p-4 bg-white">
      <Messenger
        className="h-full bg-white overflow-y-auto"
        chats={state.chats}
        messages={state.messages}
        activePartnerId={partnerId}
        activeChat={state.activeChat}
        onSelectChat={state.selectChat}
        onSend={state.sendMessage}
        onEditMessage={state.editMessage}
        onDeleteMessage={state.deleteMessage}
        onTyping={state.handleTyping}
        onStopTyping={state.stopTyping}
        isPartnerTyping={state.isPartnerTyping}
        isSending={state.isSending}
        isLoading={state.isLoading}
        actionMessageId={state.actionMessageId}
        sharedInbox={state.sharedInbox}
        sidebarTitle="Dispute Resolution Chat"
      />
    </div>
  )
}