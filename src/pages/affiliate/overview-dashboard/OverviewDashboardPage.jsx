import {
  FiAward,
  FiCreditCard,
  FiDollarSign,
  FiTrendingUp,
  FiUser,
  FiUserPlus,
} from 'react-icons/fi'
import StatusCard from '@/components/data-display/StatusCard'

const PROGRESS_CURRENT = 12
const PROGRESS_TARGET = 100
const PROGRESS_PERCENT = Math.round((PROGRESS_CURRENT / PROGRESS_TARGET) * 100)
const CLIENTS_NEEDED = PROGRESS_TARGET - PROGRESS_CURRENT

export default function OverviewDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          Affiliate Earnings Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          Monitor performance and maximize earnings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatusCard
          variant="inline"
          label="Total Referred Client"
          value="13"
          icon={FiUser}
          iconTone="purple"
        />
        <StatusCard
          variant="inline"
          label="Active Client"
          value="12"
          icon={FiUserPlus}
          iconTone="teal"
        />
        <StatusCard
          variant="inline"
          label="Pending Commissions"
          value="$1010.00"
          icon={FiDollarSign}
          iconTone="brand"
        />
        <StatusCard
          variant="inline"
          label="Paid Commission"
          value="$355.00"
          icon={FiCreditCard}
          iconTone="gray"
        />
        <StatusCard
          variant="inline"
          label="Total Earnings"
          value="$1365.00"
          icon={FiTrendingUp}
          iconTone="purple"
        />
      </div>

      {/* Active Tier Status — design image 2 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[var(--active)]">
              <FiAward className="size-5" strokeWidth={1.75} aria-hidden />
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium tracking-wide text-[var(--secondary-text)] uppercase">
                  Active Tier Status
                </p>
                <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-[var(--primary-text)]">
                  Starter Level
                </span>
              </div>
              <p className="mt-2 text-xl font-bold text-[var(--primary-text)] sm:text-2xl">
                You receive a 5% commission rate!
              </p>
              <p className="mt-1 text-sm text-[var(--secondary-text)]">
                Keep inviting customers to unlock higher tiers with even higher
                commission rates.
              </p>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-4 lg:max-w-md">
            <div className="flex items-center justify-between gap-3 text-sm text-[var(--secondary-text)]">
              <span>Progress to Bronze Level (10%)</span>
              <span>
                {PROGRESS_CURRENT}/{PROGRESS_TARGET} Clients
              </span>
            </div>

            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[var(--primary-text)]"
                style={{ width: `${PROGRESS_PERCENT}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-[var(--secondary-text)] italic">
              You need {CLIENTS_NEEDED} more active clients to reach Bronze
              Level.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
