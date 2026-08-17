import { FiArrowLeft } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import StandardOrderDetails from './StandardOrderDetails'
import InstallmentOrderDetails from './InstallmentOrderDetails'

/**
 * Common Order Details page.
 *
 * hasInstallment=false → standard UI
 * hasInstallment=true  → installment UI + timeline
 *
 * Pay actions (installment only):
 *   showPay={true}  → Pay Now / Cancel / Not Due on timeline
 *   onPayNow={fn}   → called when Pay Now is clicked
 *
 * @example
 * <OrderDetails order={data} hasInstallment showPay onPayNow={pay} />
 * <OrderDetails order={data} hasInstallment /> // no Pay UI
 */
export default function OrderDetails({
  order = {},
  hasInstallment,
  status,
  onBack,
  onAccept,
  onDownloadInvoice,
  onChat,
  showPay = false,
  onPayNow,
  onCancelInstallment,
  context = 'default',
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
          showPay={showPay}
          onPayNow={onPayNow}
          onCancelInstallment={onCancelInstallment}
          context={context}
        />
      ) : (
        <StandardOrderDetails
          order={merged}
          onAccept={onAccept}
          onDownloadInvoice={onDownloadInvoice}
          onChat={onChat}
        />
      )}
    </div>
  )
}
