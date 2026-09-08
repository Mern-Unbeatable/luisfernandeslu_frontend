export const DOCUMENT_FIELD_META = {
  companyCertificateUrl: {
    label: 'Company Certificate',
    description: 'Official company registration certificate.',
  },
  factoryCertificateUrl: {
    label: 'Factory Certificate',
    description: 'Official factory registration certificate.',
    uploadKey: 'companyCertificateUrl',
  },
  commercialRegistrationUrl: {
    label: 'RCBE ( Commercial Registration )',
    description: 'Commercial registration document.',
  },
  nifDocumentUrl: {
    label: 'NIF Document',
    description: 'Tax identification document.',
  },
  idDocumentUrl: {
    label: 'ID Proof',
    description: 'Government-issued identification document.',
  },
  addressProofUrl: {
    label: 'Address Proof ( Issued within 3 months )',
    description: 'Proof of business address issued within 3 months.',
  },
  ibanProofUrl: {
    label: 'IBAN Proof',
    description: 'Bank document showing your IBAN.',
  },
  insuranceDocumentUrl: {
    label: 'Civil Liability Insurance',
    description: 'Covers damages to third parties during transportation operations.',
    insurance: true,
  },
  transporterInsuranceUrl: {
    label: 'Transporter Civil Liability Insurance',
    description: 'Covers damage or loss of cargo during transport.',
    insurance: true,
  },
}

export const ROLE_DEFAULT_DOCUMENTS = {
  supplier: [
    'companyCertificateUrl',
    'commercialRegistrationUrl',
    'idDocumentUrl',
    'addressProofUrl',
    'ibanProofUrl',
  ],
  factory: [
    'companyCertificateUrl',
    'commercialRegistrationUrl',
    'idDocumentUrl',
    'addressProofUrl',
    'ibanProofUrl',
  ],
  transporter: [
    'insuranceDocumentUrl',
    'transporterInsuranceUrl',
    'ibanProofUrl',
  ],
}

export function parseRejectionReason(rejectionReason) {
  if (!rejectionReason) return { reason: '', invalidDocuments: [] }

  const parts = rejectionReason.split(' | ')
  const reason = parts[0] || ''
  const invalidDocuments = []

  if (parts[1]?.startsWith('Invalid documents:')) {
    const docsStr = parts[1].replace('Invalid documents:', '').trim()
    docsStr.split(',').forEach((doc) => {
      const trimmed = doc.trim()
      if (trimmed) invalidDocuments.push(trimmed)
    })
  }

  return { reason, invalidDocuments }
}

export function resolveDocumentsToUpload(role, invalidDocuments = []) {
  const unique = [...new Set(invalidDocuments.filter(Boolean))]
  if (unique.length > 0) return unique
  return ROLE_DEFAULT_DOCUMENTS[role] || []
}

export function getDocumentLabel(key) {
  return DOCUMENT_FIELD_META[key]?.label || key
}

export function getUploadFieldName(key) {
  return DOCUMENT_FIELD_META[key]?.uploadKey || key
}
