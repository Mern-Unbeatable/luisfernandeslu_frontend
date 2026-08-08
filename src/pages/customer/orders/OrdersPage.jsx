import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BuyerOrderCard from '@/components/data-display/BuyerOrderCard/BuyerOrderCard'
import CancelReasonModal from './components/CancelReasonModal'
import { CUSTOMER_ORDERS_DEMO } from './data/customerOrdersDemo'

function resolveDetailPath(order) {
  return order.detailRef ?? order.id
}

export default function OrdersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cancelOrder, setCancelOrder] = useState(null)

  const handleOrderAction = (actionId, order) => {
    if (actionId === 'track') {
      navigate(`/customer/orders/${resolveDetailPath(order)}`)
      return
    }
    if (actionId === 'cancel') {
      setCancelOrder(order)
      return
    }
    if (actionId === 'review') {
      navigate('/customer/product-to-review/portland-cement-50kg-grade-a')
    }
  }

  return (
    <div className="w-full">
      {CUSTOMER_ORDERS_DEMO.length === 0 ? (
        <p className="py-12 text-center text-sm text-[var(--secondary-text)]">
          {t('buyerOrders.empty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-4 sm:gap-5">
          {CUSTOMER_ORDERS_DEMO.map((order) => (
            <li key={order.id}>
              <BuyerOrderCard order={order} onAction={handleOrderAction} />
            </li>
          ))}
        </ul>
      )}

      <CancelReasonModal
        open={Boolean(cancelOrder)}
        order={cancelOrder}
        onClose={() => setCancelOrder(null)}
        onSubmit={() => setCancelOrder(null)}
      />
    </div>
  )
}
