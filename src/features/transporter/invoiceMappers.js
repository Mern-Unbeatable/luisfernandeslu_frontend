function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString()
}

function formatMoney(amount) {
  if (amount == null || amount === '') return '—'
  if (typeof amount === 'string' && amount.trim().startsWith('€')) {
    return amount
  }
  const value = Number(amount)
  if (!Number.isFinite(value)) return String(amount)
  return `€${value.toLocaleString('en-IE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/** Map list invoice row → table shape */
export function mapCommissionInvoice(invoice) {
  const id = invoice.id || invoice.invoiceId
  return {
    id,
    invoiceId: id,
    type: invoice.type || 'Invoice',
    orderId: invoice.orderId || '—',
    customer: invoice.customer || '—',
    amount: formatMoney(invoice.amount),
    date: formatDate(invoice.date),
    dateRaw: invoice.date,
    amountRaw: invoice.amount,
  }
}

/** Map invoice detail API → modal shape */
export function mapCommissionInvoiceDetails(invoice) {
  if (!invoice) return null
  const id = invoice.id || invoice.invoiceId
  return {
    id,
    invoiceId: id,
    type: invoice.type || 'Invoice',
    orderId: invoice.orderId || '—',
    customer: invoice.customer || '—',
    amount: formatMoney(invoice.amount),
    date: formatDate(invoice.date),
    orderTotal: formatMoney(invoice.orderTotal),
    commissionPercent:
      invoice.commissionPercent == null
        ? '—'
        : `${Number(invoice.commissionPercent)}%`,
    partyPayout: formatMoney(invoice.partyPayout),
  }
}

export function downloadBlobFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
