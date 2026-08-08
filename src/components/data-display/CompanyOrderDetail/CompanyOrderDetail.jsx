import { useTranslation } from 'react-i18next'
import {
  FiBox,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
} from 'react-icons/fi'
import StatusBadge from '@/components/data-display/DataTable/StatusBadge'
import BuyerOrderProgress from '@/components/data-display/BuyerOrderProgress/BuyerOrderProgress'
import DriverContactCard from '@/components/data-display/DriverContactCard/DriverContactCard'

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6] text-[var(--secondary-text)]">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <p className="text-xs font-medium text-[var(--secondary-text)]">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-[var(--primary-text)]">
          {value}
        </p>
      </div>
    </div>
  )
}

export default function CompanyOrderDetail({
  order,
  onChatDriver,
  className = '',
}) {
  const { t } = useTranslation()
  if (!order) return null

  const statusLabel =
    order.statusLabel
    ?? t(`companyOrders.status.${order.status}`, order.status)

  return (
    <article
      className={`rounded-xl border border-gray-200 bg-white p-5 sm:p-8 ${className}`}
    >
      <header className="border-b border-gray-100 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold text-[var(--primary-text)] sm:text-xl">
            {order.id}
          </h1>
          <StatusBadge status={order.status} label={statusLabel} />
        </div>
        <p className="mt-3 text-xl font-bold text-[var(--primary-text)] sm:text-2xl">
          {order.productName}
        </p>
        {order.quantityLabel ? (
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {t('companyOrders.quantityLabel', { value: order.quantityLabel })}
          </p>
        ) : null}
      </header>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InfoItem
          icon={FiBox}
          label={t('companyOrders.project')}
          value={order.projectName}
        />
        <InfoItem
          icon={FiMapPin}
          label={t('companyOrders.deliveryLocation')}
          value={order.deliveryLocation}
        />
        <InfoItem
          icon={FiDollarSign}
          label={t('companyOrders.totalPrice')}
          value={order.totalPrice}
        />
        <InfoItem
          icon={FiCalendar}
          label={t('companyOrders.installment')}
          value={order.installmentLabel}
        />
      </div>

      {order.payment ? (
        <div className="mt-6 rounded-lg border-2 border-[var(--active)] bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-[var(--secondary-text)]">
                {t('companyOrders.payNowDownPayment')}
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {order.payment.payNow}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-[var(--secondary-text)]">
                {t('companyOrders.remainingBalance')}
              </p>
              <p className="text-2xl font-bold text-[var(--active)]">
                {order.payment.remaining}
              </p>
            </div>
          </div>
          {order.payment.note ? (
            <p className="mt-4 text-xs text-[var(--secondary-text)]">
              {order.payment.note}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-[var(--secondary-text)]">
            {t('companyOrders.unloadingNeeded')}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--primary-text)]">
            {order.unloadingType}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-[var(--secondary-text)]">
            {t('companyOrders.accessConditions')}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--primary-text)]">
            {order.accessConditions}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <DriverContactCard driver={order.driver} onChat={onChatDriver} />
      </div>

      {order.progressSteps?.length ? (
        <div className="mt-8 border-t border-gray-100 pt-8">
          <BuyerOrderProgress steps={order.progressSteps} />
        </div>
      ) : null}
    </article>
  )
}
