import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import CartItemsPanel from './components/CartItemsPanel'
import CartTotalsCard from './components/CartTotalsCard'
import CartPageSkeleton from './components/CartPageSkeleton'
import { useGetCartQuery } from '@/features/cart/cartApi'

function resolveCheckoutPath(user) {
  return user?.role === 'customer' ? '/checkout' : '/checkout/company'
}

function computeLiveTotals(items, selectedIds, fees) {
  const selected = items.filter((item) => selectedIds.has(item.id))
  
  const subtotalBeforeDiscount = selected.reduce(
    (sum, item) => sum + (item.promo?.originalSubtotal ?? item.subtotal),
    0
  )
  const discountAmount = selected.reduce(
    (sum, item) => sum + (item.promo?.discountAmount ?? 0),
    0
  )
  const subtotal = subtotalBeforeDiscount - discountAmount
  
  const hasSelection = selected.length > 0
  const vatRate = Number(fees?.vatRate) || 0
  
  let vat = 0
  if (hasSelection) {
    if (vatRate > 0) {
      vat = (subtotal * vatRate) / 100
    } else {
      vat = Number(fees?.vat) || 0
    }
  }

  const total = hasSelection ? subtotal + vat : 0

  return {
    subtotalBeforeDiscount,
    discount: discountAmount,
    subtotal,
    vat,
    total,
    currency: fees?.currency || 'EUR',
  }
}

export default function CartPage() {
  const { t } = useTranslation()
  const user = useSelector((state) => state.auth.user)
  
  const { data, isLoading } = useGetCartQuery()
  const cartData = data?.cart || {}
  const items = useMemo(() => cartData.items || [], [cartData.items])
  const promos = useMemo(() => cartData.promos || [], [cartData.promos])
  const fees = useMemo(() => cartData.fees || {}, [cartData.fees])

  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [hasInitialized, setHasInitialized] = useState(false)

  if (items.length > 0 && !hasInitialized) {
    setSelectedIds(new Set(items.map((item) => item.id)))
    setHasInitialized(true)
  }

  const totals = useMemo(
    () => computeLiveTotals(items, selectedIds, fees),
    [items, selectedIds, fees],
  )

  const toggleItem = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedIds((prev) => {
      if (items.every((item) => prev.has(item.id))) {
        return new Set()
      }
      return new Set(items.map((item) => item.id))
    })
  }

  const hasSelection = items.some((item) => selectedIds.has(item.id))

  if (isLoading && !data) {
    return (
      <div className="w-full bg-[#F9FAFB] py-6 sm:py-8 lg:py-10">
        <Seo
          title={t('cartPage.seoTitle')}
          description={t('cartPage.seoDescription')}
        />
        <CartPageSkeleton />
      </div>
    )
  }

  return (
    <div className="w-full bg-[#F9FAFB] py-6 sm:py-8 lg:py-10">
      <Seo
        title={t('cartPage.seoTitle')}
        description={t('cartPage.seoDescription')}
      />

      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:gap-10">
          <CartItemsPanel
            items={items}
            selectedIds={selectedIds}
            onToggleItem={toggleItem}
            onToggleAll={toggleAll}
            isLoading={isLoading}
          />

          <CartTotalsCard
            totals={totals}
            promos={promos}
            checkoutPath={resolveCheckoutPath(user)}
            disabled={!hasSelection || isLoading}
            selectedIds={selectedIds}
          />
        </div>
      </div>
    </div>
  )
}
