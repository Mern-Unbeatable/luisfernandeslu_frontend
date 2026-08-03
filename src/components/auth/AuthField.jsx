/** Cream (photo) vs bordered (marketing) text input */
export default function AuthField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete,
  variant = 'photo',
  icon: Icon,
  labelRight = null,
}) {
  const base =
    variant === 'marketing'
      ? 'w-full rounded-xl border border-gray-200 bg-white py-3.5 text-sm text-[var(--primary-text)] outline-none transition placeholder:text-gray-400 focus:border-[var(--active)] focus:ring-1 focus:ring-[var(--active)]'
      : 'w-full rounded-lg border-0 bg-[#FFF4E5] py-3.5 text-sm text-[var(--primary-text)] outline-none ring-1 ring-transparent transition placeholder:text-gray-400 focus:ring-[var(--active)]'

  const padding = Icon && variant === 'marketing' ? 'pr-4 pl-11' : 'px-4'

  return (
    <label className="block">
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[var(--primary-text)]">
          {label}
        </span>
        {labelRight}
      </span>
      <span className="relative mt-2 block">
        {Icon && variant === 'marketing' ? (
          <Icon
            className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-gray-400"
            strokeWidth={1.75}
            aria-hidden
          />
        ) : null}
        <input
          type={type}
          name={name}
          autoComplete={autoComplete}
          required={required}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          className={`${base} ${padding}`}
        />
      </span>
    </label>
  )
}

export function AuthSubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--active)] text-base font-semibold text-white transition-opacity hover:opacity-90"
    >
      {children}
    </button>
  )
}
