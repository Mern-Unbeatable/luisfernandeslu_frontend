import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { patchAuthUser } from '@/features/auth/authSlice'
import { useResubmitSupplierDocumentsMutation } from '@/features/supplier/profile/profileApi'
import { useResubmitFactoryDocumentsMutation } from '@/features/factory-profile/factoryProfileApi'
import { useResubmitTransporterDocumentsMutation } from '@/features/transporter-profile/transporterProfileApi'

/** Submits verification documents for the given role and marks the account as pending review. */
export default function useSubmitVerificationDocuments(role = 'supplier') {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [resubmitSupplier, supplierState] = useResubmitSupplierDocumentsMutation()
  const [resubmitFactory, factoryState] = useResubmitFactoryDocumentsMutation()
  const [resubmitTransporter, transporterState] =
    useResubmitTransporterDocumentsMutation()

  const resubmit =
    role === 'factory'
      ? resubmitFactory
      : role === 'transporter'
        ? resubmitTransporter
        : resubmitSupplier
  const isLoading =
    role === 'factory'
      ? factoryState.isLoading
      : role === 'transporter'
        ? transporterState.isLoading
        : supplierState.isLoading

  const submit = async (formData) => {
    const result = await resubmit(formData).unwrap()
    dispatch(
      patchAuthUser({
        profile: {
          verificationStatus:
            result?.verificationStatus || result?.data?.verificationStatus || 'PENDING_REVIEW',
          rejectionReason: null,
        },
      }),
    )
    toast.success(
      result?.message ||
        result?.data?.message ||
        t('accountLock.submitSuccess', 'Documents submitted for review'),
    )
    return result
  }

  return { submit, isLoading }
}
