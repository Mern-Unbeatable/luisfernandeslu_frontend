import { useTranslation } from 'react-i18next'
import { FiExternalLink, FiFileText, FiMapPin, FiX } from 'react-icons/fi'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import { useGetAdminFactoryByIdQuery } from '@/features/admin/adminFactoryApi'
import { useGetAdminSupplierByIdQuery } from '@/features/admin/adminSupplierApi'
import { useGetAdminTransporterByIdQuery } from '@/features/admin/adminTransporterApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import SupplierStatusBadge from './SupplierStatusBadge'

function DetailField({ label, value, className = '' }) {
  return (
    <div className={`rounded-lg bg-[#FAF7F2] px-4 py-3 ${className}`}>
      <p className="text-xs font-medium text-[var(--secondary-text)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--primary-text)]">{value}</p>
    </div>
  )
}

function isImageUrl(url) {
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?|$)/i.test(url)
}

function DocumentThumb({ doc }) {
  if (doc.urls?.length) {
    const url = doc.urls[0]
    const label = doc.label || doc.key || 'Document'
    const image = isImageUrl(url)

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
        title={label}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {image ? (
            <img
              src={url}
              alt={label}
              className="size-full object-cover transition group-hover:opacity-90"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--secondary-text)]/40">
              <FiFileText className="size-8" aria-hidden />
            </div>
          )}
          <span className="absolute top-1.5 right-1.5 rounded bg-black/55 p-1 text-white opacity-0 transition group-hover:opacity-100">
            <FiExternalLink className="size-3" aria-hidden />
          </span>
          {doc.urls.length > 1 ? (
            <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
              +{doc.urls.length - 1}
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs font-medium text-[var(--primary-text)]">
          {label}
        </p>
      </a>
    )
  }

  const toneClass =
    doc.tone === 'blue'
      ? 'from-sky-100 to-sky-200'
      : doc.tone === 'amber'
        ? 'from-amber-100 to-amber-200'
        : 'from-gray-100 to-gray-200'

  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br ${toneClass}`}
    >
      <div className="absolute inset-0 flex items-center justify-center text-[var(--secondary-text)]/40">
        <FiFileText className="size-8" aria-hidden />
      </div>
      {doc.tone === 'blue' ? (
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-sky-500" />
      ) : null}
      {doc.tone === 'amber' ? (
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-500" />
      ) : null}
    </div>
  )
}

export default function SupplierDetailsModal({
  open,
  supplierId,
  factoryId,
  transporterId,
  supplier: supplierProp,
  onClose,
  i18nKey = 'adminSupplierManagement',
  formatRegisteredDate,
}) {
  const { t } = useTranslation()
  const fetchSupplierFromApi = Boolean(supplierId)
  const fetchFactoryFromApi = Boolean(factoryId)
  const fetchTransporterFromApi = Boolean(transporterId)
  const fetchFromApi =
    fetchSupplierFromApi || fetchFactoryFromApi || fetchTransporterFromApi

  const {
    data: supplierData,
    isLoading: supplierLoading,
    isError: supplierError,
    error: supplierFetchError,
  } = useGetAdminSupplierByIdQuery(supplierId, {
    skip: !open || !supplierId,
  })

  const {
    data: factoryData,
    isLoading: factoryLoading,
    isError: factoryError,
    error: factoryFetchError,
  } = useGetAdminFactoryByIdQuery(factoryId, {
    skip: !open || !factoryId,
  })

  const {
    data: transporterData,
    isLoading: transporterLoading,
    isError: transporterError,
    error: transporterFetchError,
  } = useGetAdminTransporterByIdQuery(transporterId, {
    skip: !open || !transporterId,
  })

  if (!open || (!supplierId && !factoryId && !transporterId && !supplierProp)) {
    return null
  }

  const formatDate =
    formatRegisteredDate ||
    ((date) => {
      if (!date) return '—'
      const [y, m, d] = date.split('-').map(Number)
      if (!y || !m || !d) return date
      return `${m}/${d}/${y}`
    })

  const isLoading = fetchTransporterFromApi
    ? transporterLoading
    : fetchFactoryFromApi
      ? factoryLoading
      : fetchSupplierFromApi
        ? supplierLoading
        : false
  const isError = fetchTransporterFromApi
    ? transporterError
    : fetchFactoryFromApi
      ? factoryError
      : fetchSupplierFromApi
        ? supplierError
        : false
  const fetchError = fetchTransporterFromApi
    ? transporterFetchError
    : fetchFactoryFromApi
      ? factoryFetchError
      : supplierFetchError
  const supplier = fetchTransporterFromApi
    ? transporterData?.transporter
    : fetchFactoryFromApi
      ? factoryData?.factory
      : fetchSupplierFromApi
        ? supplierData?.supplier
        : supplierProp
  const titleId = `${i18nKey}-details-title`
  const registeredDate = supplier?.registered ?? supplier?.registeredDate
  const registeredLabel = registeredDate
    ? t(`${i18nKey}.modal.registeredOn`, { date: formatDate(registeredDate) })
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label={t(`${i18nKey}.modal.close`)}
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100"
          aria-label={t(`${i18nKey}.modal.close`)}
        >
          <FiX className="size-5" />
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--active)_14%,white)] text-[var(--active)]">
              <FiFileText className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <h2
              id={titleId}
              className="text-lg font-bold text-[var(--primary-text)]"
            >
              {t(`${i18nKey}.modal.title`)}
            </h2>
          </div>
          {registeredLabel ? (
            <p className="text-xs text-[var(--secondary-text)]">{registeredLabel}</p>
          ) : null}
        </div>

        {fetchFromApi && isLoading ? (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg sm:col-span-2" />
            </div>
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ) : fetchFromApi && (isError || !supplier) ? (
          <p className="mt-6 text-sm text-red-500" role="alert">
            {getAuthErrorMessage(fetchError, t(`${i18nKey}.detailsFailed`))}
          </p>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailField
                label={t(`${i18nKey}.columns.name`)}
                value={supplier.name}
                className="sm:col-span-2"
              />
              <DetailField
                label={t(`${i18nKey}.columns.email`)}
                value={supplier.email}
              />
              <DetailField
                label={t(`${i18nKey}.columns.phone`)}
                value={supplier.phone || '—'}
              />
              <div className="rounded-lg bg-[#FAF7F2] px-4 py-3 sm:col-span-2">
                <p className="text-xs font-medium text-[var(--secondary-text)]">
                  {t(`${i18nKey}.columns.status`)}
                </p>
                <div className="mt-2">
                  <SupplierStatusBadge status={supplier.status} />
                </div>
              </div>
            </div>

            {supplier.address ? (
              <div className="mt-4 rounded-lg bg-[#FAF7F2] px-4 py-3">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--active)] uppercase">
                  <FiMapPin className="size-3.5" aria-hidden />
                  {t(`${i18nKey}.modal.address`)}
                </p>
                <p className="mt-2 text-sm text-[var(--primary-text)]">{supplier.address}</p>
              </div>
            ) : null}

            {supplier.rejectionReason ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-semibold text-red-700">
                  {t(`${i18nKey}.modal.rejectionReason`)}
                </p>
                <p className="mt-1 text-sm text-red-800">{supplier.rejectionReason}</p>
              </div>
            ) : null}

            <div className="mt-6">
              <p className="text-sm font-bold text-[var(--primary-text)]">
                {t(`${i18nKey}.modal.documentsTitle`)}
              </p>
              {(supplier.documents || []).length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {supplier.documents.map((doc) => (
                    <DocumentThumb key={doc.key || doc.id} doc={doc} />
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-[var(--secondary-text)]">
                  {t(`${i18nKey}.modal.noDocuments`)}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
