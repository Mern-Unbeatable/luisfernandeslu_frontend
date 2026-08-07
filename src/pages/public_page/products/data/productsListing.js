const IMG = {
  cement:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSVx0dRBi_szatWUHWM9BCwIj67uS7VEfFt5Fx1UBVaA&s=10',
  rebar:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGJMbvfUsjc7s0nlayFAS-1tm5pfe65tK6PfLJR3vGFw&s=10',
  blocks:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-hTLZsRdDd1ANv358uyRFuYN8__0xQz2nmhi3Y945Jg&s=10',
  sand:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLjq0V_QLO-cJNpJIaBpq_1nJWimY4evpG-2v35lUGhw&s=10',
  granite:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfNB-ESwL3D_1XUY1EfVoRQhvbETlPdZY7ohO8fq1-bQ&s=10',
  glass:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvOXAohQIOuxPN4bGqFgFyu9OktUCTJROM7-y6mlBGqw&s=10',
  pipes:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF_GtVY4Uhl2Zt6ui8VN1yaxnhigWg_H37KVZs1lq67g&s=10',
  wires:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEf1i9BOhEU9-R4gahAyZTvCOlWldlkI1TUiCERpghcg&s=10',
  paint:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpTtFwGsxiuxpOkXean_faVjUt3yprW9L0QUQQVQEVJQ&s=10',
  roof:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0LyBOiMnRGayrUDo_WThBFBQryo_cuT_NZP7LnqjTWA&s=10',
  timber:
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&h=300&fit=crop',
  gypsum:
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
}

