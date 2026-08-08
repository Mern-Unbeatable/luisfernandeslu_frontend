import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiMessageSquare,
  FiTruck,
  FiFile,
  FiUser,
} from 'react-icons/fi'

/** Factory panel config (sidebar nav). */
const factoryRole = {
  id: 'factory',
  labelKey: 'panel.roles.factory',
  basePath: '/factory',
  nav: [
    {
      to: '/factory',
      labelKey: 'panel.nav.dashboard',
      Icon: FiHome,
      end: true,
    },
    {
      to: '/factory/products',
      labelKey: 'panel.nav.products',
      Icon: FiPackage,
    },
    {
      to: '/factory/orders',
      labelKey: 'panel.nav.orders',
      Icon: FiShoppingCart,
    },
    {
      to: '/factory/chat',
      labelKey: 'panel.nav.chat',
      Icon: FiMessageSquare,
    },
    {
      to: '/factory/delivery-logistics',
      labelKey: 'panel.nav.deliveryLogistics',
      Icon: FiTruck,
    },
    {
      to: '/factory/invoices',
      labelKey: 'panel.nav.invoices',
      Icon: FiFile,
    },
    {
      to: '/factory/profile',
      labelKey: 'panel.nav.profile',
      Icon: FiUser,
    },
  ],
}

export default factoryRole
