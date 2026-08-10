import { useTranslation } from 'react-i18next'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'
import BuyerOrderProgress from '@/components/data-display/BuyerOrderProgress/BuyerOrderProgress'
import DriverContactCard from '@/components/data-display/DriverContactCard/DriverContactCard'

const panelClass = 'rounded-lg bg-[#F3F4F6] p-5 sm:p-6'

/**
 * Buyer order detail — shipping, line items, driver, delivery progress.
 */
export default function BuyerOrderInformation({
  order,
  onChatDriver,
  className = '',
}) {
  const { t } = useTranslation()

  if (!order) return null

  const statusLabel =
    order.statusLabel
    ?? t(`buyerOrders.status.${order.status}`, order.status)

  return (
    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8 ${className}`}>
      <div className="min-w-0 space-y-6">
        <header>
          <h1 className="text-xl font-bold text-[var(--primary-text)] sm:text-2xl">
            {t('buyerOrderDetail.title', { number: order.orderNumber })}
          </h1>
          <div className="mt-2">
            <StatusBadge status={order.status} label={statusLabel} />
          </div>
        </header>

        <section className={panelClass}>
          <h2 className="text-base font-bold text-[var(--primary-text)]">
            {t('buyerOrderDetail.shippingAddress')}
          </h2>
          <div className="mt-3 space-y-1 text-sm leading-relaxed text-[var(--secondary-text)]">
            {order.shippingAddress?.name ? (
              <p className="font-medium text-[var(--primary-text)]">
                {order.shippingAddress.name}
              </p>
            ) : null}
            {order.shippingAddress?.lines?.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {order.shippingAddress?.phone ? (
              <p className="pt-1">{order.shippingAddress.phone}</p>
            ) : null}
          </div>
        </section>

        <section className={panelClass}>
          <h2 className="text-base font-bold text-[var(--primary-text)]">
            {t('buyerOrderDetail.products')}
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[280px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300 text-[var(--secondary-text)]">
                  <th className="pb-3 pr-4 font-medium">
                    {t('buyerOrderDetail.productName')}
                  </th>
                  <th className="pb-3 pr-4 font-medium">
                    {t('buyerOrderDetail.quantity')}
                  </th>
                  <th className="pb-3 font-medium text-right">
                    {t('buyerOrderDetail.price')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.lineItems?.map((row) => (
                  <tr
                    key={`${row.name}-${row.quantity}`}
                    className="border-b border-gray-200 last:border-0"
                  >
                    <td className="py-3 pr-4 text-[var(--primary-text)]">
                      {row.name}
                    </td>
                    <td className="py-3 pr-4 text-[var(--secondary-text)]">
                      {row.quantity}
                    </td>
                    <td className="py-3 text-right font-medium text-[var(--primary-text)]">
                      {row.price}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={2}
                    className="pt-4 text-base font-bold text-[var(--primary-text)]"
                  >
                    {t('buyerOrderDetail.total')}
                  </td>
                  <td className="pt-4 text-right text-lg font-bold text-[var(--primary-text)]">
                    {order.totalDisplay}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>

      <aside className="flex flex-col gap-4">
        <DriverContactCard driver={order.driver} onChat={onChatDriver} />

        {order.progressSteps?.length ? (
          <div className={`${panelClass} lg:bg-[#F3F4F6]`}>
            <BuyerOrderProgress steps={order.progressSteps} />
          </div>
        ) : null}
      </aside>
    </div>
  )
}
