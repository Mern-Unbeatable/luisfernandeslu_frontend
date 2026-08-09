import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import CartItemsPanel from './components/CartItemsPanel'
import CartTotalsCard from './components/CartTotalsCard'
import {
  DEMO_CART_ITEMS,
  computeCartTotals,
} from './data/cartDemo'

function resolveCheckoutPath(user) {
  return user?.role === 'customer' ? '/checkout' : '/checkout/company'
}

export default function CartPage() {
  const { t } = useTranslation()
  const user = useSelector((state) => state.auth.user)
  const [items, setItems] = useState(DEMO_CART_ITEMS)
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(DEMO_CART_ITEMS.map((item) => item.id)),
  )

  const totals = useMemo(
    () => computeCartTotals(items, selectedIds),
    [items, selectedIds],
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

  const updateQuantity = (id, quantity) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    )
  }

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const hasSelection = items.some((item) => selectedIds.has(item.id))

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
            onQuantityChange={updateQuantity}
            onRemove={removeItem}
          />

          <CartTotalsCard
            totals={totals}
            checkoutPath={resolveCheckoutPath(user)}
            disabled={!hasSelection}
          />
        </div>
      </div>
    </div>
  )
}
