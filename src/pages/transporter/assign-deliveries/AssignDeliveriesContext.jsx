import { createContext, useContext, useMemo, useState } from 'react'
import { INITIAL_ASSIGN_DELIVERIES } from './data/assignDeliveriesDemo'

const AssignDeliveriesContext = createContext(null)

export function AssignDeliveriesProvider({ children }) {
  const [deliveries, setDeliveries] = useState(INITIAL_ASSIGN_DELIVERIES)

  const updateDelivery = (id, patch) => {
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === id ? { ...delivery, ...patch } : delivery,
      ),
    )
  }

  const value = useMemo(
    () => ({ deliveries, setDeliveries, updateDelivery }),
    [deliveries],
  )

  return (
    <AssignDeliveriesContext.Provider value={value}>
      {children}
    </AssignDeliveriesContext.Provider>
  )
}

export function useAssignDeliveries() {
  const context = useContext(AssignDeliveriesContext)
  if (!context) {
    throw new Error('useAssignDeliveries must be used within AssignDeliveriesProvider')
  }
  return context
}
