import { useCallback, useMemo, useState } from 'react';
import { FiChevronDown, FiFilter } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/common/Seo/Seo';
import DataTable from '@/components/data-display/DataTable/DataTable';
import StatusBadge from '@/components/data-display/DataTable/StatusBadge';
import { DEMO_SUPPLIER_PROMO_CODES } from '@/data/demoData';

const TAB_IDS = {
  promoCode: 'promo_code',
  promoProduct: 'promo_product',
};

const STATUS_LABEL_KEYS = {
  active: 'panel.supplierPromoCodes.statusActive',
  disabled: 'panel.supplierPromoCodes.statusDisabled',
  expired: 'panel.supplierPromoCodes.statusExpired',
};

export default function PromoCodesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(TAB_IDS.promoCode);
  const [statusFilter, setStatusFilter] = useState('all');
  const [promoCodes, setPromoCodes] = useState(DEMO_SUPPLIER_PROMO_CODES);

  // TODO: replace DEMO_* with supplier promo codes API fetch

  const handleStatusChange = useCallback((row, status) => {
    setPromoCodes((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, status } : item,
      ),
    );
    // TODO: wire promo code status API
  }, []);

  const tabs = useMemo(
    () => [
      {
        id: TAB_IDS.promoCode,
        label: t('panel.supplierPromoCodes.tabPromoCode'),
      },
      {
        id: TAB_IDS.promoProduct,
        label: t('panel.supplierPromoCodes.tabPromoProduct'),
      },
    ],
    [t],
  );

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('panel.supplierPromoCodes.allStatus') },
      { value: 'active', label: t('panel.supplierPromoCodes.statusActive') },
      { value: 'disabled', label: t('panel.supplierPromoCodes.statusDisabled') },
      { value: 'expired', label: t('panel.supplierPromoCodes.statusExpired') },
    ],
    [t],
  );

  const filteredPromoCodes = useMemo(() => {
    if (statusFilter === 'all') return promoCodes;
    return promoCodes.filter((row) => row.status === statusFilter);
  }, [promoCodes, statusFilter]);

  const columns = useMemo(
    () => [
      {
        key: 'code',
        header: t('panel.supplierPromoCodes.colPromoCode'),
      },
      {
        key: 'discountType',
        header: t('panel.supplierPromoCodes.colDiscountType'),
        render: (value) =>
          value === 'fixed'
            ? t('panel.supplierPromoCodes.discountTypeFixed')
            : t('panel.supplierPromoCodes.discountTypePercentage'),
      },
      {
        key: 'discountValue',
        header: t('panel.supplierPromoCodes.colDiscountValue'),
      },
      {
        key: 'minOrder',
        header: t('panel.supplierPromoCodes.colMinOrder'),
      },
      {
        key: 'usageLimit',
        header: t('panel.supplierPromoCodes.colUsageLimit'),
        render: (value, row) =>
          row.usageLimitUnlimited
            ? t('panel.supplierPromoCodes.unlimited')
            : value,
      },
      {
        key: 'usedCount',
        header: t('panel.supplierPromoCodes.colUsedCount'),
        render: (_, row) => {
          const limitLabel = row.usageLimitUnlimited
            ? t('panel.supplierPromoCodes.unlimitedLower')
            : row.usageLimit;
          return `${row.usedCount}/${limitLabel}`;
        },
      },
      {
        key: 'status',
        header: t('panel.supplierPromoCodes.colStatus'),
        render: (value) => (
          <StatusBadge
            status={value}
            label={t(STATUS_LABEL_KEYS[value])}
            className="rounded-full"
          />
        ),
      },
      {
        key: 'expiryDate',
        header: t('panel.supplierPromoCodes.colExpiryDate'),
      },
    ],
    [t],
  );

  const rowActions = useMemo(
    () => [
      {
        id: 'see-details',
        label: t('panel.supplierPromoCodes.actionSeeDetails'),
        variant: 'header',
        onClick: (row) => {
          // TODO: open promo code details when route/modal is available
          void row;
        },
      },
      {
        id: 'edit',
        label: t('panel.supplierPromoCodes.actionEdit'),
        onClick: () => {
          // TODO: open edit promo code flow when available
        },
      },
      {
        id: 'delete',
        label: t('panel.supplierPromoCodes.actionDelete'),
        onClick: () => {
          // TODO: wire delete promo code API
        },
      },
      {
        id: 'status-section',
        label: t('panel.supplierPromoCodes.statusSection'),
        variant: 'section',
      },
      {
        id: 'set-active',
        label: t('panel.supplierPromoCodes.statusActive'),
        onClick: (row) => handleStatusChange(row, 'active'),
      },
      {
        id: 'set-disabled',
        label: t('panel.supplierPromoCodes.statusDisabled'),
        onClick: (row) => handleStatusChange(row, 'disabled'),
      },
      {
        id: 'set-expired',
        label: t('panel.supplierPromoCodes.statusExpired'),
        onClick: (row) => handleStatusChange(row, 'expired'),
      },
    ],
    [t, handleStatusChange],
  );

  return (
    <>
      <Seo title={t('panel.supplierPromoCodes.title')} />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            {t('panel.supplierPromoCodes.title')}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t('panel.supplierPromoCodes.subtitle')}
          </p>
        </header>

        <button
          type="button"
          onClick={() => {
            // TODO: open create promo code flow when available
          }}
          className="inline-flex shrink-0 items-center justify-center self-start rounded-md bg-[var(--active)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-95"
        >
          {t('panel.supplierPromoCodes.createPromoCode')}
        </button>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-fit max-w-full shrink-0 items-center rounded-lg bg-gray-100 p-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
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

          {activeTab === TAB_IDS.promoCode ? (
            <label className="relative inline-flex min-w-[160px] shrink-0 items-center gap-2 self-start rounded-md border border-gray-200 bg-white px-3 pr-9">
              <FiFilter
                className="size-4 shrink-0 text-[var(--secondary-text)]"
                aria-hidden
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 w-full min-w-0 cursor-pointer appearance-none bg-transparent py-2 text-sm text-[var(--primary-text)] outline-none"
                aria-label={t('panel.supplierPromoCodes.allStatus')}
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
          ) : null}
        </div>

        {activeTab === TAB_IDS.promoCode ? (
          <DataTable
            showCard={false}
            columns={columns}
            data={filteredPromoCodes}
            getRowKey={(row) => row.id}
            showActions
            actions={rowActions}
            actionHeader={t('panel.supplierPromoCodes.colAction')}
            emptyMessage={t('panel.supplierPromoCodes.emptyPromoCodes')}
          />
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white px-6 py-16 text-center">
            <p className="text-base font-semibold text-[var(--primary-text)]">
              {t('panel.supplierPromoCodes.emptyPromoProductsTitle')}
            </p>
            <p className="mt-2 text-sm text-[var(--secondary-text)]">
              {t('panel.supplierPromoCodes.emptyPromoProductsHint')}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
