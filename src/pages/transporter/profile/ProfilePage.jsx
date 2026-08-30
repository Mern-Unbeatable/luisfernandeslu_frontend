import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import PanelProfile from '@/components/forms/PanelProfile'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import {
  useChangeTransporterPasswordMutation,
  useGetTransporterProfileQuery,
  useRemoveTransporterAvatarMutation,
  useUpdateTransporterIbanMutation,
  useUpdateTransporterProfileMutation,
  useUploadTransporterAvatarMutation,
} from '@/features/transporter-profile/transporterProfileApi'

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
    avatarUrl: null,
  }
}

function mapTransporterProfileToForm(profile) {
  return {
    displayName: profile?.displayName || profile?.name || '',
    displayEmail: profile?.displayEmail || profile?.email || '',
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    iban: profile?.iban || '',
    ibanPhone: profile?.ibanPhone || '',
    avatarUrl: profile?.avatarUrl || null,
  }
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const [form, setForm] = useState(emptyForm)

  const { data, isLoading, isError, error, refetch } = useGetTransporterProfileQuery()
  const [updateProfile] = useUpdateTransporterProfileMutation()
  const [changePassword] = useChangeTransporterPasswordMutation()
  const [updateIban] = useUpdateTransporterIbanMutation()
  const [uploadAvatar] = useUploadTransporterAvatarMutation()
  const [removeAvatar] = useRemoveTransporterAvatarMutation()

  useEffect(() => {
    if (!data?.profile) return
    setForm(mapTransporterProfileToForm(data.profile))
  }, [data?.profile])

  const handleUpdateProfile = async ({ name, phone }) => {
    const trimmedName = String(name || '').trim()
    const trimmedPhone = String(phone || '').trim()

    if (!trimmedName) {
      toast.error(
        t('panel.profile.nameRequired', {
          defaultValue: 'Name is required',
        }),
      )
      return
    }

    try {
      const result = await updateProfile({
        name: trimmedName,
        phone: trimmedPhone,
      }).unwrap()

      if (result?.profile) {
        setForm(mapTransporterProfileToForm(result.profile))
      }

      toast.success(
        result?.message ||
          t('panel.profile.updateSuccess', {
            defaultValue: 'Profile updated',
          }),
      )
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Failed to update profile'))
    }
  }

  const handleChangePassword = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    if (!String(newPassword || '').trim()) {
      toast.error(
        t('panel.profile.newPasswordRequired', {
          defaultValue: 'New password is required',
        }),
      )
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error(
        t('panel.profile.passwordMismatch', {
          defaultValue: 'New password and confirm password do not match',
        }),
      )
      return
    }

    try {
      const result = await changePassword({
        ...(currentPassword ? { currentPassword } : {}),
        newPassword,
        confirmPassword,
      }).unwrap()
      toast.success(
        result?.message ||
          t('panel.profile.passwordChanged', {
            defaultValue: 'Password changed successfully',
          }),
      )
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Failed to change password'))
    }
  }

  const handleSaveIban = async ({ iban, ibanPhone }) => {
    try {
      const result = await updateIban({
        iban: String(iban || '').trim(),
        ibanPhone: String(ibanPhone || '').trim(),
      }).unwrap()
      toast.success(
        result?.message ||
          t('panel.profile.ibanSaved', {
            defaultValue: 'IBAN saved',
          }),
      )
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Failed to save IBAN'))
    }
  }

  const handleUploadAvatar = async (file) => {
    try {
      const result = await uploadAvatar(file).unwrap()
      if (result?.profile) {
        setForm((prev) => ({
          ...prev,
          avatarUrl: result.profile.avatarUrl || null,
        }))
      }
      toast.success(
        result?.message ||
          t('panel.profile.avatarUpdated', {
            defaultValue: 'Avatar updated',
          }),
      )
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Failed to upload avatar'))
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      const result = await removeAvatar().unwrap()
      if (result?.profile) {
        setForm((prev) => ({
          ...prev,
          avatarUrl: result.profile.avatarUrl || null,
        }))
      }
      toast.success(
        result?.message ||
          t('panel.profile.avatarRemoved', {
            defaultValue: 'Avatar removed',
          }),
      )
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Failed to remove avatar'))
    }
  }

  if (isLoading) {
    return (
      <>
        <Seo title={t('panel.profile.title')} />
        <p className="text-sm text-gray-500">Loading profile…</p>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <Seo title={t('panel.profile.title')} />
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, 'Failed to load profile')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Seo title={t('panel.profile.title')} />
      <PanelProfile
        role="transporter"
        value={form}
        onChange={setForm}
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleChangePassword}
        onSaveIban={handleSaveIban}
        onUploadAvatar={handleUploadAvatar}
        onRemoveAvatar={handleRemoveAvatar}
      />
    </>
  )
}
