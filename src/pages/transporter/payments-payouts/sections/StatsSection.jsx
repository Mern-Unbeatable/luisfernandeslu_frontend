import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiDollarSign } from 'react-icons/fi'
import StatusCard from '../../../../components/data-display/StatusCard'
import WithdrawModal from '../components/WithdrawModal'

export default function StatsSection() {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatusCard
          variant="filled"
          label={t('transporterPaymentsPayouts.cards.totalEarnings')}
          value="€580K"
          description={t('transporterPaymentsPayouts.cards.allTime')}
          icon={FiDollarSign}
        />
        <StatusCard
          variant="summary"
          label={t('transporterPaymentsPayouts.cards.adminCommission')}
          value="20%"
          description={t('transporterPaymentsPayouts.cards.adminCommissionDesc')}
        />
        <StatusCard
          variant="summary"
          label={t('transporterPaymentsPayouts.cards.availableBalance')}
          value="€36,800"
          description={
            <span
              onClick={() => setShowModal(true)}
              className="text-[var(--active)] font-semibold cursor-pointer hover:underline"
            >
              {t('transporterPaymentsPayouts.cards.requestPayout')} &rarr;
            </span>
          }
        />
        <StatusCard
          variant="summary"
          label={t('transporterPaymentsPayouts.cards.pendingEarnings')}
          value="€26,500"
        />
        <StatusCard
          variant="summary"
          label={t('transporterPaymentsPayouts.cards.monthlyAverage')}
          value="€97K"
        />
      </div>

      {/* Withdraw Funds Modal */}
      <WithdrawModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => setShowModal(false)}
      />
    </>
  )
}
