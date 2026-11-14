function cleanPlace(value) {
  const text = String(value || '').trim()
  return text && text !== '—' ? text : ''
}

/**
 * Google Maps directions link (opens the app on mobile, the website on desktop).
 * Without an origin, Google Maps starts from the user's current location.
 */
export function googleMapsDirectionsUrl({ origin, destination, waypoints = [] } = {}) {
  const to = cleanPlace(destination)
  if (!to) return ''

  const params = new URLSearchParams({ api: '1', destination: to, travelmode: 'driving' })
  const from = cleanPlace(origin)
  if (from) params.set('origin', from)
  const stops = waypoints.map(cleanPlace).filter(Boolean)
  if (stops.length) params.set('waypoints', stops.join('|'))

  return `https://www.google.com/maps/dir/?${params.toString()}`
}
