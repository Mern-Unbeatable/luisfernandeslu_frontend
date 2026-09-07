import { createContext, useContext, useMemo, useState } from 'react'
import { useGetTransporterDeliveriesQuery } from '../../../features/transporter/transporterApi'
import { mapTransporterDelivery } from '../../../features/transporter/deliveryMappers'

const AssignDeliveriesContext = createContext(null)

export function AssignDeliveriesProvider({ children }) {
  const [localPatches, setLocalPatches] = useState({})
  const { data, isLoading, isError, error, refetch } =
    useGetTransporterDeliveriesQuery({
      page: 1,
      limit: 20,
      status: 'all',
    })

  const deliveries = useMemo(() => {
    const mapped = (data?.deliveries || []).map(mapTransporterDelivery)
    return mapped.map((delivery) => ({
      ...delivery,
      ...(localPatches[delivery.id] || {}),
    }))
  }, [data?.deliveries, localPatches])

  const updateDelivery = (id, patch) => {
    setLocalPatches((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        ...patch,
      },
    }))
  }

  const value = useMemo(
    () => ({
      deliveries,
      updateDelivery,
      isLoading,
      isError,
      error,
      refetch,
      pagination: data?.pagination || null,
      total: Number(data?.pagination?.total) || deliveries.length,
    }),
    [deliveries, isLoading, isError, error, refetch, data?.pagination],
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
    throw new Error(
      'useAssignDeliveries must be used within AssignDeliveriesProvider',
    )
  }
  return context
}
