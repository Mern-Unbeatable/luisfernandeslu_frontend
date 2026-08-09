import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiDownload, FiTrash2 } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import PermissionToggle from './components/PermissionToggle'
import RolesPermissionsMatrixCard from './components/RolesPermissionsMatrixCard'
import {
  ADMIN_PERMISSION_EDIT_MATRIX,
  ADMIN_PERMISSION_VISIBILITY_MATRIX,
  INVITE_ROLE_OPTIONS,
} from './data/rolesPermissionsAdminDemo'

const I18N_KEY = 'adminRolesPermissions'

export default function RolesPermissionsPage() {
  const { t } = useTranslation()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState(INVITE_ROLE_OPTIONS[0].value)
  const [editRows, setEditRows] = useState(ADMIN_PERMISSION_EDIT_MATRIX)
  const [visibilityRows] = useState(ADMIN_PERMISSION_VISIBILITY_MATRIX)

  const handleEditToggle = (id, next) => {
    setEditRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, editEnabled: next } : row,
      ),
    )
  }

  const handleRemoveEditRow = (id) => {
    setEditRows((prev) => prev.filter((row) => row.id !== id))
  }

  const handleSendInvite = () => {
    setInviteEmail('')
  }

  const handleDownloadVisibility = () => {}

  const editColumns = useMemo(
    () => [
      {
        key: 'moduleKey',
        header: t(`${I18N_KEY}.columns.modulePage`),
        render: (moduleKey) => t(`${I18N_KEY}.${moduleKey}`),
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
              onChange={(next) => handleEditToggle(row.id, next)}
              ariaLabel={t(`${I18N_KEY}.editMatrix.toggleAria`, {
                module: t(`${I18N_KEY}.${row.moduleKey}`),
              })}
            />
          </div>
        ),
      },
      {
        key: 'id',
        header: t(`${I18N_KEY}.columns.action`),
        headerClassName: 'text-right',
        className: 'text-right',
        render: (_, row) => (
          <button
            type="button"
            onClick={() => handleRemoveEditRow(row.id)}
            className="inline-flex size-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
            aria-label={t(`${I18N_KEY}.editMatrix.deleteAria`, {
              module: t(`${I18N_KEY}.${row.moduleKey}`),
            })}
          >
            <FiTrash2 className="size-4" aria-hidden />
          </button>
        ),
      },
    ],
    [t],
  )

  const visibilityColumns = useMemo(
    () => [
      {
        key: 'moduleKey',
        header: t(`${I18N_KEY}.columns.modulePage`),
        render: (moduleKey) => t(`${I18N_KEY}.${moduleKey}`),
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
                className="h-10 w-full rounded-lg border border-[color-mix(in_srgb,var(--active)_22%,white)] bg-[color-mix(in_srgb,var(--active)_8%,white)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
              />
            </label>
            <label className="flex w-full flex-col gap-1.5 sm:w-auto">
              <span className="text-xs font-semibold text-[var(--secondary-text)]">
                {t(`${I18N_KEY}.invite.roleLabel`)}
              </span>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="h-10 w-full rounded-lg border border-[color-mix(in_srgb,var(--active)_22%,white)] bg-[color-mix(in_srgb,var(--active)_8%,white)] px-3 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
              >
                {INVITE_ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`${I18N_KEY}.${option.labelKey}`)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleSendInvite}
              className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-lg bg-[var(--active)] px-5 text-sm font-semibold text-white hover:brightness-95 sm:w-auto"
            >
              {t(`${I18N_KEY}.invite.send`)}
            </button>
          </div>
        </article>

        <RolesPermissionsMatrixCard
          title={t(`${I18N_KEY}.editMatrix.title`)}
          columns={editColumns}
          data={editRows}
          emptyMessage={t(`${I18N_KEY}.editMatrix.empty`)}
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
          data={visibilityRows}
          getRowKey={(row) => row.id}
        />
      </div>
    </>
  )
}
