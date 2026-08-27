function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString()
}

function formatCoverage(amount) {
  if (amount == null || amount === '') return '—'
  const value = Number(amount)
  if (!Number.isFinite(value)) return String(amount)
  return `€${value.toLocaleString('en-IE')}`
}

export function mapInsurancePolicy(policy, t) {
  const type = String(policy.type || policy.insuranceType || 'civil').toLowerCase()
  const typeKey = type === 'cargo' ? 'cargo' : 'civil'
  const status = String(policy.status || '').toLowerCase()

  return {
    id: typeKey,
    type: typeKey,
    title: t(`transporterInsurance.types.${typeKey}.title`, {
      defaultValue: typeKey,
    }),
    status,
    isVerified: status === 'verified',
    isExpired: status === 'expired',
    provider: policy.provider || '—',
    policyNumber: policy.policyNumber || '—',
    coverageAmount: formatCoverage(policy.coverageAmount),
    coverageAmountRaw: Number(policy.coverageAmount) || 0,
    startDate: formatDate(policy.startDate),
    expiryDate: formatDate(policy.expiryDate),
    expiryDateRaw: policy.expiryDate,
    startDateRaw: policy.startDate,
    documentUrl: policy.documentUrl || '',
  }
}

export function mapInsuranceResponse(data, t) {
  return {
    requirementsMet: Boolean(data?.requirementsMet),
    policies: (data?.policies || []).map((policy) => mapInsurancePolicy(policy, t)),
  }
}

export function buildInsuranceUploadFormData({
  type,
  provider,
  policyNumber,
  coverageAmount,
  expiryDate,
  startDate,
  document,
}) {
  const formData = new FormData()
  formData.append('type', type)
  formData.append('provider', provider)
  formData.append('policyNumber', policyNumber)
  formData.append('coverageAmount', String(Number(coverageAmount)))
  formData.append('expiryDate', expiryDate)
  if (startDate) formData.append('startDate', startDate)
  if (document) formData.append('document', document)
  return formData
}

export function downloadBlobFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
