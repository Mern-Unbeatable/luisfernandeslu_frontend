/**
 * Real AI-Generated & Curated Photographic Images for Construction Catalog.
 * Maps product types, subcategories, and top categories to real generated product photo assets.
 */

const GENERATED_REAL_IMAGES = {
  // Cements
  'ordinary-portland-cement-cem-i': '/images/categories/cement_bag_real.png',
  'portland-composite-cement-cem-ii': '/images/categories/cement_bag_real.png',
  'high-early-strength-cement-cem-i-52-5r': '/images/categories/cement_bag_real.png',
  'pozzolanic-cement-cem-iv': '/images/categories/cement_bag_real.png',
  'blast-furnace-cement-cem-iii': '/images/categories/cement_bag_real.png',
  'white-decorative-cement': '/images/categories/cement_bag_real.png',
  'rapid-setting-fast-drying-cement': '/images/categories/cement_bag_real.png',
  'special-cement-for-underground-construction': '/images/categories/cement_bag_real.png',

  // Mortars
  'plastering-stucco-mortars': '/images/categories/mortar_trowel_real.png',
  'masonry-mortars': '/images/categories/mortar_trowel_real.png',
  'tile-adhesive-mortars': '/images/categories/mortar_trowel_real.png',
  'grouting-joint-mortars': '/images/categories/mortar_trowel_real.png',
  'repair-mortars': '/images/categories/mortar_trowel_real.png',
  'self-levelling-mortars': '/images/categories/mortar_trowel_real.png',
  'refractory-mortars': '/images/categories/mortar_trowel_real.png',
  'waterproofing-mortars': '/images/categories/mortar_trowel_real.png',

  // Concrete
  'ready-mix-pre-mixed-concrete': '/images/categories/concrete_truck_real.png',
  'reinforced-structural-concrete': '/images/categories/concrete_truck_real.png',
  'lightweight-concrete': '/images/categories/concrete_block_real.png',
  'self-compacting-concrete': '/images/categories/concrete_truck_real.png',
  'shotcrete-sprayed-concrete': '/images/categories/mortar_trowel_real.png',
  'refractory-concrete': '/images/categories/concrete_block_real.png',
  'fiber-reinforced-concrete': '/images/categories/concrete_truck_real.png',
  'decorative-colored-concrete': '/images/categories/red_bricks_real.png',
  'high-strength-concrete': '/images/categories/concrete_truck_real.png',
  'fast-drying-concrete': '/images/categories/concrete_truck_real.png',

  // Sand
  'fine-sand': '/images/categories/sand_heap_real.png',
  'medium-sand': '/images/categories/sand_heap_real.png',
  'coarse-sand': '/images/categories/sand_heap_real.png',
  'washed-sand': '/images/categories/sand_heap_real.png',
  'crushed-sand-artificial-sand': '/images/categories/sand_heap_real.png',

  // Gravel
  'stone-dust-gravel-0': '/images/categories/gravel_stones_real.png',
  'gravel-1-4-12-mm': '/images/categories/gravel_stones_real.png',
  'gravel-2-12-25-mm': '/images/categories/gravel_stones_real.png',
  'gravel-3-25-38-mm': '/images/categories/gravel_stones_real.png',
  'gravel-4-38-50-mm': '/images/categories/gravel_stones_real.png',
  'concrete-gravel': '/images/categories/gravel_stones_real.png',
  'drainage-gravel': '/images/categories/gravel_stones_real.png',

  // Blocks & Bricks
  'concrete-block': '/images/categories/concrete_block_real.png',
  'formwork-block': '/images/categories/concrete_block_real.png',
  'thermal-block': '/images/categories/concrete_block_real.png',
  'solid-brick': '/images/categories/red_bricks_real.png',
  'hollow-brick-8-11-15-20': '/images/categories/red_bricks_real.png',
  'thermal-brick': '/images/categories/red_bricks_real.png',
  'facing-brick': '/images/categories/red_bricks_real.png',

  // Drywall & Insulation
  'gypsum-plasterboard': '/images/categories/drywall_board_real.png',
  'rock-wool': '/images/categories/insulation_roll_real.png',
  'glass-wool': '/images/categories/insulation_roll_real.png',

  // Roofing
  'clay-roof-tiles': '/images/categories/roof_tiles_real.png',
  'concrete-tiles': '/images/categories/roof_tiles_real.png',
}

const SUBCATEGORY_REAL_FALLBACKS = {
  cements: '/images/categories/cement_bag_real.png',
  mortars: '/images/categories/mortar_trowel_real.png',
  concrete: '/images/categories/concrete_truck_real.png',
  sand: '/images/categories/sand_heap_real.png',
  gravel: '/images/categories/gravel_stones_real.png',
  aggregates: '/images/categories/gravel_stones_real.png',
  blocks: '/images/categories/concrete_block_real.png',
  bricks: '/images/categories/red_bricks_real.png',
  boards: '/images/categories/drywall_board_real.png',
  'insulation-dry': '/images/categories/insulation_roll_real.png',
  'roof-tiles': '/images/categories/roof_tiles_real.png',
}

const DEFAULT_REAL_IMAGE = '/images/categories/cement_bag_real.png'

/**
 * Resolves a real generated image asset path for any product type.
 */
export function getProductTypeImage(productType, subcategoryId, categoryId) {
  if (!productType) return DEFAULT_REAL_IMAGE

  if (productType.imageSrc) {
    return productType.imageSrc
  }

  const typeId = typeof productType === 'string' ? productType : productType.id

  if (typeId && GENERATED_REAL_IMAGES[typeId]) {
    return GENERATED_REAL_IMAGES[typeId]
  }

  if (subcategoryId && SUBCATEGORY_REAL_FALLBACKS[subcategoryId]) {
    return SUBCATEGORY_REAL_FALLBACKS[subcategoryId]
  }

  if (categoryId && SUBCATEGORY_REAL_FALLBACKS[categoryId]) {
    return SUBCATEGORY_REAL_FALLBACKS[categoryId]
  }

  return DEFAULT_REAL_IMAGE
}
