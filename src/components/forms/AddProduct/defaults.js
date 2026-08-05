export const DEFAULT_ADD_PRODUCT = {
  warehouseLocation: '',
  categoryId: '',
  subCategoryId: '',
  productTypeId: '',
  title: '',
  quantity: '',
  basePrice: '',
  b2bDiscount: '',
  minB2bQuantity: '',
  sku: '',
  weight: '',
  description: '',
  feature: '',
  additionalInformation: '',
  specifications: '',
  bulkEnabled: true,
  bulkTiers: [
    { id: 'tier-1', quantity: '', price: '' },
    { id: 'tier-2', quantity: '', price: '' },
  ],
  bannerImage: null,
  otherImages: [],
}

export const CATEGORY_OPTIONS = [
  { value: '', label: 'Select category' },
  { value: 'cement', label: 'Cement, Mortars & Concretes' },
  { value: 'steel', label: 'Steel & Metals' },
  { value: 'wood', label: 'Timber & Wood' },
]

export const SUB_CATEGORY_OPTIONS = [
  { value: '', label: 'Select sub category' },
  { value: 'cement', label: 'Cement' },
  { value: 'mortar', label: 'Mortar' },
  { value: 'concrete', label: 'Concrete' },
]

export const PRODUCT_TYPE_OPTIONS = [
  { value: '', label: 'Select product type' },
  { value: 'cem-i', label: 'Ordinary Portland Cement (CEM I)' },
  { value: 'cem-ii', label: 'Portland-Composite Cement (CEM II)' },
  { value: 'quick-set', label: 'Quick Set Cement' },
]
