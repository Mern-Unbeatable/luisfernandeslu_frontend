import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import { ADMIN_DASHBOARD_CHANNELS } from './data/dashboardDemo'
import MetricsSection from './sections/MetricsSection'
import QuickActionsSection from './sections/QuickActionsSection'
import ChartsSection from './sections/ChartsSection'
import PerformanceSection from './sections/PerformanceSection'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [channel, setChannel] = useState('all')

  return (
    <div className="space-y-8">
      <Seo
        title={t('adminDashboard.title')}
        description={t('adminDashboard.subtitle')}
      />

      <header className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t('adminDashboard.title')}
        </h1>
        <p className="text-sm font-normal text-[#6B7280] sm:text-base">
          {t('adminDashboard.subtitle')}
        </p>

        <div
          className="flex flex-wrap gap-2.5 pt-1"
          role="group"
          aria-label={t('adminDashboard.channels.label')}
        >
          {ADMIN_DASHBOARD_CHANNELS.map((id) => {
            const active = channel === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setChannel(id)}
                className={`rounded-md px-5 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#F59E0B] text-white shadow-sm'
                    : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]'
                }`}
              >
                {t(`adminDashboard.channels.${id}`)}
              </button>
            )
          })}
        </div>
      </header>

      <MetricsSection channel={channel} />
      <QuickActionsSection />
      <ChartsSection channel={channel} />
      <PerformanceSection channel={channel} />
    </div>
  )
}
