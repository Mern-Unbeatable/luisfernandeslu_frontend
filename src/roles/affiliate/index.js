import {
  FiGrid,
  FiLink,
  FiUser,
  FiDollarSign,
  FiAward,
  FiSettings,
} from 'react-icons/fi'

/** Affiliate panel config (sidebar nav). */
const affiliateRole = {
  id: 'affiliate',
  labelKey: 'panel.roles.affiliate',
  basePath: '/affiliate',
  showMainMenu: true,
  nav: [
    {
      to: '/affiliate',
      labelKey: 'panel.nav.overviewDashboard',
      Icon: FiGrid,
      end: true,
    },
    {
      to: '/affiliate/referral-channels',
      labelKey: 'panel.nav.referralChannels',
      Icon: FiLink,
    },
    {
      to: '/affiliate/referred-clients',
      labelKey: 'panel.nav.referredClients',
      Icon: FiUser,
    },
    {
      to: '/affiliate/commissions',
      labelKey: 'panel.nav.commissions',
      Icon: FiDollarSign,
    },
    {
      to: '/affiliate/affiliate-levels',
      labelKey: 'panel.nav.affiliateLevels',
      Icon: FiAward,
    },
    {
      to: '/affiliate/settings',
      labelKey: 'panel.nav.settings',
      Icon: FiSettings,
    },
  ],
}

export default affiliateRole
