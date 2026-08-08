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
