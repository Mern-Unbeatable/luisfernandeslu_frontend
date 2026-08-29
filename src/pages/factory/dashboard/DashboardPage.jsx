import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import StatusCard from '@/components/data-display/StatusCard'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import { useGetFactoryDashboardQuery } from '@/features/factory-dashboard/factoryDashboardApi'
import { mapFactoryDashboard } from '@/features/factory-dashboard/dashboardMappers'
import RevenueOverview from './RevenueOverview'
import OrderStatus from './OrderStatus'

const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
]

export default function DashboardPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError, error, refetch } =
    useGetFactoryDashboardQuery()

  const dashboard = useMemo(
    () => mapFactoryDashboard(data, t),
    [data, t],
  )

  const revenueLabels =
    dashboard.revenue.labels.length === 12
      ? dashboard.revenue.labels
      : MONTH_KEYS.map((key) => t(`factoryDashboard.months.${key}`))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          {t('factoryDashboard.title')}
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t('factoryDashboard.subtitle')}
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-[var(--secondary-text)]">Loading dashboard…</p>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatusCard
              label={t('factoryDashboard.cards.totalOrders')}
              value={dashboard.stats.totalOrders}
            />
            <StatusCard
              label={t('factoryDashboard.cards.pendingOrders')}
              value={dashboard.stats.pendingOrders}
            />
            <StatusCard
              label={t('factoryDashboard.cards.completedOrders')}
              value={dashboard.stats.completedOrders}
            />
            <StatusCard
              label={t('factoryDashboard.cards.totalRevenue')}
              value={dashboard.stats.totalRevenue}
            />
            <StatusCard
              label={t('factoryDashboard.cards.adminCommission')}
              value={dashboard.stats.adminCommission}
              description={dashboard.stats.adminCommissionLabel}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RevenueOverview
                title={t('factoryDashboard.revenueOverview.title')}
                subtitle={t('factoryDashboard.revenueOverview.subtitle')}
                labels={revenueLabels}
                values={dashboard.revenue.values}
                maxValue={dashboard.revenue.maxValue}
                yTicks={dashboard.revenue.yTicks}
                year={dashboard.revenue.year}
              />
            </div>

            <div className="xl:col-span-1">
              <OrderStatus
                title={t('factoryDashboard.orderStatus.title')}
                filterAriaLabel={t('factoryDashboard.orderStatus.filterAria')}
                series={dashboard.orderStatus}
                filterOptions={[
                  {
                    value: 'thisMonth',
                    label: t('factoryDashboard.filters.thisMonth'),
                  },
                  {
                    value: 'thisWeek',
                    label: t('factoryDashboard.filters.thisWeek'),
                  },
                ]}
                defaultFilter="thisMonth"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
