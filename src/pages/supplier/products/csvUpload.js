const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'

export const CSV_REQUIRED_COLUMNS = [
  'title',
  'warehouseLocation',
  'categoryId',
  'subCategoryId',
  'productTypeId',
  'quantity',
  'basePrice',
  'sku',
  'description',
]

export const CSV_OPTIONAL_COLUMNS = [
  'b2bDiscount',
  'minB2bQuantity',
  'weight',
  'feature',
  'additionalInformation',
  'specifications',
  'tag',
]

export const CSV_ALL_COLUMNS = [
  ...CSV_REQUIRED_COLUMNS,
  ...CSV_OPTIONAL_COLUMNS,
]

const DEMO_CSV_ROWS = [
  {
    title: 'Portland Cement Quick Set',
    warehouseLocation: 'wh-santa-ana',
    categoryId: 'cement-mortar-concrete',
    subCategoryId: 'cements',
    productTypeId: 'ordinary-portland-cement-cem-i',
    quantity: '800 Bags',
    basePrice: '120.00',
    sku: 'SKU-CEM-001',
    description:
      'Fast-setting cement for rapid construction work and durable structures.',
    b2bDiscount: '20%',
    minB2bQuantity: '10 pcs',
    weight: '900 kg',
    feature: 'High Strength & Durability',
    additionalInformation: 'Suitable for foundations, walls, and finishing.',
    specifications: 'CEM I 52.5R, 50 kg bags',
    tag: 'regular',
  },
  {
    title: 'Portland Cement Standard',
    warehouseLocation: 'wh-santa-ana',
    categoryId: 'cement-mortar-concrete',
    subCategoryId: 'cements',
    productTypeId: 'portland-composite-cement-cem-ii',
    quantity: '500 Bags',
    basePrice: '115.00',
    sku: 'SKU-CEM-002',
    description:
      'Reliable cement for everyday construction and masonry work.',
    b2bDiscount: '15%',
    minB2bQuantity: '20 pcs',
    weight: '850 kg',
    feature: 'Smooth Workability',
    additionalInformation: 'Consistent quality for residential projects.',
    specifications: 'CEM II, 50 kg bags',
    tag: 'bulk_order',
  },
  {
    title: 'White Decorative Cement',
    warehouseLocation: 'wh-santa-ana',
    categoryId: 'cement-mortar-concrete',
    subCategoryId: 'cements',
    productTypeId: 'white-decorative-cement',
    quantity: '200 Bags',
    basePrice: '145.00',
    sku: 'SKU-CEM-003',
    description:
      'Decorative white cement for architectural finishes and detailing.',
    b2bDiscount: '10%',
    minB2bQuantity: '8 pcs',
    weight: '700 kg',
    feature: 'Bright finish, low shrinkage',
    additionalInformation: 'Use for facades and interior decorative work.',
    specifications: 'White CEM I, 25 kg bags',
    tag: 'featured',
  },
]

