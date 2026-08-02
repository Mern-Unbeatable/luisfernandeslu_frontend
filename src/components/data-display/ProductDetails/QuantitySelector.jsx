export default function QuantitySelector({
  value = 1,
  min = 1,
  onChange,
  className = '',
}) {
  const setValue = (next) => {
    onChange?.(Math.max(min, next))
  }

  return (
    <div
      className={`inline-flex h-12 shrink-0 items-stretch overflow-hidden rounded-md border border-gray-200 bg-white ${className}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => setValue(value - 1)}
        className="flex w-10 items-center justify-center text-lg leading-none text-[var(--secondary-text)] hover:bg-gray-50"
      >
        −
      </button>
      <span className="flex min-w-10 items-center justify-center px-2 text-center text-sm font-semibold tabular-nums text-[var(--primary-text)]">
        {String(value).padStart(2, '0')}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => setValue(value + 1)}
        className="flex w-10 items-center justify-center text-lg leading-none text-[var(--secondary-text)] hover:bg-gray-50"
      >
        +
      </button>
    </div>
  )
}
