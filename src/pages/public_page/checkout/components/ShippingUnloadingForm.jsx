import { useTranslation } from 'react-i18next'
import {
  ACCESS_CONDITION_OPTIONS,
  UNLOADING_TYPE_OPTIONS,
} from '../data/checkoutDemo'
import {
  CheckoutField,
  CheckoutSelect,
  CheckoutTextArea,
  CheckoutTextInput,
} from './checkoutFields'
import AddressAutocomplete from './AddressAutocomplete'

export default function ShippingUnloadingForm({ values, onChange }) {
  const { t } = useTranslation()

  const set = (key) => (value) => onChange({ ...values, [key]: value })

  const handleLocationSelect = (loc) => {
    onChange({
      ...values,
      address: loc.address,
      city: loc.city,
      region: loc.region,
    })
  }

  const mapOptions = (options) =>
    options.map((option) => ({
      ...option,
      label:
        option.value === ''
          ? t('checkoutPage.selectPlaceholder')
          : option.label,
    }))

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6 lg:p-8">
      <h2 className="text-xl font-bold text-[var(--primary-text)]">
        {t('checkoutPage.shippingTitle')}
      </h2>
      <p className="mt-2 text-sm text-[var(--secondary-text)]">
        {t('checkoutPage.shippingIntro')}
      </p>

      <div className="mt-6 space-y-8">
        <div>
          <h3 className="text-base font-semibold text-[var(--primary-text)] mb-4">
            {t('checkoutPage.deliveryAddress', { defaultValue: 'Delivery Address' })}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CheckoutField label={t('checkoutPage.address')} className="sm:col-span-3">
              <AddressAutocomplete
                value={values.address}
                onChange={set('address')}
                onLocationSelect={handleLocationSelect}
                placeholder={t('checkoutPage.address')}
              />
            </CheckoutField>
            
            <CheckoutField label={t('checkoutPage.region')}>
              <CheckoutTextInput
                value={values.region}
                onChange={set('region')}
                placeholder={t('checkoutPage.region')}
              />
            </CheckoutField>
            <CheckoutField label={t('checkoutPage.city')}>
              <CheckoutTextInput
                value={values.city}
                onChange={set('city')}
                placeholder={t('checkoutPage.city')}
              />
            </CheckoutField>
            <CheckoutField label={t('checkoutPage.zipCode')}>
              <CheckoutTextInput
                value={values.zipCode}
                onChange={set('zipCode')}
                placeholder={t('checkoutPage.zipCode')}
              />
            </CheckoutField>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-[var(--primary-text)]">
            {t('checkoutPage.unloadingRequirements')}
          </h3>
          <div className="mt-4 space-y-4">
            <CheckoutField label={t('checkoutPage.unloadingType')}>
              <CheckoutSelect
                value={values.unloadingType}
                onChange={set('unloadingType')}
                options={mapOptions(UNLOADING_TYPE_OPTIONS)}
              />
            </CheckoutField>
            <CheckoutField label={t('checkoutPage.unloadingLocation')}>
              <CheckoutTextArea
                value={values.unloadingLocation}
                onChange={set('unloadingLocation')}
                placeholder={t('checkoutPage.unloadingLocationPlaceholder')}
                rows={5}
              />
            </CheckoutField>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-[var(--primary-text)]">
            {t('checkoutPage.siteConditions')}
          </h3>
          <div className="mt-4 space-y-4">
            <CheckoutField label={t('checkoutPage.accessConditions')}>
              <CheckoutSelect
                value={values.accessConditions}
                onChange={set('accessConditions')}
                options={mapOptions(ACCESS_CONDITION_OPTIONS)}
              />
            </CheckoutField>
            <CheckoutField label={t('checkoutPage.locationNotes')}>
              <CheckoutTextArea
                value={values.locationNotes}
                onChange={set('locationNotes')}
                placeholder={t('checkoutPage.locationNotesPlaceholder')}
                rows={5}
              />
            </CheckoutField>
          </div>
        </div>
      </div>
    </section>
  )
}

export const emptyShippingValues = {
  region: '',
  city: '',
  zipCode: '',
  address: '',
  unloadingType: '',
  unloadingLocation: '',
  accessConditions: '',
  locationNotes: '',
}
