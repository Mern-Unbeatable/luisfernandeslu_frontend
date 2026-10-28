import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAdminSelfDeliveriesQuery } from '@/features/supplier/deliveries/deliveriesApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import { appLocale } from '@/i18n/locale'

const I18N_KEY = 'adminDeliveryLogistics.selfDeliveries'

function formatDateTime(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString(appLocale(), {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function formatEuro(value) {
  return new Intl.NumberFormat(appLocale(), {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value) || 0)
}

function StatusBadge({ delivery }) {
  const { t } = useTranslation()
  const delivered = Boolean(delivery.deliveredAt) || delivery.orderStatus === 'DELIVERED'
  let tone = 'bg-blue-100 text-blue-700'
  let label = t(`${I18N_KEY}.inProgress`)
  if (delivered && delivery.isLate) {
    tone = 'bg-red-100 text-red-700'
    label = t(`${I18N_KEY}.deliveredLate`)
  } else if (delivered) {
    tone = 'bg-green-100 text-green-700'
    label = t(`${I18N_KEY}.delivered`)
  } else if (delivery.isLate) {
    tone = 'bg-red-100 text-red-700'
    label = t(`${I18N_KEY}.late`)
  }
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {label}
    </span>
  )
}

export default function AdminSelfDeliveriesSection() {
  const { t } = useTranslation()
  const [lateOnly, setLateOnly] = useState(false)
  const { data = [], isLoading, isError, error } = useGetAdminSelfDeliveriesQuery(
    { late: lateOnly },
    { pollingInterval: 60000 },
  )

  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--primary-text)]">
            {t(`${I18N_KEY}.title`)}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
            {t(`${I18N_KEY}.subtitle`)}
          </p>
        </div>
        <label className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[var(--secondary-text)]">
          <input
            type="checkbox"
            checked={lateOnly}
            onChange={(event) => setLateOnly(event.target.checked)}
            className="size-4 accent-[var(--active)]"
          />
          {t(`${I18N_KEY}.lateOnly`)}
        </label>
      </div>

      {isError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {getAuthErrorMessage(error, t('adminDeliveryLogistics.loadFailed'))}
        </p>
      ) : isLoading ? null : data.length === 0 ? (
        <p className="py-6 text-center text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.empty`)}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase text-[var(--secondary-text)]">
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-4 font-semibold">{t(`${I18N_KEY}.order`)}</th>
                <th className="py-2 pr-4 font-semibold">{t(`${I18N_KEY}.supplier`)}</th>
                <th className="py-2 pr-4 font-semibold">{t(`${I18N_KEY}.customer`)}</th>
                <th className="py-2 pr-4 font-semibold">{t(`${I18N_KEY}.deadline`)}</th>
                <th className="py-2 pr-4 font-semibold">{t(`${I18N_KEY}.deliveredAt`)}</th>
                <th className="py-2 pr-4 font-semibold">{t(`${I18N_KEY}.payout`)}</th>
                <th className="py-2 font-semibold">{t(`${I18N_KEY}.status`)}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((delivery) => (
                <tr key={delivery.orderId} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 pr-4 font-semibold text-[var(--primary-text)]">
                    {delivery.orderNumber}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-[var(--primary-text)]">{delivery.supplier?.name || '—'}</div>
                    {delivery.supplier?.email ? (
                      <div className="text-xs text-[var(--secondary-text)]">{delivery.supplier.email}</div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-[var(--primary-text)]">{delivery.customer?.name || '—'}</div>
                    {delivery.deliveryAddress ? (
                      <div className="text-xs text-[var(--secondary-text)]">{delivery.deliveryAddress}</div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4">{formatDateTime(delivery.selfDeliveryDeadline)}</td>
                  <td className="py-3 pr-4">{formatDateTime(delivery.deliveredAt)}</td>
                  <td className="py-3 pr-4">{formatEuro(delivery.selfDeliveryPayout)}</td>
                  <td className="py-3">
                    <StatusBadge delivery={delivery} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
