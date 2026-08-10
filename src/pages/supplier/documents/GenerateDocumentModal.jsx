import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiFileText, FiX } from 'react-icons/fi';

export default function GenerateDocumentModal({
  open,
  onClose,
  orderOptions = [],
  onSubmit,
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (!open) return undefined;

    setOrderId('');

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
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!orderId) return;
    onSubmit?.({ orderId });
    onClose?.();
  };

  return createPortal(
    <div className='fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 sm:p-6'>
      <button
        type='button'
        aria-label={t('panel.supplierFiscalDocuments.modalClose')}
        className='absolute inset-0 bg-black/45'
        onClick={onClose}
      />

      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className='relative z-10 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl'
      >
        <div className='flex items-start gap-3 border-b border-gray-200 px-5 py-4'>
          <span
            className='inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--active)_16%,white)] text-[var(--active)]'
            aria-hidden
          >
            <FiFileText className='size-5' strokeWidth={1.75} />
          </span>
          <div className='min-w-0 flex-1'>
            <h2
              id={titleId}
              className='text-base font-bold text-[var(--primary-text)]'
            >
              {t('panel.supplierFiscalDocuments.modalTitle')}
            </h2>
            <p className='mt-0.5 text-sm text-[var(--secondary-text)]'>
              {t('panel.supplierFiscalDocuments.modalSubtitle')}
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label={t('panel.supplierFiscalDocuments.modalClose')}
            className='inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--secondary-text)] transition-colors hover:bg-gray-100'
          >
            <FiX className='size-5' strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='px-5 py-5'>
            <label className='block'>
              <span className='mb-2 block text-sm font-bold text-[var(--primary-text)]'>
                {t('panel.supplierFiscalDocuments.modalOrderIdLabel')}
              </span>
              <div className='relative'>
                <select
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value)}
                  className='h-12 w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-sm text-[var(--primary-text)] outline-none transition-colors hover:border-gray-300 focus:border-[var(--active)]'
                  aria-label={t(
                    'panel.supplierFiscalDocuments.modalOrderIdLabel',
                  )}
                >
                  <option value='' disabled>
                    {t('panel.supplierFiscalDocuments.modalOrderIdPlaceholder')}
                  </option>
                  {orderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className='pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[var(--secondary-text)]'
                  aria-hidden
                />
              </div>
              <p className='mt-2 text-xs text-[var(--secondary-text)]'>
                {t('panel.supplierFiscalDocuments.modalOrderIdHint')}
              </p>
            </label>
          </div>

          <div className='grid grid-cols-2 gap-3 border-t border-gray-200 px-5 py-4'>
            <button
              type='button'
              onClick={onClose}
              className='inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-[var(--primary-text)] transition-colors hover:bg-gray-50'
            >
              {t('panel.supplierFiscalDocuments.modalCancel')}
            </button>
            <button
              type='submit'
              disabled={!orderId}
              className='inline-flex h-11 items-center justify-center rounded-lg bg-[var(--active)] px-4 text-sm font-semibold text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {t('panel.supplierFiscalDocuments.modalSubmit')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
