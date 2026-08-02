import Messenger from '../components/common/messenger/Messenger'
import useMessages from '../components/common/messenger/useMessages'

export default function MessagePage() {
  const {
    chats,
    messages,
    activePartnerId,
    activeChat,
    search,
    setSearch,
    selectChat,
    sendMessage,
    editMessage,
    deleteMessage,
    handleTyping,
    stopTyping,
    isPartnerTyping,
    isSending,
    actionMessageId,
    isLoading,
    sharedInbox,
  } = useMessages()

  return (
    <section className="w-full bg-gray-100 px-3 py-4 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto h-[calc(100vh-8rem)] w-full max-w-[1440px] min-h-[520px]">
        <Messenger
          chats={chats}
          messages={messages}
          activePartnerId={activePartnerId}
          activeChat={activeChat}
          search={search}
          onSearchChange={setSearch}
          onSelectChat={selectChat}
          onSend={sendMessage}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
          onTyping={handleTyping}
          onStopTyping={stopTyping}
          onCreateOffer={() => console.log('Create offer')}
          onPayNow={(message) => console.log('Pay now', message)}
          onNegotiate={(message) => console.log('Negotiate', message)}
          isPartnerTyping={isPartnerTyping}
          isSending={isSending}
          isLoading={isLoading}
          actionMessageId={actionMessageId}
          sharedInbox={sharedInbox}
          sidebarTitle="Recent Messages"
        />
      </div>
    </section>
  )
}
