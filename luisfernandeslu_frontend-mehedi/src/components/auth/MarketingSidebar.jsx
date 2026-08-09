import { useTranslation } from 'react-i18next'

/** Left marketing panel for supplier / factory / transporter / affiliate auth */
export default function MarketingSidebar({ sidebar, className = '' }) {
  const { t } = useTranslation()
  if (!sidebar) return null

  const BrandIcon = sidebar.BrandIcon

  return (
    <aside className={`flex w-full flex-col justify-center ${className}`}>
      <div className="mx-auto w-full max-w-lg">
        {sidebar.brandKey ? (
          <div className="mb-8 flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--active)] text-white">
              {BrandIcon ? (
                <BrandIcon className="size-5" strokeWidth={2.25} aria-hidden />
              ) : null}
            </span>
            <span className="text-lg font-bold text-[var(--primary-text)]">
              {t(sidebar.brandKey)}
            </span>
          </div>
        ) : null}

        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-[var(--primary-text)] sm:text-3xl xl:text-[2.15rem] xl:leading-[1.2]">
          {t(sidebar.titleKey)}
        </h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--secondary-text)]">
          {t(sidebar.subtitleKey)}
        </p>
        <ul className="mt-12 flex flex-col gap-8">
          {(sidebar.features || []).map(({ Icon, titleKey, descKey }) => (
            <li key={titleKey} className="flex gap-4">
              <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--active)] text-white">
                <Icon className="size-5" strokeWidth={2.25} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-bold text-[var(--primary-text)]">
                  {t(titleKey)}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-[var(--secondary-text)]">
                  {t(descKey)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
