import { getProductTypeImage } from '../utils/productTypeImages'

/**
 * Public catalog taxonomy: Category → SubCategory → Product Types.
 */

function types(...names) {
  return names.map((name) => ({
    id: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, ''),
    name,
    imageKey: null,
  }))
}

export const PRODUCT_CATEGORIES = [
  {
    id: 'cement-mortar-concrete',
    name: 'Cement, Mortar & Concrete',
    subcategories: [
      {
        id: 'cements',
        name: 'Cements',
        productTypes: types(
          'Ordinary Portland Cement (CEM I)',
          'Portland Composite Cement (CEM II)',
          'High Early Strength Cement (CEM I 52.5R)',
          'Pozzolanic Cement (CEM IV)',
          'Blast Furnace Cement (CEM III)',
          'White / Decorative Cement',
          'Rapid-Setting / Fast-Drying Cement',
          'Special Cement for Underground Construction',
        ),
      },
      {
        id: 'mortars',
        name: 'Mortars',
        productTypes: types(
          'Plastering / Stucco Mortars',
          'Masonry Mortars',
          'Tile Adhesive Mortars',
          'Grouting / Joint Mortars',
          'Repair Mortars',
          'Self-Levelling Mortars',
          'Refractory Mortars',
          'Waterproofing Mortars',
        ),
      },
      {
        id: 'concrete',
        name: 'Concrete',
        productTypes: types(
          'Ready-Mix / Pre-Mixed Concrete',
          'Reinforced / Structural Concrete',
          'Lightweight Concrete',
          'Self-Compacting Concrete',
          'Shotcrete (Sprayed Concrete)',
          'Refractory Concrete',
          'Fiber-Reinforced Concrete',
          'Decorative / Colored Concrete',
          'High-Strength Concrete',
          'Fast-Drying Concrete',
        ),
      },
      {
        id: 'additives-admixtures',
        name: 'Additives & Admixtures',
        productTypes: types(
          'Plasticizers / Superplasticizers',
          'Set Retarders / Accelerators',
          'Water Repellents / Liquid Waterproofing Admixtures',
          'Anti-Freeze Admixtures',
          'Synthetic and Metallic Fibers',
          'Mineral Pigments',
        ),
      },
      {
        id: 'special-products',
        name: 'Special Products',
        productTypes: types(
          'Screeds',
          'Concrete Repair Products',
          'Micro Concrete',
          'Cement Injections / Grouts',
          'Grouts',
          'Sealants and Expansion Joints',
        ),
      },
    ],
  },
  {
    id: 'sand-gravel-aggregates',
    name: 'Sand, Gravel & Aggregates',
    subcategories: [
      {
        id: 'sand',
        name: 'Sand',
        productTypes: types(
          'Fine Sand',
          'Medium Sand',
          'Coarse Sand',
          'Washed Sand',
          'Crushed Sand (Artificial Sand)',
        ),
      },
      {
        id: 'gravel',
        name: 'Gravel',
        productTypes: types(
          'Stone Dust (Gravel 0)',
          'Gravel 1 (4–12 mm)',
          'Gravel 2 (12–25 mm)',
          'Gravel 3 (25–38 mm)',
          'Gravel 4 (38–50 mm)',
          'Concrete Gravel',
          'Drainage Gravel',
        ),
      },
      {
        id: 'aggregates',
        name: 'Aggregates',
        productTypes: types(
          'All-in Aggregate (Tout-Venant)',
          'Sandy Gravel (Saibro)',
          'Pebbles / Gravel',
          'Compacted Sub-Base',
          'Riprap Stone (Large Rock Fill)',
        ),
      },
    ],
  },
  {
    id: 'blocks-bricks',
    name: 'Blocks & Bricks',
    subcategories: [
      {
        id: 'blocks',
        name: 'Blocks',
        productTypes: types(
          'Concrete Block',
          'Formwork Block',
          'Thermal Block',
          'Acoustic Block',
          'Split Face / Exposed Block',
        ),
      },
      {
        id: 'bricks',
        name: 'Bricks',
        productTypes: types(
          'Solid Brick',
          'Hollow Brick (8, 11, 15, 20)',
          'Thermal Brick',
          'Facing Brick',
          'Refractory Brick',
        ),
      },
      {
        id: 'floor-blocks',
        name: 'Floor Blocks & Hollow Clay Blocks',
        productTypes: types('Cement Floor Block', 'Clay Floor Block'),
      },
    ],
  },
  {
    id: 'dry-construction-systems',
    name: 'Dry Construction Systems',
    subcategories: [
      {
        id: 'metal-profiles',
        name: 'Metal Profiles',
        productTypes: types(
          'Stud Profile (M)',
          'Track Profile (U)',
          'F530 Profile',
          'Omega Profile',
          'Corner Beads',
          'Fixing Accessories',
        ),
      },
      {
        id: 'boards',
        name: 'Boards',
        productTypes: types(
          'Gypsum Plasterboard',
          'Moisture-Resistant Board',
          'Fire-Resistant Board',
          'High-Density Board',
          'Cement Board',
          'Mineral Fiber Board',
        ),
      },
      {
        id: 'insulation-dry',
        name: 'Insulation',
        productTypes: types(
          'Rock Wool',
          'Glass Wool',
          'EPS / XPS',
          'Acoustic Insulation',
        ),
      },
      {
        id: 'compounds-accessories',
        name: 'Compounds & Accessories',
        productTypes: types(
          'Joint Compound',
          'Joint Tape',
          'Screws',
          'Metal Anchors',
          'Primers',
        ),
      },
      {
        id: 'complete-systems',
        name: 'Complete Systems',
        productTypes: types(
          'Interior Partitions',
          'Suspended Ceilings',
          'Wall Cladding Systems',
          'Niches and Moldings',
        ),
      },
    ],
  },
  {
    id: 'roofing-coverings',
    name: 'Roofing & Coverings',
    subcategories: [
      {
        id: 'roof-tiles',
        name: 'Roof Tiles',
        productTypes: types(
          'Ceramic Roof Tile',
          'Concrete Roof Tile',
          'Metal / Sandwich Roof Panel',
          'Plastic / PVC Roof Tile',
          'Translucent Roof Tile',
          'Ridge Tiles',
        ),
      },
      {
        id: 'sheets-panels',
        name: 'Sheets & Panels',
        productTypes: types(
          'Profiled Metal Sheet',
          'Sandwich Panel',
          'Galvanized Sheet',
          'Fiber Cement Sheet',
          'Translucent Sheet',
          'Flashings and Trims',
        ),
      },
      {
        id: 'roof-underlays',
        name: 'Roof Underlays & Insulation',
        productTypes: types(
          'Breathable Membrane',
          'Bituminous Membrane',
          'EPS / XPS / PU',
          'Vapor Barrier',
        ),
      },
      {
        id: 'roof-accessories',
        name: 'Accessories',
        productTypes: types(
          'Screws',
          'Foams and Sealants',
          'Sealing Tapes',
          'Ventilated Ridge Systems',
          'Roof Drains',
        ),
      },
      {
        id: 'special-roof-systems',
        name: 'Special Systems',
        productTypes: types(
          'Industrial Roofing Systems',
          'Skylights',
          'Metal Facades',
        ),
      },
    ],
  },
  {
    id: 'insulation-waterproofing',
    name: 'Insulation & Waterproofing',
    subcategories: [
      {
        id: 'thermal-insulation',
        name: 'Thermal Insulation',
        productTypes: types(
          'EPS',
          'XPS',
          'Polyurethane',
          'Rock Wool',
          'Glass Wool',
          'Cork',
          'Sandwich Panel',
        ),
      },
      {
        id: 'acoustic-insulation',
        name: 'Acoustic Insulation',
        productTypes: types(
          'Acoustic Mats',
          'Sound-Absorbing Foams',
          'Rubber Panels',
        ),
      },
      {
        id: 'waterproofing',
        name: 'Waterproofing',
        productTypes: types(
          'Bituminous Membrane',
          'Liquid Membrane',
          'EPDM / PVC Membrane',
          'Waterproof Cement',
          'Resins',
        ),
      },
      {
        id: 'drainage-protection',
        name: 'Drainage & Protection',
        productTypes: types(
          'Geotextile',
          'Drainage Board',
          'Drainage Pipe',
          'Root Barrier Mesh',
        ),
      },
      {
        id: 'insulation-accessories',
        name: 'Accessories',
        productTypes: types(
          'Primers',
          'Reinforcement Bands',
          'Joint Tapes',
        ),
      },
    ],
  },
  {
    id: 'coverings-finishes',
    name: 'Coverings & Finishes',
    subcategories: [
      {
        id: 'ceramic-coverings',
        name: 'Ceramic Coverings',
        productTypes: types(
          'Wall Tiles',
          'Mosaic Tiles',
          'Porcelain Tiles',
          'Natural Stone',
          'Wood / Stone Effect Tiles',
        ),
      },
      {
        id: 'flooring',
        name: 'Flooring',
        productTypes: types(
          'Ceramic Flooring',
          'Vinyl Flooring',
          'Laminate Flooring',
          'Microcement Flooring',
          'Natural Stone Flooring',
          'Non-Slip Outdoor Flooring',
        ),
      },
      {
        id: 'mortars-adhesives',
        name: 'Mortars & Adhesives',
        productTypes: types(
          'Tile Adhesive',
          'Flexible Adhesive',
          'Joint Mortar',
          'Silicones',
        ),
      },
      {
        id: 'plasters-compounds',
        name: 'Plasters & Compounds',
        productTypes: types(
          'Traditional Plaster',
          'Spray Plaster',
          'Acrylic Compound',
          'Gypsum Adhesive',
        ),
      },
      {
        id: 'profiles-accessories',
        name: 'Profiles & Accessories',
        productTypes: types(
          'Finishing Profiles',
          'Corners',
          'Skirting Boards',
          'Thresholds',
        ),
      },
      {
        id: 'decorative-coverings',
        name: 'Decorative Coverings',
        productTypes: types(
          '3D Panels',
          'PVC / MDF Panels',
          'Self-Adhesive Coverings',
        ),
      },
    ],
  },
  {
    id: 'timber-wood-products',
    name: 'Timber & Wood Products',
    subcategories: [
      {
        id: 'sawn-timber',
        name: 'Sawn Timber',
        productTypes: types(
          'Pine',
          'Oak',
          'Chestnut',
          'Exotic Woods',
          'Beams',
          'Battens',
          'Boards',
        ),
      },
      {
        id: 'treated-timber',
        name: 'Treated Timber',
        productTypes: types(
          'Pressure-Treated Timber',
          'Outdoor Decking',
          'Laminated Beams',
        ),
      },
      {
        id: 'engineered-wood',
        name: 'Engineered Wood Panels',
        productTypes: types(
          'MDF',
          'Particle Board',
          'OSB',
          'Plywood',
          'Melamine Board',
        ),
      },
      {
        id: 'flooring-cladding',
        name: 'Flooring & Cladding',
        productTypes: types(
          'Hardwood Flooring',
          'Laminate Flooring',
          'Wooden Decking',
          'Composite Decking',
          'Skirting Boards',
        ),
      },
      {
        id: 'wood-accessories',
        name: 'Accessories & Treatments',
        productTypes: types(
          'Varnishes',
          'Oils',
          'Adhesives',
          'Screws',
          'Sealants',
        ),
      },
    ],
  },
  {
    id: 'metals-structures',
    name: 'Metals & Structures',
    subcategories: [
      {
        id: 'construction-steel',
        name: 'Construction Steel',
        productTypes: types(
          'Steel Rebar',
          'Welded Mesh',
          'Annealed Wire',
          'Reinforcement Bars',
          'Stirrups',
        ),
      },
      {
        id: 'metal-profiles-struct',
        name: 'Metal Profiles',
        productTypes: types(
          'I / H Profile',
          'U Profile',
          'L Profile',
          'T Profile',
          'Tubular Profiles',
        ),
      },
      {
        id: 'sheets',
        name: 'Sheets',
        productTypes: types(
          'Plain Sheet',
          'Perforated Sheet',
          'Chequered Sheet',
          'Galvanized Sheet',
          'Stainless Steel Sheet',
        ),
      },
      {
        id: 'misc-metals',
        name: 'Miscellaneous Metals',
        productTypes: types('Aluminum', 'Stainless Steel', 'Copper', 'Brass'),
      },
      {
        id: 'fixings',
        name: 'Fixings',
        productTypes: types(
          'Screws',
          'Anchor Bolts',
          'Electrodes',
          'Anti-Corrosion Paints',
        ),
      },
    ],
  },
  {
    id: 'plumbing-hydraulics',
    name: 'Plumbing & Hydraulics',
    subcategories: [
      {
        id: 'pipes',
        name: 'Pipes',
        productTypes: types(
          'PVC Pipe',
          'PPR Pipe',
          'HDPE Pipe',
          'Multilayer Pipe',
          'Copper Pipe',
        ),
      },
      {
        id: 'connections',
        name: 'Connections',
        productTypes: types(
          'Elbows',
          'Unions',
          'Valves',
          'Stop Valves',
          'Clamps',
        ),
      },
      {
        id: 'sewerage-drainage',
        name: 'Sewerage & Drainage',
        productTypes: types(
          'Sewer Pipes',
          'Inspection Chambers',
          'Drains',
          'Traps',
          'Pumps',
        ),
      },
      {
        id: 'irrigation-water',
        name: 'Irrigation & Water Supply',
        productTypes: types(
          'Hoses',
          'Sprinklers',
          'Filters',
          'Pumps',
          'Water Tanks',
        ),
      },
      {
        id: 'sealing-plumbing',
        name: 'Sealing',
        productTypes: types('PTFE Tapes', 'Sealants', 'PVC Adhesives'),
      },
    ],
  },
  {
    id: 'electrical-lighting',
    name: 'Electrical & Technical Lighting',
    subcategories: [
      {
        id: 'cables-wiring',
        name: 'Cables & Wiring',
        productTypes: types(
          'Single-Core Cable',
          'Multi-Core Cable',
          'Rigid Cable',
          'Flexible Cable',
          'Data Cable',
          'Corrugated Conduit',
        ),
      },
      {
        id: 'panels-protection',
        name: 'Panels & Protection',
        productTypes: types(
          'Electrical Panels',
          'Circuit Breakers',
          'Fuses',
          'Contactors',
          'DIN Rails',
        ),
      },
      {
        id: 'sockets-switches',
        name: 'Sockets & Switches',
        productTypes: types(
          'Sockets',
          'Switches',
          'Faceplates',
          'Industrial Sockets',
        ),
      },
      {
        id: 'technical-lighting',
        name: 'Technical Lighting',
        productTypes: types(
          'LED Floodlights',
          'LED Panels',
          'Linear LED Lights',
          'Emergency Lighting',
        ),
      },
      {
        id: 'electrical-accessories',
        name: 'Accessories',
        productTypes: types(
          'Cable Trays',
          'Fixings',
          'Insulation Tapes',
          'Terminal Blocks',
        ),
      },
      {
        id: 'instruments',
        name: 'Instruments',
        productTypes: types('Multimeters', 'Testers', 'Insulated Pliers'),
      },
    ],
  },
  {
    id: 'tools-equipment',
    name: 'Tools & Equipment',
    subcategories: [
      {
        id: 'hand-tools',
        name: 'Hand Tools',
        productTypes: types(
          'Hammers',
          'Wrenches',
          'Pliers',
          'Saws',
          'Putty Knives',
          'Measuring Tapes',
        ),
      },
      {
        id: 'power-tools',
        name: 'Power Tools',
        productTypes: types(
          'Drill',
          'Rotary Hammer',
          'Circular Saw',
          'Angle Grinder',
          'Sander',
          'Mixer',
        ),
      },
      {
        id: 'measuring-tools',
        name: 'Measuring Tools',
        productTypes: types('Levels', 'Laser Levels', 'Plumb Bobs'),
      },
      {
        id: 'plumbing-electrical-tools',
        name: 'Plumbing & Electrical Tools',
        productTypes: types(
          'Pipe Cutters',
          'Crimping Pliers',
          'Cable Pullers',
        ),
      },
      {
        id: 'consumables',
        name: 'Consumables',
        productTypes: types(
          'Cutting Discs',
          'Drill Bits',
          'Sandpapers',
          'Wall Plugs',
        ),
      },
      {
        id: 'construction-equipment',
        name: 'Construction Equipment',
        productTypes: types(
          'Concrete Mixers',
          'Scaffolding',
          'Generators',
          'Air Compressors',
        ),
      },
      {
        id: 'storage-protection',
        name: 'Storage & Protection',
        productTypes: types(
          'Tool Boxes',
          'Workbenches',
          'PPE (Personal Protective Equipment)',
        ),
      },
    ],
  },
  {
    id: 'paints-sealants',
    name: 'Paints & Sealants',
    subcategories: [
      {
        id: 'paints',
        name: 'Paints',
        productTypes: types(
          'Interior Paint',
          'Exterior Paint',
          'Acrylic Paint',
          'Facade Paint',
          'Epoxy Paint',
          'Anti-Rust Paint',
          'Swimming Pool Paint',
        ),
      },
      {
        id: 'primers',
        name: 'Primers',
        productTypes: types(
          'Acrylic Primer',
          'Bonding Primer',
          'Anti-Rust Primer',
        ),
      },
      {
        id: 'varnishes',
        name: 'Varnishes',
        productTypes: types(
          'Gloss Varnish',
          'Matte Varnish',
          'Exterior Varnish',
        ),
      },
      {
        id: 'sealants',
        name: 'Sealants',
        productTypes: types(
          'Silicone Sealant',
          'Polyurethane Sealant',
          'PU Foam',
        ),
      },
      {
        id: 'compounds',
        name: 'Compounds',
        productTypes: types('Wall Filler', 'Putty', 'Levelling Compound'),
      },
      {
        id: 'paint-tools',
        name: 'Tools',
        productTypes: types(
          'Rollers',
          'Paint Brushes',
          'Sandpapers',
          'Masking Tapes',
        ),
      },
    ],
  },
  {
    id: 'doors-windows-frames',
    name: 'Doors, Windows & Frames',
    subcategories: [
      {
        id: 'doors',
        name: 'Doors',
        productTypes: types(
          'Interior Door',
          'Exterior Door',
          'Security Door',
          'Aluminum / PVC Door',
          'Glass Door',
          'Technical Door',
        ),
      },
      {
        id: 'windows',
        name: 'Windows',
        productTypes: types(
          'Aluminum Window',
          'PVC Window',
          'Wooden Window',
          'Tilt-and-Turn Window',
          'Sliding Window',
        ),
      },
      {
        id: 'frames',
        name: 'Frames',
        productTypes: types(
          'Profiles',
          'Thermal Break Systems',
          'Guides',
        ),
      },
      {
        id: 'glass',
        name: 'Glass',
        productTypes: types(
          'Single Glass',
          'Double Glazing',
          'Laminated Glass',
          'Tempered Glass',
          'Polycarbonate',
        ),
      },
      {
        id: 'hardware',
        name: 'Hardware',
        productTypes: types('Locks', 'Handles', 'Hinges'),
      },
      {
        id: 'sealing-doors',
        name: 'Sealing',
        productTypes: types('Foams', 'Silicones', 'Thresholds'),
      },
    ],
  },
  {
    id: 'bathroom-kitchen',
    name: 'Bathroom & Kitchen',
    subcategories: [
      {
        id: 'sanitary-ware',
        name: 'Sanitary Ware',
        productTypes: types(
          'Toilets',
          'Cisterns',
          'Bidets',
          'Wash Basins',
          'Bathroom Furniture',
        ),
      },
      {
        id: 'shower',
        name: 'Shower',
        productTypes: types(
          'Shower Trays',
          'Shower Cabins',
          'Shower Screens',
          'Drains',
        ),
      },
      {
        id: 'faucets',
        name: 'Faucets',
        productTypes: types(
          'Basin Faucet',
          'Shower Faucet',
          'Bathtub Faucet',
          'Kitchen Faucet',
        ),
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        productTypes: types('Kitchen Sinks', 'Sink Bowls', 'Valves'),
      },
      {
        id: 'bathroom-accessories',
        name: 'Accessories',
        productTypes: types('Towel Holders', 'Mirrors', 'Cabinets'),
      },
      {
        id: 'complements',
        name: 'Complements',
        productTypes: types('Coverings', 'Sealants', 'Lighting'),
      },
    ],
  },
  {
    id: 'renovation-rehabilitation',
    name: 'Renovation & Rehabilitation',
    subcategories: [
      {
        id: 'structural-repair',
        name: 'Structural Repair',
        productTypes: types(
          'Repair Mortars',
          'Resins',
          'Injection Systems',
          'Fibers',
          'Anti-Corrosion Treatments',
        ),
      },
      {
        id: 'surface-treatment',
        name: 'Surface Treatment',
        productTypes: types(
          'Cleaning Products',
          'Paint Strippers',
          'Neutralizers',
        ),
      },
      {
        id: 'waterproofing-reno',
        name: 'Waterproofing',
        productTypes: types(
          'Membranes',
          'Injection Systems',
          'Protective Coatings',
        ),
      },
      {
        id: 'insulation-reno',
        name: 'Insulation',
        productTypes: types('ETICS Systems', 'Cork', 'EPS / XPS'),
      },
      {
        id: 'facades',
        name: 'Facades',
        productTypes: types(
          'Technical Plasters',
          'Mineral Paints',
          'Reinforcement Meshes',
        ),
      },
      {
        id: 'interiors',
        name: 'Interiors',
        productTypes: types(
          'Crack Repair Products',
          'Primers',
          'Special Coatings',
        ),
      },
      {
        id: 'protection',
        name: 'Protection',
        productTypes: types(
          'Water Repellents',
          'Anti-Fungal Treatments',
          'Technical Varnishes',
        ),
      },
    ],
  },
]

