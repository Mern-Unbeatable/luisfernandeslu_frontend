import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import {
  useDeleteAdminOrderMutation,
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
} from '@/features/admin/adminOrderApi'
import { mapAdminOrderDetail } from '@/features/admin/adminOrderMappers'
import { getAuthErrorMessage } from '@/features/auth/authUtils'
import { confirmDelete } from '@/utils/confirmDialog'
import AdminFactoryOrderDetailView from './components/AdminFactoryOrderDetailView'
import AdminOrderDetailView from './components/AdminOrderDetailView'

const I18N_KEY = 'adminOrders'

export default function AdminOrderDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { orderId } = useParams()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAdminOrderByIdQuery(orderId ?? '', {
    skip: !orderId,
  })

  const [updateOrderStatus] = useUpdateAdminOrderStatusMutation()
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteAdminOrderMutation()

  const order = useMemo(() => {
    const mapped = mapAdminOrderDetail(data?.order)
    if (!mapped) return null

    if (mapped.cancelledByAdmin && mapped.status === 'cancel') {
      return {
        ...mapped,
        statusLabel: t(`${I18N_KEY}.status.cancelByAdmin`),
      }
    }

    return mapped
  }, [data?.order, t])

  const runStatusUpdate = useCallback(
    async (status, reason) => {
      if (!orderId) return false

      try {
        const result = await updateOrderStatus({
          orderId,
          status,
          reason,
        }).unwrap()

        if (result?.success === false) {
          toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.actionFailed`)))
          return false
        }

        toast.success(result?.message || t(`${I18N_KEY}.statusUpdated`))
        return true
      } catch (err) {
        toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
        return false
      }
    },
    [orderId, updateOrderStatus, t],
  )

  const handleAccept = useCallback(async () => {
    await runStatusUpdate('pending')
  }, [runStatusUpdate])

  const handleDelete = useCallback(async () => {
    if (!order) return

    const confirmed = await confirmDelete({
      title: t(`${I18N_KEY}.deleteConfirmTitle`),
      text: t(`${I18N_KEY}.deleteConfirm`, { id: order.orderId }),
      confirmText: t(`${I18N_KEY}.deleteConfirmButton`),
      cancelText: t(`${I18N_KEY}.deleteCancelButton`),
    })
    if (!confirmed) return

    try {
      const result = await deleteOrder(order.id).unwrap()
      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.actionFailed`)))
        return
      }
      toast.success(result?.message || t(`${I18N_KEY}.deleteSuccess`))
      navigate('/admin/orders')
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
    }
  }, [order, deleteOrder, navigate, t])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.loading`)} />
        <p className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.detail.loading`)}
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N_KEY}.detail.loadFailed`)} />
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{getAuthErrorMessage(error, t(`${I18N_KEY}.detail.loadFailed`))}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            {t(`${I18N_KEY}.retry`)}
          </button>
        </div>
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

  if (!order) {
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
        title={t(`${I18N_KEY}.detail.title`, { id: order.orderId })}
        description={t(`${I18N_KEY}.subtitle`)}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)] hover:underline"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t(`${I18N_KEY}.detail.back`)}
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex h-10 items-center rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t(`${I18N_KEY}.detail.delete`)}
        </button>
      </div>

      {order.hasInstallment ? (
        <AdminFactoryOrderDetailView
          order={order}
          supplierSectionTitle={t(`${I18N_KEY}.detail.supplierSection`)}
          factorySectionTitle={t(`${I18N_KEY}.detail.factorySection`)}
          producedLabel={t(`${I18N_KEY}.detail.produced`)}
          assignedLabel={t(`${I18N_KEY}.detail.assigned`)}
          onAccept={handleAccept}
          onChat={() => {}}
        />
      ) : (
        <AdminOrderDetailView
          order={order}
          supplierSectionTitle={t(`${I18N_KEY}.detail.supplierSection`)}
          onDownloadInvoice={() => {}}
          onAccept={handleAccept}
        />
      )}
    </div>
  )
}
