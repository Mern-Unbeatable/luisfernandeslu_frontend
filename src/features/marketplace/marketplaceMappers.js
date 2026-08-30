function formatEuro(amount) {
  if (amount == null || amount === '') return null
  const num = Number(amount)
  if (Number.isNaN(num)) return String(amount)
  return `€${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

/** Map marketplace sponsored list item → ProductCard props */
export function mapSponsoredProduct(product) {
  const unit = product.unit || ''
  const priceText = formatEuro(product.price)
  const companyPriceText =
    product.b2bPrice != null ? formatEuro(product.b2bPrice) : null

  return {
    id: product.id,
    slug: product.slug,
    image: product.image,
    title: product.title,
    description: product.description,
    price: priceText ?? '—',
    unit,
    minOrder: product.minOrder ?? null,
    company: product.company || '—',
    rating:
      product.rating != null && Number(product.rating) > 0
        ? Number(product.rating)
        : null,
    companyPrice: companyPriceText,
    companyPriceText: companyPriceText
      ? `Company: ${companyPriceText}${unit ? ` /${unit}` : ''}`
      : undefined,
    bulkOptionLabel: product.hasBulkOption ? 'Bulk options available' : undefined,
  }
}