// Auto-assign imageSrc for all product types across categories
PRODUCT_CATEGORIES.forEach((category) => {
  category.subcategories.forEach((sub) => {
    sub.productTypes.forEach((type) => {
      type.imageSrc = getProductTypeImage(type, sub.id, category.id)
    })
  })
})

export function getCategoryById(id) {
  return PRODUCT_CATEGORIES.find((category) => category.id === id) || null
}

export function getSubCategoryById(categoryId, subCategoryId) {
  const category = getCategoryById(categoryId)
  if (!category) return null
  return (
    category.subcategories.find((sub) => sub.id === subCategoryId) || null
  )
}

/** Select options: Category → SubCategory → Product Type (cascading). */
export function getCategorySelectOptions(
  placeholder = 'Select category',
) {
  return [
    { value: '', label: placeholder },
    ...PRODUCT_CATEGORIES.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ]
}

export function getSubCategorySelectOptions(
  categoryId,
  placeholder = 'Select sub category',
) {
  const category = getCategoryById(categoryId)
  return [
    { value: '', label: placeholder },
    ...(category?.subcategories ?? []).map((sub) => ({
      value: sub.id,
      label: sub.name,
    })),
  ]
}

export function getProductTypeSelectOptions(
  categoryId,
  subCategoryId,
  placeholder = 'Select product type',
) {
  const sub = getSubCategoryById(categoryId, subCategoryId)
  return [
    { value: '', label: placeholder },
    ...(sub?.productTypes ?? []).map((type) => ({
      value: type.id,
      label: type.name,
    })),
  ]
}
