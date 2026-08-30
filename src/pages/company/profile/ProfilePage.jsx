import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import PanelProfile from '@/components/forms/PanelProfile'
import {
  useChangeCompanyProfilePasswordMutation,
  useGetCompanyProfileQuery,
  useUpdateCompanyBillingAddressMutation,
  useUpdateCompanyProfileIbanMutation,
  useUpdateCompanyProfileMutation,
  useUpdateCompanyShippingAddressMutation,
  useUploadCompanyProfileAvatarMutation,
  useDeleteCompanyProfileAvatarMutation,
} from '@/features/company/companyProfileApi'
import {
  emptyCompanyProfileForm,
  mapCompanyAddressToPayload,
  mapCompanyProfileToForm,
  mapCompanyProfileToPayload,
} from '@/features/company/companyProfileMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import { isValidPhone } from '@/utils/phoneUtils'

const ALLOWED_AVATAR_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

export default function ProfilePage() {
  const { t } = useTranslation()
  const [form, setForm] = useState(emptyCompanyProfileForm)

  const { data, isLoading, isError, error, refetch } =
    useGetCompanyProfileQuery()

  const [updateProfile] = useUpdateCompanyProfileMutation()
  const [changePassword] = useChangeCompanyProfilePasswordMutation()
  const [updateIban] = useUpdateCompanyProfileIbanMutation()
  const [updateBillingAddress] = useUpdateCompanyBillingAddressMutation()
  const [updateShippingAddress] = useUpdateCompanyShippingAddressMutation()
  const [uploadAvatar] = useUploadCompanyProfileAvatarMutation()
  const [deleteAvatar] = useDeleteCompanyProfileAvatarMutation()

  useEffect(() => {
    if (!data?.profile) return
    setForm(mapCompanyProfileToForm(data.profile))
  }, [data?.profile])

  const ensureValidPhone = (phone) => {
    if (isValidPhone(phone)) return true
    toast.error(t('panel.profile.phoneInvalid'))
    return false
  }

  const handleUpdateProfile = async (payload) => {
    if (!ensureValidPhone(payload.phone)) return

    try {
      const result = await updateProfile(mapCompanyProfileToPayload(payload))
        .unwrap()

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
        confirmPassword,
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

  const handleSaveIban = async ({ iban, ibanPhone }) => {
    if (!ensureValidPhone(ibanPhone)) return

    try {
      const result = await updateIban({
        iban: String(iban || '').trim(),
        ibanPhone: String(ibanPhone || '').trim(),
      }).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t('panel.profile.ibanUpdateFailed')))
        return
      }

      toast.success(result?.message || t('panel.profile.ibanUpdateSuccess'))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t('panel.profile.ibanUpdateFailed')))
    }
  }

  const handleSaveBillingAddress = async (address) => {
    if (!ensureValidPhone(address?.phone)) return

    try {
      const result = await updateBillingAddress(
        mapCompanyAddressToPayload(address),
      ).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t('panel.profile.updateFailed')))
        return
      }

      toast.success(result?.message || t('panel.profile.updateSuccess'))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t('panel.profile.updateFailed')))
    }
  }

  const handleSaveShippingAddress = async (address) => {
    if (!ensureValidPhone(address?.phone)) return

    try {
      const result = await updateShippingAddress(
        mapCompanyAddressToPayload(address),
      ).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t('panel.profile.updateFailed')))
        return
      }

      toast.success(result?.message || t('panel.profile.updateSuccess'))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t('panel.profile.updateFailed')))
    }
  }

  const handleUploadAvatar = async (file) => {
    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      toast.error(t('panel.profile.avatarInvalidType'))
      throw new Error('invalid avatar type')
    }

    try {
      const result = await uploadAvatar(file).unwrap()

      if (result?.success === false) {
        toast.error(
          getAuthErrorMessage(result, t('panel.profile.avatarUploadFailed')),
        )
        throw new Error('avatar upload failed')
      }

      toast.success(result?.message || t('panel.profile.avatarUploadSuccess'))
      await refetch()
    } catch (err) {
      if (
        err?.message === 'invalid avatar type'
        || err?.message === 'avatar upload failed'
      ) {
        throw err
      }
      toast.error(getAuthErrorMessage(err, t('panel.profile.avatarUploadFailed')))
      throw err
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      const result = await deleteAvatar().unwrap()

      if (result?.success === false) {
        toast.error(
          getAuthErrorMessage(result, t('panel.profile.avatarRemoveFailed')),
        )
        throw new Error('avatar remove failed')
      }

      toast.success(result?.message || t('panel.profile.avatarRemoveSuccess'))
      await refetch()
    } catch (err) {
      if (err?.message === 'avatar remove failed') {
        throw err
      }
      toast.error(getAuthErrorMessage(err, t('panel.profile.avatarRemoveFailed')))
      throw err
    }
  }

  return (
    <>
      <Seo
        title={t('buyer.account')}
        description={t('seo.buyerAccountDescription')}
      />

      {isError ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
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
        <p className="text-sm text-[var(--secondary-text)]">
          {t('panel.profile.loading')}
        </p>
      ) : (
        <PanelProfile
          role="company"
          value={form}
          onChange={setForm}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
          onSaveIban={handleSaveIban}
          onSaveBillingAddress={handleSaveBillingAddress}
          onSaveShippingAddress={handleSaveShippingAddress}
          onUploadAvatar={handleUploadAvatar}
          onRemoveAvatar={handleRemoveAvatar}
        />
      )}
    </>
  )
}
