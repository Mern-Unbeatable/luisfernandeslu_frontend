import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '../../components/common/Seo/Seo'
import PanelProfile from '../../components/forms/PanelProfile'
import {
  DEMO_PANEL_PROFILE_ADMIN,
  DEMO_PANEL_PROFILE_AFFILIATE,
  DEMO_PANEL_PROFILE_FACTORY,
  DEMO_PANEL_PROFILE_SUPPLIER,
  DEMO_PANEL_PROFILE_TRANSPORTER,
} from '@/data/demoData'

const DEMO_BY_ROLE = {
  supplier: DEMO_PANEL_PROFILE_SUPPLIER,
  factory: DEMO_PANEL_PROFILE_FACTORY,
  transporter: DEMO_PANEL_PROFILE_TRANSPORTER,
  admin: DEMO_PANEL_PROFILE_ADMIN,
  affiliate: DEMO_PANEL_PROFILE_AFFILIATE,
}

/**
 * Shared panel profile screen for supplier / factory / transporter / admin / affiliate.
 */
export default function PanelProfilePage() {
  const { t } = useTranslation()
  const { role } = useOutletContext() || {}
  const resolvedRole = role || 'supplier'

  return (
    <>
      <Seo title={t('panel.profile.title')} />
      <PanelProfile
        role={resolvedRole}
        defaultValue={DEMO_BY_ROLE[resolvedRole] || DEMO_PANEL_PROFILE_SUPPLIER}
      />
    </>
  )
}
