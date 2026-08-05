import { useState } from 'react'
import DisputeResolution from '../../../components/data-display/DisputeResolution'
import { DEMO_DISPUTE_DASHBOARD } from '@/data/demoData'

export default function DisputesPage() {
  const [dispute, setDispute] = useState(DEMO_DISPUTE_DASHBOARD)

  return (
    <DisputeResolution
      variant="dashboard"
      dispute={dispute}
      currentUserRole="admin"
      onStatusChange={(status) =>
        setDispute((prev) => ({ ...prev, status }))
      }
      onSendMessage={(text) => {
        setDispute((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: `local-${Date.now()}`,
              author: 'Support',
              roleLabel: 'Admin',
              role: 'admin',
              align: 'left',
              at: new Date().toLocaleString(),
              text,
            },
          ],
        }))
      }}
    />
  )
}
