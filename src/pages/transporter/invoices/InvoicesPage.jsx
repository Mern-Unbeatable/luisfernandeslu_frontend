import InvoicesTableSection from './sections/InvoicesTableSection'

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Commission Invoices
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track all commission invoices generated from marketplace orders.
        </p>
      </div>

      {/* Invoices List Table Section */}
      <InvoicesTableSection />
    </div>
  )
}
