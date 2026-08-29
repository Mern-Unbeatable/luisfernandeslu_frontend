import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiArrowRight, FiFileText, FiSettings } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import {
  useGetAdminSettingsQuery,
  useResetAdminSettingsAuctionMutation,
  useResetAdminSettingsShippingMutation,
  useResetAdminSettingsVatMutation,
  useUpdateAdminSettingsAuctionMutation,
  useUpdateAdminSettingsShippingMutation,
  useUpdateAdminSettingsVatMutation,
} from '@/features/admin/adminSettingsApi'
import {
  mapAdminSettings,
  toAdminSettingsShippingPayload,
  vehicleRatesEqual,
} from '@/features/admin/adminSettingsMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import SettingsConfigCard from './components/SettingsConfigCard'
import SettingsResultPanel from './components/SettingsResultPanel'
import {
  ADMIN_SETTINGS_DEFAULTS,
  formatUsd,
  parseMoneyInput,
} from './data/settingsAdminDemo'

const I18N_KEY = 'adminSettings'

function SettingsSection({ title, description, children }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[var(--primary-text)] sm:text-xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        {children}
      </div>
    </section>
  )
}

function FieldLabel({ children }) {
  return (
    <span className="text-xs font-semibold tracking-wide text-[var(--secondary-text)] uppercase">
      {children}
    </span>
  )
}

function cloneVehicleRates(rates) {
  return rates.map((rate) => ({ ...rate }))
}

