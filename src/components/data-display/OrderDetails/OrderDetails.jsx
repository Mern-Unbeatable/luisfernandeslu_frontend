import { FiArrowLeft } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import StandardOrderDetails from './StandardOrderDetails'
import InstallmentOrderDetails from './InstallmentOrderDetails'

/**
 * Common Order Details page.
 *
 * hasInstallment=false → standard UI (images 1–3)
 *   status: pending | assigned | cancel
 *   assigned/cancel → transporter info shown
 *
 * hasInstallment=true → installment UI (images 4–5)
 *   status: new | pending | processing | assigned | paid
 *   assigned → transporter banner + chat
 *
 * @example
 * <OrderDetails order={data} hasInstallment={false} onBack={fn} />
 * <OrderDetails order={data} hasInstallment status="assigned" onBack={fn} />
 */
export default function OrderDetails({
  order = {},
  hasInstallment,
  status,
  onBack,
  onAccept,
  onDownloadInvoice,
  onChat,
  onPayNow,
  onCancelInstallment,
  className = '',
}) {
  const { t } = useTranslation()
  const resolvedHasInstallment =
    hasInstallment ?? order.hasInstallment ?? false

  const merged = {
    ...order,
    status: status || order.status,
    hasInstallment: resolvedHasInstallment,
  }

  return (
    <div className={`mx-auto w-full ${className}`}>
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] transition-colors hover:text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" strokeWidth={2} aria-hidden />
          {t('order.details.back')}
        </button>
      ) : null}

      {resolvedHasInstallment ? (
        <InstallmentOrderDetails
          order={merged}
          onAccept={onAccept}
          onChat={onChat}
          onPayNow={onPayNow}
          onCancelInstallment={onCancelInstallment}
        />
      ) : (
        <StandardOrderDetails
          order={merged}
          onAccept={onAccept}
          onDownloadInvoice={onDownloadInvoice}
        />
      )}
    </div>
  )
}
