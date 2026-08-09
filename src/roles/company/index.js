import { FiCheckSquare, FiGrid, FiUser, FiLink } from 'react-icons/fi'

/** Company buyer-account config (sidebar + dashboard). */
const companyRole = {
  id: 'company',
  basePath: '/company',
  nav: [
    { to: '/company', labelKey: 'buyer.dashboard', end: true },
    { to: '/company/orders', labelKey: 'buyer.orders' },
    { to: '/company/projects', labelKey: 'buyer.projects' },
    { to: '/company/profile', labelKey: 'buyer.account' },
    { to: '/company/affiliates', labelKey: 'buyer.affiliates' },
  ],
  breadcrumbs: {
    '/company': 'buyer.dashboard',
    '/company/orders': 'buyer.orders',
    '/company/projects': 'buyer.projects',
    '/company/profile': 'buyer.account',
    '/company/affiliates': 'buyer.affiliates',
  },
  dashboardCards: [
    {
      id: 'orders',
      labelKey: 'buyer.orders',
      to: '/company/orders',
      Icon: FiCheckSquare,
    },
    {
      id: 'project',
      labelKey: 'buyer.project',
      to: '/company/projects',
      Icon: FiGrid,
    },
    {
      id: 'account',
      labelKey: 'buyer.account',
      to: '/company/profile',
      Icon: FiUser,
    },
    {
      id: 'affiliates',
      labelKey: 'buyer.affiliates',
      to: '/company/affiliates',
      Icon: FiLink,
    },
  ],
  introLinks: [
    { labelKey: 'buyer.recentOrders', to: '/company/orders' },
    {
      labelKey: 'buyer.shippingAddresses',
      to: '/company/profile',
      separatorKey: 'buyer.sepManageYour',
    },
    {
      labelKey: 'buyer.bulkQuotes',
      to: '/company/projects',
      separatorKey: 'buyer.sepAndTrackYour',
    },
  ],
}

export default companyRole
