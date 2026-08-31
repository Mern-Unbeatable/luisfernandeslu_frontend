import { PRODUCT_CATEGORIES } from '@/data/productCategories'

/** Resolve static catalog slugs for category / subcategory / product type. */
export function findCatalogTaxonomy({
  categorySlug,
  subSlug,
  typeSlug,
} = {}) {
  for (const category of PRODUCT_CATEGORIES) {
    if (categorySlug && category.id !== categorySlug) continue

    for (const subcategory of category.subcategories) {
      if (subSlug && subcategory.id !== subSlug) continue

      if (typeSlug) {
        const productType = subcategory.productTypes.find(
          (item) => item.id === typeSlug,
        )
        if (!productType) continue
        return {
          categorySlug: category.id,
          subSlug: subcategory.id,
          typeSlug: productType.id,
        }
      }

      if (subSlug) {
        return {
          categorySlug: category.id,
          subSlug: subcategory.id,
          typeSlug: null,
        }
      }
    }

    if (categorySlug && !subSlug && !typeSlug) {
      return {
        categorySlug: category.id,
        subSlug: null,
        typeSlug: null,
      }
    }
  }

  return null
}

export function findCategorySlugForSubcategory(subSlug) {
  if (!subSlug) return null
  for (const category of PRODUCT_CATEGORIES) {
    if (category.subcategories.some((sub) => sub.id === subSlug)) {
      return category.id
    }
  }
  return null
}

function pickList(response, keys) {
  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key]
  }
  return []
}

export function mapSlugToId(rows = []) {
  return Object.fromEntries(
    rows.map((row) => [row.slug, row.id]),
  )
}

export function pickSubcategories(response) {
  return pickList(response, ['subCategories', 'subcategories'])
}

export function pickProductTypes(response) {
  return pickList(response, ['productTypes', 'types'])
}
