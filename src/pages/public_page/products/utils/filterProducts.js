export function filterProducts(
  products,
  { minPrice, maxPrice, categoryIds, typeIds },
) {
  const hasCategoryFilter = categoryIds?.size > 0
  const hasTypeFilter = typeIds?.size > 0

  return products.filter((product) => {
    if (product.priceValue < minPrice || product.priceValue > maxPrice) {
      return false
    }

    if (!hasCategoryFilter && !hasTypeFilter) return true

    if (hasTypeFilter && typeIds.has(product.typeId)) return true
    if (hasCategoryFilter && categoryIds.has(product.categoryId)) return true

    return false
  })
}
