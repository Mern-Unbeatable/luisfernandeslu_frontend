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
 * <OrderDetails order={data} hasInstallment={false} />
 * <OrderDetails order={data} hasInstallment status="assigned" />
 */
export default function OrderDetails({
  order = {},
  hasInstallment,
  status,
  onDownloadInvoice,
  onChat,
  onPayNow,
  onCancelInstallment,
  className = '',
}) {
  const resolvedHasInstallment =
    hasInstallment ?? order.hasInstallment ?? false

  const merged = {
    ...order,
    status: status || order.status,
    hasInstallment: resolvedHasInstallment,
  }

  return (
    <div className={`mx-auto w-full ${className}`}>
      {resolvedHasInstallment ? (
        <InstallmentOrderDetails
          order={merged}
          onChat={onChat}
          onPayNow={onPayNow}
          onCancelInstallment={onCancelInstallment}
        />
      ) : (
        <StandardOrderDetails
          order={merged}
          onDownloadInvoice={onDownloadInvoice}
        />
      )}
    </div>
  )
}
