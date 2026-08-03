import { Link, Outlet, useNavigate, useParams, useMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiChevronLeft } from 'react-icons/fi'
import Seo from '../../components/common/Seo/Seo'
import MarketingSidebar from '../../components/auth/MarketingSidebar'
import { getRoleAuthConfig } from '../../features/auth/roleAuthConfig'

/**
 * Auth shell:
 * - photo: construction image left (role select, customer/company)
 * - marketing: cream feature panel left (supplier/factory/transporter)
 * Register: left sticky, right scrollable
 */
export default function AuthLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { role } = useParams()
  const matchSignup = useMatch('/signup')
  const matchSignupRole = useMatch('/signup/:role')
  const isRegister = Boolean(matchSignupRole)
  const isSignupFlow = Boolean(matchSignup || matchSignupRole)
  const config = role ? getRoleAuthConfig(role) : null
  const layout = config?.layout || 'photo'
  const mode = isRegister ? 'register' : 'login'
  const sidebar = config?.[mode]?.sidebar

  const goBack = () => {
    if (role) {
      navigate(isSignupFlow ? '/signup' : '/login')
      return
    }
    navigate('/')
  }

  if (layout === 'marketing') {
    return (
      <div className="flex min-h-screen flex-col bg-white lg:h-screen lg:flex-row lg:overflow-hidden">
        <Seo />

        {/* Left — sticky / fixed viewport height */}
        <div className="relative hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[42%] lg:shrink-0">
          <MarketingSidebar
            sidebar={sidebar}
            className="h-full w-full overflow-hidden bg-[#FFF8EE] px-10 py-16 xl:px-14"
          />
          <button
            type="button"
            onClick={goBack}
            className="absolute top-6 left-6 z-10 flex size-10 items-center justify-center rounded-full bg-white text-[var(--primary-text)] shadow-sm transition-colors hover:bg-white/90"
            aria-label={t('auth.back')}
          >
            <FiChevronLeft className="size-5" strokeWidth={2} />
          </button>
        </div>

        {/* Right — independently scrollable */}
        <div className="relative flex min-h-screen w-full flex-col lg:h-screen lg:w-[58%] lg:overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-4 lg:hidden">
            <button
              type="button"
              onClick={goBack}
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

          <div
            className={`mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 sm:px-6 lg:pt-10 ${
              mode === 'login' ? 'justify-center' : 'justify-start pt-2'
            }`}
          >
            <Outlet context={{ role, config, layout, mode }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white lg:h-screen lg:overflow-hidden">
      <Seo />

      {/* Left image — sticky */}
      <div className="relative hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-1/2 lg:shrink-0">
        <img
          src="/login_page.png"
          alt=""
          className="absolute inset-0 size-full object-cover"
          decoding="async"
        />
        <button
          type="button"
          onClick={goBack}
          className="absolute top-6 left-6 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-[var(--primary-text)] shadow-sm transition-colors hover:bg-white"
          aria-label={t('auth.back')}
        >
          <FiChevronLeft className="size-5" strokeWidth={2} />
        </button>
      </div>

      {/* Right — scrollable */}
      <div className="relative flex min-h-screen w-full flex-col lg:h-screen lg:w-1/2 lg:overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-4 lg:hidden">
          <button
            type="button"
            onClick={goBack}
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
          <Outlet context={{ role, config, layout: 'photo', mode }} />
        </div>
      </div>
    </div>
  )
}
