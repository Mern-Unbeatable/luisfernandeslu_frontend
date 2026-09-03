import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FiMapPin, FiLoader } from 'react-icons/fi'
import { useLazySuggestLocationsQuery } from '@/features/checkout/checkoutApi'
import { checkoutInputClass } from './checkoutFields'

export default function AddressAutocomplete({ 
  value, 
  onChange, 
  onLocationSelect, 
  placeholder,
  inputClassName = checkoutInputClass,
  disabled = false
}) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)
  const lastSelectedValue = useRef(null)
  const isTyping = useRef(false)

  const [trigger, { data, isFetching }] = useLazySuggestLocationsQuery()
  const locations = data?.locations || []

  // Debounced search on value
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isTyping.current) return
      
      if (value === lastSelectedValue.current) {
        setIsOpen(false)
        return
      }

      // Only trigger if we have at least 2 chars
      if (value && value.length >= 2) {
        trigger({ q: value })
        setIsOpen(true)
      } else if (!value || value.length < 2) {
        setIsOpen(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [value, trigger])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (loc) => {
    const fullAddress = loc.placeName || loc.text
    lastSelectedValue.current = fullAddress
    isTyping.current = false
    setIsOpen(false)
    
    // Call the parent handler with the selected location object
    if (onLocationSelect) {
      onLocationSelect({
        address: fullAddress,
        city: loc.place || '',
        region: loc.region || '',
        country: loc.country || '',
        zipCode: loc.postcode || '',
      })
    } else if (onChange) {
      onChange(fullAddress)
    }
  }

  const handleChange = (e) => {
    lastSelectedValue.current = null
    isTyping.current = true
    if (onChange) onChange(e.target.value)
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={value || ''}
          onChange={handleChange}
          onFocus={() => {
            if (locations.length > 0 && value !== lastSelectedValue.current) setIsOpen(true)
          }}
          placeholder={placeholder || t('checkoutPage.addressPlaceholder', 'Start typing an address...')}
          className={`${inputClassName} pr-10`}
          autoComplete="off"
          disabled={disabled}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--secondary-text)] pointer-events-none">
          {isFetching ? (
            <FiLoader className="size-4 animate-spin text-[var(--active)]" />
          ) : (
            <FiMapPin className="size-4" />
          )}
        </div>
      </div>

      {isOpen && locations.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg focus:outline-none sm:text-sm">
          {locations.map((loc) => (
            <li
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="relative cursor-pointer select-none py-2 px-3 text-[var(--primary-text)] hover:bg-gray-100 hover:text-[var(--active)]"
            >
              <div className="flex items-start gap-2">
                <FiMapPin className="mt-1 size-4 shrink-0 text-[var(--secondary-text)]" />
                <div className="flex flex-col">
                  <span className="block truncate font-medium">{loc.text}</span>
                  <span className="block truncate text-xs text-[var(--secondary-text)]">
                    {loc.placeName}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
