import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import PanelProfile from '@/components/forms/PanelProfile'
import {
  useChangeAffiliatePasswordMutation,
  useGetAffiliateIbanQuery,
  useGetAffiliateProfileQuery,
  useUpdateAffiliateIbanMutation,
  useUpdateAffiliateProfileMutation,
} from '@/features/affiliate/affiliateProfileApi'

function emptyForm() {
  return {
    displayName: '',
    displayEmail: '',
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    iban: '',
    ibanPhone: '',
    businessName: '',
    avatarUrl: null,
    warehouses: [],
  }
}

function mapToForm(profile, iban) {
  return {
    displayName: profile?.name ?? '',
    displayEmail: profile?.email ?? '',
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phoneNumber ?? '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    iban: iban?.ibanNumber ?? profile?.ibanNumber ?? '',
    ibanPhone: iban?.linkedPhoneNumber ?? profile?.phoneNumber ?? '',
    businessName:
      iban?.businessName ?? profile?.companyName ?? profile?.name ?? '',
    avatarUrl: null,
    warehouses: [],
  }
}

export default function SettingsPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState(emptyForm)

  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetAffiliateProfileQuery()
  const { data: ibanResponse, isLoading: isIbanLoading } =
    useGetAffiliateIbanQuery()

  const [updateProfile] = useUpdateAffiliateProfileMutation()
  const [changePassword] = useChangeAffiliatePasswordMutation()
  const [updateIban] = useUpdateAffiliateIbanMutation()

  const profile = profileResponse?.profile
  const iban = ibanResponse?.iban

  useEffect(() => {
    if (!profile) return
    setForm(mapToForm(profile, iban))
  }, [profile, iban])

  const handleUpdateProfile = async ({ name, phone }) => {
    try {
      const result = await updateProfile({
        name: String(name || '').trim(),
        phoneNumber: String(phone || '').trim(),
      }).unwrap()
      toast.success(result?.message || 'Profile updated')
    } catch (error) {
      toast.error(error?.data?.message || error?.error || 'Profile update failed')
    }
  }

  const handleChangePassword = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      }).unwrap()
      toast.success(result?.message || 'Password updated')
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || 'Password update failed',
      )
    }
  }

  const handleSaveIban = async ({ iban: ibanNumber, ibanPhone }) => {
    try {
      const result = await updateIban({
        ibanNumber: String(ibanNumber || '').trim(),
        linkedPhoneNumber: String(ibanPhone || '').trim(),
        businessName: String(form.businessName || '').trim(),
      }).unwrap()
      toast.success(result?.message || 'IBAN updated')
    } catch (error) {
      toast.error(error?.data?.message || error?.error || 'IBAN update failed')
    }
  }

  const isLoading = isProfileLoading || isIbanLoading

  return (
    <>
      <Seo title={t('panel.profile.title')} />
      {isLoading ? (
        <p className="text-sm text-[var(--secondary-text)]">—</p>
      ) : (
        <PanelProfile
          role="affiliate"
          value={form}
          onChange={setForm}
          passwordMode="full"
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
          onSaveIban={handleSaveIban}
        />
      )}
    </>
  )
}
