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
  basePath: '/panel',
  activeVariant: 'soft',
  showMainMenu: false,
  nav: [
    {
      to: '/panel',
      labelKey: 'panel.nav.overviewDashboard',
      Icon: FiGrid,
      end: true,
    },
    {
      to: '/panel/referral-channels',
      labelKey: 'panel.nav.referralChannels',
      Icon: FiLink,
    },
    {
      to: '/panel/referred-clients',
      labelKey: 'panel.nav.referredClients',
      Icon: FiUser,
    },
    {
      to: '/panel/commissions',
      labelKey: 'panel.nav.commissions',
      Icon: FiDollarSign,
    },
    {
      to: '/panel/affiliate-levels',
      labelKey: 'panel.nav.affiliateLevels',
      Icon: FiAward,
    },
    {
      to: '/panel/settings',
      labelKey: 'panel.nav.settings',
      Icon: FiSettings,
    },
  ],
}

export default affiliateRole
