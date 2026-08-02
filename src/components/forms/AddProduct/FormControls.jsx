import { FiChevronDown } from 'react-icons/fi'

export function Field({ label, children, className = '' }) {
  return (
    <label className={`flex w-full flex-col gap-2 ${className}`}>
      {label ? (
        <span className="text-base font-normal text-gray-800">{label}</span>
      ) : null}
      {children}
    </label>
  )
}

const controlBase =
  'w-full rounded-sm border border-black/20 bg-white outline-none transition-colors focus:border-[var(--active)]'

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className={`${controlBase} h-10 px-2.5 text-sm text-[var(--primary-text)] placeholder:text-xs placeholder:text-zinc-500 ${className}`}
    />
  )
}

export function SelectInput({
  id,
  value,
  onChange,
  options = [],
  className = '',
}) {
  const isEmpty = !value

  return (
    <div className={`relative w-full ${className}`}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className={`${controlBase} h-10 appearance-none px-2.5 pr-9 ${
          isEmpty
            ? 'text-xs text-zinc-500'
            : 'text-sm font-medium text-[var(--primary-text)]'
        }`}
      >
        {options.map((option) => (
          <option key={option.value || 'empty'} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-neutral-400" />
    </div>
  )
}

export function TextAreaInput({
  id,
  value,
  onChange,
  placeholder,
  rows = 8,
  className = '',
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${controlBase} min-h-44 resize-y px-2.5 py-2.5 text-sm leading-6 text-zinc-700 placeholder:text-zinc-500 ${className}`}
    />
  )
}

export function AiAssistButton({ label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 w-fit shrink-0 items-center justify-center self-start rounded-full border border-neutral-400 px-8 text-base font-bold tracking-tight text-gray-800 uppercase transition-colors hover:border-[var(--active)] hover:text-[var(--active)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-2">
      {label ? (
        <span className="text-xl font-medium text-gray-800">{label}</span>
      ) : null}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={`relative h-5 w-14 shrink-0 rounded-full px-0.5 transition-colors ${
          checked ? 'bg-[var(--active)]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-[3px] size-4 rounded-full bg-white transition-all ${
            checked ? 'left-[36px]' : 'left-[3px]'
          }`}
        />
      </button>
    </div>
  )
}
