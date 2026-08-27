import {
  FiHome,
  FiTruck,
  FiDollarSign,
  FiRotateCcw,
  FiMessageSquare,
  FiShield,
  // FiMapPin,
  FiFile,
  FiUser,
} from 'react-icons/fi'
import { FaGavel } from 'react-icons/fa'

/** Transporter panel config (sidebar nav). */
const transporterRole = {
  id: 'transporter',
  labelKey: 'panel.roles.transporter',
  basePath: '/transporter',
  nav: [
    {
      to: '/transporter',
      labelKey: 'panel.nav.dashboard',
      Icon: FiHome,
      end: true,
    },
    {
      to: '/transporter/auction-board',
      labelKey: 'panel.nav.auctionBoard',
      Icon: FaGavel,
    },
    {
      to: '/transporter/assign-deliveries',
      labelKey: 'panel.nav.assignDeliveries',
      Icon: FiTruck,
    },
    {
      to: '/transporter/payments-payouts',
      labelKey: 'panel.nav.paymentsPayouts',
      Icon: FiDollarSign,
    },
    {
      to: '/transporter/order-history',
      labelKey: 'panel.nav.orderHistory',
      Icon: FiRotateCcw,
    },
    {
      to: '/transporter/chat',
      labelKey: 'panel.nav.chat',
      Icon: FiMessageSquare,
    },
    {
      to: '/transporter/insurance',
      labelKey: 'panel.nav.insurance',
      Icon: FiShield,
    },
    // {
    //   to: '/transporter/map',
    //   labelKey: 'panel.nav.map',
    //   Icon: FiMapPin,
    // },
    {
      to: '/transporter/invoices',
      labelKey: 'panel.nav.invoices',
      Icon: FiFile,
    },
    {
      to: '/transporter/profile',
      labelKey: 'panel.nav.profile',
      Icon: FiUser,
    },
  ],
}

export default transporterRole
