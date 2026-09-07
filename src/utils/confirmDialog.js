import Swal from 'sweetalert2'

/**
 * Styled confirmation dialog (SweetAlert2).
 * Use react-hot-toast for success/error toasts after the action completes.
 */
export async function confirmAction({
  title,
  text,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon = 'warning',
  confirmButtonColor = '#dc2626',
  cancelButtonColor = '#6b7280',
}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel: true,
  })

  return result.isConfirmed
}

export async function confirmDelete({
  title,
  text,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) {
  return confirmAction({
    title,
    text,
    confirmText,
    cancelText,
    icon: 'warning',
    confirmButtonColor: '#dc2626',
  })
}
