import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Seo from '@/components/common/Seo/Seo'
import ProductDetails from '@/components/data-display/ProductDetails/ProductDetails'
import {
  ADMIN_MODERATION_PRODUCTS,
  getModerationDetailProduct,
  getModerationProductById,
} from './data/moderationDemo'

export default function ProductModerationDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { productId } = useParams()

  const row = useMemo(
    () => getModerationProductById(ADMIN_MODERATION_PRODUCTS, productId),
    [productId],
  )

  const product = useMemo(
    () => getModerationDetailProduct(row),
    [row],
  )

  if (!row) {
    return (
      <div className="space-y-4">
        <Seo title={t('adminProductModeration.detail.notFound')} />
        <p className="text-sm text-[var(--secondary-text)]">
          {t('adminProductModeration.detail.notFound')}
        </p>
        <Link
          to="/admin/product-moderation"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)]"
        >
          <FiArrowLeft className="size-4" aria-hidden />
          {t('adminProductModeration.detail.back')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Seo
        title={t('adminProductModeration.detail.title', { name: product.title })}
        description={t('adminProductModeration.subtitle')}
      />

      <Link
        to="/admin/product-moderation"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--active)] hover:underline"
      >
        <FiArrowLeft className="size-4" aria-hidden />
        {t('adminProductModeration.detail.back')}
      </Link>

      <ProductDetails
        role="admin"
        product={product}
        onAction={(actionId) => {
          if (actionId === 'accept' || actionId === 'reject') {
            navigate('/admin/product-moderation')
          }
        }}
      />
    </div>
  )
}
