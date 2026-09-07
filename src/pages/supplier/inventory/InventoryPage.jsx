import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import StatusCard from '@/components/data-display/StatusCard';
import { getApiErrorMessage, parseNumber, toSelectOptions } from '@/features/supplier/apiError';
import {
  useCreateInventoryProductMutation,
  useDeleteInventoryProductMutation,
  useGetCategoriesQuery,
  useGetInventoryProductsQuery,
  useGetInventoryStatsQuery,
  useGetProductTypesQuery,
  useGetSubcategoriesQuery,
  useRestockInventoryProductMutation,
} from '@/features/supplier/inventory/inventoryApi';
import { buildInventoryCreateBody } from '@/features/supplier/inventory/inventoryMappers';
import {
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

export default function InventoryPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(TAB_IDS.management);
  const [factoryFilter, setFactoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [restockProduct, setRestockProduct] = useState(null);
  const [modalError, setModalError] = useState('');
  const [restockError, setRestockError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetInventoryStatsQuery();

  const {
    data: inventory,
    isLoading: listLoading,
    isError: listError,
    error: listQueryError,
  } = useGetInventoryProductsQuery({
    page,
    limit: SUPPLIER_INVENTORY_PAGE_SIZE,
    search: debouncedSearch,
  });

  const { data: categories = [] } = useGetCategoriesQuery();
  const [createInventoryProduct, { isLoading: creating }] =
    useCreateInventoryProductMutation();
  const [restockInventoryProduct, { isLoading: restocking }] =
    useRestockInventoryProductMutation();
  const [deleteInventoryProduct] = useDeleteInventoryProductMutation();

  const products = inventory?.products ?? [];
  const total = inventory?.total ?? 0;
  const loading = listLoading || statsLoading;

  const [modalCategoryId, setModalCategoryId] = useState('');
  const [modalSubCategoryId, setModalSubCategoryId] = useState('');

  const { data: subCategories = [] } = useGetSubcategoriesQuery(modalCategoryId, {
    skip: !modalCategoryId,
  });
  const { data: productTypes = [] } = useGetProductTypesQuery(modalSubCategoryId, {
    skip: !modalSubCategoryId,
  });

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

  const factoryOptions = useMemo(() => {
    const unique = new Map();
    products.forEach((row) => {
      if (row.factoryId && row.factoryName) {
        unique.set(row.factoryId, row.factoryName);
      }
    });
    return [
      { value: 'all', label: t('panel.supplierInventory.allFactory') },
      ...Array.from(unique.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [products, t]);

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

  const categoryOptions = useMemo(() => toSelectOptions(categories), [categories]);
  const subCategoryOptions = useMemo(
    () => toSelectOptions(subCategories),
    [subCategories],
  );
  const productTypeOptions = useMemo(
    () => toSelectOptions(productTypes),
    [productTypes],
  );

  const handleDelete = useCallback(
    async (row) => {
      try {
        await deleteInventoryProduct(row.id).unwrap();
      } catch (error) {
        toast.error(
          getApiErrorMessage(
            error,
            t('panel.supplierInventory.deleteFailed', {
              defaultValue: 'Could not delete inventory product.',
            }),
          ),
        );
      }
    },
    [deleteInventoryProduct, t],
  );

  const handleRestock = useCallback((row) => {
    setRestockError('');
    setRestockProduct(row);
    setRestockModalOpen(true);
  }, []);

  const handleEdit = useCallback((row) => {
    const warehouse = DEMO_SUPPLIER_INVENTORY_WAREHOUSES.find(
      (item) => item.label === row.warehouseLocation,
    );

    setModalError('');
    setModalCategoryId(row.categoryId || '');
    setModalSubCategoryId(row.subCategoryId || '');
    setEditingProduct({
      id: row.id,
      warehouseId: warehouse?.value || '',
      warehouseLocation: row.warehouseLocation,
      categoryId: row.categoryId || '',
      subCategoryId: row.subCategoryId || '',
      productTypeId: row.productTypeId || '',
      productName: row.productName,
      sku: row.sku,
      totalQuantity: String(row.currentStock),
      price:
        row.rawPrice != null
          ? String(row.rawPrice)
          : String(row.price || '').replace('€', ''),
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
            onClick: () => {},
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

  const pageCount = Math.max(1, Math.ceil(total / SUPPLIER_INVENTORY_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);
  const from = total === 0 ? 0 : (safePage - 1) * SUPPLIER_INVENTORY_PAGE_SIZE + 1;
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
    setModalCategoryId('');
    setModalSubCategoryId('');
    setModalError('');
    setAddModalOpen(true);
  }, []);

  const handleAddModalClose = useCallback(() => {
    if (creating) return;
    setAddModalOpen(false);
    setEditingProduct(null);
    setModalError('');
  }, [creating]);

  const handleAddSubmit = useCallback(
    async (payload) => {
      setModalError('');
      setModalCategoryId(payload.categoryId || '');
      setModalSubCategoryId(payload.subCategoryId || '');

      if (payload.id) {
        setModalError(
          t('panel.supplierInventory.updateUnsupported', {
            defaultValue:
              'Inventory details cannot be edited. Use restock to add quantity.',
          }),
        );
        return;
      }

      try {
        await createInventoryProduct(
          buildInventoryCreateBody(payload, DEMO_SUPPLIER_INVENTORY_WAREHOUSES),
        ).unwrap();
        setAddModalOpen(false);
        setEditingProduct(null);
      } catch (error) {
        setModalError(
          getApiErrorMessage(
            error,
            t('panel.supplierInventory.saveFailed', {
              defaultValue: 'Could not save inventory product.',
            }),
          ),
        );
      }
    },
    [createInventoryProduct, t],
  );

  const handleRestockSubmit = useCallback(
    async ({ product, quantity }) => {
      setRestockError('');
      const added = parseNumber(quantity);
      if (added == null || added <= 0) {
        setRestockError(
          t('panel.supplierInventory.invalidQuantity', {
            defaultValue: 'Enter a valid quantity.',
          }),
        );
        return;
      }

      try {
        await restockInventoryProduct({
          id: product.id,
          quantity: added,
        }).unwrap();
        setRestockModalOpen(false);
        setRestockProduct(null);
      } catch (error) {
        setRestockError(
          getApiErrorMessage(
            error,
            t('panel.supplierInventory.restockFailed', {
              defaultValue: 'Could not restock this product.',
            }),
          ),
        );
      }
    },
    [restockInventoryProduct, t],
  );

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setPage(1);
    setSearch('');
    setDebouncedSearch('');
  }, []);

  const tableFilters = useMemo(
    () => [
      {
        id: 'factory',
        value: factoryFilter,
        onChange: (value) => {
          setFactoryFilter(value);
        },
        options: factoryOptions,
        placeholder: t('panel.supplierInventory.allFactory'),
      },
      {
        id: 'status',
        value: statusFilter,
        onChange: (value) => {
          setStatusFilter(value);
        },
        options: statusOptions,
        placeholder: t('panel.supplierInventory.allStatus'),
      },
    ],
    [factoryFilter, statusFilter, factoryOptions, statusOptions, t],
  );

  const isManagementTab = activeTab === TAB_IDS.management;
  const listErrorMessage = listError
    ? getApiErrorMessage(
        listQueryError,
        t('panel.supplierInventory.loadFailed', {
          defaultValue: 'Could not load inventory.',
        }),
      )
    : '';

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
          const value = stats?.[card.valueKey] ?? (statsError ? '—' : '…');
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
        <DataTable
          showCard={false}
          showTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showSearch={isManagementTab}
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
          }}
          searchPlaceholder={t('panel.supplierInventory.searchPlaceholder')}
          showFilters={isManagementTab}
          filterLabel={t('panel.supplierInventory.sortBy')}
          filters={tableFilters}
          showTable={isManagementTab}
          tableMinWidth="1120px"
          columns={columns}
          data={filteredProducts}
          getRowKey={(row) => row.id}
          loading={isManagementTab && loading}
          showActions={isManagementTab}
          actionType="menu"
          getActions={getRowActions}
          actionHeader={t('panel.supplierInventory.colAction')}
          emptyMessage={
            listErrorMessage || t('panel.supplierInventory.emptyProducts')
          }
          showPagination={isManagementTab}
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

        {!isManagementTab ? (
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-6 py-16 text-center">
            <p className="text-base font-semibold text-[var(--primary-text)]">
              {t('panel.supplierInventory.erpTitle')}
            </p>
            <p className="mt-2 text-sm text-[var(--secondary-text)]">
              {t('panel.supplierInventory.erpSubtitle')}
            </p>
          </div>
        ) : null}
      </section>

      <AddInventoryProductModal
        open={addModalOpen}
        onClose={handleAddModalClose}
        warehouseOptions={DEMO_SUPPLIER_INVENTORY_WAREHOUSES}
        categoryOptions={categoryOptions}
        subCategoryOptions={subCategoryOptions}
        productTypeOptions={productTypeOptions}
        initialValues={editingProduct}
        onCascadeChange={({ categoryId, subCategoryId }) => {
          setModalCategoryId(categoryId || '');
          setModalSubCategoryId(subCategoryId || '');
        }}
        onSubmit={handleAddSubmit}
        submitting={creating}
        error={modalError}
      />

      <RestockModal
        open={restockModalOpen}
        onClose={() => {
          if (restocking) return;
          setRestockModalOpen(false);
          setRestockProduct(null);
          setRestockError('');
        }}
        product={restockProduct}
        onSubmit={handleRestockSubmit}
        submitting={restocking}
        error={restockError}
      />
    </>
  );
}
