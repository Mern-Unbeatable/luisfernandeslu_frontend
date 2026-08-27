import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiDollarSign } from 'react-icons/fi'
import StatusCard from '../../../../components/data-display/StatusCard'
import WithdrawModal from '../components/WithdrawModal'

export default function StatsSection({
  stats,
  onWithdraw,
  isWithdrawing = false,
}) {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  const commissionPercent = stats?.adminCommissionPercent
  const commissionDesc =
    Number.isFinite(commissionPercent) && commissionPercent > 0
      ? t('transporterPaymentsPayouts.cards.adminCommissionDescDynamic', {
          percent: commissionPercent,
          defaultValue: `${commissionPercent}% per order`,
        })
      : t('transporterPaymentsPayouts.cards.adminCommissionDesc')

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatusCard
          variant="filled"
          label={t('transporterPaymentsPayouts.cards.totalEarnings')}
          value={stats?.totalEarnings || '—'}
          description={t('transporterPaymentsPayouts.cards.allTime')}
          icon={FiDollarSign}
        />
        <StatusCard
          variant="summary"
          label={t('transporterPaymentsPayouts.cards.adminCommission')}
          value={stats?.adminCommission || '—'}
          description={commissionDesc}
        />
        <StatusCard
          variant="summary"
          label={t('transporterPaymentsPayouts.cards.availableBalance')}
          value={stats?.availableBalance || '—'}
          description={
            <span
              onClick={() => setShowModal(true)}
              className="cursor-pointer font-semibold text-[var(--active)] hover:underline"
            >
              {t('transporterPaymentsPayouts.cards.requestPayout')} &rarr;
            </span>
          }
        />
        <StatusCard
          variant="summary"
          label={t('transporterPaymentsPayouts.cards.pendingEarnings')}
          value={stats?.pendingEarnings || '—'}
        />
        <StatusCard
          variant="summary"
          label={t('transporterPaymentsPayouts.cards.monthlyAverage')}
          value={stats?.monthlyAverage || '—'}
        />
      </div>

      <WithdrawModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isSubmitting={isWithdrawing}
        availableBalance={stats?.availableBalanceRaw}
        onSubmit={async (payload) => {
          const ok = await onWithdraw?.(payload)
          if (ok) setShowModal(false)
        }}
      />
    </>
  )
}
