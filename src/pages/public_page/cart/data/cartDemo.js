const CEMENT_IMG =
  'https://images.unsplash.com/photo-1581094794359-844d2a4f2696?auto=format&fit=crop&w=120&q=80'
const BRICK_IMG =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-hTLZsRdDd1ANv358uyRFuYN8__0xQz2nmhi3Y945Jg&s=10'

export const DEMO_CART_ITEMS = [
  {
    id: 'cart-1',
    title: 'Premium Portland Cement 50kg',
    compareAtPrice: 99,
    unitPrice: 70,
    quantity: 1,
    image: CEMENT_IMG,
  },
  {
    id: 'cart-2',
    title: 'High Density Construction Bricks (Pack of 1000)',
    compareAtPrice: 99,
    unitPrice: 70,
    quantity: 1,
    image: BRICK_IMG,
  },
  {
    id: 'cart-3',
    title: 'High Density Construction Bricks (Pack of 1000)',
    compareAtPrice: 99,
    unitPrice: 250,
    quantity: 3,
    image: BRICK_IMG,
  },
  {
    id: 'cart-4',
    title: 'Premium Portland Cement 50kg',
    compareAtPrice: 99,
    unitPrice: 70,
    quantity: 1,
    image: CEMENT_IMG,
  },
  {
    id: 'cart-5',
    title: 'High Density Construction Bricks (Pack of 1000)',
    compareAtPrice: 99,
    unitPrice: 70,
    quantity: 1,
    image: BRICK_IMG,
  },
]

export const CART_FEE_RATES = {
  shipping: 20,
  vat: 4,
  currency: 'EUR',
}

export function lineSubtotal(item) {
  return item.unitPrice * item.quantity
}

export function computeCartTotals(items, selectedIds) {
  const selected = items.filter((item) => selectedIds.has(item.id))
  const subtotal = selected.reduce((sum, item) => sum + lineSubtotal(item), 0)
  const { shipping, vat, currency } = CART_FEE_RATES
  const hasSelection = selected.length > 0
  const total = hasSelection ? subtotal + shipping + vat : 0

  return {
    subtotal,
    shipping: hasSelection ? shipping : 0,
    vat: hasSelection ? vat : 0,
    total,
    currency,
  }
}
