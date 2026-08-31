import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

export default function useCartAction() {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleAddToCart = useCallback(() => {
    if (isAuthenticated) {
      navigate('/cart')
      return true
    }

    Swal.fire({
      title: 'Login Required',
      text: 'Please login to add items to your cart.',
      icon: 'info',
      showCloseButton: true,
      showCancelButton: false,
      showDenyButton: true,
      confirmButtonText: 'Login as Customer',
      denyButtonText: 'Login as Company',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-2xl pb-6',
        title: 'text-xl font-bold text-[var(--primary-text)]',
        htmlContainer: 'text-sm text-[var(--secondary-text)] mt-2 mb-6',
        actions: 'flex w-full justify-center gap-3 px-6',
        confirmButton: 'flex-1 whitespace-nowrap rounded-lg border-2 border-[var(--active)] bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--active)] transition-colors hover:bg-[color-mix(in_srgb,var(--active)_8%,transparent)]',
        denyButton: 'flex-1 whitespace-nowrap rounded-lg border-2 border-[var(--active)] bg-[var(--active)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90',
        closeButton: 'hover:text-[var(--active)] focus:shadow-none'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login/customer')
      } else if (result.isDenied) {
        navigate('/login/company')
      }
    })

    return false
  }, [isAuthenticated, navigate])

  return { handleAddToCart }
}
