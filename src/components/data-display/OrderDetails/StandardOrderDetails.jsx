import { FiMapPin } from 'react-icons/fi'
import {
  AcceptButton,
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
 * status: new | pending | assigned | cancel
 * new → Accept button (instead of Download Invoice)
 */
export default function StandardOrderDetails({
  order = {},
  onDownloadInvoice,
  onAccept,
}) {
  const status = normalizeStatus(order.status)
  const isNew = status === 'new'
  const isCancel = status === 'cancel'
  const showTransporter =
    status === 'assigned' || (isCancel && order.transporter)
  const recipient = order.customer || order.company || {}
  const isCustomerRecipient =
    order.recipientType === 'customer' ||
    Boolean(order.customer) ||
    Boolean(
      recipient.region ||
        recipient.city ||
        recipient.zipCode ||
        recipient.address,
    )
  const showCompanyLogistics = !isCustomerRecipient && !showTransporter
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
        {isNew ? (
          <AcceptButton onClick={() => onAccept?.(order)} />
        ) : (
          <DownloadInvoiceButton onClick={() => onDownloadInvoice?.(order)} />
        )}
      </div>

      {isCancel && order.cancelReason ? (
        <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {order.cancelReason}
        </div>
      ) : null}

      <div
        className={`mb-8 grid grid-cols-1 gap-8 ${
          showTransporter || showCompanyLogistics ? 'lg:grid-cols-2' : ''
        }`}
      >
        <div>
          <SectionEyebrow>Recipient</SectionEyebrow>
          <h2 className="mt-1 mb-3 text-lg font-bold text-[var(--primary-text)]">
            {isCustomerRecipient ? 'Customer Information' : 'Company Information'}
          </h2>
          <p className="text-base font-bold text-[var(--primary-text)]">
            {recipient.name}
          </p>
          <div className="mt-1">
            <ContactLine email={recipient.email} phone={recipient.phone} />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {isCustomerRecipient ? (
              <>
                <StackLabel label="Region" value={recipient.region} />
                <StackLabel label="City" value={recipient.city} />
                <StackLabel label="Zip Code" value={recipient.zipCode} />
                <StackLabel label="Address" value={recipient.address} />
              </>
            ) : (
              <>
                <IconLabel
                  icon={FiMapPin}
                  label="Project"
                  value={recipient.project}
                />
                <StackLabel
                  label="Types of unloading Needed"
                  value={logistics.unloadingType}
                />
              </>
            )}
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
            {!isCustomerRecipient ? (
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
            ) : null}
          </div>
        ) : showCompanyLogistics ? (
          <div className="flex flex-col gap-3">
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
        ) : null}
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
