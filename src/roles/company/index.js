import { FiCheckSquare, FiGrid, FiUser, FiLink } from 'react-icons/fi'

/** Company buyer-account config (sidebar + dashboard). */
const companyRole = {
  id: 'company',
  nav: [
    { to: '/account', labelKey: 'buyer.dashboard', end: true },
    { to: '/account/orders', labelKey: 'buyer.orders' },
    { to: '/account/projects', labelKey: 'buyer.projects' },
    { to: '/account/profile', labelKey: 'buyer.account' },
  ],
  breadcrumbs: {
    '/account': 'buyer.dashboard',
    '/account/orders': 'buyer.orders',
    '/account/projects': 'buyer.projects',
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
      id: 'project',
      labelKey: 'buyer.project',
      to: '/account/projects',
      Icon: FiGrid,
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
  ],
}

export default companyRole
