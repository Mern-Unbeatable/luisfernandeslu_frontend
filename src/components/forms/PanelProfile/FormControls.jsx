import { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export function Field({ label, children, className = '' }) {
  return (
    <label className={`flex w-full flex-col gap-1.5 ${className}`}>
      {label ? (
        <span className="text-sm font-medium text-[var(--primary-text)]">
          {label}
        </span>
      ) : null}
      {children}
    </label>
  )
}

const controlBase =
  'w-full rounded-md border border-gray-200 bg-white text-sm text-[var(--primary-text)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--active)]'

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  ...rest
}) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className={`${controlBase} h-11 px-3 ${className}`}
      {...rest}
    />
  )
}

export function SecretInput({
  value,
  onChange,
  placeholder,
  className = '',
  ...rest
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative w-full">
      <input
        type={visible ? 'text' : 'password'}
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className={`${controlBase} h-11 px-3 pr-11 ${className}`}
        autoComplete="off"
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-[var(--primary-text)]"
        aria-label={visible ? 'Hide value' : 'Show value'}
      >
        {visible ? (
          <FiEyeOff className="size-4" strokeWidth={1.75} />
        ) : (
          <FiEye className="size-4" strokeWidth={1.75} />
        )}
      </button>
    </div>
  )
}

export function PrimaryButton({ children, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`inline-flex h-10 items-center justify-center rounded-md bg-[var(--active)] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
