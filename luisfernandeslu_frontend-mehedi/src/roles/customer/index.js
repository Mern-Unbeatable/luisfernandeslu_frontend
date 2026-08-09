import { FiCheckSquare, FiStar, FiUser, FiLink } from 'react-icons/fi'

/** Customer buyer-account config (sidebar + dashboard). */
const customerRole = {
  id: 'customer',
  basePath: '/customer',
  nav: [
    { to: '/customer', labelKey: 'buyer.dashboard', end: true },
    { to: '/customer/orders', labelKey: 'buyer.orders' },
    {
      to: '/customer/product-to-review',
      labelKey: 'buyer.productToReview',
    },
    { to: '/customer/profile', labelKey: 'buyer.account' },
  ],
  breadcrumbs: {
    '/customer': 'buyer.dashboard',
    '/customer/orders': 'buyer.orders',
    '/customer/product-to-review': 'buyer.productToReview',
    '/customer/profile': 'buyer.account',
    '/customer/affiliates': 'buyer.affiliates',
  },
  dashboardCards: [
    {
      id: 'orders',
      labelKey: 'buyer.orders',
      to: '/customer/orders',
      Icon: FiCheckSquare,
    },
    {
      id: 'review',
      labelKey: 'buyer.productToReview',
      to: '/customer/product-to-review',
      Icon: FiStar,
    },
    {
      id: 'account',
      labelKey: 'buyer.account',
      to: '/customer/profile',
      Icon: FiUser,
    },
    {
      id: 'affiliates',
      labelKey: 'buyer.affiliates',
      to: '/customer/affiliates',
      Icon: FiLink,
    },
  ],
  introLinks: [
    { labelKey: 'buyer.recentOrders', to: '/customer/orders' },
    {
      labelKey: 'buyer.shippingAddresses',
      to: '/customer/profile',
      separatorKey: 'buyer.sepManageYour',
    },
    {
      labelKey: 'buyer.productToReview',
      to: '/customer/product-to-review',
      separatorKey: 'buyer.sepAndTrackYour',
    },
  ],
}

export default customerRole
