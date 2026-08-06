import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Seo from '@/components/common/Seo/Seo'
import Messenger from '@/components/common/messenger/Messenger'
import useMessages from '@/components/common/messenger/useMessages'

function resolveMessagingRole(user) {
  if (user?.role === 'customer') return 'customer'
  if (user?.role === 'company') return 'company'
  return 'customer'
}

export default function MessagesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useSelector((state) => state.auth)
  const role = resolveMessagingRole(user)
  const isCompany = role === 'company'

  const state = useMessages()

  useEffect(() => {
    const chatId = searchParams.get('chat')
    if (chatId) {
      state.selectChat(chatId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync inbox from URL once
  }, [searchParams])

  return (
    <div className="w-full bg-[#F9FAFB] py-4 sm:py-6 lg:py-8">
      <Seo
        title={t('messagesPage.seoTitle')}
        description={t('messagesPage.seoDescription')}
      />

      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-[min(720px,calc(100dvh-11rem))] min-h-[420px] w-full">
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
              onCreateOffer={isCompany ? state.createOffer : undefined}
              onPayNow={
                !isCompany
                  ? () => navigate('/checkout')
                  : undefined
              }
              onNegotiate={
                !isCompany
                  ? () => {
                      void state.sendMessage(
                        "I'd like to negotiate the terms of this offer.",
                      )
                    }
                  : undefined
              }
              isPartnerTyping={state.isPartnerTyping}
              isSending={state.isSending}
              isLoading={state.isLoading}
              actionMessageId={state.actionMessageId}
              sharedInbox={state.sharedInbox}
              sidebarTitle={t('messagesPage.sidebarTitle')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
