import { useCallback, useMemo, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import {
  DEMO_SUPPLIER_FACTORY_ORDER_COMPANIES,
  DEMO_SUPPLIER_FACTORY_ORDERS,
  SUPPLIER_FACTORY_ORDERS_PAGE_SIZE,
} from '@/data/demoData';

const TAB_IDS = {
  orders: 'orders',
  transport: 'transport',
};

const STATUS_LABEL_KEYS = {
  produced: 'panel.supplierFactoryOrders.statusProduced',
  'in-production': 'panel.supplierFactoryOrders.statusInProduction',
  ready: 'panel.supplierFactoryOrders.statusReady',
  assigned: 'panel.supplierFactoryOrders.statusAssigned',
  cancel: 'panel.supplierFactoryOrders.statusCancel',
  completed: 'panel.supplierFactoryOrders.statusCompleted',
};

export default function FactoryOrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_IDS.orders);
  const [companyFilter, setCompanyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState(DEMO_SUPPLIER_FACTORY_ORDERS.orders);

  // TODO: replace DEMO_* with supplier factory orders API fetch

  const tabs = useMemo(
    () => [
      {
        id: TAB_IDS.orders,
        label: t('panel.supplierFactoryOrders.tabOrders'),
      },
      {
        id: TAB_IDS.transport,
        label: t('panel.supplierFactoryOrders.tabTransportRequest'),
      },
    ],
    [t],
  );

  const companyOptions = useMemo(
    () => [
      { value: 'all', label: t('panel.supplierFactoryOrders.allCompany') },
      ...DEMO_SUPPLIER_FACTORY_ORDER_COMPANIES.map((company) => ({
        value: company.value,
        label: company.label,
      })),
    ],
    [t],
  );

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('panel.supplierFactoryOrders.allStatus') },
      {
        value: 'produced',
        label: t('panel.supplierFactoryOrders.statusProduced'),
      },
      {
        value: 'in-production',
        label: t('panel.supplierFactoryOrders.statusInProduction'),
      },
      {
        value: 'ready',
        label: t('panel.supplierFactoryOrders.statusReady'),
      },
      {
        value: 'assigned',
        label: t('panel.supplierFactoryOrders.statusAssigned'),
      },
      {
        value: 'cancel',
        label: t('panel.supplierFactoryOrders.statusCancel'),
      },
      {
        value: 'completed',
        label: t('panel.supplierFactoryOrders.statusCompleted'),
      },
    ],
    [t],
  );

  const handleDelete = useCallback((row) => {
    setOrders((prev) => prev.filter((item) => item.id !== row.id));
    // TODO: wire factory order delete API
  }, []);

  const handleMarkPaid = useCallback((row) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, transportStatus: 'paid' } : item,
      ),
    );
    // TODO: wire transport request paid API
  }, []);

  const handleDecline = useCallback((row) => {
    setOrders((prev) => prev.filter((item) => item.id !== row.id));
    // TODO: wire transport request decline API
  }, []);

  const getOrderRowActions = useCallback(
    () => [
      {
        id: 'see-details',
        label: t('panel.supplierFactoryOrders.actionSeeDetails'),
        variant: 'header',
        onClick: (row) => {
          navigate(`/supplier/factory-orders/${row.id}`, {
            state: { status: row.status, tab: activeTab },
          });
        },
      },
      {
        id: 'delete',
        label: t('panel.supplierFactoryOrders.actionDelete'),
        onClick: handleDelete,
      },
    ],
    [t, handleDelete, navigate, activeTab],
  );

  const getTransportRowActions = useCallback(
    () => [
      {
        id: 'paid',
        label: t('panel.supplierFactoryOrders.actionPaid'),
        variant: 'header',
        onClick: handleMarkPaid,
      },
      {
        id: 'decline',
        label: t('panel.supplierFactoryOrders.actionDecline'),
        onClick: handleDecline,
      },
    ],
    [t, handleMarkPaid, handleDecline],
  );

  const companyLabelById = useMemo(
    () =>
      Object.fromEntries(
        DEMO_SUPPLIER_FACTORY_ORDER_COMPANIES.map((company) => [
          company.value,
          company.label,
        ]),
      ),
    [],
  );

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((row) => {
      if (row.tab !== activeTab) return false;
      if (
        activeTab === TAB_IDS.transport &&
        row.transportStatus === 'paid'
      ) {
        return false;
      }
      if (companyFilter !== 'all' && row.companyId !== companyFilter) return false;
      if (
        activeTab === TAB_IDS.orders &&
        statusFilter !== 'all' &&
        row.status !== statusFilter
      ) {
        return false;
      }
      if (!q) return true;

      const statusLabel = (
        row.statusLabel || t(STATUS_LABEL_KEYS[row.status] || '')
      ).toLowerCase();
      const companyLabel = (
        companyLabelById[row.companyId] || row.factoryName || ''
      ).toLowerCase();

      if (activeTab === TAB_IDS.orders) {
        return (
          String(row.poNumber).toLowerCase().includes(q) ||
          String(row.factoryName).toLowerCase().includes(q) ||
          companyLabel.includes(q) ||
          String(row.total).toLowerCase().includes(q) ||
          String(row.installmentAmount).toLowerCase().includes(q) ||
          String(row.installmentNumber).toLowerCase().includes(q) ||
          String(row.status).toLowerCase().includes(q) ||
          statusLabel.includes(q) ||
          String(row.date).toLowerCase().includes(q)
        );
      }

      return (
        String(row.poNumber).toLowerCase().includes(q) ||
        String(row.factoryName).toLowerCase().includes(q) ||
        companyLabel.includes(q) ||
        String(row.product).toLowerCase().includes(q) ||
        String(row.qty).toLowerCase().includes(q) ||
        String(row.weightSize).toLowerCase().includes(q) ||
        String(row.shippingCharge).toLowerCase().includes(q)
      );
    });
  }, [
    orders,
    activeTab,
    companyFilter,
    statusFilter,
    search,
    companyLabelById,
    t,
  ]);

  const total = filteredOrders.length;
  const pageCount = Math.max(
    1,
    Math.ceil(total / SUPPLIER_FACTORY_ORDERS_PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);
  const pagedOrders = filteredOrders.slice(
    (safePage - 1) * SUPPLIER_FACTORY_ORDERS_PAGE_SIZE,
    safePage * SUPPLIER_FACTORY_ORDERS_PAGE_SIZE,
  );

  const orderColumns = useMemo(
    () => [
      {
        key: 'poNumber',
        header: t('panel.supplierFactoryOrders.colPoNumber'),
      },
      {
        key: 'factoryName',
        header: t('panel.supplierFactoryOrders.colFactoryName'),
      },
      {
        key: 'total',
        header: t('panel.supplierFactoryOrders.colTotal'),
      },
      {
        key: 'installmentAmount',
        header: t('panel.supplierFactoryOrders.colInstallmentAmount'),
      },
      {
        key: 'status',
        header: t('panel.supplierFactoryOrders.colStatus'),
        render: (value, row) => (
          <StatusBadge status={value} label={row.statusLabel} />
        ),
      },
      {
        key: 'installmentNumber',
        header: t('panel.supplierFactoryOrders.colInstallmentNumber'),
      },
      {
        key: 'date',
        header: t('panel.supplierFactoryOrders.colDate'),
      },
    ],
    [t],
  );

  const transportColumns = useMemo(
    () => [
      {
        key: 'poNumber',
        header: t('panel.supplierFactoryOrders.colPoNumber'),
      },
      {
        key: 'factoryName',
        header: t('panel.supplierFactoryOrders.colFactoryName'),
      },
      {
        key: 'product',
        header: t('panel.supplierFactoryOrders.colProduct'),
      },
      {
        key: 'qty',
        header: t('panel.supplierFactoryOrders.colQty'),
      },
      {
        key: 'weightSize',
        header: t('panel.supplierFactoryOrders.colWeightSize'),
        className: 'max-w-[200px] whitespace-normal',
      },
      {
        key: 'shippingCharge',
        header: t('panel.supplierFactoryOrders.colShippingCharge'),
      },
    ],
    [t],
  );

  const columns =
    activeTab === TAB_IDS.transport ? transportColumns : orderColumns;
  const getRowActions =
    activeTab === TAB_IDS.transport
      ? getTransportRowActions
      : getOrderRowActions;

  const from =
    total === 0 ? 0 : (safePage - 1) * SUPPLIER_FACTORY_ORDERS_PAGE_SIZE + 1;
  const to =
    total === 0
      ? 0
      : Math.min(safePage * SUPPLIER_FACTORY_ORDERS_PAGE_SIZE, total);

  const emptyMessage =
    activeTab === TAB_IDS.transport
      ? t('panel.supplierFactoryOrders.emptyTransport')
      : t('panel.supplierFactoryOrders.emptyOrders');

  const isOrdersTab = activeTab === TAB_IDS.orders;

  return (
    <>
      <Seo title={t('panel.supplierFactoryOrders.title')} />

      <div className="mb-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t('panel.supplierFactoryOrders.title')}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t('panel.supplierFactoryOrders.subtitle')}
          </p>
        </header>
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

          {isOrdersTab ? (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              <span className="text-sm font-medium text-[var(--primary-text)]">
                {t('panel.supplierFactoryOrders.sortBy')}
              </span>
              <label className="relative inline-flex min-w-[140px] items-center">
                <select
                  value={companyFilter}
                  onChange={(event) => {
                    setCompanyFilter(event.target.value);
                    setPage(1);
                  }}
                  className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none transition-colors hover:border-gray-300 focus:border-[var(--active)]"
                  aria-label={t('panel.supplierFactoryOrders.allCompany')}
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
                  aria-label={t('panel.supplierFactoryOrders.allStatus')}
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
          ) : null}
        </div>

        <DataTable
          showCard={false}
          columns={columns}
          data={pagedOrders}
          getRowKey={(row) => row.id}
          showActions
          getActions={getRowActions}
          actionHeader={t('panel.supplierFactoryOrders.colAction')}
          emptyMessage={emptyMessage}
          showPagination
          showSearch
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder={t('panel.supplierFactoryOrders.searchPlaceholder')}
          pagination={{
            page: safePage,
            pageSize: SUPPLIER_FACTORY_ORDERS_PAGE_SIZE,
            total,
            from,
            to,
            hasPrevious: safePage > 1,
            hasNext: safePage < pageCount,
            onPageChange: setPage,
            summaryLabel: t('panel.supplierFactoryOrders.showingResults', {
              from,
              to,
              total,
            }),
            previousLabel: t('panel.supplierFactoryOrders.previous'),
            nextLabel: t('panel.supplierFactoryOrders.next'),
          }}
        />
      </section>
    </>
  );
}
