import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowRight, FiX } from 'react-icons/fi'
import { useApplyPromoCodeMutation, useRemovePromoCodeMutation } from '@/features/cart/cartApi'
import Swal from 'sweetalert2'

export default function CartTotalsCard({
  totals,
  promos = [],
  checkoutPath,
  disabled,
}) {
  const { t } = useTranslation()
  const [coupon, setCoupon] = useState('')
  const { subtotalBeforeDiscount, discount, subtotal, vat, total, currency } = totals
  
  const [applyPromo, { isLoading: isApplying }] = useApplyPromoCodeMutation()
  const [removePromo, { isLoading: isRemoving }] = useRemovePromoCodeMutation()

  const handleApplyPromo = async () => {
    if (!coupon.trim()) return
    try {
      await applyPromo({ code: coupon.trim() }).unwrap()
      setCoupon('')
      Swal.fire({
        title: 'Success',
        text: 'Promo code applied',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err?.data?.message || 'Failed to apply promo code',
        icon: 'error'
      })
    }
  }

  const handleRemovePromo = async (code) => {
    try {
      await removePromo({ code }).unwrap()
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err?.data?.message || 'Failed to remove promo code',
        icon: 'error'
      })
    }
  }

  const isBusy = disabled || isApplying || isRemoving

  return (
    <aside className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-48 ${isBusy ? 'opacity-80' : ''}`}>
      <h2 className="text-lg font-bold text-[var(--primary-text)]">
        {t('cartPage.totalsTitle')}
      </h2>

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">{t('checkoutPage.subtotal')}</dt>
          <dd className="font-medium text-[var(--primary-text)]">
            €{(subtotalBeforeDiscount ?? subtotal).toFixed(2)}
          </dd>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between gap-4 text-green-600">
            <dt>{t('checkoutPage.discount', { defaultValue: 'Discount' })}</dt>
            <dd className="font-medium">
              -€{discount.toFixed(2)}
            </dd>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">{t('checkoutPage.shipping', { defaultValue: 'Shipping' })}</dt>
          <dd className="text-right">
            <span className="text-[13px] italic text-[var(--secondary-text)]">
              {t('cartPage.calculatedAtCheckout', { defaultValue: 'Calculated at checkout' })}
            </span>
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">{t('checkoutPage.vat')}</dt>
          <dd className="font-medium text-[var(--primary-text)]">
            €{vat.toFixed(2)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={coupon}
          onChange={(event) => setCoupon(event.target.value)}
          placeholder={t('cartPage.couponPlaceholder')}
          disabled={isBusy}
          className="h-11 min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)] disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleApplyPromo()
          }}
        />
        <button
          type="button"
          onClick={handleApplyPromo}
          disabled={!coupon.trim() || isBusy}
          className="shrink-0 rounded-md bg-[var(--primary-text)] px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {t('checkoutPage.apply')}
        </button>
      </div>

      {promos?.length > 0 && (
        <ul className="mt-3 space-y-2">
          {promos.map(promo => (
            <li key={promo.id} className="flex items-center justify-between rounded bg-green-50 px-3 py-2 text-sm text-green-700">
              <span className="font-medium">{promo.code}</span>
              <button
                type="button"
                onClick={() => handleRemovePromo(promo.code)}
                disabled={isRemoving}
                className="text-green-600 hover:text-green-800"
                aria-label="Remove promo code"
              >
                <FiX className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <span className="text-base font-bold text-[var(--primary-text)]">
          {t('cartPage.totalLabel')}
        </span>
        <span className="text-lg font-bold text-[var(--primary-text)]">
          €{total.toFixed(2)} {currency}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {isBusy ? (
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
