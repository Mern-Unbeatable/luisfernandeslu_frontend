import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { DEMO_SUPPLIER_ANALYTICS } from '@/data/demoData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const REVENUE_COLOR = '#14B8A6';
const EXPENSES_COLOR = '#EF4444';
const PROFIT_COLOR = '#22C55E';
const REGULAR_BAR_COLOR = '#E8D4B8';
const COMPANY_BAR_COLOR = '#F59E0B';

const baseTooltip = {
  backgroundColor: '#ffffff',
  titleColor: '#9ca3af',
  bodyColor: '#111827',
  borderColor: '#e5e7eb',
  borderWidth: 1,
  padding: 12,
  displayColors: true,
};

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
];

function ChartShell({ title, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <h2 className='text-lg font-bold text-[var(--primary-text)]'>{title}</h2>
      {children}
    </div>
  );
}

export function RevenueExpensesProfitChart() {
  const { t } = useTranslation();
  const labels = MONTH_KEYS.map((key) => t(`supplierAnalytics.months.${key}`));
  const series = DEMO_SUPPLIER_ANALYTICS.revenueExpensesProfit;

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: t('supplierAnalytics.charts.revenue'),
          data: series.revenue,
          borderColor: REVENUE_COLOR,
          backgroundColor: REVENUE_COLOR,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2.5,
        },
        {
          label: t('supplierAnalytics.charts.expenses'),
          data: series.expenses,
          borderColor: EXPENSES_COLOR,
          backgroundColor: EXPENSES_COLOR,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2.5,
        },
        {
          label: t('supplierAnalytics.charts.profit'),
          data: series.profit,
          borderColor: PROFIT_COLOR,
          backgroundColor: PROFIT_COLOR,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2.5,
        },
      ],
    }),
    [labels, series, t],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: false,
            padding: 16,
            color: '#4b5563',
            font: { size: 12 },
          },
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
        x: {
          grid: { display: false },
          ticks: { color: '#9ca3af', font: { size: 11 } },
          border: { display: false },
        },
        y: {
          min: 0,
          max: 20000,
          ticks: {
            stepSize: 5000,
            color: '#9ca3af',
            font: { size: 11 },
            callback: (value) => `€${value / 1000}k`,
          },
          grid: { color: '#f3f4f6' },
          border: { display: false },
        },
      },
    }),
    [],
  );

  return (
    <ChartShell title={t('supplierAnalytics.charts.revenueExpensesProfit')}>
      <div className='mt-6 h-72 w-full sm:h-80'>
        <Line data={data} options={options} />
      </div>
    </ChartShell>
  );
}

export function RevenueBreakdownChart() {
  const { t } = useTranslation();
  const breakdown = DEMO_SUPPLIER_ANALYTICS.revenueBreakdown;

  const items = [
    {
      key: 'regular',
      label: t('supplierAnalytics.charts.regularSales'),
      ...breakdown.regular,
    },
    {
      key: 'company',
      label: t('supplierAnalytics.charts.companySales'),
      ...breakdown.company,
    },
  ];

  const data = useMemo(
    () => ({
      labels: items.map((item) => item.label),
      datasets: [
        {
          data: items.map((item) => item.value),
          backgroundColor: items.map((item) => item.color),
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    }),
    [items],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          ...baseTooltip,
          callbacks: {
            label: (ctx) => {
              const item = items[ctx.dataIndex];
              return `${item.label}: ${item.percent}% (${item.amount})`;
            },
          },
        },
      },
    }),
    [items],
  );

  return (
    <ChartShell title={t('supplierAnalytics.charts.revenueBreakdown')}>
      <div className='mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between'>
        <div className='h-52 w-full max-w-[220px] sm:h-56'>
          <Doughnut data={data} options={options} />
        </div>

        <ul className='w-full min-w-0 space-y-4 sm:max-w-[220px]'>
          {items.map((item) => (
            <li key={item.key} className='text-sm'>
              <span className='inline-flex items-center gap-2 text-[var(--primary-text)]'>
                <span
                  className='size-2.5 shrink-0 rounded-full'
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                {item.label}
              </span>
              <p className='mt-1 pl-4 text-base font-bold text-[var(--primary-text)]'>
                {item.amount}
              </p>
              <p className='pl-4 text-xs text-[var(--secondary-text)]'>
                {item.percent}%
              </p>
            </li>
          ))}
        </ul>
      </div>
    </ChartShell>
  );
}

export function SalesByCustomerTypeChart() {
  const { t } = useTranslation();
  const labels = MONTH_KEYS.map((key) => t(`supplierAnalytics.months.${key}`));
  const sales = DEMO_SUPPLIER_ANALYTICS.salesByCustomerType;

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: t('supplierAnalytics.charts.regularCustomers'),
          data: sales.regular,
          backgroundColor: REGULAR_BAR_COLOR,
          borderRadius: 4,
          barThickness: 14,
        },
        {
          label: t('supplierAnalytics.charts.companyCustomers'),
          data: sales.company,
          backgroundColor: COMPANY_BAR_COLOR,
          borderRadius: 4,
          barThickness: 14,
        },
      ],
    }),
    [labels, sales, t],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            padding: 16,
            color: '#4b5563',
            font: { size: 12 },
          },
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
        x: {
          grid: { display: false },
          ticks: { color: '#9ca3af', font: { size: 11 } },
          border: { display: false },
        },
        y: {
          min: 0,
          max: 10000,
          ticks: {
            stepSize: 2500,
            color: '#9ca3af',
            font: { size: 11 },
            callback: (value) => `€${value / 1000}k`,
          },
          grid: { color: '#f3f4f6' },
          border: { display: false },
        },
      },
    }),
    [],
  );

  return (
    <ChartShell title={t('supplierAnalytics.charts.salesByCustomerType')}>
      <div className='mt-6 h-72 w-full sm:h-80'>
        <Bar data={data} options={options} />
      </div>

      <div className='mt-6 rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900'>
        {t('supplierAnalytics.charts.insight')}
      </div>
    </ChartShell>
  );
}
