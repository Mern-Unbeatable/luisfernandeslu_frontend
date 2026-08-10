import { useCallback, useMemo, useState } from 'react';
import { FiAlertCircle, FiAlertTriangle, FiChevronDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import StatusCard from '@/components/data-display/StatusCard';
import {
  DEMO_SUPPLIER_INVENTORY,
  DEMO_SUPPLIER_INVENTORY_CATEGORIES,
  DEMO_SUPPLIER_INVENTORY_FACTORIES,
  DEMO_SUPPLIER_INVENTORY_STAT_CARDS,
  DEMO_SUPPLIER_INVENTORY_WAREHOUSES,
  SUPPLIER_INVENTORY_PAGE_SIZE,
} from '@/data/demoData';
import AddInventoryProductModal from './AddInventoryProductModal';
import RestockModal from './RestockModal';

const TAB_IDS = {
  management: 'management',
  erp: 'erp',
};

function InventoryStatusBadge({ status, label }) {
  const key = String(status || label || '').trim().toLowerCase();

  if (key === 'low') {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 whitespace-nowrap"
      >
        <FiAlertTriangle className="size-3.5 shrink-0" aria-hidden />
        {label || 'Low'}
      </span>
    );
  }

  if (key === 'out-of-stock' || key === 'out of stock') {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 whitespace-nowrap"
      >
        <FiAlertCircle className="size-3.5 shrink-0" aria-hidden />
        {label || 'Out of stock'}
      </span>
    );
  }

  return <StatusBadge status={status} label={label} />;
}

function deriveInventoryStatus(stock) {
  const value = Number(stock);
  if (value <= 0) return { status: 'out-of-stock', statusLabel: 'Out of stock' };
  if (value <= 200) return { status: 'low', statusLabel: 'Low' };
  return { status: 'good', statusLabel: 'Good' };
}

