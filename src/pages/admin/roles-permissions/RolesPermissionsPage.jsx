import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiDownload } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import {
  useGetAdminRolesPermissionsQuery,
  useInviteAdminRoleMemberMutation,
  useUpdateAdminRolePermissionsMutation,
} from '@/features/admin/adminRolesPermissionsApi'
import {
  mapAdminRolePermissionEditRow,
  mapAdminRolePermissionRole,
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
  const [inviteRole, setInviteRole] = useState('moderator')
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

  const roles = useMemo(
    () => (data?.roles ?? []).map(mapAdminRolePermissionRole),
    [data?.roles],
  )

  const visibilityRows = useMemo(
    () => (data?.visibilityMatrix ?? []).map(mapAdminRolePermissionVisibilityRow),
    [data?.visibilityMatrix],
  )

  useEffect(() => {
    setEditRows((data?.editMatrix ?? []).map(mapAdminRolePermissionEditRow))
  }, [data?.editMatrix])

  useEffect(() => {
    if (roles.length === 0) return
    setInviteRole((current) =>
      roles.some((role) => role.value === current)
        ? current
        : roles[0].value,
    )
  }, [roles])

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
    if (!email) return

    try {
      const result = await inviteMember({ email, role: inviteRole }).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.inviteFailed`)))
        return
      }

      toast.success(result?.message || t(`${I18N_KEY}.inviteSuccess`))
      setInviteEmail('')
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
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_9.5rem_auto] sm:items-end">
            <label className="flex min-w-0 flex-col gap-1.5">
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
            <label className="flex w-full flex-col gap-1.5 sm:w-auto">
              <span className="text-xs font-semibold text-[var(--secondary-text)]">
                {t(`${I18N_KEY}.invite.roleLabel`)}
              </span>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                disabled={isInviting || roles.length === 0}
                className="h-10 w-full rounded-lg border border-[color-mix(in_srgb,var(--active)_22%,white)] bg-[color-mix(in_srgb,var(--active)_8%,white)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleSendInvite}
              disabled={isInviting || !inviteEmail.trim()}
              className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-lg bg-[var(--active)] px-5 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
