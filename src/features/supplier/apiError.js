export function getApiErrorMessage(error, fallback = 'Request failed') {
  const data = error?.data

  if (typeof data === 'string' && data.trim()) return data
  if (data?.message) return data.message
  if (typeof data?.error === 'string') return data.error
  if (typeof error === 'string' && error.trim()) return error

  return fallback
}

export function pickList(payload, keys) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  for (const key of keys) {
    if (Array.isArray(payload[key])) return payload[key]
  }

  if (Array.isArray(payload.data)) return payload.data
  if (payload.data && typeof payload.data === 'object') {
    for (const key of keys) {
      if (Array.isArray(payload.data[key])) return payload.data[key]
    }
  }

  return []
}

export function pickTotal(payload, fallbackLength = 0) {
  const root = payload?.pagination ?? payload?.meta ?? payload ?? {}
  const value =
    root.total ??
    root.totalItems ??
    root.count ??
    payload?.total ??
    payload?.totalItems ??
    payload?.count

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallbackLength
}

export function pickPage(payload, fallback = 1) {
  const root = payload?.pagination ?? payload?.meta ?? payload ?? {}
  const value = root.page ?? payload?.page
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function toSelectOptions(items = []) {
  return items
    .map((item) => {
      const value = item?.id ?? item?.value ?? ''
      const label =
        item?.name ||
        item?.namePt ||
        item?.title ||
        item?.label ||
        item?.sku ||
        String(value)
      if (!value) return null
      return { value: String(value), label: String(label) }
    })
    .filter(Boolean)
}

export function parseNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const cleaned = String(value ?? '')
    .replace(/[€$£,\s]/g, '')
    .replace(/%/g, '')
    .trim()
  if (!cleaned) return null
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

export function formatEuro(value) {
  const amount = parseNumber(value)
  if (amount == null) return value ? String(value) : '—'
  return `€${amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

export function splitLines(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  return String(value ?? '')
    .split(/\r?\n|•/g)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function firstFile(value) {
  if (!value) return null
  if (value instanceof File) return value
  if (Array.isArray(value)) {
    return value.find((item) => item instanceof File) || null
  }
  return null
}

export function fileList(value) {
  if (!value) return []
  if (value instanceof File) return [value]
  if (Array.isArray(value)) return value.filter((item) => item instanceof File)
  return []
}

export function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
