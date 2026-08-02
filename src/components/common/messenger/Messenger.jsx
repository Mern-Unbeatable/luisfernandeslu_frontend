import ChatArea from './ChatArea'
import Sidebar from './Sidebar'

/**
 * Common messenger shell — inbox + conversation.
 * Pass state/handlers from the page (e.g. useMessages()).
 */
export default function Messenger({
  chats = [],
  messages = [],
  activePartnerId = null,
  activeChat = null,
  search = '',
  onSearchChange,
  onSelectChat,
  onSend,
  onEditMessage,
  onDeleteMessage,
  onTyping,
  onStopTyping,
  onCreateOffer,
  onPayNow,
  onNegotiate,
  isPartnerTyping = false,
  isSending = false,
  isLoading = false,
  actionMessageId = null,
  sharedInbox = false,
  sidebarTitle = 'Recent Messages',
  className = '',
}) {
  return (
    <div
      className={`flex h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-[#F8F8F8] ${className}`}
    >
      <div
        className={`w-full shrink-0 md:w-80 lg:w-96 ${
          activePartnerId ? 'hidden md:block' : 'block'
        }`}
      >
        <Sidebar
          chats={chats}
          activeChatId={activePartnerId}
          search={search}
          onSearchChange={undefined}
          onSelectChat={onSelectChat}
          isLoading={isLoading && !chats.length}
          title={sidebarTitle}
          onCompose={onCreateOffer}
        />
      </div>

      <div
        className={`min-w-0 flex-1 ${
          !activePartnerId ? 'hidden md:block' : 'block'
        }`}
      >
        <ChatArea
          activeChat={activeChat}
          messages={messages}
          onBack={() => onSelectChat?.(null)}
          onSendMessage={onSend}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
          onTyping={onTyping}
          onStopTyping={onStopTyping}
          onCreateOffer={onCreateOffer}
          onPayNow={onPayNow}
          onNegotiate={onNegotiate}
          isPartnerTyping={isPartnerTyping}
          isSending={isSending}
          isLoading={isLoading}
          actionMessageId={actionMessageId}
        />
      </div>
    </div>
  )
}
