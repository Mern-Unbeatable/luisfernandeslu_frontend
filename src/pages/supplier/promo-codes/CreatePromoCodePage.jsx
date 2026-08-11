import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CreatePromoCode from '@/components/forms/CreatePromoCode/CreatePromoCode'
import Seo from '@/components/common/Seo/Seo'
import {
  DEMO_CREATE_PROMO_CODE,
  DEMO_SUPPLIER_PROMO_PRODUCT_OPTIONS,
} from '@/data/demoData'

export default function CreatePromoCodePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const productOptions = useMemo(
    () =>
      DEMO_SUPPLIER_PROMO_PRODUCT_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    [],
  )

  return (
    <>
      <Seo title={t('panel.supplierPromoCodes.create.title')} />

      <CreatePromoCode
        defaultValue={DEMO_CREATE_PROMO_CODE}
        productOptions={productOptions}
        onBack={() => navigate('/supplier/promo-codes')}
        onSubmit={() => {
          // TODO: replace with supplier create promo code API
          navigate('/supplier/promo-codes')
        }}
      />
    </>
  )
}
