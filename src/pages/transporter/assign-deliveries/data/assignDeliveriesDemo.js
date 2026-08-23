export const INITIAL_ASSIGN_DELIVERIES = [
  {
    id: 'del-001',
    title: 'Premium Portland Cement',
    orderLabel: 'Auction ID: AUC-001',
    price: '€8,500',
    distance: '32 km',
    status: 'assigned',
    pickup: {
      title: 'Ambuja Cement Factory',
      subtitle: 'Plot 45, MIDC Kalyan, Maharashtra 421301',
    },
    delivery: {
      title: 'Metro Construction Pvt Ltd',
      subtitle: 'Site 12, Andheri West, Mumbai 400053',
    },
  },
  {
    id: 'del-002',
    title: 'TMT Steel Rods ( 12mm )',
    orderLabel: 'Auction ID: AUC-002',
    price: '€8,500',
    distance: '18 km',
    status: 'picked_up',
    pickup: {
      title: 'Tata Steel Depot',
      subtitle: 'Sector 11, Turbhe, Navi Mumbai 400705',
    },
    delivery: {
      title: 'Skyline Residency Project',
      subtitle: 'Plot 8, Sector 20, Kharghar, Navi Mumbai 410210',
    },
  },
  {
    id: 'del-003',
    title: 'Red Bricks',
    orderLabel: 'Auction ID: AUC-003',
    price: '€8,500',
    distance: '18 km',
    status: 'in_transit',
    pickup: {
      title: 'Brick Kiln Industries',
      subtitle: 'Vasai East, Palghar 401208',
    },
    delivery: {
      title: 'Villa Paradise Construction',
      subtitle: 'Mira Road, Thane 401107',
    },
  },
]

export function findAssignDelivery(id, deliveries = INITIAL_ASSIGN_DELIVERIES) {
  return deliveries.find((delivery) => delivery.id === id) ?? null
}
