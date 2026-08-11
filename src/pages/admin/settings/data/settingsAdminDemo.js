export const ADMIN_SETTINGS_DEFAULTS = {
  shipping: {
    perKmCharge: '100',
    perKmChargeDisplay: '€100 / KM',
  },
  shippingCalculator: {
    distanceKm: '25',
    ratePerKm: '18',
  },
  vat: {
    defaultRate: '25',
  },
  vatCalculator: {
    productPrice: '1000.00',
    previewRate: 23,
  },
  auction: {
    hours: '00',
    minutes: '30',
  },
}

export function parseMoneyInput(value) {
  const cleaned = String(value ?? '')
    .replace(/[^0-9.-]/g, '')
    .trim()
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : 0
}

export function formatUsd(amount) {
  return `€${amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}
