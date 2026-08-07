import { useMemo, useState } from 'react';
import { FiChevronDown, FiFilter } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import StatusCard from '@/components/data-display/StatusCard';
import {
  DEMO_SUPPLIER_CUSTOMER_ORDERS,
  DEMO_SUPPLIER_CUSTOMER_ORDERS_STAT_CARDS,
  SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE,
} from '@/data/demoData';

export default function OrdersCustomerPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  // TODO: replace DEMO_* with supplier customer orders API fetch
  const { stats, orders } = DEMO_SUPPLIER_CUSTOMER_ORDERS;

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('panel.supplierCustomerOrders.allStatus') },
      { value: 'new', label: t('panel.supplierCustomerOrders.statusNew') },
      { value: 'pending', label: t('panel.supplierCustomerOrders.statusPending') },
      {
        value: 'processing',
        label: t('panel.supplierCustomerOrders.statusProcessing'),
      },
      { value: 'assigned', label: t('panel.supplierCustomerOrders.statusAssigned') },
      { value: 'cancel', label: t('panel.supplierCustomerOrders.statusCancel') },
      {
        value: 'completed',
        label: t('panel.supplierCustomerOrders.statusCompleted'),
      },
    ],
    [t],
  );

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((row) => row.status === statusFilter);
  }, [orders, statusFilter]);

  const total = filteredOrders.length;
  const pageCount = Math.max(
    1,
    Math.ceil(total / SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);
  const pagedOrders = filteredOrders.slice(
    (safePage - 1) * SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE,
    safePage * SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE,
  );

  const columns = useMemo(
    () => [
      {
        key: 'orderId',
        header: t('panel.supplierCustomerOrders.colOrderId'),
      },
      {
        key: 'customerName',
        header: t('panel.supplierCustomerOrders.colCustomerName'),
      },
      {
        key: 'email',
        header: t('panel.supplierCustomerOrders.colEmail'),
      },
      {
        key: 'items',
        header: t('panel.supplierCustomerOrders.colItems'),
      },
      {
        key: 'total',
        header: t('panel.supplierCustomerOrders.colTotal'),
      },
      {
        key: 'status',
        header: t('panel.supplierCustomerOrders.colStatus'),
        render: (value, row) => (
          <StatusBadge
            status={value}
            label={row.statusLabel}
            className="rounded-full"
          />
        ),
      },
      {
        key: 'date',
        header: t('panel.supplierCustomerOrders.colDate'),
      },
    ],
    [t],
  );

  const rowActions = useMemo(
    () => [
      {
        id: 'view',
        label: t('panel.supplierCustomerOrders.actionViewDetails'),
        onClick: () => {
          // TODO: open order details when route is available
        },
      },
    ],
    [t],
  );

  const from = total === 0 ? 0 : (safePage - 1) * SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE + 1;
  const to =
    total === 0
      ? 0
      : Math.min(safePage * SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE, total);

  return (
    <>
      <Seo title={t('panel.supplierCustomerOrders.title')} />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t('panel.supplierCustomerOrders.title')}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t('panel.supplierCustomerOrders.subtitle')}
          </p>
        </header>

        <label
          className="relative inline-flex min-w-[160px] shrink-0 items-center gap-2 self-start rounded-md border border-gray-200 bg-white px-3 pr-9"
        >
          <FiFilter
            className="size-4 shrink-0 text-[var(--secondary-text)]"
            aria-hidden
          />
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="h-10 w-full min-w-0 cursor-pointer appearance-none bg-transparent py-2 text-sm text-[var(--primary-text)] outline-none"
            aria-label={t('panel.supplierCustomerOrders.allStatus')}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown
            className="pointer-events-none absolute right-2.5 size-4 text-[var(--secondary-text)]"
            aria-hidden
          />
        </label>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_SUPPLIER_CUSTOMER_ORDERS_STAT_CARDS.map((card) => {
          const value = stats[card.valueKey];

          return (
            <StatusCard
              key={card.id}
              variant={card.variant}
              label={t(card.labelKey)}
              value={value}
              badge={card.variant === 'badge' ? value : undefined}
              icon={card.icon}
              iconTone={card.iconTone}
              tone={card.tone}
              className="shadow-sm"
            />
          );
        })}
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <DataTable
          showCard={false}
          columns={columns}
          data={pagedOrders}
          getRowKey={(row) => row.id}
          showActions
          actions={rowActions}
          actionHeader={t('panel.supplierCustomerOrders.colAction')}
          emptyMessage={t('panel.supplierCustomerOrders.emptyOrders')}
          showPagination
          pagination={{
            page: safePage,
            pageSize: SUPPLIER_CUSTOMER_ORDERS_PAGE_SIZE,
            total,
            from,
            to,
            hasPrevious: safePage > 1,
            hasNext: safePage < pageCount,
            onPageChange: setPage,
            summaryLabel: t('panel.supplierCustomerOrders.showingResults', {
              from,
              to,
              total,
            }),
            previousLabel: t('panel.supplierCustomerOrders.previous'),
            nextLabel: t('panel.supplierCustomerOrders.next'),
          }}
        />
      </section>
    </>
  );
}
