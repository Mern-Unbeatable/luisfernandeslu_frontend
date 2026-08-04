import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getBuyerRoleConfig } from '../../roles'

export default function BuyerAccountDashboard() {
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
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <div className="w-full space-y-3">
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

        <p className="w-full text-sm leading-relaxed break-words text-[var(--secondary-text)] sm:text-base">
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

      <div className="grid w-full grid-cols-2 gap-[3%] sm:gap-5">
        {roleConfig.dashboardCards.map(({ id, labelKey, to, Icon }) => (
          <Link
            key={id}
            to={withQs(to)}
            className="flex aspect-[1/1.05] w-full flex-col items-center justify-center gap-2 rounded-sm border border-gray-300 bg-white px-[6%] py-[8%] text-center transition-colors hover:border-[var(--active)] sm:aspect-auto sm:min-h-40 sm:gap-4 sm:px-6 sm:py-10"
          >
            <Icon
              className="h-[18%] w-[18%] min-h-8 min-w-8 max-h-12 max-w-12 text-[var(--primary-text)] sm:size-12"
              strokeWidth={1.25}
            />
            <span className="w-full text-sm font-medium break-words text-[var(--primary-text)] sm:text-lg">
              {t(labelKey)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
