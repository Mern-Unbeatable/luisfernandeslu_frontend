import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Seo from '@/components/common/Seo/Seo'
import Messenger from '@/components/common/messenger/Messenger'
import useLiveChat from '@/features/chat/useLiveChat'
import { resolveStorefrontBuyerRole } from '@/features/auth/resolveStorefrontBuyerRole'
import { usePaySupplierQuoteOfferMutation } from '@/features/supplier/quotes/quotesApi'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useSelector((state) => state.auth)
  const role = resolveStorefrontBuyerRole(user)
  const isCompany = role === 'company'

  const state = useLiveChat()

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    if (params.type || params.chat) {
      state.openThread({
        chatId: params.chat,
        type: params.type,
        quoteId: params.quoteId,
        orderId: params.orderId,
        productId: params.productId,
        peerUserId: params.peerUserId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const [payOffer, { isLoading: isPaying }] = usePaySupplierQuoteOfferMutation()

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
              onPayNow={(msg) => {
                const quoteId = state.activeChat?.raw?.quoteRequestId || state.activeChat?.id
                const stateNav = { directBuy: { offerId: msg?.offer?.id, offer: msg?.offer, quoteId } }
                if (isCompany) {
                  navigate('/checkout/company', { state: stateNav })
                } else {
                  navigate('/checkout', { state: stateNav })
                }
              }}
              onNegotiate={() => {
                void state.sendMessage(
                  "I'd like to negotiate the terms of this offer.",
                )
              }}
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
