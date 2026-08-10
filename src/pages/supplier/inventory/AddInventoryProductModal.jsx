import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { FiBox, FiChevronDown, FiPackage, FiX } from 'react-icons/fi';

const fieldClass =
  'h-12 w-full rounded-lg border border-gray-200 bg-[#FFFBF5] px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]';

const emptyForm = {
  warehouseId: '',
  categoryId: '',
  productName: '',
  sku: '',
  totalQuantity: '',
  price: '',
  factoryName: '',
};

export default function AddInventoryProductModal({
  open,
  onClose,
  warehouseOptions = [],
  categoryOptions = [],
  initialValues = null,
  onSubmit,
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const isEdit = Boolean(initialValues?.id);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return undefined;

    setForm(
      initialValues
        ? {
            warehouseId: initialValues.warehouseId || '',
            categoryId: initialValues.categoryId || '',
            productName: initialValues.productName || '',
            sku: initialValues.sku || '',
            totalQuantity: initialValues.totalQuantity || '',
            price: initialValues.price || '',
            factoryName: initialValues.factoryName || '',
          }
        : emptyForm,
    );

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, initialValues]);

  if (!open) return null;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      ...form,
      id: initialValues?.id,
    });
    onClose?.();
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <button
        type="button"
        aria-label={t('panel.supplierInventory.modalClose')}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="flex items-start gap-3 border-b border-gray-200 px-5 py-4">
          <span
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
            aria-hidden
          >
            <FiPackage className="size-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="text-base font-bold text-[var(--primary-text)]"
            >
              {isEdit
                ? t('panel.supplierInventory.editModalTitle')
                : t('panel.supplierInventory.addModalTitle')}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {isEdit
                ? t('panel.supplierInventory.editModalSubtitle')
                : t('panel.supplierInventory.addModalSubtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('panel.supplierInventory.modalClose')}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--secondary-text)] transition-colors hover:bg-gray-100"
          >
            <FiX className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-5 py-5">
            <label className="block">
              <span className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[var(--primary-text)]">
                <FiBox className="size-3.5 shrink-0" aria-hidden />
                {t('panel.supplierInventory.fieldWarehouse')}
              </span>
              <div className="relative">
                <select
                  value={form.warehouseId}
                  onChange={handleChange('warehouseId')}
                  className={`${fieldClass} cursor-pointer appearance-none pr-10`}
                  aria-label={t('panel.supplierInventory.fieldWarehouse')}
                >
                  <option value="">
                    {t('panel.supplierInventory.fieldWarehousePlaceholder')}
                  </option>
                  {warehouseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[var(--secondary-text)]"
                  aria-hidden
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[var(--primary-text)]">
                <FiBox className="size-3.5 shrink-0" aria-hidden />
                {t('panel.supplierInventory.fieldCategory')}
              </span>
              <div className="relative">
                <select
                  value={form.categoryId}
                  onChange={handleChange('categoryId')}
                  className={`${fieldClass} cursor-pointer appearance-none pr-10`}
                  aria-label={t('panel.supplierInventory.fieldCategory')}
                >
                  <option value="">
                    {t('panel.supplierInventory.fieldCategoryPlaceholder')}
                  </option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[var(--secondary-text)]"
                  aria-hidden
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--primary-text)]">
                {t('panel.supplierInventory.fieldProductName')}
              </span>
              <input
                type="text"
                value={form.productName}
                onChange={handleChange('productName')}
                placeholder={t(
                  'panel.supplierInventory.fieldProductNamePlaceholder',
                )}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--primary-text)]">
                {t('panel.supplierInventory.fieldSku')}
              </span>
              <input
                type="text"
                value={form.sku}
                onChange={handleChange('sku')}
                placeholder={t('panel.supplierInventory.fieldSkuPlaceholder')}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--primary-text)]">
                {t('panel.supplierInventory.fieldTotalQuantity')}
              </span>
              <input
                type="text"
                value={form.totalQuantity}
                onChange={handleChange('totalQuantity')}
                placeholder={t(
                  'panel.supplierInventory.fieldTotalQuantityPlaceholder',
                )}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--primary-text)]">
                {t('panel.supplierInventory.fieldPrice')}
              </span>
              <input
                type="text"
                value={form.price}
                onChange={handleChange('price')}
                placeholder={t('panel.supplierInventory.fieldPricePlaceholder')}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--primary-text)]">
                {t('panel.supplierInventory.fieldFactoryName')}
              </span>
              <input
                type="text"
                value={form.factoryName}
                onChange={handleChange('factoryName')}
                placeholder={t(
                  'panel.supplierInventory.fieldFactoryNamePlaceholder',
                )}
                className={fieldClass}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-gray-50"
            >
              {t('panel.supplierInventory.modalCancel')}
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--active)] px-4 text-sm font-semibold text-white transition-colors hover:brightness-95"
            >
              {t('panel.supplierInventory.modalSendOffer')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
