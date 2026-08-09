import { FiAlertCircle } from 'react-icons/fi'

const ICON_TONES = {
  brand: {
    wrap: 'bg-[color-mix(in_srgb,var(--active)_16%,white)] text-[var(--active)]',
    text: 'text-[var(--active)]',
  },
  purple: {
    wrap: 'bg-violet-100 text-violet-600',
    text: 'text-violet-600',
  },
  teal: {
    wrap: 'bg-teal-100 text-teal-600',
    text: 'text-teal-600',
  },
  red: {
    wrap: 'bg-red-100 text-red-600',
    text: 'text-red-600',
  },
  warning: {
    wrap: 'bg-amber-100 text-amber-600',
    text: 'text-amber-600',
  },
  gray: {
    wrap: 'bg-gray-100 text-gray-600',
    text: 'text-gray-600',
  },
}

const TONES = {
  default: {
    value: 'text-[var(--primary-text)]',
    footer: 'text-[var(--secondary-text)]',
    badge: 'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]',
    alertIcon: 'bg-red-500 text-white',
    filled: 'bg-[var(--active)] text-white',
  },
  brand: {
    value: 'text-[var(--active)]',
    footer: 'text-[var(--active)]',
    badge: 'bg-[color-mix(in_srgb,var(--active)_18%,white)] text-[var(--active)]',
    alertIcon: 'bg-[var(--active)] text-white',
    filled: 'bg-[var(--active)] text-white',
  },
  warning: {
    value: 'text-amber-500',
    footer: 'text-amber-500',
    badge: 'bg-amber-100 text-amber-700',
    alertIcon: 'bg-amber-500 text-white',
    filled: 'bg-amber-500 text-white',
  },
  danger: {
    value: 'text-red-500',
    footer: 'text-red-500',
    badge: 'bg-red-100 text-red-600',
    alertIcon: 'bg-red-500 text-white',
    filled: 'bg-red-500 text-white',
  },
  success: {
    value: 'text-emerald-600',
    footer: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    alertIcon: 'bg-emerald-500 text-white',
    filled: 'bg-emerald-600 text-white',
  },
}

const shellBase =
  'w-full rounded-2xl border border-gray-200 bg-white p-5 sm:p-6'

function IconBox({ icon: Icon, iconTone = 'brand', size = 'md' }) {
  if (!Icon) return null
  const tone = ICON_TONES[iconTone] || ICON_TONES.brand
  const sizeClass = size === 'sm' ? 'size-9' : 'size-10'
  const iconSize = size === 'sm' ? 'size-4' : 'size-[18px]'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg ${sizeClass} ${tone.wrap}`}
    >
      <Icon className={iconSize} strokeWidth={1.75} aria-hidden />
    </span>
  )
}

/**
 * Shared dashboard status / metric card.
 *
 * @param {'default'|'inline'|'action'|'filled'|'status'|'badge'|'summary'} [variant]
 */
export default function StatusCard({
  variant = 'default',
  label,
  value,
  description,
  icon: Icon,
  iconTone = 'brand',
  tone = 'default',
  badge,
  actionLabel,
  onAction,
  className = '',
}) {
  const t = TONES[tone] || TONES.default
  const iconToneMap = ICON_TONES[iconTone] || ICON_TONES.brand

  if (variant === 'inline') {
    return (
      <div
        className={`${shellBase} flex items-start justify-between gap-4 ${className}`}
      >
        <div className="min-w-0">
          {label ? (
            <p className="text-xs font-medium tracking-wide text-[var(--secondary-text)] uppercase">
              {label}
            </p>
          ) : null}
          <p className="mt-1 text-2xl font-bold text-[var(--primary-text)] sm:text-[1.75rem]">
            {value}
          </p>
        </div>
        <IconBox icon={Icon} iconTone={iconTone} />
      </div>
    )
  }

  if (variant === 'action') {
    return (
      <div className={`${shellBase} shadow-sm ${className}`}>
        <IconBox icon={Icon} iconTone={iconTone} />
        <p className="mt-4 text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
          {value}
        </p>
        {label ? (
          <p className="mt-1 text-sm font-medium text-[var(--primary-text)]">
            {label}
          </p>
        ) : null}
        {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[var(--active)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    )
  }

  if (variant === 'filled') {
    return (
      <div className={`w-full rounded-2xl p-5 sm:p-6 ${t.filled} ${className}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {label ? (
              <p className="text-sm font-medium text-white/90">{label}</p>
            ) : null}
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {value}
            </p>
            {description ? (
              <p className="mt-2 text-sm text-white/85">{description}</p>
            ) : null}
          </div>
          {Icon ? (
            <Icon
              className="size-5 shrink-0 text-white/90"
              strokeWidth={1.75}
              aria-hidden
            />
          ) : null}
        </div>
      </div>
    )
  }

  if (variant === 'status') {
    return (
      <div className={`${shellBase} ${className}`}>
        <div className="flex items-start justify-between gap-3">
          {label ? (
            <p className="text-sm font-medium text-[var(--secondary-text)]">
              {label}
            </p>
          ) : null}
          <span
            className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full ${t.alertIcon}`}
            aria-hidden
          >
            {Icon ? (
              <Icon className="size-3.5" strokeWidth={2.5} />
            ) : (
              <FiAlertCircle className="size-3.5" strokeWidth={2.5} />
            )}
          </span>
        </div>
        <p className={`mt-3 text-2xl font-bold sm:text-3xl ${t.value}`}>
          {value}
        </p>
        {description ? (
          <p className={`mt-2 text-sm font-medium ${t.footer}`}>{description}</p>
        ) : null}
      </div>
    )
  }

  if (variant === 'badge') {
    return (
      <div className={`relative ${shellBase} ${className}`}>
        {badge != null && badge !== '' ? (
          <span
            className={`absolute top-4 right-4 inline-flex min-w-7 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${t.badge}`}
          >
            {badge}
          </span>
        ) : null}
        {label ? (
          <p className="pr-10 text-sm font-medium text-[var(--secondary-text)]">
            {label}
          </p>
        ) : null}
        <p className="mt-2 text-3xl font-bold text-[var(--primary-text)]">
          {value}
        </p>
      </div>
    )
  }

  if (variant === 'summary') {
    return (
      <div className={`${shellBase} ${className}`}>
        <div className="flex items-start justify-between gap-3">
          {label ? (
            <p className="text-sm text-[var(--secondary-text)]">{label}</p>
          ) : (
            <span />
          )}
          {Icon ? (
            <Icon
              className={`size-5 shrink-0 ${iconToneMap.text}`}
              strokeWidth={1.75}
              aria-hidden
            />
          ) : null}
        </div>
        <p className="mt-2 text-3xl font-bold text-[var(--primary-text)]">
          {value}
        </p>
        {description ? (
          <p className="mt-1.5 text-sm text-[var(--secondary-text)]">
            {description}
          </p>
        ) : null}
      </div>
    )
  }

  // default — optional icon → label → value → description
  return (
    <div className={`${shellBase} ${className}`}>
      <IconBox icon={Icon} iconTone={iconTone} />
      {label ? (
        <p
          className={`text-sm text-[var(--secondary-text)] ${Icon ? 'mt-3' : ''}`}
        >
          {label}
        </p>
      ) : null}
      <p
        className={`text-2xl font-bold text-[var(--primary-text)] sm:text-3xl ${label || Icon ? 'mt-1' : ''}`}
      >
        {value}
      </p>
      {description ? (
        <p className="mt-1.5 text-sm text-[var(--secondary-text)]">
          {description}
        </p>
      ) : null}
    </div>
  )
}
