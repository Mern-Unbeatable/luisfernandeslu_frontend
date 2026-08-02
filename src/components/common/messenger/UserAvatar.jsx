import { getPartnerInitials } from './messageUtils'

export default function UserAvatar({
  partner,
  className = 'size-10',
  textClassName = 'text-sm',
  src,
}) {
  const image = src || partner?.avatar

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8EEF5] text-[var(--primary-text)] ${className}`}
    >
      {image ? (
        <img
          src={image}
          alt={partner?.name || 'User'}
          className="size-full object-cover"
        />
      ) : (
        <span className={`font-semibold ${textClassName}`}>
          {getPartnerInitials(partner)}
        </span>
      )}
    </div>
  )
}
