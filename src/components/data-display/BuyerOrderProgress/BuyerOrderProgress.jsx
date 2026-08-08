import { FiCheck } from 'react-icons/fi'

/**
 * Vertical delivery stepper for buyer order detail (read-only).
 */
export default function BuyerOrderProgress({ steps = [], className = '' }) {
  return (
    <ol className={`flex flex-col ${className}`}>
      {steps.map((step, index) => {
        const done = step.completed
        const isLast = index === steps.length - 1
        return (
          <li key={step.id ?? index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${
                  done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-gray-300 bg-white text-transparent'
                }`}
                aria-hidden
              >
                {done ? <FiCheck className="size-4" strokeWidth={3} /> : null}
              </span>
              {!isLast ? (
                <span
                  className={`my-1 w-0.5 flex-1 min-h-8 ${
                    done ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                  aria-hidden
                />
              ) : null}
            </div>
            <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
              <p
                className={`text-sm font-semibold ${
                  done
                    ? 'text-[var(--primary-text)]'
                    : 'text-[var(--secondary-text)]'
                }`}
              >
                {step.label}
              </p>
              {step.date ? (
                <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
                  {step.date}
                </p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
