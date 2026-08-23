import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from '../store'

export function AppProvider({ children }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '14px',
            maxWidth: '420px',
          },
          success: {
            style: {
              background: '#ecfdf5',
              color: '#065f46',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
            },
          },
        }}
      />
    </Provider>
  )
}

export default AppProvider
