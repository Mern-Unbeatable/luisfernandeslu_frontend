import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Seo from '@/components/common/Seo/Seo'
import RejectionBanner from '@/components/common/RejectionBanner'
import PanelProfile from '@/components/forms/PanelProfile'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import {
  useChangeFactoryPasswordMutation,
  useGetFactoryProfileQuery,
  useRemoveFactoryAvatarMutation,
  useUpdateFactoryEupagoMutation,
  useUpdateFactoryProfileMutation,
  useUpdateFactoryWarehousesMutation,
  useUploadFactoryAvatarMutation,
} from '@/features/factory-profile/factoryProfileApi'
import PanelProfileSkeleton from '@/components/common/Skeleton/PanelProfileSkeleton'

const ALLOWED_AVATAR_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

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
    eupagoApiKey: '',
    eupagoExternKey: '',
    hasEupagoCredentials: false,
    avatarUrl: null,
    warehouses: [],
  }
}

function mapFactoryProfileToForm(profile) {
  const warehouses = Array.isArray(profile?.warehouses)
    ? profile.warehouses.map((item, index) => ({
        id: item.id || `wh-${index + 1}`,
        label: item.label || `Warehouse ${index + 1}`,
        address: item.address || '',
      }))
    : []

  return {
    displayName: profile?.displayName || profile?.name || '',
    displayEmail: profile?.displayEmail || profile?.email || '',
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    eupagoApiKey: '',
    eupagoExternKey: '',
    hasEupagoCredentials: Boolean(profile?.hasEupagoCredentials),
    avatarUrl: profile?.avatarUrl || null,
    warehouses,
  }
}

function toWarehousePayload(warehouses) {
  return (warehouses || [])
    .map((item, index) => {
      const address = String(item.address || '').trim()
      if (!address) return null

      const id = String(item.id || '').trim()
      const isLocalId = !id || id.startsWith('wh-')

      return {
        ...(isLocalId ? {} : { id }),
        label: String(item.label || '').trim() || `Warehouse ${index + 1}`,
        address,
      }
    })
    .filter(Boolean)
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const [form, setForm] = useState(emptyForm)

  const { data, isLoading, isError, error, refetch } = useGetFactoryProfileQuery()
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateFactoryProfileMutation()
  const [updateWarehouses, { isLoading: isSavingWarehouses }] =
    useUpdateFactoryWarehousesMutation()
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangeFactoryPasswordMutation()
  const [updateEupago, { isLoading: isSavingEupago }] =
    useUpdateFactoryEupagoMutation()
  const [uploadAvatar] = useUploadFactoryAvatarMutation()
  const [removeAvatar] = useRemoveFactoryAvatarMutation()

  useEffect(() => {
    if (!data?.profile) return
    setForm(mapFactoryProfileToForm(data.profile))
  }, [data?.profile])

  const handleUpdateProfile = async ({ name, phone }) => {
    try {
      const result = await updateProfile({
        name: String(name || '').trim(),
        phone: String(phone || '').trim(),
      }).unwrap()
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

  const handleSaveWarehouses = async (warehouses) => {
    const payload = toWarehousePayload(warehouses)
    if (payload.length < 1) {
      toast.error(
        t('panel.profile.warehouseRequired', {
          defaultValue: 'Add at least one warehouse address',
        }),
      )
      return
    }

    try {
      const result = await updateWarehouses(payload).unwrap()
      toast.success(
        result?.message ||
          t('panel.profile.warehousesSaved', {
            defaultValue: 'Warehouses saved',
          }),
      )
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Failed to save warehouses'))
    }
  }

  const handleChangePassword = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    if (!String(currentPassword || '').trim()) {
      toast.error(
        t('panel.profile.currentPasswordRequired', {
          defaultValue: 'Current password is required',
        }),
      )
      return
    }
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
        currentPassword,
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

  const handleSaveEupago = async ({ eupagoApiKey, eupagoExternKey }) => {
    try {
      const result = await updateEupago({
        eupagoApiKey: String(eupagoApiKey || '').trim() || undefined,
        eupagoExternKey: String(eupagoExternKey || '').trim() || undefined,
      }).unwrap()
      setForm((prev) => ({
        ...prev,
        eupagoApiKey: '',
        eupagoExternKey: '',
        hasEupagoCredentials: true,
      }))
      toast.success(
        result?.message ||
          t('panel.profile.eupagoSaved', {
            defaultValue: 'EuPago credentials saved',
          }),
      )
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Failed to save EuPago credentials'))
    }
  }

  const handleUploadAvatar = async (file) => {
    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      toast.error(
        t('panel.profile.avatarInvalidType', {
          defaultValue: 'Use a JPEG, PNG, or WEBP image',
        }),
      )
      return
    }
    try {
      const result = await uploadAvatar(file).unwrap()
      if (result?.profile) {
        setForm(mapFactoryProfileToForm(result.profile))
      } else {
        await refetch()
      }
      toast.success(
        result?.message ||
          t('panel.profile.avatarUpdated', { defaultValue: 'Avatar updated' }),
      )
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Failed to upload avatar'))
    }
  }

  const handleRemoveAvatar = async () => {
    if (!form.avatarUrl) return
    try {
      const result = await removeAvatar().unwrap()
      if (result?.profile) {
        setForm(mapFactoryProfileToForm(result.profile))
      } else {
        setForm((prev) => ({ ...prev, avatarUrl: null }))
      }
      toast.success(
        result?.message ||
          t('panel.profile.avatarRemoved', { defaultValue: 'Avatar removed' }),
      )
    } catch (err) {
      toast.error(getAuthErrorMessage(err, 'Failed to remove avatar'))
    }
  }

  if (isLoading) {
    return (
      <>
        <Seo title={t('panel.profile.title')} />
        <PanelProfileSkeleton showWarehouses />
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
      {form?.rejectionReason && (
        <div className="mb-6">
          <RejectionBanner rejectionReason={form.rejectionReason} />
        </div>
      )}
      <PanelProfile
        role="factory"
        value={form}
        onChange={setForm}
        passwordMode="full"
        onUpdateProfile={handleUpdateProfile}
        onSaveWarehouses={handleSaveWarehouses}
        onChangePassword={handleChangePassword}
        onSaveEupago={handleSaveEupago}
        onUploadAvatar={handleUploadAvatar}
        onRemoveAvatar={handleRemoveAvatar}
        showIban={false}
        isUpdatingProfile={isUpdatingProfile}
        isSavingWarehouses={isSavingWarehouses}
        isChangingPassword={isChangingPassword}
        isSavingEupago={isSavingEupago}
      />
    </>
  )
}
