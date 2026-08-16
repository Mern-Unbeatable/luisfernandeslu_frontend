import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AddProduct from '@/components/forms/AddProduct/AddProduct'
import Seo from '@/components/common/Seo/Seo'
import {
  DEMO_ADD_PRODUCT,
  DEMO_WAREHOUSE_OPTIONS,
  getSupplierProductFormValue,
} from '@/data/demoData'

export default function AddProductPage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const { t } = useTranslation()
  const isEdit = Boolean(productId)

  const warehouseOptions = useMemo(
    () => [
      {
        value: '',
        label: t('panel.supplierProducts.add.selectWarehouse'),
      },
      ...DEMO_WAREHOUSE_OPTIONS.filter((option) => option.value),
    ],
    [t],
  )

  const defaultValue = useMemo(() => {
    if (!isEdit) return DEMO_ADD_PRODUCT
    return getSupplierProductFormValue(productId)
  }, [isEdit, productId])

  if (isEdit && !defaultValue) {
    return <Navigate to="/supplier/products" replace />
  }

  const title = isEdit
    ? t('panel.supplierProducts.edit.title')
    : t('panel.supplierProducts.add.title')

  return (
    <>
      <Seo title={title} />

      <AddProduct
        key={isEdit ? `edit-${productId}` : 'add'}
        role="supplier"
        defaultValue={defaultValue}
        warehouseOptions={warehouseOptions}
        breadcrumb={
          isEdit
            ? t('panel.supplierProducts.edit.breadcrumb')
            : t('panel.supplierProducts.add.breadcrumb')
        }
        title={title}
        submitLabel={
          isEdit
            ? t('panel.supplierProducts.edit.submit')
            : t('panel.supplierProducts.add.submit')
        }
        onBack={() => navigate('/supplier/products')}
        onSubmit={() => {
          // TODO: replace with supplier add/update product API
          navigate('/supplier/products')
        }}
      />
    </>
  )
}
