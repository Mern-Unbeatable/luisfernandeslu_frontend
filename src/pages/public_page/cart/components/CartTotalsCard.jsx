import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowRight } from 'react-icons/fi'

export default function CartTotalsCard({
  totals,
  checkoutPath,
  disabled,
}) {
  const { t } = useTranslation()
  const [coupon, setCoupon] = useState('')
  const { subtotal, shipping, vat, total, currency } = totals

  return (
    <aside className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-[var(--primary-text)]">
        {t('cartPage.totalsTitle')}
      </h2>

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">{t('checkoutPage.subtotal')}</dt>
          <dd className="font-medium text-[var(--primary-text)]">
            ${subtotal.toFixed(2)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">{t('checkoutPage.shipping')}</dt>
          <dd className="font-medium text-[var(--primary-text)]">
            ${shipping.toFixed(2)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">{t('checkoutPage.vat')}</dt>
          <dd className="font-medium text-[var(--primary-text)]">
            ${vat.toFixed(2)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={coupon}
          onChange={(event) => setCoupon(event.target.value)}
          placeholder={t('cartPage.couponPlaceholder')}
          className="h-11 min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]"
        />
        <button
          type="button"
          className="shrink-0 rounded-md bg-[var(--primary-text)] px-4 text-sm font-semibold text-white hover:opacity-90"
        >
          {t('checkoutPage.apply')}
        </button>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <span className="text-base font-bold text-[var(--primary-text)]">
          {t('cartPage.totalLabel')}
        </span>
        <span className="text-lg font-bold text-[var(--primary-text)]">
          ${total.toFixed(2)} {currency}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {disabled ? (
          <span className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-gray-200 text-sm font-bold tracking-wide text-[var(--secondary-text)]">
            {t('cartPage.proceedCheckout')}
            <FiArrowRight className="size-5" aria-hidden />
          </span>
        ) : (
          <Link
            to={checkoutPath}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--active)] text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-95"
          >
            {t('cartPage.proceedCheckout')}
            <FiArrowRight className="size-5" aria-hidden />
          </Link>
        )}
        <Link
          to="/products"
          className="inline-flex h-12 w-full items-center justify-center rounded-md border border-[var(--active)] bg-white text-sm font-bold tracking-wide text-[var(--active)] transition-colors hover:bg-[color-mix(in_srgb,var(--active)_8%,white)]"
        >
          {t('cartPage.continueShopping')}
        </Link>
      </div>
    </aside>
  )
}
