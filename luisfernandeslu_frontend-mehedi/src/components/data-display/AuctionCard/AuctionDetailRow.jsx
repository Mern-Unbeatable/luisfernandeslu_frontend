import {
  FiMapPin,
  FiUser,
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiClock,
  FiCalendar,
} from 'react-icons/fi'
import { MdOutlineStraighten } from 'react-icons/md'

const COLOR = {
  muted: 'text-gray-400',
  active: 'text-[var(--active)]',
  green: 'text-emerald-500',
  blue: 'text-sky-500',
}

/** Icon + label + value row used across auction card variants */
export default function AuctionDetailRow({
  icon: Icon = FiMapPin,
  iconColor = 'muted',
  label,
  value,
  className = '',
}) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <Icon
        className={`mt-0.5 size-5 shrink-0 ${COLOR[iconColor] || COLOR.muted}`}
        strokeWidth={1.75}
        aria-hidden
      />
      <div className="min-w-0">
        {label ? (
          <p className="text-xs text-[var(--secondary-text)]">{label}</p>
        ) : null}
        <p className="text-sm font-medium break-words text-[var(--primary-text)]">
          {value}
        </p>
      </div>
    </div>
  )
}

export const AuctionIcons = {
  MapPin: FiMapPin,
  User: FiUser,
  Package: FiPackage,
  Truck: FiTruck,
  Dollar: FiDollarSign,
  Clock: FiClock,
  Calendar: FiCalendar,
  Distance: MdOutlineStraighten,
}
