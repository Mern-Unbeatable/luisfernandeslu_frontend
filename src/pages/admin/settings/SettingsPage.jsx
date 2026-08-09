import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiArrowRight, FiFileText, FiSettings } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
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

export default function SettingsPage() {
  const { t } = useTranslation()

  const [shippingSaved, setShippingSaved] = useState(
    ADMIN_SETTINGS_DEFAULTS.shipping.perKmCharge,
  )
  const [shippingDraft, setShippingDraft] = useState(
    ADMIN_SETTINGS_DEFAULTS.shipping.perKmChargeDisplay,
  )
  const [shipDistance, setShipDistance] = useState(
    ADMIN_SETTINGS_DEFAULTS.shippingCalculator.distanceKm,
  )
  const [shipRate, setShipRate] = useState(
    ADMIN_SETTINGS_DEFAULTS.shippingCalculator.ratePerKm,
  )
  const [shipResult, setShipResult] = useState(null)

  const [vatSaved, setVatSaved] = useState(ADMIN_SETTINGS_DEFAULTS.vat.defaultRate)
  const [vatDraft, setVatDraft] = useState(
    `${ADMIN_SETTINGS_DEFAULTS.vat.defaultRate}%`,
  )
  const [vatPrice, setVatPrice] = useState(
    ADMIN_SETTINGS_DEFAULTS.vatCalculator.productPrice,
  )
  const [vatResult, setVatResult] = useState(null)

  const [auctionSaved, setAuctionSaved] = useState({
    hours: ADMIN_SETTINGS_DEFAULTS.auction.hours,
    minutes: ADMIN_SETTINGS_DEFAULTS.auction.minutes,
  })
  const [auctionDraft, setAuctionDraft] = useState({ ...auctionSaved })

  const shippingUnsaved = useMemo(() => {
    const numeric = parseMoneyInput(shippingDraft)
    return String(numeric) !== String(shippingSaved)
  }, [shippingDraft, shippingSaved])

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

  const handleShippingSave = () => {
    setShippingSaved(String(parseMoneyInput(shippingDraft)))
  }

  const handleShippingReset = () => {
    setShippingDraft(ADMIN_SETTINGS_DEFAULTS.shipping.perKmChargeDisplay)
    setShippingSaved(ADMIN_SETTINGS_DEFAULTS.shipping.perKmCharge)
  }

  const handleShippingCalculate = () => {
    const distance = parseMoneyInput(shipDistance)
    const rate = parseMoneyInput(shipRate)
    const total = distance * rate
    setShipResult({ distance, rate, total })
  }

  const handleVatSave = () => {
    setVatSaved(String(parseMoneyInput(vatDraft)))
  }

  const handleVatReset = () => {
    setVatDraft(`${ADMIN_SETTINGS_DEFAULTS.vat.defaultRate}%`)
    setVatSaved(ADMIN_SETTINGS_DEFAULTS.vat.defaultRate)
  }

  const handleVatCalculate = () => {
    const price = parseMoneyInput(vatPrice)
    const rate = ADMIN_SETTINGS_DEFAULTS.vatCalculator.previewRate
    const vatAmount = (price * rate) / 100
    setVatResult({ price, rate, vatAmount, total: price + vatAmount })
  }

  const handleAuctionSave = () => {
    setAuctionSaved({ ...auctionDraft })
  }

  const handleAuctionReset = () => {
    const next = {
      hours: ADMIN_SETTINGS_DEFAULTS.auction.hours,
      minutes: ADMIN_SETTINGS_DEFAULTS.auction.minutes,
    }
    setAuctionDraft(next)
    setAuctionSaved(next)
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

      <SettingsSection
        title={t(`${I18N_KEY}.shipping.title`)}
        description={t(`${I18N_KEY}.shipping.description`)}
      >
        <SettingsConfigCard
          icon={FiSettings}
          title={t(`${I18N_KEY}.shipping.baseRateTitle`)}
          unsaved={shippingUnsaved}
          unsavedLabel={t(`${I18N_KEY}.unsaved`)}
          saveLabel={t(`${I18N_KEY}.saveChange`)}
          resetLabel={t(`${I18N_KEY}.reset`)}
          onSave={handleShippingSave}
          onReset={handleShippingReset}
        >
          <label className="block">
            <FieldLabel>{t(`${I18N_KEY}.shipping.perKmLabel`)}</FieldLabel>
            <input
              type="text"
              value={shippingDraft}
              onChange={(e) => setShippingDraft(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
            />
          </label>
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
              <FieldLabel>{t(`${I18N_KEY}.shipping.currentRateLabel`)}</FieldLabel>
              <input
                type="text"
                value={shipRate}
                onChange={(e) => setShipRate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleShippingCalculate}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--active)] px-5 text-sm font-semibold text-white hover:brightness-95"
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
        >
          <label className="block">
            <FieldLabel>{t(`${I18N_KEY}.vat.defaultRateLabel`)}</FieldLabel>
            <input
              type="text"
              value={vatDraft}
              onChange={(e) => setVatDraft(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
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
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
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
                className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--active)]"
              />
            </label>
          </div>
        </SettingsConfigCard>
      </SettingsSection>
    </div>
  )
}
