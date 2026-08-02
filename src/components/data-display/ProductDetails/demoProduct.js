const IMG_MAIN =
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=80'
const IMG_2 =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
const IMG_3 =
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80'
const IMG_4 =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'
const AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'

export const DEMO_PRODUCT = {
  title: 'Portland Cement',
  sku: 'A264671',
  category: 'Building Materials',
  availability: 'In Stock',
  warehouse: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
  rating: 4.7,
  feedbackCount: 21671,
  price: '$130.00',
  priceText: '$130.00 Per Bag ( 50kg )',
  unit: 'Bag ( 50kg )',
  minOrder: '10 PCS',
  images: [IMG_MAIN, IMG_2, IMG_3, IMG_4],
  bulkPricing: [
    { range: '1 - 2', price: '$24.00 each' },
    { range: '3 - 5', price: '$21.60 each' },
    { range: '6 - 11', price: '$20.40 each' },
    { range: '12 - 27', price: '$19.20 each' },
    { range: '28 - 49', price: '$18.00 each' },
    { range: '50 - 79', price: '$17.40 each' },
    { range: '80 - 120', price: '$16.80 each' },
  ],
  seller: {
    name: 'RQA Store',
    avatar: AVATAR,
    rating: 4.5,
    reviewCount: 66,
    email: 'contact@a2a-supplies.com',
    phone: '+1 (555) 012-3456',
  },
  descriptionParagraphs: [
    'Portland Cement is a high-quality binding material designed for durable concrete and masonry work across residential, commercial, and industrial projects.',
    'It delivers consistent strength, smooth workability, and reliable setting performance — ideal for foundations, slabs, columns, plastering, and finishing.',
    'Engineered for everyday construction demands, this cement helps reduce cracking risk and supports long-lasting structural results when mixed and cured properly.',
  ],
  features: [
    'High Strength & Durability',
    'Smooth Workability',
    'Crack Resistance Performance',
    'Suitable for All Construction Types',
    'Consistent Quality & Reliable Results',
    'Easy Mixing & Application',
  ],
  additionalParagraphs: [
    'This Portland Cement is suitable for general construction including concrete work, flooring, masonry, plastering, and structural applications.',
    'Brand: Superstrong. Type: OPC / PCC. Grade: 42.5. Form: Powder. Color: Grey. Packaging Size: 50 KG Bag.',
    'It offers reliable compressive strength, controlled setting time, and good compatibility with standard aggregates and common admixtures. Quality is assured per manufacturer guidelines.',
  ],
  specificationParagraphs: [
    'Net Weight: 50 kg. Cement Type: Portland. Fineness: Standard.',
    'Storage: Keep dry and sealed. Shelf Life: 3 months from manufacture. Origin: Local / Imported mix.',
    'Use clean water and proper mix ratios for best results. Follow site curing practices to achieve designed strength and durability.',
  ],
  reviews: [
    {
      id: 'r1',
      author: 'Carlos M.',
      rating: 5,
      text: 'Consistent quality and easy to work with on slab pours.',
    },
    {
      id: 'r2',
      author: 'Priya S.',
      rating: 4,
      text: 'Good strength development. Packaging arrived intact.',
    },
  ],
  supplierDetails: [
    { label: 'Company', value: 'A2A Construction Supplies' },
    { label: 'Contact Person', value: 'Atik Adnan' },
    { label: 'Email', value: 'contact@a2a-supplies.com' },
    { label: 'Phone', value: '+1 (555) 012-3456' },
  ],
  supplierBusiness: [
    { label: 'Business Type', value: 'Building Materials Supplier' },
    { label: 'Years Active', value: '8+' },
    { label: 'Service Area', value: 'Illinois & nearby states' },
    { label: 'Verification', value: 'Verified vendor' },
  ],
}

/** Admin-facing seller label override */
export const ADMIN_PRODUCT = {
  ...DEMO_PRODUCT,
  seller: {
    ...DEMO_PRODUCT.seller,
    name: 'A2A Construction Supplies',
  },
}
