export const CHECKOUT_LINE_ITEMS = [
  {
    id: 'line-1',
    title: 'High Density Construction Bricks (Pack of 1000)',
    quantity: 1,
    unitPrice: 70,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-hTLZsRdDd1ANv358uyRFuYN8__0xQz2nmhi3Y945Jg&s=10',
  },
  {
    id: 'line-2',
    title: 'High Density Construction Bricks (Pack of 1000)',
    quantity: 3,
    unitPrice: 250,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLjq0V_QLO-cJNpJIaBpq_1nJWimY4evpG-2v35lUGhw&s=10',
  },
]

export const CHECKOUT_TOTALS = {
  subtotal: 320,
  shipping: 20,
  vat: 4,
  currency: 'EUR',
  total: 357.99,
}

export const CHECKOUT_REGION_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'lisbon', label: 'Lisbon' },
  { value: 'porto', label: 'Porto' },
  { value: 'faro', label: 'Faro' },
  { value: 'coimbra', label: 'Coimbra' },
]

export const CHECKOUT_CITY_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'lisbon-city', label: 'Lisbon' },
  { value: 'cascais', label: 'Cascais' },
  { value: 'sintra', label: 'Sintra' },
  { value: 'almada', label: 'Almada' },
]

export const UNLOADING_TYPE_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'crane-12', label: 'Crane (12m)' },
  { value: 'crane-24', label: 'Crane (24m)' },
  { value: 'tipper', label: 'Tipper Truck' },
  { value: 'forklift', label: 'Forklift' },
  { value: 'manual', label: 'Manual Unloading' },
]

export const ACCESS_CONDITION_OPTIONS = [
  { value: '', label: 'Select...' },
  { value: 'easy', label: 'Easy Access' },
  { value: 'narrow', label: 'Narrow Road' },
  { value: 'restricted', label: 'Restricted Area' },
  { value: 'terrain', label: 'Difficult Terrain' },
]
