import { useTranslation } from 'react-i18next'
import { FiAlertTriangle } from 'react-icons/fi'

const DOCUMENT_LABELS = {
  companyCertificateUrl: 'Company Certificate',
  commercialRegistrationUrl: 'Commercial Registration',
  nifDocumentUrl: 'NIF Document',
  idDocumentUrl: 'ID Proof',
  addressProofUrl: 'Address Proof',
  ibanProofUrl: 'IBAN Proof',
  insuranceDocumentUrl: 'Insurance Document',
  transporterInsuranceUrl: 'Transporter Insurance',
  factoryCertificateUrl: 'Factory Certificate',
}

function parseRejectionReason(rejectionReason) {
  if (!rejectionReason) return { reason: '', invalidDocuments: [] }

  const parts = rejectionReason.split(' | ')
  const reason = parts[0] || ''

  const invalidDocs = []
  if (parts[1]?.startsWith('Invalid documents:')) {
    const docsStr = parts[1].replace('Invalid documents:', '').trim()
    docsStr.split(',').forEach((doc) => {
      const trimmed = doc.trim()
      if (trimmed) invalidDocs.push(trimmed)
    })
  }

  return { reason, invalidDocuments: invalidDocs }
}

export default function RejectionBanner({ rejectionReason, onReSubmit }) {
  const { t } = useTranslation()

  if (!rejectionReason) return null

  const { reason, invalidDocuments } = parseRejectionReason(rejectionReason)

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100">
          <FiAlertTriangle className="size-4 text-red-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-red-800">
            {t('common.accountSuspended', 'Account Suspended')}
          </h3>
          {reason && (
            <p className="mt-1 text-sm text-red-700">
              {t('common.rejectionReason', 'Reason')}: {reason}
            </p>
          )}
          {invalidDocuments.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-red-800">
                {t('common.invalidDocuments', 'Invalid Documents')}:
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1">
                {invalidDocuments.map((doc) => (
                  <li key={doc} className="text-sm text-red-700">
                    {DOCUMENT_LABELS[doc] || doc}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-3 text-sm text-red-700">
            {t('common.resubmitNotice', 'Please correct the issues and re-submit your documents for review.')}
          </p>
          {onReSubmit && (
            <button
              type="button"
              onClick={() => onReSubmit(invalidDocuments)}
              className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              {t('common.resubmitDocuments', 'Re-submit Documents')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
