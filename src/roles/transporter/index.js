import {
  FiHome,
  FiTruck,
  FiDollarSign,
  FiRotateCcw,
  FiShield,
  FiMapPin,
  FiFile,
  FiUser,
} from 'react-icons/fi'
import { FaGavel } from 'react-icons/fa'

/** Transporter panel config (sidebar nav). */
const transporterRole = {
  id: 'transporter',
  labelKey: 'panel.roles.transporter',
  basePath: '/panel',
  activeVariant: 'soft',
  nav: [
    {
      to: '/panel',
      labelKey: 'panel.nav.dashboard',
      Icon: FiHome,
      end: true,
    },
    {
      to: '/panel/auction-board',
      labelKey: 'panel.nav.auctionBoard',
      Icon: FaGavel,
    },
    {
      to: '/panel/assign-deliveries',
      labelKey: 'panel.nav.assignDeliveries',
      Icon: FiTruck,
    },
    {
      to: '/panel/payments-payouts',
      labelKey: 'panel.nav.paymentsPayouts',
      Icon: FiDollarSign,
    },
    {
      to: '/panel/order-history',
      labelKey: 'panel.nav.orderHistory',
      Icon: FiRotateCcw,
    },
    {
      to: '/panel/insurance',
      labelKey: 'panel.nav.insurance',
      Icon: FiShield,
    },
    {
      to: '/panel/map',
      labelKey: 'panel.nav.map',
      Icon: FiMapPin,
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

export default transporterRole
