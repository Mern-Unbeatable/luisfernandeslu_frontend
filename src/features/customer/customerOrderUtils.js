export function downloadBlobFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function triggerCustomerOrderInvoiceDownload({
  orderId,
  orderNumber,
  downloadInvoice,
  fetchInvoice,
  onError,
}) {
  try {
    const blob = await downloadInvoice(orderId).unwrap()
    downloadBlobFile(blob, `${orderNumber || orderId}-invoice.pdf`)
    return true
  } catch {
    try {
      const result = await fetchInvoice(orderId).unwrap()
      const pdfUrl = result?.invoice?.pdfUrl
      if (pdfUrl) {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer')
        return true
      }
    } catch (fetchError) {
      onError?.(fetchError)
      return false
    }

    onError?.()
    return false
  }
}
