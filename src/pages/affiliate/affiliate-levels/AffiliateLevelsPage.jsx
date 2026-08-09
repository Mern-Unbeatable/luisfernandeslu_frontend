import { useState } from 'react'
import { FiAward } from 'react-icons/fi'
import StatusCard from '@/components/data-display/StatusCard'

const ACTIVE_REFERRALS = 12
const BRONZE_TARGET = 100
const CLIENTS_NEEDED = BRONZE_TARGET - ACTIVE_REFERRALS
const PROGRESS_PERCENT = Math.round((ACTIVE_REFERRALS / BRONZE_TARGET) * 100)

const TIERS = [
  {
    id: 'starter',
    name: 'Starter Level',
    requirement: 'ENTRY LEVEL TIER',
    value: '5%',
    active: true,
  },
  {
    id: 'bronze',
    name: 'Bronze Level',
    requirement: '100+ Active Clients Required',
    value: '10%',
    active: false,
  },
  {
    id: 'silver',
    name: 'Silver Level',
    requirement: '200+ Active Clients Required',
    value: '15%',
    active: false,
  },
  {
    id: 'gold',
    name: 'Gold Level',
    requirement: '300+ Active Clients Required',
    value: '20%',
    active: false,
  },
  {
    id: 'premium',
    name: 'Premium Level',
    requirement: '500+ Active Clients Required',
    value: '25%',
    active: false,
  },
]

export default function AffiliateLevelsPage() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary-text)]">
          Affiliate Levels
        </h1>
        <p className="mt-1 text-sm text-[var(--secondary-text)]">
          Unlock new tiers and enjoy greater rewards as your referrals grow.
        </p>
      </div>

      {/* Top Affiliate Tier Status card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-xl">
            <p className="text-xs font-semibold tracking-wide text-[var(--active)] uppercase">
              Gamified Achievements
            </p>
            <h2 className="mt-2 text-xl font-bold text-[var(--primary-text)] sm:text-2xl">
              Affiliate Tier Status
            </h2>
            <p className="mt-2 text-sm text-[var(--secondary-text)]">
              As your referred client base grows, you automatically advance to
              higher tiers and unlock better commission splits!
            </p>
          </div>

          <div className="w-full shrink-0 rounded-xl bg-[#F8FAFC] border border-[#00000024] p-4 lg:max-w-md">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-[var(--primary-text)]">
                Active referrals:
              </span>
              <span className="font-semibold text-[var(--active)]">
                {ACTIVE_REFERRALS} clients
              </span>
            </div>

            <p className="mt-3 text-sm text-[var(--secondary-text)]">
              Progress to Bronze Level
            </p>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[var(--primary-text)]"
                style={{ width: `${PROGRESS_PERCENT}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-[var(--secondary-text)] italic">
              You need {CLIENTS_NEEDED} more clients to unlock the 10% commission
              spot!
            </p>
          </div>
        </div>
      </div>

      {/* Tier cards */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
        onMouseLeave={() => setHoveredId(null)}
      >
        {TIERS.map((tier) => {
          const highlighted = hoveredId
            ? hoveredId === tier.id
            : tier.active

          return (
            <div
              key={tier.id}
              onMouseEnter={() => setHoveredId(tier.id)}
              className={`relative rounded-2xl border p-3 pb-2 transition-colors ${
                highlighted
                  ? 'border-[var(--active)] bg-[#FFF8F0]'
                  : 'border-transparent bg-transparent'
              }`}
            >
              {highlighted ? (
                <span className="absolute top-4 right-4 z-10 inline-flex rounded-full bg-[var(--active)] px-2.5 py-0.5 text-xs font-semibold text-white">
                  Active
                </span>
              ) : null}

              <p className="pr-16 px-1 text-base font-bold text-[var(--primary-text)]">
                {tier.name}
              </p>
              <p className="mt-0.5 px-1 text-xs text-[var(--secondary-text)]">
                {tier.requirement}
              </p>

              <div className="mt-3">
                <StatusCard
                  label="Commission Split"
                  value={tier.value}
                  description="Recurring Lifetime payout split"
                  icon={FiAward}
                  iconTone="brand"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
