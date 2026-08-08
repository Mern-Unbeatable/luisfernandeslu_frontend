import { useState } from 'react'
import DisputeResolution from '../../components/data-display/DisputeResolution'
import { DEMO_DISPUTE_PUBLIC } from '@/data/demoData'

export default function DisputeResolutionPage() {
  const [dispute, setDispute] = useState(DEMO_DISPUTE_PUBLIC)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <DisputeResolution
        variant="public"
        dispute={dispute}
        currentUserRole="buyer"
        onSendMessage={(text) => {
          setDispute((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: `local-${Date.now()}`,
                author: 'You',
                roleLabel: 'Buyer',
                role: 'buyer',
                align: 'right',
                at: new Date().toLocaleString(),
                text,
              },
            ],
          }))
        }}
      />
    </div>
  )
}
