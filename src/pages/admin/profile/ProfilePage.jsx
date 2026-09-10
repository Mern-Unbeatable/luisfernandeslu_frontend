import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import PanelProfile from '@/components/forms/PanelProfile'
import PanelProfileSkeleton from '@/components/common/Skeleton/PanelProfileSkeleton'
import {
  useChangeAdminProfilePasswordMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileIbanMutation,
  useUpdateAdminProfileMutation,
} from '@/features/admin/adminProfileApi'
import { mapAdminProfileToForm } from '@/features/admin/adminProfileMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

export default function ProfilePage() {
  const { t } = useTranslation()
  const staffRole = useSelector((state) => state.auth.user?.staffRole)
  const isModerator = staffRole === 'moderator'
  const [form, setForm] = useState(() => mapAdminProfileToForm(null))

  const { data, isLoading, isError, error, refetch } = useGetAdminProfileQuery()

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateAdminProfileMutation()
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangeAdminProfilePasswordMutation()
  const [updateEupago, { isLoading: isSavingEupago }] =
    useUpdateAdminProfileIbanMutation()

  useEffect(() => {
    if (!data?.profile) return
    setForm(mapAdminProfileToForm(data.profile))
  }, [data?.profile])

  const handleUpdateProfile = async ({ name }) => {
    try {
      const result = await updateProfile({
        name: String(name || '').trim(),
      }).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t('panel.profile.updateFailed')))
        return
      }

      toast.success(result?.message || t('panel.profile.updateSuccess'))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t('panel.profile.updateFailed')))
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

      if (result?.success === false) {
        toast.error(
          getAuthErrorMessage(result, t('panel.profile.passwordUpdateFailed')),
        )
        return
      }

      toast.success(result?.message || t('panel.profile.passwordUpdateSuccess'))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t('panel.profile.passwordUpdateFailed')))
    }
  }

  const handleSaveEupago = async ({ eupagoApiKey, eupagoExternKey }) => {
    if (isModerator) return
    try {
      const result = await updateEupago({
        eupagoApiKey: String(eupagoApiKey || '').trim() || undefined,
        eupagoExternKey: String(eupagoExternKey || '').trim() || undefined,
      }).unwrap()

      if (result?.success === false) {
        toast.error(
          getAuthErrorMessage(result, t('panel.profile.ibanUpdateFailed')),
        )
        return
      }

      setForm((prev) => ({
        ...prev,
        eupagoApiKey: '',
        eupagoExternKey: '',
      }))
      toast.success(
        result?.message ||
          t('panel.profile.eupagoSaved', {
            defaultValue: 'EuPago credentials saved',
          }),
      )
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t('panel.profile.ibanUpdateFailed')))
    }
  }

  return (
    <>
      <Seo
        title={t('panel.profile.title')}
        description={t('panel.profile.subtitle')}
      />

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, t('panel.profile.loadFailed'))}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t('panel.profile.retry')}
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <PanelProfileSkeleton showIban={!isModerator} />
      ) : (
        <PanelProfile
          role="admin"
          value={form}
          onChange={setForm}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
          onSaveEupago={isModerator ? undefined : handleSaveEupago}
          showIban={false}
          showEupagoCredentials={!isModerator}
          isUpdatingProfile={isUpdatingProfile}
          isChangingPassword={isChangingPassword}
          isSavingEupago={isSavingEupago}
        />
      )}
    </>
  )
}
