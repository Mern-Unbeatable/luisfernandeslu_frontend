import { useTranslation } from 'react-i18next'
import Seo from '../../components/common/Seo/Seo'
import PanelProfile from '@/components/forms/PanelProfile'
import { DEMO_PANEL_PROFILE_TRANSPORTER } from '@/data/demoData'

export default function ProfilePage() {
  const { t } = useTranslation()

  // TODO: replace DEMO_* with transporter profile API fetch
  const profile = DEMO_PANEL_PROFILE_TRANSPORTER

  return (
    <>
      <Seo title={t('panel.profile.title')} />
      <PanelProfile role="transporter" defaultValue={profile} />
    </>
  )
}