export default function InventoryPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(TAB_IDS.management);
  const [factoryFilter, setFactoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState(DEMO_SUPPLIER_INVENTORY.products);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [restockProduct, setRestockProduct] = useState(null);

  // TODO: replace DEMO_* with supplier inventory API fetch
  const stats = DEMO_SUPPLIER_INVENTORY.stats;

  const tabs = useMemo(
    () => [
      {
        id: TAB_IDS.management,
        label: t('panel.supplierInventory.tabManagement'),
      },
      {
        id: TAB_IDS.erp,
        label: t('panel.supplierInventory.tabErp'),
      },
    ],
    [t],
  );

  const factoryOptions = useMemo(
    () =>
      DEMO_SUPPLIER_INVENTORY_FACTORIES.map((factory) => ({
        value: factory.value,
        label:
          factory.value === 'all'
            ? t('panel.supplierInventory.allFactory')
            : factory.label,
      })),
    [t],
  );

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('panel.supplierInventory.allStatus') },
      { value: 'good', label: t('panel.supplierInventory.statusGood') },
      { value: 'low', label: t('panel.supplierInventory.statusLow') },
      {
        value: 'out-of-stock',
        label: t('panel.supplierInventory.statusOutOfStock'),
      },
    ],
    [t],
  );

  const handleDelete = useCallback((row) => {
    setProducts((prev) => prev.filter((item) => item.id !== row.id));
    // TODO: wire inventory delete API
  }, []);

  const handleRestock = useCallback((row) => {
    setRestockProduct(row);
    setRestockModalOpen(true);
  }, []);

  const handleEdit = useCallback((row) => {
    const warehouse =
      DEMO_SUPPLIER_INVENTORY_WAREHOUSES.find(
        (item) => item.label === row.warehouseLocation,
      );
    const category = DEMO_SUPPLIER_INVENTORY_CATEGORIES.find(
      (item) => item.label === row.category,
    );

    setEditingProduct({
      id: row.id,
      warehouseId: warehouse?.value || '',
      categoryId: category?.value || '',
      productName: row.productName,
      sku: row.sku,
      totalQuantity: String(row.currentStock),
      price: row.price.replace('$', ''),
      factoryName: row.factoryName,
    });
    setAddModalOpen(true);
  }, []);

  const getRowActions = useCallback(
    (row) => {
      if (!row.approved) {
        return [
          {
            id: 'see-details',
            label: t('panel.supplierInventory.actionSeeDetails'),
            variant: 'header',
            onClick: () => {
              // TODO: wire inventory detail route
            },
          },
        ];
      }

      return [
        {
          id: 'restock',
          label: t('panel.supplierInventory.actionRestock'),
          variant: 'header',
          onClick: handleRestock,
        },
        {
          id: 'edit',
          label: t('panel.supplierInventory.actionEdit'),
          onClick: handleEdit,
        },
        {
          id: 'delete',
          label: t('panel.supplierInventory.actionDelete'),
          onClick: handleDelete,
        },
      ];
    },
    [t, handleRestock, handleEdit, handleDelete],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((row) => {
      if (factoryFilter !== 'all' && row.factoryId !== factoryFilter) return false;
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      return true;
    });
  }, [products, factoryFilter, statusFilter]);

  const total = filteredProducts.length;
  const pageCount = Math.max(
    1,
    Math.ceil(total / SUPPLIER_INVENTORY_PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);
  const pagedProducts = filteredProducts.slice(
    (safePage - 1) * SUPPLIER_INVENTORY_PAGE_SIZE,
    safePage * SUPPLIER_INVENTORY_PAGE_SIZE,
  );

  const from =
    total === 0 ? 0 : (safePage - 1) * SUPPLIER_INVENTORY_PAGE_SIZE + 1;
  const to =
    total === 0
      ? 0
      : Math.min(safePage * SUPPLIER_INVENTORY_PAGE_SIZE, total);

  const columns = useMemo(
    () => [
      {
        key: 'inventoryNumber',
        header: t('panel.supplierInventory.colInventoryNumber'),
      },
      {
        key: 'category',
        header: t('panel.supplierInventory.colCategory'),
      },
      {
        key: 'productName',
        header: t('panel.supplierInventory.colProductName'),
        className: 'max-w-[180px] whitespace-normal font-medium',
      },
      {
        key: 'sku',
        header: t('panel.supplierInventory.colSku'),
      },
      {
        key: 'currentStock',
        header: t('panel.supplierInventory.colCurrentStock'),
      },
      {
        key: 'price',
        header: t('panel.supplierInventory.colPrice'),
      },
      {
        key: 'factoryName',
        header: t('panel.supplierInventory.colFactoryName'),
        className: 'max-w-[160px] whitespace-normal',
      },
      {
        key: 'warehouseLocation',
        header: t('panel.supplierInventory.colWarehouseLocation'),
        wrap: true,
        headerClassName: 'min-w-[220px] whitespace-normal',
        className: 'min-w-[220px] max-w-[280px] align-top leading-snug',
        render: (value) => (
          <span className="block break-words" title={value || undefined}>
            {value || '—'}
          </span>
        ),
      },
      {
        key: 'status',
        header: t('panel.supplierInventory.colStatus'),
        className: 'whitespace-nowrap align-top',
        render: (value, row) => (
          <InventoryStatusBadge status={value} label={row.statusLabel} />
        ),
      },
    ],
    [t],
  );

  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    setAddModalOpen(true);
  }, []);

  const handleAddModalClose = useCallback(() => {
    setAddModalOpen(false);
    setEditingProduct(null);
  }, []);

  const handleAddSubmit = useCallback(
    (payload) => {
      const warehouse = DEMO_SUPPLIER_INVENTORY_WAREHOUSES.find(
        (item) => item.value === payload.warehouseId,
      );
      const category = DEMO_SUPPLIER_INVENTORY_CATEGORIES.find(
        (item) => item.value === payload.categoryId,
      );
      const stock = Number(payload.totalQuantity) || 0;
      const statusMeta = deriveInventoryStatus(stock);
      const factoryMatch = DEMO_SUPPLIER_INVENTORY_FACTORIES.find(
        (item) =>
          item.label.toLowerCase() === payload.factoryName?.toLowerCase(),
      );

      if (payload.id) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === payload.id
              ? {
                  ...item,
                  category: category?.label || item.category,
                  productName: payload.productName,
                  sku: payload.sku,
                  currentStock: stock,
                  price: payload.price.startsWith('$')
                    ? payload.price
                    : `$${payload.price}`,
                  factoryName: payload.factoryName,
                  factoryId: factoryMatch?.value || item.factoryId,
                  warehouseLocation:
                    warehouse?.label || item.warehouseLocation,
                  status: statusMeta.status,
                  statusLabel: statusMeta.statusLabel,
                }
              : item,
          ),
        );
      } else {
        const nextIndex = products.length + 1;
        setProducts((prev) => [
          ...prev,
          {
            id: `inv-new-${Date.now()}`,
            inventoryNumber: `INV-${1000 + nextIndex}`,
            category: category?.label || 'Cement',
            productName: payload.productName,
            sku: payload.sku,
            currentStock: stock,
            price: payload.price.startsWith('$')
              ? payload.price
              : `$${payload.price}`,
            factoryId: factoryMatch?.value || 'steelco-manufacturing',
            factoryName: payload.factoryName,
            warehouseLocation: warehouse?.label || '',
            status: statusMeta.status,
            statusLabel: statusMeta.statusLabel,
            approved: true,
          },
        ]);
      }
      // TODO: wire inventory create/update API
    },
    [products.length],
  );

  const handleRestockSubmit = useCallback(({ product, quantity }) => {
    const added = Number(String(quantity).replace(/[^\d.]/g, '')) || 0;
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== product.id) return item;
        const nextStock = item.currentStock + added;
        const statusMeta = deriveInventoryStatus(nextStock);
        return {
          ...item,
          currentStock: nextStock,
          status: statusMeta.status,
          statusLabel: statusMeta.statusLabel,
        };
      }),
    );
    // TODO: wire inventory restock API
  }, []);

  return (
    <>
      <Seo title={t('panel.supplierInventory.title')} />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t('panel.supplierInventory.title')}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t('panel.supplierInventory.subtitle')}
          </p>
        </header>

        <button
          type="button"
          onClick={handleAddProduct}
          className="inline-flex shrink-0 items-center justify-center self-start rounded-md bg-[var(--active)] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:brightness-95"
        >
          {t('panel.supplierInventory.addNewProducts')}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_SUPPLIER_INVENTORY_STAT_CARDS.map((card) => {
          const value = stats[card.valueKey];
          const description = card.descriptionKey
            ? t(card.descriptionKey)
            : undefined;

          return (
            <StatusCard
              key={card.id}
              variant={card.variant}
              label={t(card.labelKey)}
              value={value}
              description={description}
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
        </div>

        {activeTab === TAB_IDS.management ? (
          <>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-bold text-[var(--primary-text)]">
                {t('panel.supplierInventory.productList')}
              </h2>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                <span className="text-sm font-medium text-[var(--primary-text)]">
                  {t('panel.supplierInventory.sortBy')}
                </span>
                <label className="relative inline-flex min-w-[140px] items-center">
                  <select
                    value={factoryFilter}
                    onChange={(event) => {
                      setFactoryFilter(event.target.value);
                      setPage(1);
                    }}
                    className="h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-[var(--primary-text)] outline-none transition-colors hover:border-gray-300 focus:border-[var(--active)]"
                    aria-label={t('panel.supplierInventory.allFactory')}
                  >
                    {factoryOptions.map((option) => (
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
                    aria-label={t('panel.supplierInventory.allStatus')}
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
              tableMinWidth="1120px"
              columns={columns}
              data={pagedProducts}
              getRowKey={(row) => row.id}
              showActions
              getActions={getRowActions}
              actionHeader={t('panel.supplierInventory.colAction')}
              emptyMessage={t('panel.supplierInventory.emptyProducts')}
              showPagination
              pagination={{
                page: safePage,
                pageSize: SUPPLIER_INVENTORY_PAGE_SIZE,
                total,
                from,
                to,
                hasPrevious: safePage > 1,
                hasNext: safePage < pageCount,
                onPageChange: setPage,
                summaryLabel: t('panel.supplierInventory.showingResults', {
                  from,
                  to,
                  total,
                }),
                previousLabel: t('panel.supplierInventory.previous'),
                nextLabel: t('panel.supplierInventory.next'),
              }}
            />
          </>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-16 text-center">
            <p className="text-base font-semibold text-[var(--primary-text)]">
              {t('panel.supplierInventory.erpTitle')}
            </p>
            <p className="mt-2 text-sm text-[var(--secondary-text)]">
              {t('panel.supplierInventory.erpSubtitle')}
            </p>
          </div>
        )}
      </section>

      <AddInventoryProductModal
        open={addModalOpen}
        onClose={handleAddModalClose}
        warehouseOptions={DEMO_SUPPLIER_INVENTORY_WAREHOUSES}
        categoryOptions={DEMO_SUPPLIER_INVENTORY_CATEGORIES}
        initialValues={editingProduct}
        onSubmit={handleAddSubmit}
      />

      <RestockModal
        open={restockModalOpen}
        onClose={() => {
          setRestockModalOpen(false);
          setRestockProduct(null);
        }}
        product={restockProduct}
        onSubmit={handleRestockSubmit}
      />
    </>
  );
}
