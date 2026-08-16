import { Outlet } from 'react-router-dom'
import { AssignDeliveriesProvider } from './AssignDeliveriesContext'

export default function AssignDeliveriesLayout() {
  return (
    <AssignDeliveriesProvider>
      <Outlet />
    </AssignDeliveriesProvider>
  )
}
