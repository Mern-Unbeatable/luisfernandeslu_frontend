const IMAGES = {
  steel:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzONbrJRrpEo0oAuV07Pl9xWt7t0S4SGGy5fzbSbOzMQ&s=10',
  lighting:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR3mEJwuZBA-Py_Jr47MGtww4qzAcWJUDyCUpDZ5_2Ww&s=10',
  forklift:
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  cement:
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
  safety:
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
  pallets:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR4XT2tTAFQClDQWn_bMOcGIXUtBaYTJQXimYUFMUtdw&s=10',
}

const CORE_SPONSORED = [
  {
    id: 'industrial-steel-beams',
    slug: 'reinforcing-steel-bar',
    image: IMAGES.steel,
    title: 'Industrial Steel Beams',
    description:
      'High quality steel beams for all commercial construction projects today.',
    price: '€150',
    unit: 'units',
    minOrder: '10 units',
    company: 'SteelWorks Inc',
    rating: 4.8,
  },
  {
    id: 'industrial-led-lighting',
    slug: 'electrical-wires',
    image: IMAGES.lighting,
    title: 'Industrial LED Lighting System',
    description:
      'Energy efficient LED lighting for warehouses and factory floor areas.',
    price: '€45',
    unit: 'units',
    minOrder: '20 units',
    company: 'BrightTech Solutions',
    rating: 4.9,
  },
  {
    id: 'hydraulic-forklift',
    slug: 'concrete-blocks',
    image: IMAGES.forklift,
    title: 'Hydraulic Forklift 3-Ton',
    description:
      'Heavy duty forklift built for industrial material handling work sites.',
    price: '€12500',
    unit: 'units',
    minOrder: '1 units',
    company: 'HeavyLift Equipment',
    rating: 4.6,
  },
  {
    id: 'portland-cement',
    slug: 'portland-cement-quick-set',
    image: IMAGES.cement,
    title: 'Portland Cement',
    description:
      'High strength cement suitable for construction and masonry projects today.',
    price: '€115',
    unit: 'bag (50 kg)',
    minOrder: '50 bags',
    company: 'BuildMart Supply',
    rating: 4.7,
  },
  {
    id: 'safety-helmets',
    slug: 'insulation-material',
    image: IMAGES.safety,
    title: 'Safety Helmets Bulk Pack',
    description:
      'ANSI certified hard hats for site crews and contractor teams.',
    price: '€28',
    unit: 'units',
    minOrder: '25 units',
    company: 'SafeGuard Industrial',
    rating: 4.5,
  },
  {
    id: 'warehouse-pallets',
    slug: 'gravel-aggregate',
    image: IMAGES.pallets,
    title: 'Heavy-Duty Warehouse Pallets',
    description:
      'Reinforced warehouse pallets for logistics and storage operations at scale.',
    price: '€32',
    unit: 'units',
    minOrder: '100 units',
    company: 'LogiPack Co',
    rating: 4.4,
  },
]

/** Eight cards per carousel page (4 × 2 grid). */
export const SPONSORED_PRODUCTS_PAGE_SIZE = 8

export const SPONSORED_PRODUCTS = [
  ...CORE_SPONSORED,
  ...CORE_SPONSORED.map((product, index) => ({
    ...product,
    id: `${product.id}-alt-${index}`,
  })),
]
