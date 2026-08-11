import { useCallback, useMemo, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import StatusCard from '@/components/data-display/StatusCard';
import {
  DEMO_SUPPLIER_COMPANY_ORDER_COMPANIES,
  DEMO_SUPPLIER_COMPANY_ORDERS,
  DEMO_SUPPLIER_COMPANY_ORDERS_CHAT_STAT_CARDS,
  DEMO_SUPPLIER_COMPANY_ORDERS_DIRECT_STAT_CARDS,
  SUPPLIER_COMPANY_ORDERS_PAGE_SIZE,
} from '@/data/demoData';

const TAB_IDS = {
  direct: 'direct',
  chat: 'chat',
};

const STATUS_LABEL_KEYS = {
  new: 'panel.supplierCompanyOrders.statusNew',
  pending: 'panel.supplierCompanyOrders.statusPending',
  processing: 'panel.supplierCompanyOrders.statusProcessing',
  assigned: 'panel.supplierCompanyOrders.statusAssigned',
  completed: 'panel.supplierCompanyOrders.statusCompleted',
  cancel: 'panel.supplierCompanyOrders.statusCancel',
};

const APPROVED_STATUS_OPTIONS = [
  'pending',
  'processing',
  'assigned',
  'completed',
  'cancel',
];

export default function CompanyOrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_IDS.direct);
  const [companyFilter, setCompanyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState(DEMO_SUPPLIER_COMPANY_ORDERS.orders);

  // TODO: replace DEMO_* with supplier company orders API fetch
  const statsByTab = DEMO_SUPPLIER_COMPANY_ORDERS.stats;
  const statCards =
    activeTab === TAB_IDS.direct
      ? DEMO_SUPPLIER_COMPANY_ORDERS_DIRECT_STAT_CARDS
      : DEMO_SUPPLIER_COMPANY_ORDERS_CHAT_STAT_CARDS;
  const stats = statsByTab[activeTab];

  const tabs = useMemo(
    () => [
      {
        id: TAB_IDS.direct,
        label: t('panel.supplierCompanyOrders.tabDirectOrders'),
      },
      {
        id: TAB_IDS.chat,
        label: t('panel.supplierCompanyOrders.tabChatOrders'),
      },
    ],
    [t],
  );

  const companyOptions = useMemo(
    () => [
      { value: 'all', label: t('panel.supplierCompanyOrders.allCompany') },
      ...DEMO_SUPPLIER_COMPANY_ORDER_COMPANIES.map((company) => ({
        value: company.value,
        label: company.label,
      })),
    ],
    [t],
  );

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('panel.supplierCompanyOrders.allStatus') },
      { value: 'new', label: t('panel.supplierCompanyOrders.statusNew') },
      {
        value: 'pending',
        label: t('panel.supplierCompanyOrders.statusPending'),
      },
      {
        value: 'processing',
        label: t('panel.supplierCompanyOrders.statusProcessing'),
      },
      {
        value: 'assigned',
        label: t('panel.supplierCompanyOrders.statusAssigned'),
      },
      { value: 'cancel', label: t('panel.supplierCompanyOrders.statusCancel') },
      {
        value: 'completed',
        label: t('panel.supplierCompanyOrders.statusCompleted'),
      },
    ],
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
      // TODO: wire company order status API
    },
    [t],
  );

  const handleAcceptOrder = useCallback(
    (row) => {
      handleStatusChange(row, 'pending');
    },
    [handleStatusChange],
  );

  const getRowActions = useCallback(
    (row) => {
      const seeDetails = {
        id: 'see-details',
        label: t('panel.supplierCompanyOrders.actionSeeDetails'),
        variant: 'header',
        onClick: (order) => {
          navigate(`/supplier/company-orders/${order.id}`, {
            state: { status: order.status, tab: order.tab },
          });
        },
      };

      if (row.status === 'new') {
        return [
          seeDetails,
          {
            id: 'accept',
            label: t('panel.supplierCompanyOrders.actionAccept'),
            onClick: handleAcceptOrder,
          },
        ];
      }

      return [
        seeDetails,
        {
          id: 'status-section',
          label: t('panel.supplierCompanyOrders.statusSection'),
          variant: 'section',
        },
        ...APPROVED_STATUS_OPTIONS.map((status) => ({
          id: `set-${status}`,
          label: t(STATUS_LABEL_KEYS[status]),
          onClick: (order) => handleStatusChange(order, status),
        })),
      ];
    },
    [t, handleAcceptOrder, handleStatusChange, navigate],
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((row) => {
      if (row.tab !== activeTab) return false;
      if (companyFilter !== 'all' && row.companyId !== companyFilter) return false;
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      return true;
    });
  }, [orders, activeTab, companyFilter, statusFilter]);

  const total = filteredOrders.length;
  const pageCount = Math.max(
    1,
    Math.ceil(total / SUPPLIER_COMPANY_ORDERS_PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);
  const pagedOrders = filteredOrders.slice(
    (safePage - 1) * SUPPLIER_COMPANY_ORDERS_PAGE_SIZE,
    safePage * SUPPLIER_COMPANY_ORDERS_PAGE_SIZE,
  );

  const directColumns = useMemo(
    () => [
      {
        key: 'orderId',
        header: t('panel.supplierCompanyOrders.colOrderId'),
      },
      {
        key: 'customerName',
        header: t('panel.supplierCompanyOrders.colCustomerName'),
      },
      {
        key: 'email',
        header: t('panel.supplierCompanyOrders.colEmail'),
      },
      {
        key: 'items',
        header: t('panel.supplierCompanyOrders.colItems'),
      },
      {
        key: 'total',
        header: t('panel.supplierCompanyOrders.colTotal'),
      },
      {
        key: 'status',
        header: t('panel.supplierCompanyOrders.colStatus'),
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
        header: t('panel.supplierCompanyOrders.colDate'),
      },
    ],
    [t],
  );

  const chatColumns = useMemo(
    () => [
      {
        key: 'orderId',
        header: t('panel.supplierCompanyOrders.colOrderId'),
      },
      {
        key: 'companyName',
        header: t('panel.supplierCompanyOrders.colCompanyName'),
      },
      {
        key: 'total',
        header: t('panel.supplierCompanyOrders.colTotal'),
      },
      {
        key: 'installmentAmount',
        header: t('panel.supplierCompanyOrders.colInstallmentAmount'),
      },
      {
        key: 'status',
        header: t('panel.supplierCompanyOrders.colStatus'),
        render: (value, row) => (
          <StatusBadge
            status={value}
            label={row.statusLabel}
            className="rounded-full"
          />
        ),
      },
      {
        key: 'installmentNumber',
        header: t('panel.supplierCompanyOrders.colInstallmentNumber'),
      },
      {
        key: 'date',
        header: t('panel.supplierCompanyOrders.colDate'),
      },
    ],
    [t],
  );

  const columns =
    activeTab === TAB_IDS.direct ? directColumns : chatColumns;

  const from =
    total === 0 ? 0 : (safePage - 1) * SUPPLIER_COMPANY_ORDERS_PAGE_SIZE + 1;
  const to =
    total === 0
      ? 0
      : Math.min(safePage * SUPPLIER_COMPANY_ORDERS_PAGE_SIZE, total);

  return (
    <>
      <Seo title={t('panel.supplierCompanyOrders.title')} />

      <div className="mb-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t('panel.supplierCompanyOrders.title')}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t('panel.supplierCompanyOrders.subtitle')}
          </p>
        </header>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const value = stats[card.valueKey];
          const description = card.descriptionKey
            ? stats[card.descriptionKey]
            : undefined;

          return (
            <StatusCard
              key={card.id}
              variant={card.variant}
              label={t(card.labelKey)}
              value={value}
              description={description}
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
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-fit max-w-full shrink-0 items-center rounded-lg bg-white p-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPage(1);
                  }}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                    isActive
                      ? 'bg-[var(--active)] text-white shadow-sm'
                      : 'bg-transparent text-[var(--primary-text)] hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-sm font-medium text-[var(--primary-text)]">
              {t('panel.supplierCompanyOrders.sortBy')}
            </span>
            <label className="relative inline-flex min-w-[140px] items-center">
              <select
                value={companyFilter}
                onChange={(event) => {
                  setCompanyFilter(event.target.value);
                  setPage(1);
                }}
                className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none transition-colors hover:border-gray-300 focus:border-[var(--active)]"
                aria-label={t('panel.supplierCompanyOrders.allCompany')}
              >
                {companyOptions.map((option) => (
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
            <label className="relative inline-flex min-w-[140px] items-center">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none transition-colors hover:border-gray-300 focus:border-[var(--active)]"
                aria-label={t('panel.supplierCompanyOrders.allStatus')}
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
        </div>

        <DataTable
          showCard={false}
          columns={columns}
          data={pagedOrders}
          getRowKey={(row) => row.id}
          showActions
          getActions={getRowActions}
          actionHeader={t('panel.supplierCompanyOrders.colAction')}
          emptyMessage={t('panel.supplierCompanyOrders.emptyOrders')}
          showPagination
          pagination={{
            page: safePage,
            pageSize: SUPPLIER_COMPANY_ORDERS_PAGE_SIZE,
            total,
            from,
            to,
            hasPrevious: safePage > 1,
            hasNext: safePage < pageCount,
            onPageChange: setPage,
            summaryLabel: t('panel.supplierCompanyOrders.showingResults', {
              from,
              to,
              total,
            }),
            previousLabel: t('panel.supplierCompanyOrders.previous'),
            nextLabel: t('panel.supplierCompanyOrders.next'),
          }}
        />
      </section>
    </>
  );
}
