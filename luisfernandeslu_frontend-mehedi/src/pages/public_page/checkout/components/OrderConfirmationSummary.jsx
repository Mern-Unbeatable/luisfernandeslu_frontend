import { useTranslation } from 'react-i18next'
import {
  ORDER_CONFIRMATION_ITEMS,
  ORDER_CONFIRMATION_META,
  ORDER_CONFIRMATION_TOTALS,
} from '../data/orderConfirmationDemo'

export default function OrderConfirmationSummary() {
  const { t } = useTranslation()
  const { subtotal, shipping, vat, total, currency } = ORDER_CONFIRMATION_TOTALS

  return (
    <aside className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-[var(--primary-text)]">
        {t('checkoutPage.orderSummaryTitle')}
      </h2>

      <ul className="mt-5 space-y-4 border-b border-gray-200 pb-5">
        {ORDER_CONFIRMATION_ITEMS.map((item) => (
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
              <p className="mt-1 text-sm font-medium text-[var(--active)]">
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

      <p className="mt-5 text-xl font-bold text-[var(--primary-text)]">
        ${total.toFixed(2)} {currency}
      </p>

      <p className="mt-4 text-center text-sm font-medium text-[var(--active)]">
        {t('orderConfirmationPage.paymentMethod', {
          method: ORDER_CONFIRMATION_META.paymentMethod,
        })}
      </p>
    </aside>
  )
}
