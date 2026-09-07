import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiX } from 'react-icons/fi'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import {
  useGetAdminFactoryByIdQuery,
  useRejectAdminFactoryMutation,
} from '@/features/admin/adminFactoryApi'
import { getAuthErrorMessage } from '@/features/auth/authUtils'

const I18N_KEY = 'adminFactoryManagement'

export default function FactoryRejectModal({ open, factoryId, onClose, onRejected }) {
  const { t } = useTranslation()
  const [reason, setReason] = useState('')
  const [invalidDocuments, setInvalidDocuments] = useState([])

  const { data, isLoading } = useGetAdminFactoryByIdQuery(factoryId, {
    skip: !open || !factoryId,
  })

  const [rejectFactory, { isLoading: isSubmitting }] = useRejectAdminFactoryMutation()

  const factory = data?.factory
  const documents = factory?.documents ?? []

  useEffect(() => {
    if (!open) {
      setReason('')
      setInvalidDocuments([])
    }
  }, [open, factoryId])

  if (!open || !factoryId) return null

  const toggleDocument = (key) => {
    setInvalidDocuments((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedReason = reason.trim()
    if (!trimmedReason) {
      toast.error(t(`${I18N_KEY}.rejectModal.reasonRequired`))
      return
    }
    if (invalidDocuments.length === 0) {
      toast.error(t(`${I18N_KEY}.rejectModal.documentsRequired`))
      return
    }

    try {
      const result = await rejectFactory({
        factoryId,
        reason: trimmedReason,
        invalidDocuments,
      }).unwrap()

      if (result?.success === false) {
        toast.error(getAuthErrorMessage(result, t(`${I18N_KEY}.actionFailed`)))
        return
      }

      toast.success(result?.message || t(`${I18N_KEY}.rejectSuccess`))
      onRejected?.()
      onClose()
    } catch (err) {
      toast.error(getAuthErrorMessage(err, t(`${I18N_KEY}.actionFailed`)))
    }
  }

  const titleId = `${I18N_KEY}-reject-title`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label={t(`${I18N_KEY}.rejectModal.cancel`)}
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-md p-1 text-[var(--secondary-text)] hover:bg-gray-100"
          aria-label={t(`${I18N_KEY}.rejectModal.cancel`)}
        >
          <FiX className="size-5" />
        </button>

        <h2 id={titleId} className="pr-8 text-lg font-bold text-[var(--primary-text)]">
          {t(`${I18N_KEY}.rejectModal.title`, { name: factory?.name || '—' })}
        </h2>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          {t(`${I18N_KEY}.rejectModal.subtitle`)}
        </p>

        {isLoading ? (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ) : (
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor={`${titleId}-reason`}
                className="text-sm font-semibold text-[var(--primary-text)]"
              >
                {t(`${I18N_KEY}.rejectModal.reasonLabel`)}
              </label>
              <textarea
                id={`${titleId}-reason`}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
                placeholder={t(`${I18N_KEY}.rejectModal.reasonPlaceholder`)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[var(--primary-text)] outline-none focus:border-[var(--active)]"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--primary-text)]">
                {t(`${I18N_KEY}.rejectModal.documentsLabel`)}
              </p>
              {documents.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {documents.map((doc) => (
                    <li key={doc.key}>
                      <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-[var(--primary-text)] hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={invalidDocuments.includes(doc.key)}
                          onChange={() => toggleDocument(doc.key)}
                          className="mt-0.5 size-4 accent-[var(--active)]"
                        />
                        <span>{doc.label || doc.key}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-[var(--secondary-text)]">
                  {t(`${I18N_KEY}.modal.noDocuments`)}
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-[var(--primary-text)] hover:bg-gray-50"
              >
                {t(`${I18N_KEY}.rejectModal.cancel`)}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t(`${I18N_KEY}.rejectModal.submit`)}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
