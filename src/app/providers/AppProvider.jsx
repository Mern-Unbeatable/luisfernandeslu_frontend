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
          },
        }}
      />
    </Provider>
  )
}

export default AppProvider
