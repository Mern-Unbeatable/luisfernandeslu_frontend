import { useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import AuctionSelect from './AuctionSelect'
import {
  ACCESS_CONDITION_OPTIONS,
  DEFAULT_CREATE_AUCTION,
  UNLOADING_NEEDS_OPTIONS,
} from './defaults'

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-base font-bold text-[var(--primary-text)] sm:text-lg">
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`flex w-full flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-medium text-[var(--primary-text)]">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'h-11 w-full rounded-lg border border-transparent bg-gray-100 px-3.5 text-sm text-[var(--primary-text)] outline-none transition-colors placeholder:text-zinc-400 hover:border-gray-200 focus:border-[var(--active)] focus:ring-1 focus:ring-[var(--active)]'

const textareaClass =
  'min-h-[96px] w-full resize-y rounded-lg border border-transparent bg-gray-100 px-3.5 py-3 text-sm text-[var(--primary-text)] outline-none transition-colors placeholder:text-zinc-400 hover:border-gray-200 focus:border-[var(--active)] focus:ring-1 focus:ring-[var(--active)]'

/**
 * Common Create Auction / Shipment Information form.
 * role: 'supplier' (full + shipping/unloading) | 'factory' (no shipping section)
 */
export default function CreateAuction({
  role = 'supplier',
  value,
  defaultValue,
  placeholders = {},
  onChange,
  onSubmit,
  onBack,
  unloadingOptions = UNLOADING_NEEDS_OPTIONS,
  accessOptions = ACCESS_CONDITION_OPTIONS,
  className = '',
}) {
  const { t } = useTranslation()
  const isSupplier = role === 'supplier'
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(
    () => defaultValue || DEFAULT_CREATE_AUCTION,
  )

  const form = isControlled ? value : internal

  const ph = (key, fallbackKey) =>
    placeholders[key] || t(`auction.create.${fallbackKey}`)

  const patch = (partial) => {
    const next = { ...form, ...partial }
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const setField = (key) => (nextValue) => patch({ [key]: nextValue })

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(form)
  }

  const handleFormKeyDown = (event) => {
    if (event.key !== 'Enter') return
    const tag = String(event.target?.tagName || '').toLowerCase()
    // Allow Enter only inside textarea; block accidental form submit from inputs
    if (tag !== 'textarea') {
      event.preventDefault()
    }
  }

  return (
    <div className={`mx-auto w-full ${className}`}>
      <header className="mb-6">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--secondary-text)] transition-colors hover:text-[var(--active)]"
          >
            <FiArrowLeft className="size-4" strokeWidth={2} aria-hidden />
            {t('auction.create.back')}
          </button>
        ) : null}
        <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {t('auction.create.title')}
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t('auction.create.subtitle')}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyDown}
        className="flex flex-col gap-5"
      >
        <Section title={t('auction.create.orderInfo')}>
          <Field label={t('auction.create.orderId')}>
            <input
              id="auction-order-id"
              type="text"
              value={form.orderId}
              onChange={(e) => setField('orderId')(e.target.value)}
              placeholder={ph('orderId', 'orderIdPlaceholder')}
              className={inputClass}
            />
          </Field>
          <Field label={t('auction.create.pickupLocation')}>
            <input
              id="auction-pickup"
              type="text"
              value={form.pickupLocation}
              onChange={(e) => setField('pickupLocation')(e.target.value)}
              placeholder={ph('pickupLocation', 'pickupPlaceholder')}
              className={inputClass}
            />
          </Field>
        </Section>

        <Section title={t('auction.create.customerInfo')}>
          <Field label={t('auction.create.customerName')}>
            <input
              id="auction-customer"
              type="text"
              value={form.customerName}
              onChange={(e) => setField('customerName')(e.target.value)}
              placeholder={ph('customerName', 'customerPlaceholder')}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t('auction.create.phone')}>
              <input
                id="auction-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setField('phone')(e.target.value)}
                placeholder={ph('phone', 'phonePlaceholder')}
                className={inputClass}
              />
            </Field>
            <Field label={t('auction.create.email')}>
              <input
                id="auction-email"
                type="email"
                value={form.email}
                onChange={(e) => setField('email')(e.target.value)}
                placeholder={ph('email', 'emailPlaceholder')}
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        <Section title={t('auction.create.deliveryLocation')}>
          <Field label={t('auction.create.deliveryAddress')}>
            <input
              id="auction-delivery"
              type="text"
              value={form.deliveryAddress}
              onChange={(e) => setField('deliveryAddress')(e.target.value)}
              placeholder={ph('deliveryAddress', 'deliveryPlaceholder')}
              className={inputClass}
            />
          </Field>
        </Section>

        <Section title={t('auction.create.productInfo')}>
          <Field label={t('auction.create.productName')}>
            <input
              id="auction-product"
              type="text"
              value={form.productName}
              onChange={(e) => setField('productName')(e.target.value)}
              placeholder={ph('productName', 'productPlaceholder')}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label={t('auction.create.weight')}>
              <input
                id="auction-weight"
                type="text"
                value={form.weight}
                onChange={(e) => setField('weight')(e.target.value)}
                placeholder={ph('weight', 'weightPlaceholder')}
                className={inputClass}
              />
            </Field>
            <Field label={t('auction.create.sku')}>
              <input
                id="auction-sku"
                type="text"
                value={form.sku}
                onChange={(e) => setField('sku')(e.target.value)}
                placeholder={ph('sku', 'skuPlaceholder')}
                className={inputClass}
              />
            </Field>
            <Field label={t('auction.create.price')}>
              <input
                id="auction-price"
                type="text"
                value={form.price}
                onChange={(e) => setField('price')(e.target.value)}
                placeholder={ph('price', 'pricePlaceholder')}
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        {isSupplier ? (
          <Section title={t('auction.create.shippingDetails')}>
            <Field label={t('auction.create.unloadingNeeds')}>
              <AuctionSelect
                id="auction-unloading"
                value={form.unloadingNeeds}
                onChange={setField('unloadingNeeds')}
                options={unloadingOptions}
                placeholder={ph('unloadingNeeds', 'unloadingPlaceholder')}
              />
            </Field>
            <Field label={t('auction.create.unloadingInstruction')}>
              <textarea
                id="auction-unloading-instruction"
                value={form.unloadingInstruction}
                onChange={(e) =>
                  setField('unloadingInstruction')(e.target.value)
                }
                placeholder={ph(
                  'unloadingInstruction',
                  'unloadingInstructionPlaceholder',
                )}
                rows={3}
                className={textareaClass}
              />
            </Field>
            <Field label={t('auction.create.accessCondition')}>
              <AuctionSelect
                id="auction-access"
                value={form.accessCondition}
                onChange={setField('accessCondition')}
                options={accessOptions}
                placeholder={ph('accessCondition', 'accessPlaceholder')}
              />
            </Field>
            <Field label={t('auction.create.additionalNotes')}>
              <textarea
                id="auction-notes"
                value={form.additionalNotes}
                onChange={(e) => setField('additionalNotes')(e.target.value)}
                placeholder={ph(
                  'additionalNotes',
                  'additionalNotesPlaceholder',
                )}
                rows={3}
                className={textareaClass}
              />
            </Field>
          </Section>
        ) : null}

        <div>
          <button
            type="submit"
            className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-xl bg-[var(--active)] px-8 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t('auction.create.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}
