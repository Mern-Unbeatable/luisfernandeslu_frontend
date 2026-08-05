import { useTranslation } from 'react-i18next'
import { DEMO_PASSWORD, DEMO_USERS } from '@/data/demoData'

/**
 * Demo credentials for login pages.
 * When `role` is set, only that role’s account is shown.
 */
export default function AuthDemoAccounts({ role, onUse }) {
  const { t } = useTranslation()
  const users = role
    ? DEMO_USERS.filter((user) => user.role === role)
    : DEMO_USERS

  if (users.length === 0) return null

  return (
    <div className="mt-6 rounded-xl border border-dashed border-[var(--active)]/40 bg-[#FFFBF5] p-4">
      <p className="text-sm font-semibold text-[var(--primary-text)]">
        {t('auth.demo.title')}
      </p>
      <p className="mt-1 text-xs text-[var(--secondary-text)]">
        {t('auth.demo.hint', { password: DEMO_PASSWORD })}
      </p>
      <ul className="mt-3 space-y-1.5">
        {users.map((user) => (
          <li key={user.email}>
            <button
              type="button"
              onClick={() => onUse(user)}
              className="flex w-full items-center justify-between gap-2 rounded-lg bg-[var(--active)]/10 px-2.5 py-2.5 text-left text-xs ring-1 ring-[var(--active)]/30 transition-colors hover:bg-[var(--active)]/15"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-[var(--primary-text)]">
                  {t(user.labelKey)}
                </span>
                <span className="mt-0.5 block truncate text-[var(--secondary-text)]">
                  {user.email}
                </span>
                <span className="mt-0.5 block text-[var(--secondary-text)]">
                  {t('auth.password')}: {user.password}
                </span>
              </span>
              <span className="shrink-0 font-semibold text-[var(--active)]">
                {t('auth.demo.use')}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
