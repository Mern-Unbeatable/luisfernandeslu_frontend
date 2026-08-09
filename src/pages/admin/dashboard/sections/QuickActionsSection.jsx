import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ADMIN_DASHBOARD_QUICK_ACTIONS } from '../data/dashboardDemo'

const CARD_THEMES = {
  orange: {
    surface:
      'bg-gradient-to-br from-[#FF7A00] via-[#FF9500] to-[#FFB84D]',
    button: 'bg-white/25 hover:bg-white/35',
  },
  purple: {
    surface:
      'bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7]',
    button: 'bg-white/20 hover:bg-white/30',
  },
  green: {
    surface:
      'bg-gradient-to-br from-[#059669] via-[#10B981] to-[#14B8A6]',
    button: 'bg-white/20 hover:bg-white/30',
  },
}

function QuickActionCardDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
      aria-hidden
    >
      <span className="absolute -right-10 -bottom-12 size-[140px] rounded-full bg-white/[0.12]" />
      <span className="absolute right-6 bottom-2 size-[88px] rounded-full bg-white/[0.10]" />
      <span className="absolute right-20 -bottom-6 size-[112px] rounded-full bg-white/[0.08]" />
    </div>
  )
}

function QuickActionCard({ title, subtitle, themeKey, actionLabel, onAction }) {
  const theme = CARD_THEMES[themeKey] || CARD_THEMES.orange

  return (
    <article
      className={`relative flex min-h-[168px] flex-col overflow-hidden rounded-2xl px-6 py-5 shadow-sm sm:min-h-[176px] sm:px-7 sm:py-6 ${theme.surface}`}
    >
      <QuickActionCardDecor />
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
        <h3 className="text-lg font-bold leading-snug text-white sm:text-[1.125rem]">
          {title}
        </h3>
        <p className="mt-2 max-w-[95%] text-sm font-normal leading-relaxed text-white/95">
          {subtitle}
        </p>
        <button
          type="button"
          onClick={onAction}
          className={`mt-auto inline-flex w-fit items-center gap-1 rounded-[10px] px-4 py-2 text-sm font-medium text-white transition ${theme.button}`}
        >
          {actionLabel}
        </button>
      </div>
    </article>
  )
}

export default function QuickActionsSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <section className="space-y-4 sm:space-y-5">
      <h2 className="text-lg font-bold text-[var(--primary-text)] sm:text-xl">
        {t('adminDashboard.quickActionSectionTitle')}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {ADMIN_DASHBOARD_QUICK_ACTIONS.map((action) => (
          <QuickActionCard
            key={action.id}
            themeKey={action.themeKey}
            title={t(`adminDashboard.quickActions.${action.id}.title`)}
            subtitle={t(`adminDashboard.quickActions.${action.id}.subtitleLine`)}
            actionLabel={t('adminDashboard.takeAction')}
            onAction={() => navigate(action.to)}
          />
        ))}
      </div>
    </section>
  )
}
