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
      to: '/panel/user-management',
      labelKey: 'panel.nav.userManagement',
      Icon: FiUsers,
    },
    {
      to: '/panel/supplier-management',
      labelKey: 'panel.nav.supplierManagement',
      Icon: FiBriefcase,
    },
    {
      to: '/panel/factory-management',
      labelKey: 'panel.nav.factoryManagement',
      Icon: FaIndustry,
    },
    {
      to: '/panel/transporter-management',
      labelKey: 'panel.nav.transporterManagement',
      Icon: FiTruck,
    },
    {
      to: '/panel/product-moderation',
      labelKey: 'panel.nav.productModeration',
      Icon: FiPackage,
    },
    {
      to: '/panel/chat',
      labelKey: 'panel.nav.chat',
      Icon: FiMessageSquare,
    },
    {
      to: '/panel/marketing-management',
      labelKey: 'panel.nav.marketingManagement',
      Icon: FiShoppingBag,
    },
    {
      to: '/panel/finance-payments',
      labelKey: 'panel.nav.financePayments',
      Icon: FiDollarSign,
    },
    {
      to: '/panel/disputes',
      labelKey: 'panel.nav.disputesResolution',
      Icon: FiAlertCircle,
    },
    {
      to: '/panel/auction',
      labelKey: 'panel.nav.auction',
      Icon: FaGavel,
    },
    {
      to: '/panel/orders',
      labelKey: 'panel.nav.orders',
      Icon: FiShoppingCart,
    },
    {
      to: '/panel/delivery-logistics',
      labelKey: 'panel.nav.deliveryLogisticsAdmin',
      Icon: FiTruck,
    },
    {
      to: '/panel/affiliate-directory',
      labelKey: 'panel.nav.affiliateDirectory',
      Icon: FiUsers,
    },
    {
      to: '/panel/roles-permissions',
      labelKey: 'panel.nav.rolesPermissions',
      Icon: FiShield,
    },
    {
      to: '/panel/settings',
      labelKey: 'panel.nav.settings',
      Icon: FiSettings,
    },
    {
      to: '/panel/profile',
      labelKey: 'panel.nav.profile',
      Icon: FiUser,
    },
  ],
}

export default adminRole
