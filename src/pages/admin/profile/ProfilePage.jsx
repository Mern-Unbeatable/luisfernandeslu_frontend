import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import PanelProfile from '@/components/forms/PanelProfile'
import { DEMO_PANEL_PROFILE_ADMIN } from '@/data/demoData'

export default function ProfilePage() {
  const { t } = useTranslation()

  // TODO: replace DEMO_* with admin profile API fetch
  const profile = DEMO_PANEL_PROFILE_ADMIN

  return (
    <>
      <Seo
        title={t('panel.profile.title')}
        description={t('panel.profile.subtitle')}
      />
      <PanelProfile role="admin" defaultValue={profile} />
    </>
  )
}
