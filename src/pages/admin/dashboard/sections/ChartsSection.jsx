import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, Line } from 'react-chartjs-2'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import {
  ADMIN_ORDER_B2B,
  ADMIN_ORDER_B2C,
  ADMIN_REVENUE_B2B,
  ADMIN_REVENUE_B2C,
  ADMIN_REVENUE_CHART_LABELS,
} from '../data/dashboardDemo'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
)

const B2B_COLOR = '#F59E0B'
const B2C_COLOR = '#10B981'
const B2C_BAR_COLOR = '#111827'

const baseTooltip = {
  backgroundColor: '#ffffff',
  titleColor: '#9ca3af',
  bodyColor: '#111827',
  borderColor: '#f3f4f6',
  borderWidth: 1,
  padding: 12,
  displayColors: true,
}

function ChartCard({ title, children, timeframe, onTimeframeChange, timeLabel }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">{title}</h2>
        <select
          value={timeframe}
          onChange={(e) => onTimeframeChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
          aria-label={timeLabel}
        >
          <option value="thisYear">{timeLabel}</option>
          <option value="lastYear">Last year</option>
        </select>
      </div>
      <div className="mt-6 h-72 w-full sm:h-80">{children}</div>
    </div>
  )
}

export default function ChartsSection({ channel = 'all' }) {
  const { t } = useTranslation()
  const [revenueRange, setRevenueRange] = useState('thisYear')
  const [ordersRange, setOrdersRange] = useState('thisYear')
  const timeLabel = t('adminDashboard.charts.thisYear')

  const revenueData = useMemo(() => {
    const datasets = []

    if (channel === 'all' || channel === 'b2b') {
      datasets.push({
        label: t('adminDashboard.charts.b2bRevenue'),
        data: ADMIN_REVENUE_B2B,
        borderColor: B2B_COLOR,
        backgroundColor: B2B_COLOR,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      })
    }

    if (channel === 'all' || channel === 'b2c') {
      datasets.push({
        label: t('adminDashboard.charts.b2cRevenue'),
        data: ADMIN_REVENUE_B2C,
        borderColor: B2C_COLOR,
        backgroundColor: B2C_COLOR,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      })
    }

    return { labels: ADMIN_REVENUE_CHART_LABELS, datasets }
  }, [channel, t])

  const revenueOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, usePointStyle: true },
        },
        tooltip: {
          ...baseTooltip,
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: $${Number(ctx.raw).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
        y: {
          min: 0,
          max: 80000,
          ticks: {
            color: '#9ca3af',
            stepSize: 20000,
            callback: (v) => v,
          },
          grid: { color: '#f3f4f6' },
        },
      },
    }),
    [],
  )

  const ordersData = useMemo(() => {
    const datasets = []

    if (channel === 'all' || channel === 'b2b') {
      datasets.push({
        label: t('adminDashboard.charts.b2bOrders'),
        data: ADMIN_ORDER_B2B,
        backgroundColor: B2B_COLOR,
        borderRadius: 4,
        barThickness: channel === 'b2b' ? 18 : 14,
      })
    }

    if (channel === 'all' || channel === 'b2c') {
      datasets.push({
        label: t('adminDashboard.charts.b2cOrders'),
        data: ADMIN_ORDER_B2C,
        backgroundColor: B2C_BAR_COLOR,
        borderRadius: 4,
        barThickness: channel === 'b2c' ? 18 : 14,
      })
    }

    return { labels: ADMIN_REVENUE_CHART_LABELS, datasets }
  }, [channel, t])

  const ordersOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, usePointStyle: true },
        },
        tooltip: baseTooltip,
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#9ca3af' },
        },
        y: {
          min: 0,
          max: 800,
          ticks: { color: '#9ca3af', stepSize: 200 },
          grid: { color: '#f3f4f6' },
        },
      },
    }),
    [],
  )

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-5">
      <ChartCard
        title={t('adminDashboard.charts.revenueTrend')}
        timeframe={revenueRange}
        onTimeframeChange={setRevenueRange}
        timeLabel={timeLabel}
      >
        <Line key={`revenue-${channel}`} data={revenueData} options={revenueOptions} />
      </ChartCard>
      <ChartCard
        title={t('adminDashboard.charts.orderVolume')}
        timeframe={ordersRange}
        onTimeframeChange={setOrdersRange}
        timeLabel={timeLabel}
      >
        <Bar key={`orders-${channel}`} data={ordersData} options={ordersOptions} />
      </ChartCard>
    </div>
  )
}