function escapeCsv(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

export function buildDemoCsvContent() {
  const header = CSV_ALL_COLUMNS.join(',')
  const rows = DEMO_CSV_ROWS.map((row) =>
    CSV_ALL_COLUMNS.map((column) => escapeCsv(row[column])).join(','),
  )
  return [header, ...rows].join('\n')
}

export function downloadDemoCsv() {
  const blob = new Blob([buildDemoCsvContent()], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'supplier-products-demo.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function isCsvFile(file) {
  if (!file) return false
  const name = String(file.name || '').toLowerCase()
  const type = String(file.type || '').toLowerCase()
  return (
    name.endsWith('.csv') ||
    type === 'text/csv' ||
    type === 'application/vnd.ms-excel' ||
    type === 'application/csv'
  )
}

function parseCsvLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  cells.push(current.trim())
  return cells
}

export function parseCsvText(text) {
  const normalized = String(text || '')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()

  if (!normalized) {
    return { headers: [], rows: [] }
  }

  const lines = normalized.split('\n').filter((line) => line.trim())
  const headers = parseCsvLine(lines[0]).map((header) =>
    header.replace(/^\uFEFF/, '').trim(),
  )
  const rows = lines.slice(1).map((line) => {
    const cells = parseCsvLine(line)
    return headers.reduce((acc, header, index) => {
      acc[header] = cells[index] ?? ''
      return acc
    }, {})
  })

  return { headers, rows }
}

function normalizeHeader(header) {
  return String(header || '')
    .trim()
    .replace(/^\uFEFF/, '')
}

function findColumn(headers, name) {
  const target = name.toLowerCase()
  return headers.find(
    (header) => normalizeHeader(header).toLowerCase() === target,
  )
}

function parsePrice(value) {
  const cleaned = String(value || '')
    .replace(/\$/g, '')
    .replace(/,/g, '')
    .trim()
  if (!cleaned) return null
  const number = Number(cleaned)
  return Number.isFinite(number) ? number : null
}

export function validateCsv({ headers, rows }) {
  const errors = []
  const normalizedHeaders = headers.map(normalizeHeader)

  if (!normalizedHeaders.length) {
    errors.push({ type: 'empty', messageKey: 'emptyFile' })
    return { ok: false, errors, rows: [] }
  }

  const missing = CSV_REQUIRED_COLUMNS.filter(
    (column) => !findColumn(normalizedHeaders, column),
  )
  if (missing.length) {
    errors.push({
      type: 'missingColumns',
      messageKey: 'missingColumns',
      columns: missing,
    })
    return { ok: false, errors, rows: [] }
  }

  if (!rows.length) {
    errors.push({ type: 'noRows', messageKey: 'noRows' })
  }

  const validRows = []

  rows.forEach((row, index) => {
    const rowNumber = index + 2
    const mapped = {}

    CSV_ALL_COLUMNS.forEach((column) => {
      const header = findColumn(Object.keys(row), column)
      mapped[column] = header ? String(row[header] ?? '').trim() : ''
    })

    CSV_REQUIRED_COLUMNS.forEach((column) => {
      if (!mapped[column]) {
        errors.push({
          type: 'row',
          messageKey: 'rowMissingField',
          rowNumber,
          column,
        })
      }
    })

    if (mapped.basePrice && parsePrice(mapped.basePrice) == null) {
      errors.push({
        type: 'row',
        messageKey: 'rowInvalidPrice',
        rowNumber,
        column: 'basePrice',
      })
    }

    const tag = mapped.tag.toLowerCase()
    if (tag && !['regular', 'bulk_order', 'featured', 'pending'].includes(tag)) {
      errors.push({
        type: 'row',
        messageKey: 'rowInvalidTag',
        rowNumber,
        column: 'tag',
      })
    }

    validRows.push(mapped)
  })

  return {
    ok: errors.length === 0,
    errors,
    rows: validRows,
  }
}

export function csvRowsToCatalogItems(rows) {
  return rows.map((row, index) => {
    const tag = String(row.tag || '').toLowerCase()
    const isFeatured = tag === 'featured'
    const isBulk = tag === 'bulk_order'
    const isRegular = tag === 'regular'
    const price = parsePrice(row.basePrice)
    const priceLabel = price != null ? `$${price.toFixed(2)}` : row.basePrice

    return {
      id: `csv-${Date.now()}-${index + 1}`,
      tab: isFeatured
        ? 'featured'
        : isBulk
          ? 'bulk_order'
          : isRegular
            ? 'regular'
            : 'pending',
      categoryId: row.categoryId || 'cement-mortar-concrete',
      cardType: isFeatured ? 'featured' : 'dashboard',
      tag: isFeatured || isBulk || isRegular ? tag : null,
      status: isFeatured || isBulk || isRegular ? null : 'pending',
      badge: isFeatured
        ? { label: 'Featured', className: 'bg-sky-100 text-sky-700' }
        : null,
      product: {
        image: DEFAULT_PRODUCT_IMAGE,
        title: row.title,
        description: row.description,
        priceText: `Price: ${priceLabel}`,
      },
    }
  })
}
