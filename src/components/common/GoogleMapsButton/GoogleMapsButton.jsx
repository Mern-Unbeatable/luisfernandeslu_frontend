import { FiMap } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { googleMapsDirectionsUrl } from '@/utils/googleMaps'

export default function GoogleMapsButton({
  origin,
  destination,
  waypoints,
  className = 'inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-[var(--active)] px-3 text-xs font-medium text-[var(--active)] hover:bg-amber-50',
}) {
  const { t } = useTranslation()
  const href = googleMapsDirectionsUrl({ origin, destination, waypoints })
  if (!href) return null

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <FiMap className="size-3.5 shrink-0" aria-hidden />
      {t('ui.openInGoogleMaps')}
    </a>
  )
}
