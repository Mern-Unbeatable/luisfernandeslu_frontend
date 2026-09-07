import { formatEuro, parseNumber, pickList, pickPage, pickTotal } from '../apiError'

export function deriveInventoryStatus(stock) {
  const value = Number(stock)
  if (!Number.isFinite(value) || value <= 0) {
    return { status: 'out-of-stock', statusLabel: 'Out of stock' }
  }
  if (value <= 200) return { status: 'low', statusLabel: 'Low' }
  return { status: 'good', statusLabel: 'Good' }
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function mapInventoryProduct(item) {
  if (!item || typeof item !== 'object') return null

  const stock = Number(
    item.quantity ?? item.currentStock ?? item.stock ?? item.totalQuantity ?? 0,
  )
  const statusMeta = deriveInventoryStatus(stock)
  const rawStatus = String(item.status || item.stockStatus || '').toLowerCase()
  const status =
    rawStatus.includes('out')
      ? 'out-of-stock'
      : rawStatus === 'low'
        ? 'low'
        : rawStatus === 'good' || rawStatus === 'in_stock' || rawStatus === 'in-stock'
          ? 'good'
          : statusMeta.status

  const categoryName =
    item.category?.name ||
    item.category?.namePt ||
    item.categoryName ||
    (typeof item.category === 'string' ? item.category : '')

  return {
    id: item.id,
    inventoryNumber:
      item.inventoryNumber || item.inventoryNo || item.sku || item.id,
    category: categoryName,
    categoryId: item.categoryId || item.category?.id || '',
    subCategoryId: item.subCategoryId || item.subCategory?.id || '',
    productTypeId: item.productTypeId || item.productType?.id || '',
    productName: item.name || item.productName || item.title || '',
    sku: item.sku || '',
    currentStock: Number.isFinite(stock) ? stock : 0,
    price: formatEuro(item.price ?? item.unitPrice),
    rawPrice: parseNumber(item.price ?? item.unitPrice),
    factoryId: slugify(item.factoryName || item.factory?.name || item.factoryId),
    factoryName: item.factoryName || item.factory?.name || '',
    warehouseLocation: item.warehouseLocation || item.warehouse || '',
    status,
    statusLabel:
      status === 'out-of-stock'
        ? 'Out of stock'
        : status === 'low'
          ? 'Low'
          : 'Good',
    approved: item.approved !== false && rawStatus !== 'pending',
  }
}

export function mapInventoryList(payload, fallbackPage = 1) {
  const products = pickList(payload, ['products', 'items', 'inventory']).map(
    mapInventoryProduct,
  ).filter(Boolean)

  return {
    products,
    total: pickTotal(payload, products.length),
    page: pickPage(payload, fallbackPage),
  }
}

export function mapInventoryStats(payload) {
  const stats = payload?.stats || payload?.data || payload || {}

  const totalProducts = Number(stats.totalProducts ?? 0)
  const lowStockItems = Number(stats.lowStockItems ?? 0)
  const outOfStock = Number(stats.outOfStock ?? 0)
  const stockValue = stats.totalStockValue

  return {
    totalProducts: Number.isFinite(totalProducts) ? totalProducts : 0,
    totalStockValue:
      typeof stockValue === 'string' && stockValue.includes('€')
        ? stockValue
        : formatEuro(stockValue ?? 0),
    lowStockItems: Number.isFinite(lowStockItems) ? lowStockItems : 0,
    outOfStock: Number.isFinite(outOfStock) ? outOfStock : 0,
  }
}

export function buildInventoryCreateBody(payload, warehouseOptions = []) {
  const warehouse = warehouseOptions.find(
    (item) => item.value === payload.warehouseId,
  )

  return {
    warehouseLocation:
      payload.warehouseLocation || warehouse?.label || payload.warehouseId || '',
    categoryId: payload.categoryId,
    subCategoryId: payload.subCategoryId,
    productTypeId: payload.productTypeId,
    name: payload.productName,
    sku: payload.sku,
    quantity: parseNumber(payload.totalQuantity) ?? 0,
    price: parseNumber(payload.price) ?? 0,
    factoryName: payload.factoryName,
  }
}
