import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useIssueAdminTaxInvoiceMutation } from '@/features/admin/adminOrderApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

const I18N_KEY = 'adminOrders.taxInvoice'

const STATUS_STYLES = {
  FINALIZED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-amber-100 text-amber-700',
  FAILED: 'bg-red-100 text-red-700',
  PENDING: 'bg-gray-100 text-gray-600',
}

/** InvoiceXpress certified invoice status + issue / retry action. */
export default function AdminTaxInvoiceCard({ orderId, taxInvoice, isPaid }) {
  const { t } = useTranslation()
  const [issue, { isLoading }] = useIssueAdminTaxInvoiceMutation()

  const status = taxInvoice?.status || 'NONE'
  const actionLabel =
    status === 'NONE' || status === 'PENDING'
      ? t(`${I18N_KEY}.issue`)
      : status === 'DRAFT'
        ? t(`${I18N_KEY}.finalize`)
        : t(`${I18N_KEY}.retry`)

  const handleIssue = async () => {
    try {
      const result = await issue(orderId).unwrap()
      toast.success(result?.message || t(`${I18N_KEY}.done`))
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.failed`)))
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-[var(--primary-text)]">
            {t(`${I18N_KEY}.title`)}
          </h2>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.PENDING}`}
          >
            {t(`${I18N_KEY}.status.${status}`)}
          </span>
        </div>
        {status !== 'FINALIZED' && isPaid ? (
          <button
            type="button"
            onClick={handleIssue}
            disabled={isLoading}
            className="inline-flex h-9 items-center rounded-lg bg-[var(--active)] px-4 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? t(`${I18N_KEY}.working`) : actionLabel}
          </button>
        ) : null}
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        {taxInvoice?.number ? (
          <div className="flex gap-2">
            <dt className="text-[var(--secondary-text)]">{t(`${I18N_KEY}.number`)}</dt>
            <dd className="font-medium text-[var(--primary-text)]">{taxInvoice.number}</dd>
          </div>
        ) : null}
        {taxInvoice?.atcud ? (
          <div className="flex gap-2">
            <dt className="text-[var(--secondary-text)]">ATCUD</dt>
            <dd className="font-medium text-[var(--primary-text)]">{taxInvoice.atcud}</dd>
          </div>
        ) : null}
        {taxInvoice?.vatRate != null ? (
          <div className="flex gap-2">
            <dt className="text-[var(--secondary-text)]">{t(`${I18N_KEY}.vatRate`)}</dt>
            <dd className="font-medium text-[var(--primary-text)]">{taxInvoice.vatRate}%</dd>
          </div>
        ) : null}
      </dl>

      {!isPaid && status === 'NONE' ? (
        <p className="mt-2 text-sm text-[var(--secondary-text)]">{t(`${I18N_KEY}.notPaid`)}</p>
      ) : null}
      {status === 'DRAFT' ? (
        <p className="mt-2 text-sm text-[var(--secondary-text)]">{t(`${I18N_KEY}.draftHint`)}</p>
      ) : null}
      {taxInvoice?.error ? (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{taxInvoice.error}</p>
      ) : null}
      {taxInvoice?.url ? (
        <a
          href={taxInvoice.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-[var(--active)] hover:underline"
        >
          {t(`${I18N_KEY}.open`)}
        </a>
      ) : null}
    </section>
  )
}
