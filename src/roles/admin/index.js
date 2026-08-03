import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiTruck,
  FiPackage,
  FiMessageSquare,
  FiShoppingBag,
  FiDollarSign,
  FiAlertCircle,
  FiShoppingCart,
  FiSettings,
  FiUser,
  FiShield,
} from 'react-icons/fi'
import { FaIndustry, FaGavel } from 'react-icons/fa'

/** Admin panel config (sidebar nav). */
const adminRole = {
  id: 'admin',
  labelKey: 'panel.roles.admin',
  basePath: '/admin',
  activeVariant: 'solid',
  nav: [
    {
      to: '/admin',
      labelKey: 'panel.nav.dashboard',
      Icon: FiHome,
      end: true,
    },
    {
      to: '/admin/user-management',
      labelKey: 'panel.nav.userManagement',
      Icon: FiUsers,
    },
    {
      to: '/admin/supplier-management',
      labelKey: 'panel.nav.supplierManagement',
      Icon: FiBriefcase,
    },
    {
      to: '/admin/factory-management',
      labelKey: 'panel.nav.factoryManagement',
      Icon: FaIndustry,
    },
    {
      to: '/admin/transporter-management',
      labelKey: 'panel.nav.transporterManagement',
      Icon: FiTruck,
    },
    {
      to: '/admin/product-moderation',
      labelKey: 'panel.nav.productModeration',
      Icon: FiPackage,
    },
    {
      to: '/admin/chat',
      labelKey: 'panel.nav.chat',
      Icon: FiMessageSquare,
    },
    {
      to: '/admin/marketing-management',
      labelKey: 'panel.nav.marketingManagement',
      Icon: FiShoppingBag,
    },
    {
      to: '/admin/finance-payments',
      labelKey: 'panel.nav.financePayments',
      Icon: FiDollarSign,
    },
    {
      to: '/admin/disputes',
      labelKey: 'panel.nav.disputesResolution',
      Icon: FiAlertCircle,
    },
    {
      to: '/admin/auction',
      labelKey: 'panel.nav.auction',
      Icon: FaGavel,
    },
    {
      to: '/admin/orders',
      labelKey: 'panel.nav.orders',
      Icon: FiShoppingCart,
    },
    {
      to: '/admin/delivery-logistics',
      labelKey: 'panel.nav.deliveryLogisticsAdmin',
      Icon: FiTruck,
    },
    {
      to: '/admin/affiliate-directory',
      labelKey: 'panel.nav.affiliateDirectory',
      Icon: FiUsers,
    },
    {
      to: '/admin/roles-permissions',
      labelKey: 'panel.nav.rolesPermissions',
      Icon: FiShield,
    },
    {
      to: '/admin/settings',
      labelKey: 'panel.nav.settings',
      Icon: FiSettings,
    },
    {
      to: '/admin/profile',
      labelKey: 'panel.nav.profile',
      Icon: FiUser,
    },
  ],
}

export default adminRole
