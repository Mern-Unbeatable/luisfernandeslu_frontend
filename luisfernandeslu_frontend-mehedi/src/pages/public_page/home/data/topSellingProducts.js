const IMG = {
  cement:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSVx0dRBi_szatWUHWM9BCwIj67uS7VEfFt5Fx1UBVaA&s=10',
  rebar:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGJMbvfUsjc7s0nlayFAS-1tm5pfe65tK6PfLJR3vGFw&s=10',
  blocks:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-hTLZsRdDd1ANv358uyRFuYN8__0xQz2nmhi3Y945Jg&s=10',
  bricks:
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
}

const CATALOG = [
  {
    slug: 'portland-cement-quick-set',
    image: IMG.cement,
    title: 'Portland Cement Quick Set',
    description:
      'Fast setting cement for rapid construction on busy commercial sites.',
    priceText: 'Price: $130 per bag (50 kg)',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'reinforcing-steel-bar',
    image: IMG.rebar,
    title: 'Reinforcing Steel Bar (Rebar)',
    description:
      'High strength steel bars for reinforced concrete structures and foundations.',
    priceText: 'Price: $90 per ton',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'concrete-blocks',
    image: IMG.blocks,
    title: 'Concrete Blocks',
    description:
      'Durable concrete blocks for walls and foundations on residential sites.',
    priceText: 'Price: $2 per piece',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'clay-bricks',
    image: IMG.bricks,
    title: 'Clay Bricks',
    description:
      'Traditional clay bricks for masonry on homes and commercial sites.',
    priceText: 'Price: $0.50 per piece',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'granite-stone',
    image: IMG.granite,
    title: 'Granite Stone',
    description:
      'Premium granite for flooring and countertops in modern interior spaces.',
    priceText: 'Price: $45 per sq ft',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'glass-panels',
    image: IMG.glass,
    title: 'Glass Panels',
    description:
      'Tempered glass for modern facades on offices and retail stores.',
    priceText: 'Price: $120 per panel',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'pvc-pipes',
    image: IMG.pipes,
    title: 'PVC Pipes',
    description:
      'Lightweight PVC pipes for plumbing in residential and commercial builds.',
    priceText: 'Price: $15 per meter',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'cpvc-pipes',
    image: IMG.pipes,
    title: 'CPVC Pipes',
    description:
      'Hot water CPVC pipes for kitchen and bathroom areas nationwide.',
    priceText: 'Price: $22 per meter',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'electrical-wires',
    image: IMG.wires,
    title: 'Electrical Wires',
    description:
      'Safe electrical wiring for homes offices and industrial building projects.',
    priceText: 'Price: $100 per roll',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'switches-sockets',
    image: IMG.wires,
    title: 'Switches & Sockets',
    description:
      'Reliable switches and sockets for homes offices and workshop spaces.',
    priceText: 'Price: $8 per unit',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'wall-paint',
    image: IMG.paint,
    title: 'Wall Paint',
    description:
      'Interior wall paint for homes offices and retail spaces nationwide.',
    priceText: 'Price: $35 per gallon',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'wall-primer',
    image: IMG.paint,
    title: 'Wall Primer',
    description:
      'Primer for interior and exterior wall surfaces on construction projects.',
    priceText: 'Price: $28 per gallon',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'waterproof-membrane',
    image: IMG.roof,
    title: 'Waterproof Membrane',
    description:
      'Waterproof membrane for roofs basements and foundation walls on sites.',
    priceText: 'Price: $55 per roll',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'insulation-material',
    image: IMG.roof,
    title: 'Insulation Material',
    description:
      'Thermal insulation for energy efficiency in walls roofs and floors.',
    priceText: 'Price: $40 per sheet',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'bitumen',
    image: IMG.roof,
    title: 'Bitumen',
    description:
      'Waterproofing bitumen for roofing projects on commercial and residential buildings.',
    priceText: 'Price: $65 per drum',
    bulkOptionLabel: 'Bulk option Open',
  },
  {
    slug: 'roofing-sheets',
    image: IMG.roof,
    title: 'Roofing Sheets',
    description:
      'Corrugated sheets for durable roofs on barns and industrial buildings.',
    priceText: 'Price: $18 per sheet',
    bulkOptionLabel: 'Bulk option Open',
  },
]

export const TOP_SELLING_PAGE_SIZE = 12
export const TOP_SELLING_TOTAL_PAGES = 10

export const TOP_SELLING_PRODUCTS = Array.from(
  { length: TOP_SELLING_TOTAL_PAGES * TOP_SELLING_PAGE_SIZE },
  (_, index) => {
    const template = CATALOG[index % CATALOG.length]
    return {
      ...template,
      id: `${template.slug}-${index}`,
      minOrderLabel: 'Min ord 10 pcs',
    }
  },
)
