import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails'
import {
  useGetAdminProductByIdQuery,
  useModerateAdminProductMutation,
} from '@/features/admin/adminProductApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

const I18N = 'adminProductModeration'

export default function ProductModerationDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { productId } = useParams()
  const panelBase = pathname.startsWith('/moderator') ? '/moderator' : '/admin'

  const { data, isLoading, isError, error } = useGetAdminProductByIdQuery(
    productId,
    { skip: !productId },
  )
  const [moderateProduct] = useModerateAdminProductMutation()

  const product = useMemo(() => data?.product || null, [data?.product])

  const handleAction = async (actionId) => {
    if (!productId) return
    try {
      if (actionId === 'accept') {
        await moderateProduct({
          productId,
          status: 'approved',
        }).unwrap()
        toast.success(
          t(`${I18N}.approveSuccess`, { defaultValue: 'Product approved.' }),
        )
        navigate(`${panelBase}/product-moderation`)
        return
      }
      if (actionId === 'reject') {
        await moderateProduct({
          productId,
          status: 'rejected',
        }).unwrap()
        toast.success(
          t(`${I18N}.rejectSuccess`, { defaultValue: 'Product rejected.' }),
        )
        navigate(`${panelBase}/product-moderation`)
      }
    } catch (err) {
      toast.error(
        getAuthErrorMessage(
          err,
          t(`${I18N}.actionFailed`, { defaultValue: 'Action failed.' }),
        ),
      )
    }
  }

  if (isLoading) {
    return (
      <p className="text-sm text-[var(--secondary-text)]">
        {t(`${I18N}.loading`, { defaultValue: 'Loading products…' })}
      </p>
    )
  }

  if (isError || !product) {
    return (
      <div className="space-y-4">
        <Seo title={t(`${I18N}.detail.notFound`)} />
        <p className="text-sm text-[var(--secondary-text)]">
          {getAuthErrorMessage(error, t(`${I18N}.detail.notFound`))}
        </p>
        <Link
          to={`${panelBase}/product-moderation`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t(`${I18N}.detail.back`)}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Seo
        title={t(`${I18N}.detail.title`, {
          name: product.title || product.name || 'Product',
        })}
        description={t(`${I18N}.subtitle`)}
      />

      <Link
        to={`${panelBase}/product-moderation`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)] hover:underline"
      >
        <FiArrowLeft className="size-4" aria-hidden />
        {t(`${I18N}.detail.back`)}
      </Link>

      <ProductDetails
        role="admin"
        product={product}
        onAction={handleAction}
      />
    </div>
  )
}
