import { useTranslation } from 'react-i18next'
import InvoicesTableSection from './sections/InvoicesTableSection'

export default function InvoicesPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t('transporterInvoices.title')}
        </h1>
        <p className="mt-1 text-base text-gray-500">
          {t('transporterInvoices.subtitle')}
        </p>
      </div>

      {/* Invoices List Table Section */}
      <InvoicesTableSection />
    </div>
  )
}
