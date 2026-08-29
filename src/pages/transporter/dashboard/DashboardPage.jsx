import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAuthErrorMessage } from '../../../features/auth/authUtils'
import { useGetTransporterDashboardQuery } from '../../../features/transporter/transporterApi'
import { mapTransporterDashboard } from '../../../features/transporter/dashboardMappers'
import StatsSection from './sections/StatsSection'
import ActionsSection from './sections/ActionsSection'
import RevenueSection from './sections/RevenueSection'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState('thisYear')

  const { data, isLoading, isError, error, refetch } =
    useGetTransporterDashboardQuery({ period })

  const dashboard = useMemo(() => mapTransporterDashboard(data), [data])
  const welcomeName =
    dashboard.welcomeName ||
    t('transporterDashboard.defaultName', { defaultValue: 'Transporter' })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t('transporterDashboard.title')}
        </h1>
        <p className="mt-1 text-base text-gray-500">
          {t('transporterDashboard.welcome', { name: welcomeName })}
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, 'Failed to load dashboard')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <>
          <StatsSection stats={dashboard.stats} />
          <ActionsSection actions={dashboard.actions} />
          <RevenueSection
            revenue={dashboard.revenue}
            period={period}
            onPeriodChange={setPeriod}
          />
        </>
      ) : null}
    </div>
  )
}
