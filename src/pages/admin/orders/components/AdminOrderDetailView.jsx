import { FiMapPin, FiMessageSquare } from 'react-icons/fi'
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
} from '@/components/data-display/OrderDetails/shared'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

function MessageButton({ onClick, disabled }) {
  const { t } = useTranslation()
  if (!onClick || disabled) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[var(--active)] transition-colors hover:bg-[color-mix(in_srgb,var(--active)_12%,transparent)]"
    >
      <FiMessageSquare className="size-4" strokeWidth={2} aria-hidden />
      {t('ui.message')}
    </button>
  )
}

function SellerInformation({ supplier, title, onChat }) {
  const { t } = useTranslation()
  if (!supplier?.name) return null

  return (
    <div>
      <SectionEyebrow>{t('ui.seller')}</SectionEyebrow>
      <div className="mt-1 mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">{title}</h2>
        <MessageButton
          disabled={!supplier.id}
          onClick={() => onChat?.(supplier)}
        />
      </div>
      <p className="text-base font-bold text-[var(--primary-text)]">
        {supplier.name}
      </p>
      <div className="mt-1">
        <ContactLine email={supplier.email} phone={supplier.phone} />
      </div>
    </div>
  )
}

function TransporterInformation({ transporter, logistics, onChat }) {
  const { t } = useTranslation()
  return (
    <div>
      <SectionEyebrow>{t('ui.transporter')}</SectionEyebrow>
      <div className="mt-1 mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--primary-text)]">
          {t('ui.transporterInfo')}
        </h2>
        <MessageButton
          disabled={!transporter?.id}
          onClick={() => onChat?.(transporter)}
        />
      </div>
      <p className="text-base font-bold text-[var(--primary-text)]">
        {transporter.name}
      </p>
      <div className="mt-1">
        <ContactLine email={transporter.email} phone={transporter.phone} />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <IconLabel
          icon={FiMapPin}
          label={t('ui.deliveryLocation')}
          value={logistics.deliveryLocation}
        />
        <StackLabel
          label={t('ui.accessConditions')}
          value={logistics.accessCondition}
        />
      </div>
    </div>
  )
}

/**
 * Admin order detail — StandardOrderDetails layout plus Seller block (mock).
 */
export default function AdminOrderDetailView({
  order = {},
  supplierSectionTitle = i18n.t('ui.supplierInformation'),
  onDownloadInvoice,
  onAccept,
  onChat,
}) {
  const { t } = useTranslation()
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
  const logistics = order.logistics || {}
  const transporter = order.transporter || {}
  const supplier = order.supplier || {}

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--primary-text)] sm:text-3xl">
              {t('ui.orderDetails')}
            </h1>
            <StatusBadge status={status} label={order.statusLabel} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <MetaCard label={t('ui.orderId')} value={order.orderId} />
            <MetaCard label={t('ui.orderDate')} value={order.orderDate} />
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

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <SectionEyebrow>{t('ui.recipient')}</SectionEyebrow>
          <div className="mt-1 mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[var(--primary-text)]">
              {isCustomerRecipient
                ? t('ui.customerInformation')
                : t('ui.companyInformation')}
            </h2>
            <MessageButton
              disabled={!recipient.id}
              onClick={() => onChat?.(recipient)}
            />
          </div>
          <p className="text-base font-bold text-[var(--primary-text)]">
            {recipient.name}
          </p>
          <div className="mt-1">
            <ContactLine email={recipient.email} phone={recipient.phone} />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {isCustomerRecipient ? (
              <>
                <StackLabel label={t('ui.region')} value={recipient.region} />
                <StackLabel label={t('ui.city')} value={recipient.city} />
                <StackLabel label={t('ui.zipCode')} value={recipient.zipCode} />
                <StackLabel label={t('ui.address')} value={recipient.address} />
              </>
            ) : (
              <>
                <IconLabel
                  icon={FiMapPin}
                  label={t('ui.project')}
                  value={recipient.project}
                />
                <StackLabel
                  label={t('ui.unloadingType')}
                  value={logistics.unloadingType}
                />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {showTransporter ? (
            <TransporterInformation
              transporter={transporter}
              logistics={logistics}
              onChat={onChat}
            />
          ) : null}
          <SellerInformation
            supplier={supplier}
            title={supplierSectionTitle}
            onChat={onChat}
          />
        </div>
      </div>

      <div>
        <SectionEyebrow>{t('ui.materials')}</SectionEyebrow>
        <h2 className="mt-1 mb-4 text-lg font-bold text-[var(--primary-text)]">
          {t('ui.productDetails')}
        </h2>
        <ProductsTable products={order.products} />
        <div className="mt-6">
          <PriceSummary totals={order.totals} />
        </div>
      </div>
    </div>
  )
}
