import { useTranslation } from 'react-i18next'
import StatusCard from '@/components/data-display/StatusCard'
import RevenueOverview from './RevenueOverview'
import OrderStatus from './OrderStatus'

const REVENUE_SERIES = {
  thisYear: [
    2000, 3700, 2100, 4500, 2800, 2850, 2900, 3600, 4800, 5500, 4200, 3800,
  ],
  lastYear: [
    1600, 2400, 2800, 3200, 3000, 3500, 4100, 3900, 4300, 4000, 3600, 3300,
  ],
}

const ORDER_STATUS_SERIES = {
  thisMonth: [
    { key: 'completed', value: 1236, color: '#DF900A' },
    { key: 'inProduction', value: 32, color: '#E85A8C' },
    { key: 'pending', value: 16, color: '#84CC16' },
  ],
  thisWeek: [
    { key: 'completed', value: 286, color: '#DF900A' },
    { key: 'inProduction', value: 12, color: '#E85A8C' },
    { key: 'pending', value: 8, color: '#84CC16' },
  ],
}

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

  const revenueLabels = MONTH_KEYS.map((key) =>
    t(`factoryDashboard.months.${key}`),
  )

  const orderStatusSeries = {
    thisMonth: ORDER_STATUS_SERIES.thisMonth.map((item) => ({
      ...item,
      label: t(`factoryDashboard.orderStatus.${item.key}`),
    })),
    thisWeek: ORDER_STATUS_SERIES.thisWeek.map((item) => ({
      ...item,
      label: t(`factoryDashboard.orderStatus.${item.key}`),
    })),
  }

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatusCard
          label={t('factoryDashboard.cards.totalOrders')}
          value="1,284"
        />
        <StatusCard
          label={t('factoryDashboard.cards.pendingOrders')}
          value="48"
        />
        <StatusCard
          label={t('factoryDashboard.cards.completedOrders')}
          value="1,236"
        />
        <StatusCard
          label={t('factoryDashboard.cards.totalRevenue')}
          value="$40,000,000"
        />
        <StatusCard
          label={t('factoryDashboard.cards.adminCommission')}
          value="20%"
          description={t('factoryDashboard.cards.adminCommissionDesc')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueOverview
            title={t('factoryDashboard.revenueOverview.title')}
            subtitle={t('factoryDashboard.revenueOverview.subtitle')}
            filterAriaLabel={t('factoryDashboard.revenueOverview.filterAria')}
            labels={revenueLabels}
            series={REVENUE_SERIES}
            filterOptions={[
              {
                value: 'thisYear',
                label: t('factoryDashboard.filters.thisYear'),
              },
              {
                value: 'lastYear',
                label: t('factoryDashboard.filters.lastYear'),
              },
            ]}
            defaultFilter="thisYear"
          />
        </div>

        <div className="xl:col-span-1">
          <OrderStatus
            title={t('factoryDashboard.orderStatus.title')}
            filterAriaLabel={t('factoryDashboard.orderStatus.filterAria')}
            series={orderStatusSeries}
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
    </div>
  )
}
