/** Default empty form values for Create Auction */
export const DEFAULT_CREATE_AUCTION = {
  orderId: '',
  pickupLocation: '',
  customerName: '',
  phone: '',
  email: '',
  deliveryAddress: '',
  productName: '',
  weight: '',
  sku: '',
  price: '',
  unloadingNeeds: '',
  unloadingInstruction: '',
  accessCondition: '',
  additionalNotes: '',
}

/** Supplier — Types of Unloading Needs */
export const UNLOADING_NEEDS_OPTIONS = [
  { value: 'crane-12m', label: 'Crane (12m)' },
  { value: 'crane-24m', label: 'Crane (24m)' },
  { value: 'tipper-truck', label: 'Tipper Truck' },
  { value: 'forklift', label: 'Forklift' },
  { value: 'manual', label: 'Manual Unloading' },
]

/** Factory / access — Access Condition */
export const ACCESS_CONDITION_OPTIONS = [
  { value: 'easy-access', label: 'Easy Access' },
  { value: 'narrow-road', label: 'Narrow Road' },
  { value: 'restricted-area', label: 'Restricted Area' },
  { value: 'difficult-terrain', label: 'Difficult Terrain' },
  { value: 'manual', label: 'Manual Unloading' },
]

function optionLabel(options, value) {
  return options.find((opt) => opt.value === value)?.label || value
}

/** Demo copy used as field placeholders (not prefilled values) */
export const DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS = {
  orderId: 'ORD-2026-001',
  pickupLocation: '1234 Main St, Los Angeles, CA',
  customerName: 'John Smith',
  phone: '+1 555 0100',
  email: 'john@example.com',
  deliveryAddress: '5678 Oak Ave, San Francisco, CA',
  productName: 'Construction Materials - Steel Beams',
  weight: '500 kg',
  sku: 'STL-BEAM-01',
  price: '$4,500',
  unloadingNeeds: optionLabel(UNLOADING_NEEDS_OPTIONS, 'crane-12m'),
  unloadingInstruction: 'Unload near gate B',
  accessCondition: optionLabel(ACCESS_CONDITION_OPTIONS, 'easy-access'),
  additionalNotes: 'Any additional information',
}

export const DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS = {
  orderId: 'ORD-2026-010',
  pickupLocation: 'Ambuja Cement Factory, Kalyan',
  customerName: 'Metro Construction',
  phone: '+91 98765 43210',
  email: 'ops@metro.com',
  deliveryAddress: 'Metro Construction Site, Andheri West',
  productName: 'Premium Portland Cement',
  weight: '25000 kg',
  sku: 'CEM-PPC-50',
  price: '$285',
}

/** @deprecated use DEMO_CREATE_AUCTION_*_PLACEHOLDERS */
export const DEMO_CREATE_AUCTION_SUPPLIER =
  DEMO_CREATE_AUCTION_SUPPLIER_PLACEHOLDERS
export const DEMO_CREATE_AUCTION_FACTORY =
  DEMO_CREATE_AUCTION_FACTORY_PLACEHOLDERS
