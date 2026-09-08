import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FiAlertTriangle } from 'react-icons/fi'

export default function AccountSuspendedPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100">
          <FiAlertTriangle className="size-8 text-red-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          {t('accountSuspended.title', 'Account Suspended')}
        </h1>
        <p className="mt-4 text-gray-600">
          {t(
            'accountSuspended.message',
            'Your account has been suspended. Please contact support for more information.',
          )}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          {t(
            'accountSuspended.contactSupport',
            'You can contact our support team to resolve this issue.',
          )}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            {t('common.logout', 'Logout')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t('common.goHome', 'Go to Homepage')}
          </button>
        </div>
      </div>
    </div>
  )
}
