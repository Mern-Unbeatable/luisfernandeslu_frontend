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
  onError,
}) {
  try {
    const blob = await downloadInvoice(orderId).unwrap()
    downloadBlobFile(blob, `${orderNumber || orderId}-invoice.pdf`)
    return true
  } catch (error) {
    onError?.(error)
    return false
  }
}