/** Listing templates aligned with catalog taxonomy (mock storefront). */
export const LISTING_TEMPLATES = [
  {
    slug: 'portland-cement-quick-set',
    categoryId: 'cement-mortar-concrete',
    subcategoryId: 'cements',
    typeId: 'rapid-setting-fast-drying-cement',
    image: IMG.cement,
    title: 'Portland Cement Quick Set',
    description:
      'Fast-setting cement for rapid construction work and tight project schedules.',
    priceText: 'Price: $130 per bag (50 kg)',
    priceValue: 130,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'reinforcing-steel-bar',
    categoryId: 'metals-structures',
    subcategoryId: 'construction-steel',
    typeId: 'steel-rebar',
    image: IMG.rebar,
    title: 'Reinforcing Steel Bar (Rebar)',
    description:
      'High-strength steel bars for reinforced concrete structures and foundations.',
    priceText: 'Price: $90 per ton',
    priceValue: 90,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'concrete-blocks',
    categoryId: 'blocks-bricks',
    subcategoryId: 'blocks',
    typeId: 'concrete-block',
    image: IMG.blocks,
    title: 'Concrete Blocks',
    description:
      'Durable concrete blocks for walls and foundations on residential sites.',
    priceText: 'Price: $2 per piece',
    priceValue: 2,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'fine-sand',
    categoryId: 'sand-gravel-aggregates',
    subcategoryId: 'sand',
    typeId: 'fine-sand',
    image: IMG.sand,
    title: 'Fine Sand',
    description:
      'Clean fine sand for mortar, plaster and precision finishing work.',
    priceText: 'Price: $45 per cubic meter',
    priceValue: 45,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'gravel-aggregate',
    categoryId: 'sand-gravel-aggregates',
    subcategoryId: 'gravel',
    typeId: 'gravel-2-12-25-mm',
    image: IMG.sand,
    title: 'Gravel Aggregate',
    description:
      'Versatile gravel for concrete mixes, drainage and base layers.',
    priceText: 'Price: $60 per cubic meter',
    priceValue: 60,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'crushed-stone',
    categoryId: 'sand-gravel-aggregates',
    subcategoryId: 'aggregates',
    typeId: 'pebbles-gravel',
    image: IMG.granite,
    title: 'Crushed Stone',
    description:
      'Crushed stone aggregate for roads, driveways and structural fill.',
    priceText: 'Price: $75 per cubic meter',
    priceValue: 75,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'timber-wood',
    categoryId: 'timber-wood-products',
    subcategoryId: 'sawn-timber',
    typeId: 'pine',
    image: IMG.timber,
    title: 'Timber Wood',
    description:
      'Quality timber for framing, formwork and general carpentry projects.',
    priceText: 'Price: $500 per cubic meter',
    priceValue: 500,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'gypsum-board',
    categoryId: 'dry-construction-systems',
    subcategoryId: 'boards',
    typeId: 'gypsum-plasterboard',
    image: IMG.gypsum,
    title: 'Gypsum Board',
    description:
      'Standard gypsum boards for interior partitions and ceiling systems.',
    priceText: 'Price: $12 per sheet',
    priceValue: 12,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'granite-stone',
    categoryId: 'coverings-finishes',
    subcategoryId: 'flooring',
    typeId: 'natural-stone-flooring',
    image: IMG.granite,
    title: 'Granite Stone',
    description:
      'Premium granite for flooring and countertops in modern interior spaces.',
    priceText: 'Price: $80 per square meter',
    priceValue: 380,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'glass-panels',
    categoryId: 'coverings-finishes',
    subcategoryId: 'decorative-coverings',
    typeId: 'pvc-mdf-panels',
    image: IMG.glass,
    title: 'Glass Panels',
    description:
      'Tempered glass panels for facades, partitions and storefront glazing.',
    priceText: 'Price: $120 per panel',
    priceValue: 420,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'pvc-pipes',
    categoryId: 'plumbing-hydraulics',
    subcategoryId: 'pipes',
    typeId: 'pvc-pipe',
    image: IMG.pipes,
    title: 'PVC Pipes',
    description:
      'Lightweight PVC pipes for plumbing in residential and commercial builds.',
    priceText: 'Price: $15 per meter',
    priceValue: 15,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'electrical-wires',
    categoryId: 'electrical-lighting',
    subcategoryId: 'cables-wiring',
    typeId: 'single-core-cable',
    image: IMG.wires,
    title: 'Electrical Wires',
    description:
      'Safe electrical wiring for homes, offices and industrial building projects.',
    priceText: 'Price: $100 per roll',
    priceValue: 100,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'wall-paint',
    categoryId: 'paints-sealants',
    subcategoryId: 'paints',
    typeId: 'interior-paint',
    image: IMG.paint,
    title: 'Wall Paint',
    description:
      'Interior wall paint for homes, offices and retail spaces nationwide.',
    priceText: 'Price: $35 per gallon',
    priceValue: 35,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'roofing-sheets',
    categoryId: 'roofing-coverings',
    subcategoryId: 'sheets-panels',
    typeId: 'profiled-metal-sheet',
    image: IMG.roof,
    title: 'Roofing Sheets',
    description:
      'Corrugated sheets for durable roofs on barns and industrial buildings.',
    priceText: 'Price: $18 per sheet',
    priceValue: 18,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'waterproof-membrane',
    categoryId: 'insulation-waterproofing',
    subcategoryId: 'waterproofing',
    typeId: 'bituminous-membrane',
    image: IMG.roof,
    title: 'Waterproof Membrane',
    description:
      'Waterproof membrane for roofs, basements and foundation walls on sites.',
    priceText: 'Price: $55 per roll',
    priceValue: 320,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'clay-bricks',
    categoryId: 'blocks-bricks',
    subcategoryId: 'bricks',
    typeId: 'solid-brick',
    image: IMG.blocks,
    title: 'Clay Bricks',
    description:
      'Traditional clay bricks for masonry on homes and commercial sites.',
    priceText: 'Price: $0.50 per piece',
    priceValue: 1,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'insulation-material',
    categoryId: 'insulation-waterproofing',
    subcategoryId: 'thermal-insulation',
    typeId: 'rock-wool',
    image: IMG.roof,
    title: 'Insulation Material',
    description:
      'Thermal insulation for energy efficiency in walls, roofs and floors.',
    priceText: 'Price: $40 per sheet',
    priceValue: 40,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
  {
    slug: 'wall-primer',
    categoryId: 'paints-sealants',
    subcategoryId: 'primers',
    typeId: 'acrylic-primer',
    image: IMG.paint,
    title: 'Wall Primer',
    description:
      'Primer for interior and exterior wall surfaces on construction projects.',
    priceText: 'Price: $28 per gallon',
    priceValue: 28,
    bulkOptionLabel: 'Min ord 10 pcs',
  },
]

export const PRODUCTS_PRICE_MAX = 10000

export const PRODUCTS_PRICE_BRACKETS = [
  { id: 'all', labelKey: 'productsPage.priceAll', min: 0, max: 10000 },
  { id: 'under-20', labelKey: 'productsPage.priceUnder20', min: 0, max: 20 },
  { id: '25-100', labelKey: 'productsPage.price25to100', min: 25, max: 100 },
  {
    id: '100-300',
    labelKey: 'productsPage.price100to300',
    min: 100,
    max: 300,
  },
  {
    id: '300-500',
    labelKey: 'productsPage.price300to500',
    min: 300,
    max: 500,
  },
  {
    id: '500-1000',
    labelKey: 'productsPage.price500to1000',
    min: 500,
    max: 1000,
  },
  {
    id: '1000-10000',
    labelKey: 'productsPage.price1000to10000',
    min: 1000,
    max: 10000,
  },
]

export const PRODUCTS_PAGE_SIZE = 9

export const PRODUCTS_LIST = Array.from({ length: 90 }, (_, index) => {
  const template = LISTING_TEMPLATES[index % LISTING_TEMPLATES.length]
  const priceOffset = Math.floor(index / LISTING_TEMPLATES.length) * 15
  return {
    ...template,
    id: `${template.slug}-${index}`,
    priceValue: Math.min(
      PRODUCTS_PRICE_MAX,
      template.priceValue + (index % 3) * 5 + priceOffset,
    ),
  }
})

export function getProductsTotalPages(count) {
  return Math.max(1, Math.ceil(count / PRODUCTS_PAGE_SIZE))
}
