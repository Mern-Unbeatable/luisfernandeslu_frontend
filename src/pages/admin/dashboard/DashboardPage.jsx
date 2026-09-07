import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '@/components/common/Seo/Seo'
import SegmentedTabs from '@/components/common/SegmentedTabs/SegmentedTabs'
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

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary-text)] sm:text-[1.75rem]">
          {t('adminDashboard.title')}
        </h1>
        <p className="mt-1 text-sm font-normal text-[#6B7280] sm:text-base">
          {t('adminDashboard.subtitle')}
        </p>
      </header>

      <SegmentedTabs
        standalone
        tabs={ADMIN_DASHBOARD_CHANNELS.map((id) => ({
          id,
          label: t(`adminDashboard.channels.${id}`),
        }))}
        activeTab={channel}
        onTabChange={setChannel}
        ariaLabel={t('adminDashboard.channels.label')}
      />

      <MetricsSection channel={channel} />
      <QuickActionsSection />
      <ChartsSection channel={channel} />
      <PerformanceSection channel={channel} />
    </div>
  )
}
