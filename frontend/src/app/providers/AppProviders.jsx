import { Provider } from 'react-redux'
import { store } from '../../features/store'

export function AppProviders({ children }) {
  return <Provider store={store}>{children}</Provider>
}
