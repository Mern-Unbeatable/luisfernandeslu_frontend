import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBuyerRoleConfig } from '../../roles'

export default function BuyerDashboardPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const qs = params.toString()
  const withQs = (to) => (qs ? `${to}?${qs}` : to)
  const {
    userName = 'John',
    onLogout,
    roleConfig: configFromLayout,
    role,
  } = useOutletContext() || {}

  const roleConfig = configFromLayout || getBuyerRoleConfig(role)

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-3">
        <p className="text-base text-[var(--primary-text)] sm:text-lg">
          {t('buyer.hello', { name: userName })}{' '}
          <span className="text-[var(--secondary-text)]">
            {t('buyer.notYou', { name: userName })}{' '}
            <button
              type="button"
              onClick={onLogout}
              className="font-semibold text-[var(--active)] underline-offset-2 hover:underline"
            >
              {t('buyer.logOut')}
            </button>
            )
          </span>
        </p>

        <p className="max-w-3xl text-sm leading-relaxed text-[var(--secondary-text)] sm:text-base">
          {t('buyer.introPrefix')}{' '}
          {roleConfig.introLinks.map((link, index) => (
            <span key={link.labelKey}>
              {link.separatorKey ? t(link.separatorKey) : null}
              {index > 0 && !link.separatorKey ? ', ' : null}
              <Link
                to={withQs(link.to)}
                className="font-semibold text-[var(--active)] hover:underline"
              >
                {t(link.labelKey)}
              </Link>
            </span>
          ))}
          {t('buyer.introAfter')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {roleConfig.dashboardCards.map(({ id, labelKey, to, Icon }) => (
          <Link
            key={id}
            to={withQs(to)}
            className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-sm border border-gray-300 bg-white px-6 py-10 transition-colors hover:border-[var(--active)]"
          >
            <Icon
              className="size-12 text-[var(--primary-text)]"
              strokeWidth={1.25}
            />
            <span className="text-lg font-medium text-[var(--primary-text)]">
              {t(labelKey)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
