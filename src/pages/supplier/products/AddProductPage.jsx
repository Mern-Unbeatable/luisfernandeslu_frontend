import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AddProduct from '@/components/forms/AddProduct/AddProduct';
import Seo from '@/components/common/Seo/Seo';
import { DEMO_ADD_PRODUCT, DEMO_WAREHOUSE_OPTIONS } from '@/data/demoData';

export default function AddProductPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const warehouseOptions = useMemo(
    () => [
      {
        value: '',
        label: t('panel.supplierProducts.add.selectWarehouse'),
      },
      ...DEMO_WAREHOUSE_OPTIONS.filter((option) => option.value),
    ],
    [t],
  );

  return (
    <>
      <Seo title={t('panel.supplierProducts.add.title')} />

      <AddProduct
        role="supplier"
        defaultValue={DEMO_ADD_PRODUCT}
        warehouseOptions={warehouseOptions}
        breadcrumb={t('panel.supplierProducts.add.breadcrumb')}
        title={t('panel.supplierProducts.add.title')}
        submitLabel={t('panel.supplierProducts.add.submit')}
        onBack={() => navigate('/supplier/products')}
        onSubmit={() => {
          // TODO: replace with supplier add-product API
          navigate('/supplier/products');
        }}
      />
    </>
  );
}
