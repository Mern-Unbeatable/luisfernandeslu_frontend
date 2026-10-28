import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useOpenSupplierProductChatMutation } from './marketplaceApi'

/** Supplier → "Enviar mensagem" on another supplier's product: opens the chat directly. */
export default function useOpenSupplierProductChat() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [openChat, { isLoading }] = useOpenSupplierProductChatMutation()

  const open = useCallback(
    async (productId) => {
      try {
        const result = await openChat(productId).unwrap()
        const quoteId = result?.quote?.id
        navigate(quoteId ? `/supplier/chat?type=QUOTE&quoteId=${quoteId}` : '/supplier/chat')
      } catch (err) {
        toast.error(err?.data?.message || t('ui.somethingWentWrong'))
      }
    },
    [navigate, openChat, t],
  )

  return { openSupplierProductChat: open, isOpeningChat: isLoading }
}
