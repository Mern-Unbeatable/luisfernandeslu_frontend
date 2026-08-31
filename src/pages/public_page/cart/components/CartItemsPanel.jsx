import { useState } from 'react'
import { FiCheck, FiTrash2 } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import QuantitySelector from '@/components/data-display/ProductDetails/QuantitySelector'
import { useUpdateCartItemMutation, useRemoveCartItemMutation } from '@/features/cart/cartApi'
import Swal from 'sweetalert2'

export default function CartItemsPanel({
  items,
  selectedIds,
  onToggleItem,
  onToggleAll,
  isLoading,
}) {
  const { t } = useTranslation()
  const [updateCartItem] = useUpdateCartItemMutation()
  const [removeCartItem] = useRemoveCartItemMutation()
  
  const [workingItemIds, setWorkingItemIds] = useState(new Set())

  const allSelected = items.length > 0 && items.every((item) => selectedIds.has(item.id))
  const someSelected = items.some((item) => selectedIds.has(item.id))

  const handleQuantityChange = async (id, quantity) => {
    setWorkingItemIds((prev) => new Set(prev).add(id))
    try {
      await updateCartItem({ id, quantity }).unwrap()
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err?.data?.message || 'Failed to update quantity',
        icon: 'error',
      })
    } finally {
      setWorkingItemIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleRemove = async (id) => {
    setWorkingItemIds((prev) => new Set(prev).add(id))
    try {
      await removeCartItem(id).unwrap()
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err?.data?.message || 'Failed to remove item',
        icon: 'error',
      })
      setWorkingItemIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  return (
    <section className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
      <h1 className="text-lg font-semibold text-[var(--primary-text)] sm:text-xl">
        {t('cartPage.title')}
      </h1>

      <div className="mt-5 hidden border-b border-gray-200 pb-3 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)] md:grid md:grid-cols-[auto_minmax(0,1fr)_100px_140px_100px_40px] md:items-center md:gap-4">
        <SelectToggle
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={onToggleAll}
          ariaLabel={t('cartPage.selectAll')}
        />
        <span>{t('cartPage.colProducts')}</span>
        <span className="text-center">{t('cartPage.colPrice')}</span>
        <span className="text-center">{t('cartPage.colQuantity')}</span>
        <span className="text-right">{t('cartPage.colSubtotal')}</span>
        <span className="sr-only">{t('cartPage.remove')}</span>
      </div>

      <ul className="mt-2 divide-y divide-gray-100 md:mt-0">
        {items.map((item) => {
          const selected = selectedIds.has(item.id)
          const isItemBusy = workingItemIds.has(item.id)
          return (
            <li
              key={item.id}
              className={`grid grid-cols-[auto_1fr] gap-3 py-4 md:grid-cols-[auto_minmax(0,1fr)_100px_140px_100px_40px] md:items-center md:gap-4 ${
                isItemBusy ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              <SelectToggle
                checked={selected}
                onChange={() => onToggleItem(item.id)}
                ariaLabel={t('cartPage.selectItem', { name: item.title })}
              />

              <div className="col-span-1 flex min-w-0 gap-3 md:col-auto">
                <img
                  src={item.image || 'https://via.placeholder.com/150'}
                  alt=""
                  className="size-14 shrink-0 rounded-md border border-gray-200 object-cover sm:size-16"
                />
                <p className="min-w-0 self-center text-sm font-medium leading-snug text-[var(--primary-text)] sm:text-base">
                  {item.title}
                </p>
              </div>

              <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 pl-9 md:contents md:pl-0">
                <div className="text-sm md:text-center">
                  {item.compareAtPrice ? (
                    <span className="mr-1.5 text-[var(--secondary-text)] line-through">
                      €{item.compareAtPriceText || item.compareAtPrice}
                    </span>
                  ) : null}
                  <span className="font-semibold text-[var(--primary-text)]">
                    €{item.unitPriceText || item.unitPrice}
                  </span>
                </div>

                <div className="flex justify-center">
                  <QuantitySelector
                    value={item.quantity}
                    min={1}
                    onChange={(qty) => handleQuantityChange(item.id, qty)}
                    className="h-10"
                  />
                </div>

                <div className="text-sm font-semibold text-[var(--primary-text)] md:text-right">
                  {item.promo?.applied ? (
                    <div className="flex flex-col md:items-end">
                      <span className="text-xs font-medium text-[var(--secondary-text)] line-through">
                        €{item.promo.originalSubtotalText || item.promo.originalSubtotal}
                      </span>
                      <span className="text-green-600">€{item.subtotalText || item.subtotal}</span>
                    </div>
                  ) : (
                    <span>€{item.subtotalText || item.subtotal}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="flex size-9 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50 md:justify-self-end"
                  aria-label={t('cartPage.removeItem', { name: item.title })}
                >
                  <FiTrash2 className="size-5" aria-hidden />
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {items.length === 0 && !isLoading ? (
        <p className="py-8 text-center text-sm text-[var(--secondary-text)]">
          {t('cartPage.empty')}
        </p>
      ) : null}
    </section>
  )
}

function SelectToggle({ checked, indeterminate, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
        checked || indeterminate
          ? 'border-[var(--active)] bg-[var(--active)] text-white'
          : 'border-gray-300 bg-white text-transparent hover:border-[var(--active)]'
      }`}
    >
      <FiCheck className="size-3.5" strokeWidth={3} aria-hidden />
    </button>
  )
}
