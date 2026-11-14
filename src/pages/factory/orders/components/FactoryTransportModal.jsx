import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiTruck, FiX } from 'react-icons/fi'
import {
  useChooseFactoryTransportMutation,
  useGetFactoryTransportQuoteQuery,
} from '@/features/factory-orders/factoryOrderApi'
import { getApiErrorMessage } from '@/features/supplier/apiError'
import { appLocale } from '@/i18n/locale'

const FACTORY_VEHICLE_TYPES = ['HEAVY_TRUCK', 'FLATBED', 'TIPPER', 'CRANE_TRUCK', 'VAN']

function formatEuro(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat(appLocale(), { style: 'currency', currency: 'EUR' }).format(
    Number(value) || 0,
  )
}

function ModeOption({ checked, onSelect, title, description }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
        checked
          ? 'border-[var(--active)] bg-[color-mix(in_srgb,var(--active)_6%,white)]'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <input
        type="radio"
        className="mt-1 accent-[var(--active)]"
        checked={checked}
        onChange={onSelect}
      />
      <span>
        <span className="block text-sm font-semibold text-[var(--primary-text)]">{title}</span>
        <span className="mt-0.5 block text-sm text-[var(--secondary-text)]">{description}</span>
      </span>
    </label>
  )
}

export default function FactoryTransportModal({ order, onClose }) {
  const { t } = useTranslation()
  const [mode, setMode] = useState('PLATFORM')
  const [vehicleType, setVehicleType] = useState('HEAVY_TRUCK')
  const [chooseTransport, { isLoading: isSaving }] = useChooseFactoryTransportMutation()
  const { data: quote, isFetching: isQuoting } = useGetFactoryTransportQuoteQuery(
    { orderId: order?.id, vehicleType },
    { skip: !order?.id || mode !== 'PLATFORM' },
  )

  useEffect(() => {
    if (!order) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [order, onClose])

  if (!order) return null

  const preview = quote?.order
  const price = preview?.bidStartFrom

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await chooseTransport({
        id: order.id,
        mode,
        requiredVehicleType: vehicleType,
      }).unwrap()
      toast.success(
        mode === 'PLATFORM'
          ? t('factoryOrders.transport.requestedPlatform')
          : t('factoryOrders.transport.requestedSelf'),
      )
      onClose?.()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t('ui.close')}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="factory-transport-title"
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="factory-transport-title"
            className="flex items-center gap-2 text-lg font-bold text-[var(--primary-text)]"
          >
            <FiTruck className="size-5 text-[var(--active)]" aria-hidden />
            {t('factoryOrders.transport.title', { order: order.orderId })}
          </h2>
          <button
            type="button"
            aria-label={t('ui.close')}
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-full bg-gray-100 text-[var(--secondary-text)] hover:bg-gray-200"
          >
            <FiX className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <ModeOption
              checked={mode === 'PLATFORM'}
              onSelect={() => setMode('PLATFORM')}
              title={t('factoryOrders.transport.platformTitle')}
              description={t('factoryOrders.transport.platformDesc')}
            />
            <ModeOption
              checked={mode === 'SELF'}
              onSelect={() => setMode('SELF')}
              title={t('factoryOrders.transport.selfTitle')}
              description={t('factoryOrders.transport.selfDesc')}
            />
          </div>

          {mode === 'PLATFORM' ? (
            <div className="space-y-3 rounded-xl bg-gray-50 p-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[var(--primary-text)]">
                  {t('factoryOrders.transport.vehicle')}
                </span>
                <select
                  value={vehicleType}
                  onChange={(event) => setVehicleType(event.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
                >
                  {FACTORY_VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`factoryOrders.transport.vehicles.${type}`)}
                    </option>
                  ))}
                </select>
              </label>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-[var(--secondary-text)]">{t('factoryOrders.transport.distance')}</dt>
                <dd className="text-right font-medium text-[var(--primary-text)]">
                  {preview?.distanceKm != null ? `${Number(preview.distanceKm).toFixed(1)} km` : '—'}
                </dd>
                <dt className="text-[var(--secondary-text)]">{t('factoryOrders.transport.price')}</dt>
                <dd className="text-right font-semibold text-[var(--primary-text)]">
                  {isQuoting ? t('ui.loadingEllipsis') : formatEuro(price)}
                </dd>
              </dl>
              <p className="text-xs text-[var(--secondary-text)]">
                {t('factoryOrders.transport.platformNote')}
              </p>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[var(--active)] bg-white text-sm font-semibold text-[var(--active)] transition hover:bg-[#FFFBF5]"
            >
              {t('ui.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSaving || (mode === 'PLATFORM' && (isQuoting || price == null))}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--active)] text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
            >
              {isSaving ? t('ui.saving') : t('factoryOrders.transport.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
