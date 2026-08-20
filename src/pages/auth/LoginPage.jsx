import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useMatch, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FiMail, FiLock } from 'react-icons/fi'
import { setCredentials } from '../../features/auth/authSlice'
import { useLoginMutation } from '../../features/auth/authApi'
import {
  API_LOGIN_ROLES,
  getAuthErrorMessage,
} from '../../features/auth/authUtils'
import {
  findDemoUser,
  getHomePathForRole,
} from '../../features/auth/demoUsers'
import {
  getRoleAuthConfig,
  AUTH_ROLE_IDS,
} from '../../features/auth/roleAuthConfig'
import AuthField, { AuthSubmitButton } from '../../components/auth/AuthField'
import AuthModeToggle from '../../components/auth/AuthModeToggle'
import AuthSocialButtons from '../../components/auth/AuthSocialButtons'
import AuthDemoAccounts from '../../components/auth/AuthDemoAccounts'
import AuthLegalNote from '../../components/auth/AuthLegalNote'

export default function LoginPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { role: roleParam } = useParams()
  const isAdminLogin = Boolean(useMatch('/admin/login'))
  const role = isAdminLogin ? 'admin' : roleParam
  const roleValid = !role || AUTH_ROLE_IDS.includes(role)
  const config = roleValid && role ? getRoleAuthConfig(role) : null
  const layout = config?.layout || 'photo'
  const loginCfg = config?.login || {
    titleKey: 'auth.loginTitle',
    subtitleKey: 'auth.loginSubtitle',
    showSocial: true,
    showDemo: true,
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [login, { isLoading }] = useLoginMutation()

  if (roleParam === 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  if (!roleValid) {
    return <Navigate to="/login" replace />
  }

  const usesApiLogin = Boolean(role && API_LOGIN_ROLES.has(role))

  const completeLogin = (demoUser) => {
    dispatch(
      setCredentials({
        user: {
          id: demoUser.role,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
        },
        accessToken: `demo-token-${demoUser.role}`,
        refreshToken: `demo-refresh-${demoUser.role}`,
      }),
    )
    navigate(getHomePathForRole(demoUser.role), { replace: true })
  }

  const loginWithApi = async (credentials) => {
    setError('')

    try {
      const data = await login({
        role,
        email: credentials.email.trim(),
        password: credentials.password,
      }).unwrap()

      if (data?.success === false) {
        setError(getAuthErrorMessage(data, t('auth.invalidCredentials')))
        return
      }

      navigate(getHomePathForRole(data?.user?.role || role), { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err, t('auth.invalidCredentials')))
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    if (usesApiLogin) {
      await loginWithApi({ email, password })
      return
    }

    const demoUser = findDemoUser(email, password)
    if (!demoUser) {
      setError(t('auth.invalidCredentials'))
      return
    }
    if (role && demoUser.role !== role) {
      setError(t('auth.wrongRole', { role: t(config.shortNameKey) }))
      return
    }
    setError('')
    completeLogin(demoUser)
  }

  const signupLink = role ? `/signup/${role}` : '/signup'
  const isMarketing = layout === 'marketing'
  const fieldVariant = isMarketing ? 'marketing' : 'photo'
  const forgotBeside = Boolean(loginCfg.forgotBesideLabel)
  const showModeToggle = isMarketing && role && role !== 'admin'
  const showSignUpFooter = !loginCfg.showLegal && role !== 'admin'

  return (
    <div className="mx-auto w-full max-w-xl">
      {showModeToggle ? (
        <AuthModeToggle role={role} mode="login" />
      ) : null}

      <div className={isMarketing ? 'mb-7' : 'mb-8'}>
        <h1
          className={`font-bold text-[var(--primary-text)] ${
            isMarketing
              ? 'text-[1.65rem] leading-snug sm:text-[1.85rem]'
              : 'text-2xl sm:text-3xl'
          }`}
        >
          {t(loginCfg.titleKey)}
        </h1>
        <p
          className={`mt-2 text-[var(--secondary-text)] ${
            isMarketing ? 'text-sm leading-relaxed' : 'text-sm sm:text-base'
          }`}
        >
          {t(loginCfg.subtitleKey)}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className={`flex flex-col ${isMarketing ? 'gap-5' : 'gap-4'}`}
      >
        <AuthField
          label={t('auth.email')}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={
            isMarketing
              ? t('auth.emailPlaceholderMarketing')
              : t('auth.emailPlaceholder')
          }
          variant={fieldVariant}
          icon={isMarketing ? FiMail : undefined}
        />

        <AuthField
          label={t('auth.password')}
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={
            isMarketing
              ? t('auth.passwordPlaceholderMarketing')
              : t('auth.passwordPlaceholder')
          }
          variant={fieldVariant}
          icon={isMarketing ? FiLock : undefined}
          labelRight={
            forgotBeside ? (
              <Link
                to={
                  role
                    ? `/forgot-password?role=${encodeURIComponent(role)}`
                    : '/forgot-password'
                }
                state={location.state}
                className="text-sm font-medium text-[var(--active)] hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {t('auth.forgotPassword')}
              </Link>
            ) : null
          }
        />

        {!forgotBeside ? (
          <div className="-mt-1 flex justify-end">
            <Link
              to={
                role
                  ? `/forgot-password?role=${encodeURIComponent(role)}`
                  : '/forgot-password'
              }
              state={location.state}
              className="text-sm font-medium text-[var(--active)] underline-offset-2 hover:underline"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>
        ) : null}

        {loginCfg.showRememberMe ? (
          <label className="flex items-center gap-2.5 text-sm text-[var(--primary-text)]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded border-gray-300 text-[var(--active)] focus:ring-[var(--active)]"
            />
            {t('auth.rememberMe')}
          </label>
        ) : null}

        {error ? (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        <AuthSubmitButton disabled={isLoading}>
          {loginCfg.submitKey
            ? t(loginCfg.submitKey)
            : isMarketing
              ? t('auth.loginTab')
              : t('auth.signIn')}
        </AuthSubmitButton>
      </form>

      {loginCfg.showLegal ? (
        <AuthLegalNote />
      ) : showSignUpFooter ? (
        <p className="mt-6 text-center text-sm text-[var(--secondary-text)]">
          {isMarketing ? t('auth.noAccountAny') : t('auth.noAccount')}{' '}
          <Link
            to={signupLink}
            state={location.state}
            className="font-bold text-[var(--active)] hover:underline"
          >
            {isMarketing ? t('auth.signUpTabUpper') : t('header.signUp')}
          </Link>
        </p>
      ) : null}

      {!isMarketing && loginCfg.showSocial ? (
        <AuthSocialButtons
          googleLabel={t('auth.google')}
          facebookLabel={t('auth.facebook')}
          orLabel={t('auth.or')}
        />
      ) : null}

      {/* {role ? (
        <AuthDemoAccounts
          role={role}
          onUse={(user) => {
            setEmail(user.email)
            setPassword(user.password)
            if (usesApiLogin) {
              void loginWithApi(user)
              return
            }
            setError('')
            completeLogin(user)
          }}
        />
      ) : null} */}
    </div>
  )
}
