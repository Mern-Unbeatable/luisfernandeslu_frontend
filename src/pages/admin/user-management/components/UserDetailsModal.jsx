import { useTranslation } from 'react-i18next'
import { FiFileText, FiMapPin, FiX } from 'react-icons/fi'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import { useGetAdminUserByIdQuery } from '@/features/admin/adminUserApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import TypeBadge from './TypeBadge'
import AccountStatusBadge from './AccountStatusBadge'

function DetailField({ label, value, className = '' }) {
  return (
    <div className={`rounded-lg bg-[#FAF7F2] px-4 py-3 ${className}`}>
      <p className="text-xs font-medium text-[var(--secondary-text)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--primary-text)]">{value}</p>
    </div>
  )
}

export default function UserDetailsModal({ open, userId, onClose }) {
  const { t } = useTranslation()
  const { data, isLoading, isError, error } = useGetAdminUserByIdQuery(userId, {
    skip: !open || !userId,
  })

  if (!open || !userId) return null

  const user = data?.user
  const registeredLabel = user?.registered
    ? t('adminUserManagement.modal.registeredOn', { date: user.registered })
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-details-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label={t('adminUserManagement.modal.close')}
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100"
          aria-label={t('adminUserManagement.modal.close')}
        >
          <FiX className="size-5" />
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--active)_14%,white)] text-[var(--active)]">
              <FiFileText className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <h2
                id="user-details-title"
                className="text-lg font-bold text-[var(--primary-text)]"
              >
                {t('adminUserManagement.modal.title')}
              </h2>
            </div>
          </div>
          {registeredLabel ? (
            <p className="text-xs text-[var(--secondary-text)]">{registeredLabel}</p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
        ) : isError || !user ? (
          <p className="mt-6 text-sm text-red-500" role="alert">
            {getAuthErrorMessage(error, t('adminUserManagement.detailsFailed'))}
          </p>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailField
                label={t('adminUserManagement.columns.name')}
                value={user.name}
                className="sm:col-span-2"
              />
              <DetailField label={t('adminUserManagement.columns.email')} value={user.email} />
              <DetailField
                label={t('adminUserManagement.columns.phone')}
                value={user.phone || '—'}
              />
              <div className="rounded-lg bg-[#FAF7F2] px-4 py-3">
                <p className="text-xs font-medium text-[var(--secondary-text)]">
                  {t('adminUserManagement.columns.type')}
                </p>
                <div className="mt-2">
                  <TypeBadge label={user.type} />
                </div>
              </div>
              <div className="rounded-lg bg-[#FAF7F2] px-4 py-3">
                <p className="text-xs font-medium text-[var(--secondary-text)]">
                  {t('adminUserManagement.columns.status')}
                </p>
                <div className="mt-2">
                  <AccountStatusBadge status={user.status} />
                </div>
              </div>
            </div>

            {user.address ? (
              <div className="mt-4 rounded-lg bg-[#FAF7F2] px-4 py-3">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--active)] uppercase">
                  <FiMapPin className="size-3.5" aria-hidden />
                  {t('adminUserManagement.modal.address')}
                </p>
                <p className="mt-2 text-sm text-[var(--primary-text)]">{user.address}</p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
