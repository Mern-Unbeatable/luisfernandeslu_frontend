import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiChevronLeft } from 'react-icons/fi'
import Seo from '../../components/common/Seo/Seo'

/**
 * Split-screen auth shell: construction image left, form/content right.
 * Back always returns to the public home (not browser history).
 */
export default function AuthLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const goHome = () => navigate('/')

  return (
    <div className="flex min-h-screen bg-white">
      <Seo />

      {/* Left visual */}
      <div className="relative hidden w-1/2 shrink-0 lg:block">
        <img
          src="/login_page.png"
          alt=""
          className="absolute inset-0 size-full object-cover"
          decoding="async"
        />
        <button
          type="button"
          onClick={goHome}
          className="absolute top-6 left-6 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-[var(--primary-text)] shadow-sm transition-colors hover:bg-white"
          aria-label={t('auth.back')}
        >
          <FiChevronLeft className="size-5" strokeWidth={2} />
        </button>
      </div>

      {/* Right content */}
      <div className="relative flex min-h-screen w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between px-4 py-4 lg:hidden">
          <button
            type="button"
            onClick={goHome}
            className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-[var(--primary-text)]"
            aria-label={t('auth.back')}
          >
            <FiChevronLeft className="size-5" strokeWidth={2} />
          </button>
          <Link to="/" className="inline-flex items-center">
            <img
              src="/logo.png"
              alt="CONSTRUPRECO"
              className="h-8 w-auto"
              decoding="async"
            />
          </Link>
          <span className="size-10" aria-hidden />
        </div>

        <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-10 md:px-16 lg:px-14 xl:px-20">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
