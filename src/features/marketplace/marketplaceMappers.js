function formatEuro(amount) {
  if (amount == null || amount === '') return null
  const num = Number(amount)
  if (Number.isNaN(num)) return String(amount)
  return `€${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

/** Shared marketplace list → ProductCard / ProductListingCard props */
export function mapMarketplaceCatalogProduct(product) {
  const unit = product.unit || ''
  const priceText = formatEuro(product.price)
  const companyPriceText =
    product.b2bPrice != null ? formatEuro(product.b2bPrice) : null
  const minOrder =
    product.minOrder != null && Number(product.minOrder) > 0
      ? Number(product.minOrder)
      : null

  return {
    id: product.id,
    slug: product.slug,
    image: product.image,
    title: product.title,
    description: product.description,
    price: priceText ?? '—',
    priceText: priceText
      ? `Price: ${priceText}${unit ? ` per ${unit}` : ''}`
      : '—',
    unit,
    minOrder,
    minOrderLabel: minOrder != null ? `Min: ${minOrder}` : undefined,
    company: product.company || '—',
    rating:
      product.rating != null && Number(product.rating) > 0
        ? Number(product.rating)
        : null,
    companyPrice: companyPriceText,
    companyPriceText: companyPriceText
      ? `Company: ${companyPriceText}${unit ? ` /${unit}` : ''}`
      : undefined,
    bulkOptionLabel: product.hasBulkOption
      ? 'Bulk options available'
      : undefined,
    isSponsored: Boolean(product.isSponsored),
  }
}

/** @deprecated prefer mapMarketplaceCatalogProduct */
export function mapSponsoredProduct(product) {
  return mapMarketplaceCatalogProduct(product)
}
