import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CreatePromoCode from '@/components/forms/CreatePromoCode/CreatePromoCode'
import Seo from '@/components/common/Seo/Seo'
import {
  DEMO_CREATE_PROMO_CODE,
  DEMO_SUPPLIER_PROMO_PRODUCT_OPTIONS,
  getPromoCodeFormValueForProduct,
} from '@/data/demoData'

export default function CreatePromoCodePage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const { t } = useTranslation()
  const isEdit = Boolean(productId)

  const productOptions = useMemo(
    () =>
      DEMO_SUPPLIER_PROMO_PRODUCT_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    [],
  )

  const defaultValue = useMemo(() => {
    if (!isEdit) return DEMO_CREATE_PROMO_CODE
    return getPromoCodeFormValueForProduct(productId)
  }, [isEdit, productId])

  if (isEdit && !defaultValue) {
    return (
      <Navigate
        to="/supplier/promo-codes"
        replace
        state={{ tab: 'promo_product' }}
      />
    )
  }

  const goBack = () =>
    navigate('/supplier/promo-codes', {
      state: { tab: isEdit ? 'promo_product' : undefined },
    })

  const title = isEdit
    ? t('panel.supplierPromoCodes.edit.title')
    : t('panel.supplierPromoCodes.create.title')

  return (
    <>
      <Seo title={title} />

      <CreatePromoCode
        key={isEdit ? `edit-${productId}` : 'create'}
        defaultValue={defaultValue}
        productOptions={productOptions}
        breadcrumb={
          isEdit
            ? t('panel.supplierPromoCodes.edit.breadcrumb')
            : t('panel.supplierPromoCodes.create.breadcrumb')
        }
        title={title}
        submitLabel={
          isEdit
            ? t('panel.supplierPromoCodes.edit.submit')
            : t('panel.supplierPromoCodes.create.submit')
        }
        onBack={goBack}
        onSubmit={() => {
          // TODO: replace with supplier create/update promo code API
          goBack()
        }}
      />
    </>
  )
}
