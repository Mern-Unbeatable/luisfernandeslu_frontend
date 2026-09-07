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

export default function ChartsSection({ channel = 'all', data, isLoading }) {
  const { t } = useTranslation()
  const [revenueRange, setRevenueRange] = useState('thisYear')
  const [ordersRange, setOrdersRange] = useState('thisYear')
  const timeLabel = t('adminDashboard.charts.thisYear')

  const labels = data?.labels || ADMIN_REVENUE_CHART_LABELS

  const revenueB2B = Array.isArray(data?.revenue?.[revenueRange]?.b2b)
    ? data.revenue[revenueRange].b2b
    : ADMIN_REVENUE_B2B
  const revenueB2C = Array.isArray(data?.revenue?.[revenueRange]?.b2c)
    ? data.revenue[revenueRange].b2c
    : ADMIN_REVENUE_B2C

  const ordersB2B = Array.isArray(data?.orders?.[ordersRange]?.b2b)
    ? data.orders[ordersRange].b2b
    : ADMIN_ORDER_B2B
  const ordersB2C = Array.isArray(data?.orders?.[ordersRange]?.b2c)
    ? data.orders[ordersRange].b2c
    : ADMIN_ORDER_B2C

  const revenueData = useMemo(() => {
    const datasets = []

    if (channel === 'all' || channel === 'b2b') {
      datasets.push({
        label: t('adminDashboard.charts.b2bRevenue'),
        data: revenueB2B,
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
        data: revenueB2C,
        borderColor: B2C_COLOR,
        backgroundColor: B2C_COLOR,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      })
    }

    return { labels, datasets }
  }, [channel, labels, revenueB2B, revenueB2C, t])

  const maxRevenue = useMemo(() => {
    const allVals = [...revenueB2B, ...revenueB2C]
    const highest = Math.max(...allVals, 1000)
    return Math.ceil(highest / 10000) * 10000
  }, [revenueB2B, revenueB2C])

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
            label(ctx) {
              return `${ctx.dataset.label}: €${Number(ctx.raw).toLocaleString('en-US')}`
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
        y: {
          min: 0,
          max: maxRevenue,
          ticks: {
            color: '#9ca3af',
            stepSize: Math.max(1000, Math.round(maxRevenue / 4)),
            callback: (v) => v,
          },
          grid: { color: '#f3f4f6' },
        },
      },
    }),
    [maxRevenue],
  )

  const ordersData = useMemo(() => {
    const datasets = []

    if (channel === 'all' || channel === 'b2b') {
      datasets.push({
        label: t('adminDashboard.charts.b2bOrders'),
        data: ordersB2B,
        backgroundColor: B2B_COLOR,
        borderRadius: 4,
        barThickness: channel === 'b2b' ? 18 : 14,
      })
    }

    if (channel === 'all' || channel === 'b2c') {
      datasets.push({
        label: t('adminDashboard.charts.b2cOrders'),
        data: ordersB2C,
        backgroundColor: B2C_BAR_COLOR,
        borderRadius: 4,
        barThickness: channel === 'b2c' ? 18 : 14,
      })
    }

    return { labels, datasets }
  }, [channel, labels, ordersB2B, ordersB2C, t])

  const maxOrders = useMemo(() => {
    const allVals = [...ordersB2B, ...ordersB2C]
    const highest = Math.max(...allVals, 10)
    return Math.ceil(highest / 100) * 100
  }, [ordersB2B, ordersB2C])

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
        <Line key={`revenue-${channel}-${revenueRange}`} data={revenueData} options={revenueOptions} />
      </ChartCard>
      <ChartCard
        title={t('adminDashboard.charts.orderVolume')}
        timeframe={ordersRange}
        onTimeframeChange={setOrdersRange}
        timeLabel={timeLabel}
      >
        <Bar key={`orders-${channel}-${ordersRange}`} data={ordersData} options={ordersOptions} />
      </ChartCard>
    </div>
  )
}
