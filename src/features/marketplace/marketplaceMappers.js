function formatEuro(amount) {
  if (amount == null || amount === '') return null
  const num = Number(amount)
  if (Number.isNaN(num)) return String(amount)
  return `€${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function isCompanyViewer(viewer) {
  return Boolean(
    viewer?.isCompany
    || viewer?.role === 'company'
    || viewer?.pricingView === 'company',
  )
}

function categoryLabel(product) {
  const parts = [
    product.category?.name,
    product.subCategory?.name,
    product.productType?.name,
  ].filter(Boolean)
  return parts.join(' › ') || null
}

function mapGalleryImages(product) {
  const fromGallery = (product.gallery ?? [])
    .map((item) => item?.url)
    .filter(Boolean)
  if (fromGallery.length) return fromGallery

  const banner = product.bannerImage?.url
  const extras = (product.images ?? []).map((item) => item?.url).filter(Boolean)
  return banner ? [banner, ...extras] : extras
}

function mapBulkPricing(product) {
  if (product.pricingTable?.length) {
    return product.pricingTable.map((row) => ({
      range: row.buy,
      price: row.price,
    }))
  }

  return (product.bulkOptions ?? []).map((tier) => ({
    range: tier.label,
    price: tier.priceLabel || formatEuro(tier.price),
  }))
}

function mapReviews(reviews = []) {
  return reviews.map((review) => ({
    id: review.id,
    author: review.author?.name || 'Customer',
    rating: review.rating,
    text: review.comment || '',
  }))
}

/** Marketplace PDP → ProductDetails props */
export function mapMarketplaceDetailProduct(product, viewer) {
  const isCompany = isCompanyViewer(viewer)
  const unit = product.unitOfMeasure || 'bag'
  const retailPrice = formatEuro(product.basePrice)
  const companyPrice =
    product.companyPrice || formatEuro(product.b2bPrice)
  const minQty = isCompany
    ? product.minB2bQuantity ?? null
    : product.minOrderQuantity ?? null

  const price = isCompany && companyPrice ? companyPrice : retailPrice
  const priceText = isCompany
    ? product.companyPriceText
      || (companyPrice ? `${companyPrice} Per ${unit}` : product.priceLabel)
    : product.priceLabel
      || (retailPrice ? `${retailPrice} Per ${unit}` : null)

  const descriptionParagraphs = [product.description, product.additionalInfo]
    .filter(Boolean)

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    title: product.title,
    category: categoryLabel(product),
    availability: product.availabilityLabel || product.availability || null,
    rating: Number(product.averageRating ?? 0),
    feedbackCount: Number(product.reviewCount ?? 0),
    price,
    priceText,
    unit,
    minOrder: isCompany
      ? product.minOrderLabel || product.minOrder || null
      : null,
    images: mapGalleryImages(product),
    bulkPricing: mapBulkPricing(product),
    description: product.description || null,
    descriptionParagraphs,
    additionalParagraphs: product.additionalInfo
      ? [product.additionalInfo]
      : [],
    specificationParagraphs: product.specifications
      ? [product.specifications]
      : [],
    features: product.features ?? [],
    reviews: mapReviews(product.reviews),
    seller: {
      name: product.seller?.name || product.store?.name || 'Store',
      rating: Number(product.seller?.rating ?? product.store?.rating ?? 0),
      reviewCount: Number(
        product.seller?.reviewCount ?? product.store?.reviewCount ?? 0,
      ),
    },
    isSponsored: Boolean(product.isSponsored),
    isFeatured: Boolean(product.isFeatured),
    pricingView: product.pricingView || (isCompany ? 'company' : 'retail'),
    actions: product.actions ?? null,
    defaultQuantity:
      isCompany && minQty != null && Number(minQty) > 0
        ? Number(minQty)
        : 1,
  }
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
