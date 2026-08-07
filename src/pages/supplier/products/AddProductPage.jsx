import { useNavigate } from 'react-router-dom';
import AddProduct from '@/components/forms/AddProduct/AddProduct';
import Seo from '@/components/common/Seo/Seo';
import {
  DEMO_ADD_PRODUCT,
  DEMO_WAREHOUSE_OPTIONS,
} from '@/data/demoData';

export default function AddProductPage() {
  const navigate = useNavigate();

  return (
    <>
      <Seo title="Add Product" />

      <AddProduct
        role="supplier"
        defaultValue={DEMO_ADD_PRODUCT}
        warehouseOptions={DEMO_WAREHOUSE_OPTIONS}
        submitLabel="SUBMIT"
        onBack={() => navigate('/supplier/products')}
        onSubmit={() => {
          // TODO: replace with supplier add-product API
          navigate('/supplier/products');
        }}
      />
    </>
  );
}