export default function SettingsPage() {
  const { t } = useTranslation()

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminSettingsQuery()

  const [updateShipping, { isLoading: isSavingShipping }] =
    useUpdateAdminSettingsShippingMutation()
  const [resetShipping, { isLoading: isResettingShipping }] =
    useResetAdminSettingsShippingMutation()
  const [updateVat, { isLoading: isSavingVat }] =
    useUpdateAdminSettingsVatMutation()
  const [resetVat, { isLoading: isResettingVat }] =
    useResetAdminSettingsVatMutation()
  const [updateAuction, { isLoading: isSavingAuction }] =
    useUpdateAdminSettingsAuctionMutation()
  const [resetAuction, { isLoading: isResettingAuction }] =
    useResetAdminSettingsAuctionMutation()

  const mappedSettings = useMemo(() => mapAdminSettings(data), [data])

  const [vehicleRatesSaved, setVehicleRatesSaved] = useState([])
  const [vehicleRatesDraft, setVehicleRatesDraft] = useState([])
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [shipDistance, setShipDistance] = useState(
    ADMIN_SETTINGS_DEFAULTS.shippingCalculator.distanceKm,
  )
  const [shipResult, setShipResult] = useState(null)

  const [vatSaved, setVatSaved] = useState('0')
  const [vatDraft, setVatDraft] = useState('0%')
  const [vatPrice, setVatPrice] = useState(
    ADMIN_SETTINGS_DEFAULTS.vatCalculator.productPrice,
  )
  const [vatResult, setVatResult] = useState(null)

  const [auctionSaved, setAuctionSaved] = useState({ hours: '0', minutes: '0' })
  const [auctionDraft, setAuctionDraft] = useState({ hours: '0', minutes: '0' })

  useEffect(() => {
    if (!mappedSettings) return

    const rates = cloneVehicleRates(mappedSettings.vehicleRates)
    setVehicleRatesSaved(rates)
    setVehicleRatesDraft(cloneVehicleRates(rates))
    setSelectedVehicleId((current) =>
      rates.some((rate) => rate.id === current)
        ? current
        : rates[0]?.id ?? '',
    )

    const vatRate = String(mappedSettings.vatDefaultRate)
    setVatSaved(vatRate)
    setVatDraft(`${vatRate}%`)

    const auction = {
      hours: String(mappedSettings.auction.hours),
      minutes: String(mappedSettings.auction.minutes),
    }
    setAuctionSaved(auction)
    setAuctionDraft({ ...auction })
  }, [mappedSettings])

  const shippingUnsaved = useMemo(
    () => !vehicleRatesEqual(vehicleRatesDraft, vehicleRatesSaved),
    [vehicleRatesDraft, vehicleRatesSaved],
  )

  const vatUnsaved = useMemo(() => {
    const numeric = parseMoneyInput(vatDraft)
    return String(numeric) !== String(vatSaved)
  }, [vatDraft, vatSaved])

  const auctionUnsaved = useMemo(
    () =>
      auctionDraft.hours !== auctionSaved.hours ||
      auctionDraft.minutes !== auctionSaved.minutes,
    [auctionDraft, auctionSaved],
  )

  const selectedVehicleRate = useMemo(
    () =>
      vehicleRatesDraft.find((rate) => rate.id === selectedVehicleId) ??
      vehicleRatesDraft[0] ??
      null,
    [vehicleRatesDraft, selectedVehicleId],
  )

  const showInitialLoading = isLoading && !data
  const isShippingBusy = isSavingShipping || isResettingShipping
  const isVatBusy = isSavingVat || isResettingVat
  const isAuctionBusy = isSavingAuction || isResettingAuction

  const handleVehicleRateChange = (id, value) => {
    setVehicleRatesDraft((prev) =>
      prev.map((rate) =>
        rate.id === id
          ? { ...rate, perKmCharge: parseMoneyInput(value) }
          : rate,
      ),
    )
  }

  const handleShippingSave = async () => {
    try {
      const result = await updateShipping(
        toAdminSettingsShippingPayload(vehicleRatesDraft),
      ).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.saveFailed`)))
        return
      }

      toast.success(result?.message || t(`${I18N_KEY}.saveSuccess`))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.saveFailed`)))
    }
  }

  const handleShippingReset = async () => {
    try {
      const result = await resetShipping().unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.resetFailed`)))
        return
      }

      toast.success(result?.message || t(`${I18N_KEY}.resetSuccess`))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.resetFailed`)))
    }
  }

  const handleShippingCalculate = () => {
    const distance = parseMoneyInput(shipDistance)
    const rate = Number(selectedVehicleRate?.perKmCharge) || 0
    setShipResult({ distance, rate, total: distance * rate })
  }

  const handleVatSave = async () => {
    try {
      const result = await updateVat({
        defaultRate: parseMoneyInput(vatDraft),
      }).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.saveFailed`)))
        return
      }

      toast.success(result?.message || t(`${I18N_KEY}.saveSuccess`))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.saveFailed`)))
    }
  }

  const handleVatReset = async () => {
    try {
      const result = await resetVat().unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.resetFailed`)))
        return
      }

      toast.success(result?.message || t(`${I18N_KEY}.resetSuccess`))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.resetFailed`)))
    }
  }

  const handleVatCalculate = () => {
    const price = parseMoneyInput(vatPrice)
    const rate = parseMoneyInput(vatSaved)
    const vatAmount = (price * rate) / 100
    setVatResult({ price, rate, vatAmount, total: price + vatAmount })
  }

  const handleAuctionSave = async () => {
    try {
      const result = await updateAuction({
        hours: Number.parseInt(auctionDraft.hours, 10) || 0,
        minutes: Number.parseInt(auctionDraft.minutes, 10) || 0,
      }).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.saveFailed`)))
        return
      }

      toast.success(result?.message || t(`${I18N_KEY}.saveSuccess`))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.saveFailed`)))
    }
  }

  const handleAuctionReset = async () => {
    try {
      const result = await resetAuction().unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.resetFailed`)))
        return
      }

      toast.success(result?.message || t(`${I18N_KEY}.resetSuccess`))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.resetFailed`)))
    }
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <Seo
        title={t(`${I18N_KEY}.title`)}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t(`${I18N_KEY}.title`)}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t(`${I18N_KEY}.subtitle`)}
        </p>
      </header>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, t(`${I18N_KEY}.loadFailed`))}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t(`${I18N_KEY}.retry`)}
          </button>
        </div>
      ) : null}

      <div
        className={
          isFetching && data ? 'space-y-10 opacity-60 transition-opacity sm:space-y-12' : 'space-y-10 sm:space-y-12'
        }
      >
        <SettingsSection
          title={t(`${I18N_KEY}.shipping.title`)}
          description={t(`${I18N_KEY}.shipping.description`)}
        >
          <SettingsConfigCard
            icon={FiSettings}
            title={t(`${I18N_KEY}.shipping.vehicleRatesTitle`)}
            unsaved={shippingUnsaved}
            unsavedLabel={t(`${I18N_KEY}.unsaved`)}
            saveLabel={t(`${I18N_KEY}.saveChange`)}
            resetLabel={t(`${I18N_KEY}.reset`)}
            onSave={handleShippingSave}
            onReset={handleShippingReset}
            actionsDisabled={isShippingBusy || showInitialLoading}
          >
            {showInitialLoading ? (
              <p className="text-sm text-[var(--secondary-text)]">
                {t(`${I18N_KEY}.loading`)}
              </p>
            ) : (
              <div className="space-y-4">
                {vehicleRatesDraft.map((rate) => (
                  <label key={rate.id} className="block">
                    <FieldLabel>{rate.vehicle}</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={rate.perKmCharge}
                      onChange={(e) =>
                        handleVehicleRateChange(rate.id, e.target.value)
                      }
                      disabled={isShippingBusy}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>
                ))}
              </div>
            )}
          </SettingsConfigCard>

          <SettingsConfigCard
            icon={FiFileText}
            title={t(`${I18N_KEY}.shipping.calculatorTitle`)}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>{t(`${I18N_KEY}.shipping.distanceLabel`)}</FieldLabel>
                <input
                  type="text"
                  value={shipDistance}
                  onChange={(e) => setShipDistance(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
                />
              </label>
              <label className="block">
                <FieldLabel>{t(`${I18N_KEY}.shipping.vehicleLabel`)}</FieldLabel>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  disabled={vehicleRatesDraft.length === 0}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {vehicleRatesDraft.map((rate) => (
                    <option key={rate.id} value={rate.id}>
                      {rate.vehicle} ({formatUsd(rate.perKmCharge)}/km)
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={handleShippingCalculate}
              disabled={!selectedVehicleRate}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--active)] px-5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t(`${I18N_KEY}.calculate`)}
              <FiArrowRight className="size-4" aria-hidden />
            </button>
            {shipResult ? (
              <SettingsResultPanel
                title={t(`${I18N_KEY}.shipping.resultTitle`)}
                className="mt-4"
              >
                <p className="text-lg font-bold text-[var(--primary-text)]">
                  {formatUsd(shipResult.total)}
                </p>
                <p className="text-sm text-[var(--secondary-text)]">
                  {t(`${I18N_KEY}.shipping.resultFormula`, {
                    distance: shipResult.distance,
                    rate: formatUsd(shipResult.rate),
                    total: formatUsd(shipResult.total),
                  })}
                </p>
              </SettingsResultPanel>
            ) : null}
          </SettingsConfigCard>
        </SettingsSection>

        <SettingsSection
          title={t(`${I18N_KEY}.vat.title`)}
          description={t(`${I18N_KEY}.vat.description`)}
        >
          <SettingsConfigCard
            icon={FiSettings}
            title={t(`${I18N_KEY}.vat.configTitle`)}
            unsaved={vatUnsaved}
            unsavedLabel={t(`${I18N_KEY}.unsaved`)}
            saveLabel={t(`${I18N_KEY}.saveChange`)}
            resetLabel={t(`${I18N_KEY}.reset`)}
            onSave={handleVatSave}
            onReset={handleVatReset}
            actionsDisabled={isVatBusy || showInitialLoading}
          >
            <label className="block">
              <FieldLabel>{t(`${I18N_KEY}.vat.defaultRateLabel`)}</FieldLabel>
              <input
                type="text"
                value={vatDraft}
                onChange={(e) => setVatDraft(e.target.value)}
                disabled={isVatBusy || showInitialLoading}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </SettingsConfigCard>

          <SettingsConfigCard
            icon={FiFileText}
            title={t(`${I18N_KEY}.vat.previewTitle`)}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="block flex-1">
                <FieldLabel>{t(`${I18N_KEY}.vat.productPriceLabel`)}</FieldLabel>
                <input
                  type="text"
                  value={vatPrice}
                  onChange={(e) => setVatPrice(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
                />
              </label>
              <button
                type="button"
                onClick={handleVatCalculate}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[var(--active)] px-5 text-sm font-semibold text-white hover:brightness-95"
              >
                {t(`${I18N_KEY}.calculate`)}
                <FiArrowRight className="size-4" aria-hidden />
              </button>
            </div>
            {vatResult ? (
              <SettingsResultPanel className="mt-4">
                <p className="text-xs font-semibold text-[var(--secondary-text)] uppercase">
                  {t(`${I18N_KEY}.vat.previewShippingCost`)}
                </p>
                <p className="text-sm text-[var(--primary-text)]">—</p>
                <p className="mt-2 text-xs font-semibold text-[var(--secondary-text)] uppercase">
                  {t(`${I18N_KEY}.vat.previewRate`)}
                </p>
                <p className="text-sm text-[var(--primary-text)]">
                  {vatResult.rate}%
                </p>
                <p className="mt-2 text-xs font-semibold text-[var(--secondary-text)] uppercase">
                  {t(`${I18N_KEY}.vat.previewAmount`)}
                </p>
                <p className="text-sm font-semibold text-[var(--active)]">
                  {formatUsd(vatResult.vatAmount)}
                </p>
                <p className="mt-2 text-xs font-semibold text-[var(--secondary-text)] uppercase">
                  {t(`${I18N_KEY}.vat.previewFinal`)}
                </p>
                <p className="text-base font-bold text-sky-700">
                  {formatUsd(vatResult.total)}
                </p>
              </SettingsResultPanel>
            ) : null}
          </SettingsConfigCard>
        </SettingsSection>

        <SettingsSection
          title={t(`${I18N_KEY}.auction.title`)}
          description={t(`${I18N_KEY}.auction.description`)}
        >
          <SettingsConfigCard
            icon={FiSettings}
            title={t(`${I18N_KEY}.auction.durationTitle`)}
            unsaved={auctionUnsaved}
            unsavedLabel={t(`${I18N_KEY}.unsaved`)}
            saveLabel={t(`${I18N_KEY}.saveChange`)}
            resetLabel={t(`${I18N_KEY}.reset`)}
            onSave={handleAuctionSave}
            onReset={handleAuctionReset}
            actionsDisabled={isAuctionBusy || showInitialLoading}
          >
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <FieldLabel>{t(`${I18N_KEY}.auction.hoursLabel`)}</FieldLabel>
                <input
                  type="text"
                  inputMode="numeric"
                  value={auctionDraft.hours}
                  onChange={(e) =>
                    setAuctionDraft((prev) => ({
                      ...prev,
                      hours: e.target.value,
                    }))
                  }
                  disabled={isAuctionBusy || showInitialLoading}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
              <label className="block">
                <FieldLabel>{t(`${I18N_KEY}.auction.minutesLabel`)}</FieldLabel>
                <input
                  type="text"
                  inputMode="numeric"
                  value={auctionDraft.minutes}
                  onChange={(e) =>
                    setAuctionDraft((prev) => ({
                      ...prev,
                      minutes: e.target.value,
                    }))
                  }
                  disabled={isAuctionBusy || showInitialLoading}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
            </div>
          </SettingsConfigCard>
        </SettingsSection>
      </div>
    </div>
  )
}
