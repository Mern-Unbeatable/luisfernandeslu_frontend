import { Link, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FiLock } from 'react-icons/fi'
import { getHomePathForRole } from '../../features/auth/demoUsers'

const BUYER_ROLES = ['customer', 'company']

/** Disputes and returns are buyer-only; guests and sellers get a prompt instead of an API error. */
export default function BuyerAreaGate() {
  const { t } = useTranslation()
  const location = useLocation()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (isAuthenticated && BUYER_ROLES.includes(user?.role)) {
    return <Outlet />
  }

  const from = `${location.pathname}${location.search}`
  const isGuest = !isAuthenticated

  return (
    <div className="w-full bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
          <span className="flex size-12 items-center justify-center rounded-full bg-amber-50 text-[var(--active)]">
            <FiLock className="size-6" aria-hidden />
          </span>
          <h1 className="mt-4 text-xl font-bold text-[var(--primary-text)]">
            {t(isGuest ? 'buyerAreaGate.guestTitle' : 'buyerAreaGate.sellerTitle')}
          </h1>
          <p className="mt-2 text-sm text-[var(--secondary-text)]">
            {t(isGuest ? 'buyerAreaGate.guestDescription' : 'buyerAreaGate.sellerDescription')}
          </p>

          {isGuest ? (
            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/login/customer"
                state={{ from }}
                className="rounded-lg bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t('buyerAreaGate.loginCustomer')}
              </Link>
              <Link
                to="/login/company"
                state={{ from }}
                className="rounded-lg border border-[var(--active)] px-5 py-2.5 text-sm font-semibold text-[var(--active)] transition-colors hover:bg-amber-50"
              >
                {t('buyerAreaGate.loginCompany')}
              </Link>
            </div>
          ) : (
            <Link
              to={getHomePathForRole(user?.role) || '/'}
              className="mt-6 rounded-lg bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t('buyerAreaGate.goToDashboard')}
            </Link>
          )}

          {isGuest ? (
            <p className="mt-5 text-sm text-[var(--secondary-text)]">
              {t('buyerAreaGate.noAccount')}{' '}
              <Link to="/signup/customer" className="font-semibold text-[var(--active)] hover:underline">
                {t('buyerAreaGate.signup')}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
