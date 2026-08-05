import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import PanelProfile from '@/components/forms/PanelProfile'
import { DEMO_PANEL_PROFILE_AFFILIATE } from '@/data/demoData'

export default function SettingsPage() {
  const { t } = useTranslation()

  // TODO: replace DEMO_* with affiliate profile API fetch
  const profile = DEMO_PANEL_PROFILE_AFFILIATE

  return (
    <>
      <Seo title={t('panel.profile.title')} />
      <PanelProfile role="affiliate" defaultValue={profile} />
    </>
  )
}
