import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiDownload, FiEye, FiEyeOff } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import {
  useGetAdminRolesPermissionsQuery,
  useInviteAdminRoleMemberMutation,
  useUpdateAdminRolePermissionsMutation,
} from '@/features/admin/adminRolesPermissionsApi'
import {
  mapAdminRolePermissionEditRow,
  mapAdminRolePermissionVisibilityRow,
  toAdminRolePermissionEditPayload,
} from '@/features/admin/adminRolesPermissionsMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import PermissionToggle from './components/PermissionToggle'
import RolesPermissionsMatrixCard from './components/RolesPermissionsMatrixCard'

const I18N_KEY = 'adminRolesPermissions'
const MATRIX_ROLE = 'moderator'

export default function RolesPermissionsPage() {
  const { t } = useTranslation()
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePassword, setInvitePassword] = useState('')
  const [showInvitePassword, setShowInvitePassword] = useState(false)
  const [editRows, setEditRows] = useState([])

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetAdminRolesPermissionsQuery()

  const [updateRolePermissions, { isLoading: isUpdatingPermissions }] =
    useUpdateAdminRolePermissionsMutation()
  const [inviteMember, { isLoading: isInviting }] =
    useInviteAdminRoleMemberMutation()

  const visibilityRows = useMemo(
    () => (data?.visibilityMatrix ?? []).map(mapAdminRolePermissionVisibilityRow),
    [data?.visibilityMatrix],
  )

  useEffect(() => {
    setEditRows((data?.editMatrix ?? []).map(mapAdminRolePermissionEditRow))
  }, [data?.editMatrix])

  const handleEditToggle = useCallback(
    async (id, next) => {
      const previousRows = editRows
      const nextRows = previousRows.map((row) =>
        row.id === id ? { ...row, editEnabled: next } : row,
      )

      setEditRows(nextRows)

      try {
        const result = await updateRolePermissions({
          role: MATRIX_ROLE,
          edit: toAdminRolePermissionEditPayload(nextRows),
        }).unwrap()

        if (result?.success === false) {
          setEditRows(previousRows)
          toast.error(
            getAuthErrorMessage(result, t(`${I18N_KEY}.permissionsUpdateFailed`)),
          )
          return
        }

        toast.success(
          result?.message || t(`${I18N_KEY}.permissionsUpdated`),
        )
      } catch (err) {
        setEditRows(previousRows)
        toast.error(
          getAuthErrorMessage(err, t(`${I18N_KEY}.permissionsUpdateFailed`)),
        )
      }
    },
    [editRows, updateRolePermissions, t],
  )

  const handleSendInvite = async () => {
    const email = inviteEmail.trim()
    const password = invitePassword
    if (!email || password.length < 8) {
      toast.error(t(`${I18N_KEY}.invite.passwordMin`))
      return
    }

    try {
      const result = await inviteMember({
        email,
        password,
        role: 'moderator',
      }).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.inviteFailed`)))
        return
      }

      toast.success(result?.message || t(`${I18N_KEY}.inviteSuccess`))
      setInviteEmail('')
      setInvitePassword('')
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.inviteFailed`)))
    }
  }

  const handleDownloadVisibility = () => {}

  const editColumns = useMemo(
    () => [
      {
        key: 'module',
        header: t(`${I18N_KEY}.columns.modulePage`),
      },
      {
        key: 'editEnabled',
        header: t(`${I18N_KEY}.columns.moderator`),
        headerClassName: 'text-center',
        className: 'text-center',
        render: (editEnabled, row) => (
          <div className="flex justify-center">
            <PermissionToggle
              checked={editEnabled}
              disabled={isUpdatingPermissions}
              onChange={(next) => handleEditToggle(row.id, next)}
              ariaLabel={t(`${I18N_KEY}.editMatrix.toggleAria`, {
                module: row.module,
              })}
            />
          </div>
        ),
      },
    ],
    [handleEditToggle, isUpdatingPermissions, t],
  )

  const visibilityColumns = useMemo(
    () => [
      {
        key: 'module',
        header: t(`${I18N_KEY}.columns.modulePage`),
      },
      {
        key: 'visible',
        header: t(`${I18N_KEY}.columns.moderator`),
        headerClassName: 'text-right',
        className: 'text-right',
        render: (visible) => (
          <span
            className={
              visible
                ? 'font-medium text-[var(--primary-text)]'
                : 'font-medium text-[var(--secondary-text)]'
            }
          >
            {visible
              ? t(`${I18N_KEY}.visibilityMatrix.visible`)
              : t(`${I18N_KEY}.visibilityMatrix.hidden`)}
          </span>
        ),
      },
    ],
    [t],
  )

  const showInitialLoading = isLoading && !data
  const canSubmit =
    Boolean(inviteEmail.trim()) && invitePassword.length >= 8 && !isInviting

  return (
    <>
      <Seo title={t(`${I18N_KEY}.title`)} />
      <div className="w-full space-y-8 pb-2 sm:space-y-10">
        <header className="max-w-4xl">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
            {t(`${I18N_KEY}.title`)}
          </h1>
          <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
            {t(`${I18N_KEY}.subtitle`)}
          </p>
        </header>

        {isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <p>{getAuthErrorMessage(error, t(`${I18N_KEY}.loadFailed`))}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 font-semibold underline"
            >
              {t(`${I18N_KEY}.retry`)}
            </button>
          </div>
        ) : null}

        <article className="w-full max-w-[min(100%,40rem)] rounded-xl border border-gray-200 border-t-[3px] border-t-[var(--active)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-[var(--active)] sm:text-lg">
            {t(`${I18N_KEY}.invite.title`)}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--secondary-text)]">
            {t(`${I18N_KEY}.invite.description`)}
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end">
            <label className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-semibold text-[var(--secondary-text)]">
                {t(`${I18N_KEY}.invite.emailLabel`)}
              </span>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder={t(`${I18N_KEY}.invite.emailPlaceholder`)}
                disabled={isInviting}
                className="h-10 w-full rounded-lg border border-[color-mix(in_srgb,var(--active)_22%,white)] bg-[color-mix(in_srgb,var(--active)_8%,white)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-semibold text-[var(--secondary-text)]">
                {t(`${I18N_KEY}.invite.passwordLabel`)}
              </span>
              <div className="relative">
                <input
                  type={showInvitePassword ? 'text' : 'password'}
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                  placeholder={t(`${I18N_KEY}.invite.passwordPlaceholder`)}
                  disabled={isInviting}
                  autoComplete="new-password"
                  className="h-10 w-full rounded-lg border border-[color-mix(in_srgb,var(--active)_22%,white)] bg-[color-mix(in_srgb,var(--active)_8%,white)] px-3 pr-11 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowInvitePassword((prev) => !prev)}
                  disabled={isInviting}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-[var(--secondary-text)] hover:bg-black/5 hover:text-[var(--primary-text)] disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={
                    showInvitePassword
                      ? t(`${I18N_KEY}.invite.hidePassword`, 'Hide password')
                      : t(`${I18N_KEY}.invite.showPassword`, 'Show password')
                  }
                >
                  {showInvitePassword ? (
                    <FiEyeOff className="size-4.5" strokeWidth={1.75} />
                  ) : (
                    <FiEye className="size-4.5" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </label>
            <p className="text-xs text-[var(--secondary-text)] sm:col-span-2">
              {t(`${I18N_KEY}.invite.moderatorOnlyHint`)}
            </p>
            <button
              type="button"
              onClick={handleSendInvite}
              disabled={!canSubmit}
              className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-lg bg-[var(--active)] px-5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 sm:w-auto sm:justify-self-start"
            >
              {t(`${I18N_KEY}.invite.send`)}
            </button>
          </div>
        </article>

        <div
          className={
            isFetching && data && !showInitialLoading
              ? 'space-y-8 opacity-60 transition-opacity sm:space-y-10'
              : 'space-y-8 sm:space-y-10'
          }
        >
          <RolesPermissionsMatrixCard
            title={t(`${I18N_KEY}.editMatrix.title`)}
            columns={editColumns}
            data={showInitialLoading ? [] : editRows}
            loading={showInitialLoading}
            emptyMessage={
              showInitialLoading
                ? t(`${I18N_KEY}.loading`)
                : t(`${I18N_KEY}.editMatrix.empty`)
            }
            getRowKey={(row) => row.id}
          />

          <RolesPermissionsMatrixCard
            title={t(`${I18N_KEY}.visibilityMatrix.title`)}
            headerAction={
              <button
                type="button"
                onClick={handleDownloadVisibility}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--active)] px-4 text-sm font-semibold text-white hover:brightness-95"
              >
                <FiDownload className="size-4" aria-hidden />
                {t(`${I18N_KEY}.visibilityMatrix.download`)}
              </button>
            }
            columns={visibilityColumns}
            data={showInitialLoading ? [] : visibilityRows}
            loading={showInitialLoading}
            emptyMessage={
              showInitialLoading
                ? t(`${I18N_KEY}.loading`)
                : t(`${I18N_KEY}.editMatrix.empty`)
            }
            getRowKey={(row) => row.id}
          />
        </div>
      </div>
    </>
  )
}
