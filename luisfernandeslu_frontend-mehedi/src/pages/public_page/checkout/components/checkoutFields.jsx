import { FiChevronDown } from 'react-icons/fi'

export const checkoutInputClass =
  'h-11 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]'

export function CheckoutField({ label, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      {label ? (
        <span className="text-sm font-medium text-[var(--primary-text)]">
          {label}
        </span>
      ) : null}
      {children}
    </label>
  )
}

export function CheckoutTextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className={checkoutInputClass}
    />
  )
}

export function CheckoutSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className={`${checkoutInputClass} appearance-none pr-9`}
      >
        {options.map((option) => (
          <option key={option.value || 'empty'} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FiChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[var(--secondary-text)]"
        aria-hidden
      />
    </div>
  )
}

export function CheckoutTextArea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${checkoutInputClass} min-h-[120px] resize-y py-2.5`}
    />
  )
}
