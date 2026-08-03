import { FiCheckSquare, FiStar, FiUser, FiLink } from 'react-icons/fi'

/** Customer buyer-account config (sidebar + dashboard). */
const customerRole = {
  id: 'customer',
  nav: [
    { to: '/account', labelKey: 'buyer.dashboard', end: true },
    { to: '/account/orders', labelKey: 'buyer.orders' },
    {
      to: '/account/product-to-review',
      labelKey: 'buyer.productToReview',
    },
    { to: '/account/profile', labelKey: 'buyer.account' },
  ],
  breadcrumbs: {
    '/account': 'buyer.dashboard',
    '/account/orders': 'buyer.orders',
    '/account/product-to-review': 'buyer.productToReview',
    '/account/profile': 'buyer.account',
    '/account/affiliates': 'buyer.affiliates',
  },
  dashboardCards: [
    {
      id: 'orders',
      labelKey: 'buyer.orders',
      to: '/account/orders',
      Icon: FiCheckSquare,
    },
    {
      id: 'review',
      labelKey: 'buyer.productToReview',
      to: '/account/product-to-review',
      Icon: FiStar,
    },
    {
      id: 'account',
      labelKey: 'buyer.account',
      to: '/account/profile',
      Icon: FiUser,
    },
    {
      id: 'affiliates',
      labelKey: 'buyer.affiliates',
      to: '/account/affiliates',
      Icon: FiLink,
    },
  ],
  introLinks: [
    { labelKey: 'buyer.recentOrders', to: '/account/orders' },
    {
      labelKey: 'buyer.shippingAddresses',
      to: '/account/profile',
      separatorKey: 'buyer.sepManageYour',
    },
    {
      labelKey: 'buyer.productToReview',
      to: '/account/product-to-review',
      separatorKey: 'buyer.sepAndTrackYour',
    },
  ],
}

export default customerRole
