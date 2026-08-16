import { useCallback, useMemo, useState } from 'react';
import { FiChevronDown, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusCard from '@/components/data-display/StatusCard';
import {
  DEMO_SUPPLIER_DASHBOARD,
  DEMO_SUPPLIER_DASHBOARD_STAT_CARDS,
} from '@/data/demoData';
import OrderStatusSelect from './OrderStatusSelect';
import RevenueChart from './RevenueChart';

const STATUS_LABEL_KEYS = {
  assign: 'panel.supplierDashboard.statusAssign',
  completed: 'panel.supplierDashboard.statusCompleted',
  pending: 'panel.supplierDashboard.statusPending',
  cancel: 'panel.supplierDashboard.statusCancel',
};

const STATUS_OPTIONS = ['assign', 'completed', 'pending', 'cancel'];

function toDetailStatus(status) {
  return status === 'assign' ? 'assigned' : status;
}

function formatStatValue(value, format) {
  if (format === 'currency') {
    return `€${value.toLocaleString('en-US')}`;
  }
  return String(value);
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('thisYear');
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState(DEMO_SUPPLIER_DASHBOARD.orders || []);

  // TODO: replace DEMO_* with supplier dashboard API fetch
  const dashboard = DEMO_SUPPLIER_DASHBOARD;
  const pageSize = 7;
  const total = orders.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const pagedOrders = orders.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.map((value) => ({
        value,
        label: t(STATUS_LABEL_KEYS[value]),
      })),
    [t],
  );

  const handleStatusChange = useCallback(
    (row, status) => {
      setOrders((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
                ...item,
                status,
                statusLabel: t(STATUS_LABEL_KEYS[status]),
              }
            : item,
        ),
      );
      // TODO: wire supplier dashboard order status API
    },
    [t],
  );

  const handleViewOrder = useCallback((row) => {
    const isCompany = String(row.type).toLowerCase() === 'company';
    const detailId = row.detailId || row.id;
    const path = isCompany
      ? `/supplier/company-orders/${detailId}`
      : `/supplier/orders-customer/${detailId}`;

    navigate(path, {
      state: {
        status: toDetailStatus(row.status),
        tab: row.tab,
      },
    });
  }, [navigate]);

  const columns = useMemo(
    () => [
      {
        key: 'orderId',
        header: t('panel.supplierDashboard.orderId'),
      },
      {
        key: 'customerName',
        header: t('panel.supplierDashboard.customerName'),
      },
      {
        key: 'type',
        header: t('panel.supplierDashboard.type'),
      },
      {
        key: 'price',
        header: t('panel.supplierDashboard.price'),
      },
      {
        key: 'payment',
        header: t('panel.supplierDashboard.payment'),
      },
      {
        key: 'status',
        header: t('panel.supplierDashboard.status'),
        render: (value, row) => (
          <OrderStatusSelect
            status={value}
            label={row.statusLabel}
            options={statusOptions}
            onChange={(status) => handleStatusChange(row, status)}
            ariaLabel={t('panel.supplierDashboard.changeStatus')}
          />
        ),
      },
      {
        key: 'action',
        header: t('panel.supplierDashboard.action'),
        headerClassName: 'text-center',
        className: 'text-center',
        render: (_, row) => (
          <button
            type='button'
            onClick={() => handleViewOrder(row)}
            className='inline-flex rounded-md p-1.5 text-[var(--primary-text)] transition-colors hover:bg-gray-100'
            aria-label={t('panel.supplierDashboard.viewOrder')}
          >
            <FiEye className='size-5' strokeWidth={1.75} aria-hidden />
          </button>
        ),
      },
    ],
    [t, statusOptions, handleStatusChange, handleViewOrder],
  );

  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(safePage * pageSize, total);

  return (
    <>
      <Seo title={t('panel.supplierDashboard.title')} />

      <header className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl'>
          {t('panel.supplierDashboard.title')}
        </h1>
        <p className='mt-1 text-sm md:text-base text-neutral-500'>
          {t('panel.supplierDashboard.subtitle')}
        </p>
      </header>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        {DEMO_SUPPLIER_DASHBOARD_STAT_CARDS.map((card) => (
          <StatusCard
            key={card.id}
            variant='default'
            label={t(card.labelKey)}
            value={formatStatValue(dashboard.stats[card.valueKey], card.format)}
            icon={card.icon}
            iconTone={card.iconTone}
            className='shadow-sm'
          />
        ))}
      </div>

      <section
        className='mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'
        aria-label={t('panel.supplierDashboard.revenueTitle')}
      >
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h2 className='text-lg font-bold text-zinc-950 sm:text-xl'>
              {t('panel.supplierDashboard.revenueTitle')}
            </h2>
            <p className='mt-1 text-sm text-neutral-500'>
              {t('panel.supplierDashboard.revenueSubtitle')}
            </p>
          </div>

          <label className='relative inline-flex min-w-[140px] shrink-0 items-center self-start'>
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className='h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none transition-colors hover:border-gray-300 focus:border-[var(--active)]'
              aria-label={t('panel.supplierDashboard.periodFilter')}
            >
              <option value='thisYear'>
                {t('panel.supplierDashboard.periodThisYear')}
              </option>
              <option value='lastYear'>
                {t('panel.supplierDashboard.periodLastYear')}
              </option>
            </select>
            <FiChevronDown
              className='pointer-events-none absolute right-2.5 size-4 text-[var(--secondary-text)]'
              aria-hidden
            />
          </label>
        </div>

        <RevenueChart
          revenue={{
            maxValue: dashboard.revenue.maxValue,
            yTicks: dashboard.revenue.yTicks,
            series: dashboard.revenue.byPeriod[period] || [],
          }}
        />
      </section>

      <section className='mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
        <div className=''>
          <DataTable
            showCard={false}
            columns={columns}
            data={pagedOrders}
            getRowKey={(row) => row.id}
            showPagination
            pagination={{
              page: safePage,
              pageSize,
              total,
              from,
              to,
              hasPrevious: safePage > 1,
              hasNext: safePage < pageCount,
              onPageChange: setPage,
              summaryLabel: t('panel.supplierDashboard.showingResults', {
                from,
                to,
                total,
              }),
              previousLabel: t('panel.supplierDashboard.previous'),
              nextLabel: t('panel.supplierDashboard.next'),
            }}
          />
        </div>
      </section>
    </>
  );
}
