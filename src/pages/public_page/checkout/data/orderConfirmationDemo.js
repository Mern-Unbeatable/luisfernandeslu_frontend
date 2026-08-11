import {
  CHECKOUT_LINE_ITEMS,
} from '../../checkout/data/checkoutDemo'

/** Confirmation totals match Figma mock (shipping $100). */
export const ORDER_CONFIRMATION_TOTALS = {
  subtotal: 320,
  shipping: 100,
  vat: 4,
  currency: 'EUR',
  total: 357.99,
}

export const ORDER_CONFIRMATION_META = {
  orderNumber: '45897',
  orderDate: 'Oct 5, 2025',
  email: 'customer@gmail.com',
  shipmentItemCount: 2,
  deliveryAddress: '4517 Washington Ave. Manchester, Kentucky 39495',
  deliveryDateFrom: 'Oct 8, 2025',
  deliveryDateTo: 'Oct 12, 2025',
  shippingMethod: 'Standard Courier (3-5 days)',
  paymentMethod: 'Online Payment',
}

export { CHECKOUT_LINE_ITEMS as ORDER_CONFIRMATION_ITEMS }
