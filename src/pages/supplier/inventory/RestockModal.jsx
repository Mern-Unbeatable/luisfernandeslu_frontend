import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { FiPackage, FiX } from 'react-icons/fi';

const fieldClass =
  'h-12 w-full rounded-lg border border-gray-200 bg-[#FFFBF5] px-3 text-sm text-[var(--primary-text)] outline-none placeholder:text-[var(--secondary-text)] focus:border-[var(--active)]';

export default function RestockModal({
  open,
  onClose,
  product,
  onSubmit,
  submitting = false,
  error = '',
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (!open) return undefined;

    setQuantity('');

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !submitting) onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, submitting]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!quantity.trim() || submitting) return;
    await onSubmit?.({ product, quantity: quantity.trim() });
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <button
        type="button"
        aria-label={t('panel.supplierInventory.modalClose')}
        className="absolute inset-0 bg-black/45"
        onClick={() => {
          if (!submitting) onClose?.();
        }}
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
              {t('panel.supplierInventory.restockModalTitle')}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {t('panel.supplierInventory.restockModalSubtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label={t('panel.supplierInventory.modalClose')}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--secondary-text)] transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <FiX className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--primary-text)]">
                {t('panel.supplierInventory.fieldAddQuantity')}
              </span>
              <input
                type="text"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder={t(
                  'panel.supplierInventory.fieldAddQuantityPlaceholder',
                )}
                className={fieldClass}
                disabled={submitting}
              />
            </label>
            {error ? (
              <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {t('panel.supplierInventory.modalCancel')}
            </button>
            <button
              type="submit"
              disabled={!quantity.trim() || submitting}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--active)] px-4 text-sm font-semibold text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? t('panel.supplierInventory.modalSaving', {
                    defaultValue: 'Saving…',
                  })
                : t('panel.supplierInventory.modalSendOffer')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
