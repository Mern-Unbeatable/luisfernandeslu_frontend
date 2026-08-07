import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowRight } from 'react-icons/fi'
import {
  CHECKOUT_LINE_ITEMS,
  CHECKOUT_TOTALS,
} from '../data/checkoutDemo'

export default function CheckoutOrderSummary({ backTo = '/products' }) {
  const { t } = useTranslation()
  const [promoCode, setPromoCode] = useState('')

  const { subtotal, shipping, vat, total, currency } = CHECKOUT_TOTALS

  return (
    <aside className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-[var(--primary-text)]">
        {t('checkoutPage.orderSummaryTitle')}
      </h2>

      <ul className="mt-5 space-y-4 border-b border-gray-200 pb-5">
        {CHECKOUT_LINE_ITEMS.map((item) => (
          <li key={item.id} className="flex gap-3">
            <img
              src={item.image}
              alt=""
              className="size-14 shrink-0 rounded-md border border-gray-200 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug text-[var(--primary-text)]">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-[var(--secondary-text)]">
                {item.quantity} x ${item.unitPrice}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">
            {t('checkoutPage.subtotal')}
          </dt>
          <dd className="font-medium text-[var(--primary-text)]">
            ${subtotal.toFixed(2)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">
            {t('checkoutPage.shipping')}
          </dt>
          <dd className="font-medium text-[var(--primary-text)]">
            ${shipping.toFixed(2)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">
            {t('checkoutPage.vat')}
          </dt>
          <dd className="font-medium text-[var(--primary-text)]">
            ${vat.toFixed(2)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={promoCode}
          onChange={(event) => setPromoCode(event.target.value)}
          placeholder={t('checkoutPage.promoPlaceholder')}
          className="h-11 min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]"
        />
        <button
          type="button"
          className="shrink-0 rounded-md bg-[var(--primary-text)] px-4 text-sm font-semibold text-white hover:opacity-90"
        >
          {t('checkoutPage.apply')}
        </button>
      </div>

      <p className="mt-5 text-lg font-bold text-[var(--primary-text)]">
        ${total.toFixed(2)} {currency}
      </p>

      <div className="mt-5 space-y-3">
        <button
          type="submit"
          form="checkout-form"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--active)] text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-95"
        >
          {t('checkoutPage.placeOrder')}
          <FiArrowRight className="size-5" aria-hidden />
        </button>
        <Link
          to={backTo}
          className="inline-flex h-12 w-full items-center justify-center rounded-md border border-[var(--active)] bg-white text-sm font-bold tracking-wide text-[var(--active)] transition-colors hover:bg-[color-mix(in_srgb,var(--active)_8%,white)]"
        >
          {t('checkoutPage.back')}
        </Link>
      </div>
    </aside>
  )
}
