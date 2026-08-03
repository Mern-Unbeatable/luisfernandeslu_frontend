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
      to: '/panel/orders',
      labelKey: 'panel.nav.orders',
      Icon: FiShoppingCart,
    },
    {
      to: '/panel/chat',
      labelKey: 'panel.nav.chat',
      Icon: FiMessageSquare,
    },
    {
      to: '/panel/delivery-logistics',
      labelKey: 'panel.nav.deliveryLogistics',
      Icon: FiTruck,
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

export default factoryRole
