import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import Messenger from '@/components/common/messenger/Messenger'
import useMessages from '@/components/common/messenger/useMessages'

/** Default thread on load (Ope — matches admin chat mock). */
const DEFAULT_CHAT_ID = 'c2'

export default function ChatPage() {
  const { t } = useTranslation()
  const state = useMessages()

  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      state.selectChat(DEFAULT_CHAT_ID)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open default inbox thread on desktop only
  }, [])

  return (
    <div className="flex min-h-0 flex-col space-y-4">
      <Seo
        title={t('panel.nav.chat')}
        description={t('adminChat.subtitle')}
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t('panel.nav.chat')}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t('adminChat.subtitle')}
        </p>
      </header>

      <div className="h-[min(720px,calc(100dvh-14rem))] min-h-[420px] w-full">
        <Messenger
          className="h-full shadow-sm"
          chats={state.chats}
          messages={state.messages}
          activePartnerId={state.activePartnerId}
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
          sidebarTitle={t('messagesPage.sidebarTitle')}
        />
      </div>
    </div>
  )
}
