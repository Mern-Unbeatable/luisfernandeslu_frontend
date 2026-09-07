import { useEffect, useState } from 'react'
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiMail } from 'react-icons/fi'
import { setCredentials } from '../../features/auth/authSlice'
import { useRegisterMutation } from '../../features/auth/authApi'
import {
  API_REGISTER_ROLES,
  buildRegisterPayload,
  getAuthErrorMessage,
  writeEmailVerificationSession,
} from '../../features/auth/authUtils'
import { getHomePathForRole } from '../../features/auth/demoUsers'
import {
  getRoleAuthConfig,
  AUTH_ROLE_IDS,
} from '../../features/auth/roleAuthConfig'
import AuthField, { AuthSubmitButton } from '../../components/auth/AuthField'
import AuthFileUpload from '../../components/auth/AuthFileUpload'
import AuthModeToggle from '../../components/auth/AuthModeToggle'
import AuthSocialButtons from '../../components/auth/AuthSocialButtons'
import AuthLegalNote from '../../components/auth/AuthLegalNote'

function emptyValues(fields) {
  const init = {}
  for (const f of fields) {
    init[f.name] = f.type === 'file' ? [] : ''
  }
  return init
}

/** Group consecutive fields that share the same `row` key */
function groupFields(fields) {
  const groups = []
  let i = 0
  while (i < fields.length) {
    const field = fields[i]
    if (field.row) {
      const row = field.row
      const items = []
      while (i < fields.length && fields[i].row === row) {
        items.push(fields[i])
        i += 1
      }
      groups.push({ type: 'row', key: row, items })
    } else {
      groups.push({ type: 'single', key: field.name, items: [field] })
      i += 1
    }
  }
  return groups
}

/** Single register form — fields & layout driven by roleAuthConfig */
export default function RegisterPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { role } = useParams()
  const config = AUTH_ROLE_IDS.includes(role) ? getRoleAuthConfig(role) : null
  const fields = config?.register?.fields || []
  const [values, setValues] = useState(() => emptyValues(fields))
  const [error, setError] = useState('')
  const [register, { isLoading }] = useRegisterMutation()

  useEffect(() => {
    setValues(emptyValues(fields))
    setError('')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when role changes
  }, [role])

  if (!config || !config.register) {
    return <Navigate to="/signup" replace />
  }

  const layout = config.layout
  const registerCfg = config.register
  const fieldVariant = layout === 'marketing' ? 'marketing' : 'photo'
  const groups = groupFields(fields)

  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const usesApiRegister = API_REGISTER_ROLES.has(role)

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (values.confirmPassword && values.password !== values.confirmPassword) {
      setError(t('auth.register.passwordMismatch'))
      return
    }

    if (usesApiRegister) {
      try {
        const data = await register({
          role,
          payload: buildRegisterPayload(role, values),
        }).unwrap()

        if (data?.success === false) {
          setError(getAuthErrorMessage(data, t('auth.register.failed')))
          return
        }

        if (data?.requiresEmailVerification) {
          writeEmailVerificationSession({
            email: values.email.trim(),
            role,
            message: data.message,
            otpExpiresAt: data.otpExpiresAt,
            fromAuthHub: Boolean(location.state?.fromAuthHub),
          })
          navigate(`/signup/${role}/verify`, { state: location.state })
          return
        }

        if (data?.accessToken && data?.user) {
          toast.success(data.message || t('auth.register.success'))
          navigate(getHomePathForRole(data.user.role || role), { replace: true })
          return
        }

        setError(t('auth.register.failed'))
      } catch (err) {
        setError(getAuthErrorMessage(err, t('auth.register.failed')))
      }
      return
    }

    const email = values.email || `${role}@demo.local`
    const name =
      values.fullName ||
      values.companyName ||
      values.factoryName ||
      t(config.shortNameKey)

    dispatch(
      setCredentials({
        user: {
          id: `${role}-new`,
          email,
          name,
          role,
        },
        accessToken: `demo-token-${role}-new`,
        refreshToken: `demo-refresh-${role}-new`,
      }),
    )
    navigate(getHomePathForRole(role), { replace: true })
  }

  const renderField = (field) => {
    if (field.type === 'file') {
      return (
        <AuthFileUpload
          key={field.name}
          name={field.name}
          label={t(field.labelKey)}
          hideLabel={field.hideLabel}
          files={values[field.name] || []}
          onChange={setValue}
        />
      )
    }

    return (
      <AuthField
        key={field.name}
        label={t(field.labelKey)}
        name={field.name}
        type={field.type}
        autoComplete={field.autoComplete}
        required={field.required !== false}
        value={values[field.name]}
        onChange={(e) => setValue(field.name, e.target.value)}
        placeholder={
          field.placeholderKey ? t(field.placeholderKey) : undefined
        }
        variant={fieldVariant}
        icon={
          field.name === 'email' && layout === 'marketing' ? FiMail : undefined
        }
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      {layout === 'marketing' ? (
        <AuthModeToggle role={role} mode="register" />
      ) : null}

      <div className={layout === 'marketing' ? 'mb-7' : 'mb-8'}>
        <h1
          className={`font-bold text-[var(--primary-text)] ${
            layout === 'marketing'
              ? 'text-[1.65rem] leading-snug sm:text-[1.85rem]'
              : 'text-2xl sm:text-3xl'
          }`}
        >
          {t(registerCfg.titleKey)}
        </h1>
        {registerCfg.subtitleKey ? (
          <p className="mt-2 text-sm leading-relaxed text-[var(--secondary-text)]">
            {t(registerCfg.subtitleKey)}
          </p>
        ) : null}
      </div>

      <form
        onSubmit={onSubmit}
        className={`flex flex-col ${layout === 'marketing' ? 'gap-5' : 'gap-4'}`}
      >
        {groups.map((group) =>
          group.type === 'row' ? (
            <div
              key={group.key}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {group.items.map(renderField)}
            </div>
          ) : (
            renderField(group.items[0])
          ),
        )}

        {error ? (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        <AuthSubmitButton disabled={isLoading} loading={isLoading}>
          {registerCfg.submitKey
            ? t(registerCfg.submitKey)
            : t('auth.register.submit')}
        </AuthSubmitButton>
      </form>

      {registerCfg.showLegal ? (
        <AuthLegalNote />
      ) : (
        <p className="mt-6 text-center text-sm text-[var(--secondary-text)]">
          {layout === 'marketing'
            ? t('auth.alreadyHaveAccountAny')
            : t('auth.alreadyHaveAccount')}{' '}
          <Link
            to={`/login/${role}`}
            state={location.state}
            className="font-bold text-[var(--active)] hover:underline"
          >
            {layout === 'marketing'
              ? t('auth.signInTabUpper')
              : t('header.logIn')}
          </Link>
        </p>
      )}

      {registerCfg.showSocial && layout === 'photo' ? (
        <AuthSocialButtons
          googleLabel={t('auth.google')}
          facebookLabel={t('auth.facebook')}
          orLabel={t('auth.or')}
        />
      ) : null}
    </div>
  )
}
