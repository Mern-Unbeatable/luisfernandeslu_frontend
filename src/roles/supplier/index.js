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
import { FaGavel } from 'react-icons/fa'

/** Supplier panel config (sidebar nav). */
const supplierRole = {
  id: 'supplier',
  labelKey: 'panel.roles.supplier',
  basePath: '/supplier',
  activeVariant: 'solid',
  nav: [
    {
      to: '/supplier',
      labelKey: 'panel.nav.dashboard',
      Icon: FiHome,
      end: true,
    },
    {
      to: '/supplier/products',
      labelKey: 'panel.nav.products',
      Icon: FiPackage,
    },
    {
      to: '/supplier/promo-codes',
      labelKey: 'panel.nav.promoCode',
      Icon: FiTag,
    },
    {
      to: '/supplier/orders-customer',
      labelKey: 'panel.nav.ordersCustomer',
      Icon: FiShoppingBag,
    },
    {
      to: '/supplier/company-orders',
      labelKey: 'panel.nav.companyOrders',
      Icon: FiBriefcase,
    },
    {
      to: '/supplier/documents',
      labelKey: 'panel.nav.document',
      Icon: FiFileText,
    },
    {
      to: '/supplier/chat',
      labelKey: 'panel.nav.chat',
      Icon: FiMessageSquare,
    },
    {
      to: '/supplier/buy-from-factory',
      labelKey: 'panel.nav.buyFromFactory',
      Icon: FiShoppingCart,
    },
    {
      to: '/supplier/factory-orders',
      labelKey: 'panel.nav.factoryOrder',
      Icon: FiTruck,
    },
    {
      to: '/supplier/inventory',
      labelKey: 'panel.nav.inventory',
      Icon: FiLayers,
    },
    {
      to: '/supplier/delivery-logistics',
      labelKey: 'panel.nav.deliveryLogistics',
      Icon: FiMap,
    },
    {
      to: '/supplier/auction',
      labelKey: 'panel.nav.auction',
      Icon: FaGavel,
    },
    {
      to: '/supplier/payments-finance',
      labelKey: 'panel.nav.paymentsFinance',
      Icon: FiCreditCard,
    },
    {
      to: '/supplier/analytics',
      labelKey: 'panel.nav.analytics',
      Icon: FiBarChart2,
    },
    {
      to: '/supplier/reviews',
      labelKey: 'panel.nav.reviews',
      Icon: FiStar,
    },
    {
      to: '/supplier/return-requests',
      labelKey: 'panel.nav.returnRequests',
      Icon: FiRotateCcw,
    },
    {
      to: '/supplier/disputes',
      labelKey: 'panel.nav.disputesResolution',
      Icon: FiAlertCircle,
    },
    {
      to: '/supplier/invoices',
      labelKey: 'panel.nav.invoices',
      Icon: FiFile,
    },
    {
      to: '/supplier/profile',
      labelKey: 'panel.nav.profile',
      Icon: FiUser,
    },
  ],
}

export default supplierRole
