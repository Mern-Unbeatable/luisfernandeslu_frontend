import { FiMapPin } from 'react-icons/fi'
import {
  ContactLine,
  DownloadInvoiceButton,
  IconLabel,
  MetaCard,
  PriceSummary,
  ProductsTable,
  SectionEyebrow,
  StackLabel,
  StatusBadge,
  normalizeStatus,
} from './shared'

/**
 * Order details when hasInstallment=false
 * status: pending | assigned | cancel
 */
export default function StandardOrderDetails({
  order = {},
  onDownloadInvoice,
}) {
  const status = normalizeStatus(order.status)
  const isCancel = status === 'cancel'
  const showTransporter =
    status === 'assigned' || (isCancel && order.transporter)
  const company = order.company || {}
  const logistics = order.logistics || {}
  const transporter = order.transporter || {}

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
              Order Details
            </h1>
            <StatusBadge status={status} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <MetaCard label="Order ID" value={order.orderId} />
            <MetaCard label="Order Date" value={order.orderDate} />
          </div>
        </div>
        <DownloadInvoiceButton onClick={() => onDownloadInvoice?.(order)} />
      </div>

      {isCancel && order.cancelReason ? (
        <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {order.cancelReason}
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <SectionEyebrow>Recipient</SectionEyebrow>
          <h2 className="mt-1 mb-3 text-lg font-bold text-[var(--primary-text)]">
            Company Information
          </h2>
          <p className="text-base font-bold text-[var(--primary-text)]">
            {company.name}
          </p>
          <div className="mt-1">
            <ContactLine email={company.email} phone={company.phone} />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <IconLabel
              icon={FiMapPin}
              label="Project"
              value={company.project}
            />
            <StackLabel
              label="Types of unloading Needed"
              value={logistics.unloadingType}
            />
          </div>
        </div>

        {showTransporter ? (
          <div>
            <SectionEyebrow>Transporter</SectionEyebrow>
            <h2 className="mt-1 mb-3 text-lg font-bold text-[var(--primary-text)]">
              Transporter Information
            </h2>
            <p className="text-base font-bold text-[var(--primary-text)]">
              {transporter.name}
            </p>
            <div className="mt-1">
              <ContactLine
                email={transporter.email}
                phone={transporter.phone}
              />
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <IconLabel
                icon={FiMapPin}
                label="Delivery Location"
                value={logistics.deliveryLocation}
              />
              <StackLabel
                label="Access Conditions"
                value={logistics.accessCondition}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-7">
            <IconLabel
              icon={FiMapPin}
              label="Delivery Location"
              value={logistics.deliveryLocation}
            />
            <StackLabel
              label="Access Conditions"
              value={logistics.accessCondition}
            />
          </div>
        )}
      </div>

      <div>
        <SectionEyebrow>Materials</SectionEyebrow>
        <h2 className="mt-1 mb-4 text-lg font-bold text-[var(--primary-text)]">
          Product Details
        </h2>
        <ProductsTable products={order.products} />
        <div className="mt-6">
          <PriceSummary totals={order.totals} />
        </div>
      </div>
    </div>
  )
}
