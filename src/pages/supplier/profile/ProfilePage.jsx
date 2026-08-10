import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import PanelProfile from '@/components/forms/PanelProfile'
import { DEMO_PANEL_PROFILE_SUPPLIER } from '@/data/demoData'

export default function ProfilePage() {
  const { t } = useTranslation()

  // TODO: replace DEMO_* with supplier profile API fetch
  const profile = DEMO_PANEL_PROFILE_SUPPLIER

  return (
    <>
      <Seo title={t('panel.profile.title')} />
      <PanelProfile
        role="supplier"
        defaultValue={profile}
        onUpdateProfile={() => {
          // TODO: wire supplier profile update API
        }}
        onSaveWarehouses={() => {
          // TODO: wire supplier warehouse API
        }}
        onChangePassword={() => {
          // TODO: wire supplier password change API
        }}
        onSaveIban={() => {
          // TODO: wire supplier IBAN API
        }}
      />
    </>
  )
}
