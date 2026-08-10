import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import PanelProfile from '@/components/forms/PanelProfile'
import { DEMO_PANEL_PROFILE_COMPANY } from '@/data/demoData'

export default function ProfilePage() {
  const { t } = useTranslation()

  // TODO: replace DEMO_* with company profile API fetch
  const profile = DEMO_PANEL_PROFILE_COMPANY

  return (
    <>
      <Seo
        title={t('buyer.account')}
        description={t('seo.buyerAccountDescription')}
      />
      <PanelProfile role="company" defaultValue={profile} />
    </>
  )
}
