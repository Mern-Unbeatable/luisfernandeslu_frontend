import {
  FiHome,
  FiPackage,
  FiTag,
  FiShoppingBag,
  FiBriefcase,
  FiFileText,
  FiMessageSquare,
  FiShoppingCart,
  FiTruck,
  FiLayers,
  FiMap,
  FiCreditCard,
  FiBarChart2,
  FiStar,
  FiRotateCcw,
  FiAlertCircle,
  FiFile,
  FiUser,
} from 'react-icons/fi'

/** Supplier panel config (sidebar nav). */
const supplierRole = {
  id: 'supplier',
  labelKey: 'panel.roles.supplier',
  basePath: '/panel',
  activeVariant: 'solid',
  nav: [
    {
      to: '/panel',
      labelKey: 'panel.nav.dashboard',
      Icon: FiHome,
      end: true,
    },
    {
      to: '/panel/products',
      labelKey: 'panel.nav.products',
      Icon: FiPackage,
    },
    {
      to: '/panel/promo-codes',
      labelKey: 'panel.nav.promoCode',
      Icon: FiTag,
    },
    {
      to: '/panel/orders-customer',
      labelKey: 'panel.nav.ordersCustomer',
      Icon: FiShoppingBag,
    },
    {
      to: '/panel/company-orders',
      labelKey: 'panel.nav.companyOrders',
      Icon: FiBriefcase,
    },
    {
      to: '/panel/documents',
      labelKey: 'panel.nav.document',
      Icon: FiFileText,
    },
    {
      to: '/panel/chat',
      labelKey: 'panel.nav.chat',
      Icon: FiMessageSquare,
    },
    {
      to: '/panel/buy-from-factory',
      labelKey: 'panel.nav.buyFromFactory',
      Icon: FiShoppingCart,
    },
    {
      to: '/panel/factory-orders',
      labelKey: 'panel.nav.factoryOrder',
      Icon: FiTruck,
    },
    {
      to: '/panel/inventory',
      labelKey: 'panel.nav.inventory',
      Icon: FiLayers,
    },
    {
      to: '/panel/delivery-logistics',
      labelKey: 'panel.nav.deliveryLogistics',
      Icon: FiMap,
    },
    {
      to: '/panel/payments-finance',
      labelKey: 'panel.nav.paymentsFinance',
      Icon: FiCreditCard,
    },
    {
      to: '/panel/analytics',
      labelKey: 'panel.nav.analytics',
      Icon: FiBarChart2,
    },
    {
      to: '/panel/reviews',
      labelKey: 'panel.nav.reviews',
      Icon: FiStar,
    },
    {
      to: '/panel/return-requests',
      labelKey: 'panel.nav.returnRequests',
      Icon: FiRotateCcw,
    },
    {
      to: '/panel/disputes',
      labelKey: 'panel.nav.disputesResolution',
      Icon: FiAlertCircle,
    },
    {
      to: '/panel/invoices',
      labelKey: 'panel.nav.invoices',
      Icon: FiFile,
    },
    {
      to: '/panel/profile',
      labelKey: 'panel.nav.profile',
      Icon: FiUser,
    },
  ],
}

export default supplierRole
