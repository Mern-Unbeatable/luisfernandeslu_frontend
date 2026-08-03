import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiMessageSquare,
  FiTruck,
  FiFile,
  FiUser,
} from 'react-icons/fi'
import { FaGavel } from 'react-icons/fa'

/** Factory panel config (sidebar nav). */
const factoryRole = {
  id: 'factory',
  labelKey: 'panel.roles.factory',
  basePath: '/factory',
  activeVariant: 'solid',
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
      to: '/factory/auction',
      labelKey: 'panel.nav.auction',
      Icon: FaGavel,
    },
    {
      to: '/factory/create-auction',
      labelKey: 'auction.create.nav',
      Icon: FaGavel,
    },
    {
      to: '/factory/auction-details',
      labelKey: 'auction.details.nav',
      Icon: FaGavel,
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
