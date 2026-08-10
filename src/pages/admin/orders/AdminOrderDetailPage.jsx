import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import AdminFactoryOrderDetailView from './components/AdminFactoryOrderDetailView'
import AdminOrderDetailView from './components/AdminOrderDetailView'
import { getAdminOrderDetail, getAdminOrderRow } from './data/ordersAdminDemo'

const I18N_KEY = 'adminOrders'

export default function AdminOrderDetailPage() {
  const { t } = useTranslation()
  const { orderId } = useParams()

  const row = useMemo(() => getAdminOrderRow(orderId ?? ''), [orderId])
  const order = useMemo(() => getAdminOrderDetail(orderId ?? ''), [orderId])

  if (!row || !order) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.notFound`)} />
        <p className="text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.detail.notFound`)}
        </p>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t(`${I18N_KEY}.detail.back`)}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Seo
        title={t(`${I18N_KEY}.detail.title`, { id: row.orderId })}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)] hover:underline"
      >
        <FiArrowLeft className="size-4" aria-hidden />
        {t(`${I18N_KEY}.detail.back`)}
      </Link>

      {order.hasInstallment ? (
        <AdminFactoryOrderDetailView
          order={order}
          supplierSectionTitle={t(`${I18N_KEY}.detail.supplierSection`)}
          factorySectionTitle={t(`${I18N_KEY}.detail.factorySection`)}
          producedLabel={t(`${I18N_KEY}.detail.produced`)}
          assignedLabel={t(`${I18N_KEY}.detail.assigned`)}
          onAccept={() => {}}
          onChat={() => {}}
        />
      ) : (
        <AdminOrderDetailView
          order={order}
          supplierSectionTitle={t(`${I18N_KEY}.detail.supplierSection`)}
          onDownloadInvoice={() => {}}
          onAccept={() => {}}
        />
      )}
    </div>
  )
}
