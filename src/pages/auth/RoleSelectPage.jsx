import { Link, useMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiUser, FiBriefcase, FiShoppingBag, FiTruck, FiGift } from 'react-icons/fi'
import { FaIndustry } from 'react-icons/fa'

const ROLES = [
  {
    id: 'customer',
    titleKey: 'auth.roles.customer.title',
    descKey: 'auth.roles.customer.desc',
    Icon: FiUser,
  },
  {
    id: 'company',
    titleKey: 'auth.roles.company.title',
    descKey: 'auth.roles.company.desc',
    Icon: FiBriefcase,
  },
  {
    id: 'supplier',
    titleKey: 'auth.roles.supplier.title',
    descKey: 'auth.roles.supplier.desc',
    Icon: FiShoppingBag,
  },
  {
    id: 'factory',
    titleKey: 'auth.roles.factory.title',
    descKey: 'auth.roles.factory.desc',
    Icon: FaIndustry,
  },
  {
    id: 'transporter',
    titleKey: 'auth.roles.transporter.title',
    descKey: 'auth.roles.transporter.desc',
    Icon: FiTruck,
  },
  {
    id: 'affiliate',
    titleKey: 'auth.roles.affiliate.title',
    descKey: 'auth.roles.affiliate.desc',
    Icon: FiGift,
  },
]

/** Role picker for both /login and /signup */
export default function RoleSelectPage() {
  const { t } = useTranslation()
  const isLogin = Boolean(useMatch('/login'))
  const nextBase = isLogin ? '/login' : '/signup'

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 hidden flex-col items-center text-center lg:flex">
        <Link to="/" className="inline-flex flex-col items-center gap-2">
          <img
            src="/logo.png"
            alt="CONSTRUPRECO"
            className="h-14 w-auto"
            decoding="async"
          />
        </Link>
      </div>

      <ul className="flex flex-col gap-3">
        {ROLES.map(({ id, titleKey, descKey, Icon }) => (
          <li key={id}>
            <Link
              to={`${nextBase}/${id}`}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-colors hover:border-[var(--active)] hover:bg-[#FFFBF5]"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--active)] text-white">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-base font-bold text-[var(--primary-text)]">
                  {t(titleKey)}
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-[var(--secondary-text)]">
                  {t(descKey)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-sm text-[var(--secondary-text)]">
        {isLogin ? (
          <>
            {t('auth.noAccount')}{' '}
            <Link
              to="/signup"
              className="font-semibold text-[var(--active)] hover:underline"
            >
              {t('header.signUp')}
            </Link>
          </>
        ) : (
          <>
            {t('auth.alreadyHaveAccount')}{' '}
            <Link
              to="/login"
              className="font-semibold text-[var(--active)] hover:underline"
            >
              {t('header.logIn')}
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
