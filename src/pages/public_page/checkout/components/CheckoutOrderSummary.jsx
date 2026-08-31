import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiArrowRight, FiX, FiLoader } from 'react-icons/fi'
import Swal from 'sweetalert2'
import { 
  useGetCartQuery, 
  useApplyPromoCodeMutation, 
  useRemovePromoCodeMutation 
} from '@/features/cart/cartApi'
import { useQuoteShippingMutation } from '@/features/checkout/checkoutApi'

export default function CheckoutOrderSummary({ backTo = '/products', shippingForm, isSubmitting }) {
  const { t } = useTranslation()
  const [coupon, setCoupon] = useState('')
  const [shippingCost, setShippingCost] = useState(0)

  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery()
  const cartItems = cartData?.cart?.items || []
  const promos = cartData?.cart?.promos || []
  const fees = cartData?.cart?.fees || {}

  const [quoteShipping, { isLoading: isQuoting }] = useQuoteShippingMutation()
  const [applyPromo, { isLoading: isApplying }] = useApplyPromoCodeMutation()
  const [removePromo, { isLoading: isRemoving }] = useRemovePromoCodeMutation()

  useEffect(() => {
    if (shippingForm && shippingForm.unloadingType && shippingForm.city && cartItems.length > 0) {
      const timer = setTimeout(async () => {
        try {
          const result = await quoteShipping({
            cartItemIds: cartItems.map(i => i.id),
            unloadingType: shippingForm.unloadingType,
            shippingAddress: {
              streetAddress: shippingForm.address || '—',
              city: shippingForm.city || '—',
              state: shippingForm.region || '—',
              zipCode: shippingForm.zipCode || '—',
              country: 'Portugal'
            },
            sameAsBilling: false
          }).unwrap()
          setShippingCost(result.shippingCost ?? result.quote ?? 0)
        } catch (e) {
          // Ignore quote errors
        }
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setShippingCost(0)
    }
  }, [shippingForm, cartItems, quoteShipping])

  const subtotalBeforeDiscount = cartItems.reduce(
    (sum, item) => sum + (item.promo?.originalSubtotal ?? item.subtotal),
    0
  )
  const discount = cartItems.reduce(
    (sum, item) => sum + (item.promo?.discountAmount ?? 0),
    0
  )
  const subtotal = subtotalBeforeDiscount - discount

  const vatRate = Number(fees.vatRate) || 0
  let vat = 0
  if (cartItems.length > 0) {
    if (vatRate > 0) {
      vat = ((subtotal + shippingCost) * vatRate) / 100
    } else {
      vat = Number(fees.vat) || 0
    }
  }

  const total = cartItems.length > 0 ? subtotal + shippingCost + vat : 0
  const currency = fees.currency || 'EUR'

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

  const isBusy = isSubmitting || isCartLoading || isApplying || isRemoving || isQuoting

  return (
    <aside className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-48 ${isBusy ? 'opacity-80' : ''}`}>
      <h2 className="text-lg font-bold text-[var(--primary-text)]">
        {t('checkoutPage.orderSummaryTitle')}
      </h2>

      <ul className="mt-5 space-y-4 border-b border-gray-200 pb-5 max-h-[300px] overflow-y-auto">
        {cartItems.map((item) => (
          <li key={item.id} className="flex gap-3">
            <img
              src={item.image || 'https://placehold.co/100'}
              alt={item.title}
              className="size-14 shrink-0 rounded-md border border-gray-200 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug text-[var(--primary-text)] line-clamp-2">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-[var(--secondary-text)]">
                {item.quantity} x {item.unitPriceText}
              </p>
            </div>
          </li>
        ))}
        {cartItems.length === 0 && !isCartLoading && (
          <li className="text-sm text-[var(--secondary-text)] italic">
            {t('checkoutPage.emptyCart', { defaultValue: 'Your cart is empty' })}
          </li>
        )}
      </ul>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">
            {t('checkoutPage.subtotal')}
          </dt>
          <dd className="font-medium text-[var(--primary-text)]">
            €{subtotalBeforeDiscount.toFixed(2)}
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
          <dt className="text-[var(--secondary-text)] flex items-center gap-2">
            {t('checkoutPage.shipping')}
            {isQuoting && <FiLoader className="animate-spin text-[var(--active)]" />}
          </dt>
          <dd className="font-medium text-[var(--primary-text)]">
            {shippingCost > 0 ? `€${shippingCost.toFixed(2)}` : '—'}
          </dd>
        </div>
        
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--secondary-text)]">
            {t('checkoutPage.vat')}
          </dt>
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
          placeholder={t('checkoutPage.promoPlaceholder')}
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

      <p className="mt-5 text-lg font-bold text-[var(--primary-text)]">
        €{total.toFixed(2)} {currency}
      </p>

      <div className="mt-5 space-y-3">
        {isSubmitting ? (
          <button
            type="button"
            disabled
            className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-gray-400 text-sm font-bold tracking-wide text-white"
          >
            <FiLoader className="animate-spin size-5" aria-hidden />
            {t('checkoutPage.placingOrder', { defaultValue: 'Placing Order...' })}
          </button>
        ) : (
          <button
            type="submit"
            form="checkout-form"
            disabled={cartItems.length === 0 || isBusy}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--active)] text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('checkoutPage.placeOrder')}
            <FiArrowRight className="size-5" aria-hidden />
          </button>
        )}
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
