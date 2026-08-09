import { useTranslation } from 'react-i18next'
import { ADMIN_PERFORMANCE } from '../data/dashboardDemo'

const cardShell =
  'w-full rounded-2xl border border-gray-200 bg-white p-5 sm:p-6'

function MetricBar({ label, value, barClassName }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-[var(--secondary-text)]">{label}</span>
        <span className="font-semibold text-[var(--primary-text)]">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${barClassName}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function LtvRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-gray-100 py-3 last:border-0">
      <span className="text-sm text-[var(--secondary-text)]">{label}</span>
      <span className="text-lg font-bold text-[var(--primary-text)]">{value}</span>
    </div>
  )
}

function SingleChannelLtv({ label, value }) {
  return (
    <div className="mt-4">
      <p className="text-sm text-[var(--secondary-text)]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[var(--primary-text)]">{value}</p>
    </div>
  )
}

export default function PerformanceSection({ channel = 'all' }) {
  const { t } = useTranslation()
  const { retention, ltv, repurchase } = ADMIN_PERFORMANCE

  const isSingleChannel = channel === 'b2b' || channel === 'b2c'
  const barTone =
    channel === 'b2b' ? 'bg-blue-500' : 'bg-emerald-500'

  if (isSingleChannel) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        <div className={cardShell}>
          <h3 className="text-base font-bold text-[var(--primary-text)]">
            {t('adminDashboard.performance.retentionTitle')}
          </h3>
          <div className="mt-5">
            <MetricBar
              label={t(`adminDashboard.performance.${channel}Retention`)}
              value={retention[channel]}
              barClassName={barTone}
            />
          </div>
        </div>

        <div className={cardShell}>
          <h3 className="text-base font-bold text-[var(--primary-text)]">
            {t('adminDashboard.performance.ltvTitle')}
          </h3>
          <SingleChannelLtv
            label={t(`adminDashboard.performance.${channel}Ltv`)}
            value={ltv[channel]}
          />
        </div>

        <div className={cardShell}>
          <h3 className="text-base font-bold text-[var(--primary-text)]">
            {t('adminDashboard.performance.repurchaseTitle')}
          </h3>
          <div className="mt-5">
            <MetricBar
              label={t(`adminDashboard.performance.${channel}Repurchase`)}
              value={repurchase[channel]}
              barClassName={barTone}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
      <div className={cardShell}>
        <h3 className="text-base font-bold text-[var(--primary-text)]">
          {t('adminDashboard.performance.retentionTitle')}
        </h3>
        <div className="mt-5 space-y-5">
          <MetricBar
            label={t('adminDashboard.performance.b2bRetention')}
            value={retention.b2b}
            barClassName="bg-blue-500"
          />
          <MetricBar
            label={t('adminDashboard.performance.b2cRetention')}
            value={retention.b2c}
            barClassName="bg-emerald-500"
          />
        </div>
      </div>

      <div className={cardShell}>
        <h3 className="text-base font-bold text-[var(--primary-text)]">
          {t('adminDashboard.performance.ltvTitle')}
        </h3>
        <div className="mt-3">
          <LtvRow
            label={t('adminDashboard.performance.b2bLtv')}
            value={ltv.b2b}
          />
          <LtvRow
            label={t('adminDashboard.performance.b2cLtv')}
            value={ltv.b2c}
          />
        </div>
      </div>

      <div className={cardShell}>
        <h3 className="text-base font-bold text-[var(--primary-text)]">
          {t('adminDashboard.performance.repurchaseTitle')}
        </h3>
        <div className="mt-5 space-y-5">
          <MetricBar
            label={t('adminDashboard.performance.b2bRepurchase')}
            value={repurchase.b2b}
            barClassName="bg-blue-500"
          />
          <MetricBar
            label={t('adminDashboard.performance.b2cRepurchase')}
            value={repurchase.b2c}
            barClassName="bg-emerald-500"
          />
        </div>
      </div>
    </div>
  )
}
