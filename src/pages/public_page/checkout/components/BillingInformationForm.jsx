import { useTranslation } from 'react-i18next'
import {
  CHECKOUT_CITY_OPTIONS,
  CHECKOUT_REGION_OPTIONS,
} from '../data/checkoutDemo'
import {
  CheckoutField,
  CheckoutSelect,
  CheckoutTextInput,
} from './checkoutFields'
import AddressAutocomplete from './AddressAutocomplete'

export default function BillingInformationForm({
  values,
  onChange,
  showProjectFields = false,
  showCompanyFields = false,
  hideBillingFields = false,
}) {
  const { t } = useTranslation()

  const set = (key) => (value) => onChange({ ...values, [key]: value })

  if (hideBillingFields && !showProjectFields) {
    return null
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6 lg:p-8">
      <h2 className="text-xl font-bold text-[var(--primary-text)]">
        {t('checkoutPage.billingTitle')}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {!hideBillingFields && (
          <>
            {showCompanyFields ? (
              <>
                <CheckoutField
                  label={t('checkoutPage.companyName')}
                  className="sm:col-span-2"
                >
                  <CheckoutTextInput
                    value={values.companyName}
                    onChange={set('companyName')}
                    placeholder={t('checkoutPage.companyName')}
                  />
                </CheckoutField>
                <CheckoutField label={t('checkoutPage.vatNumber')}>
                  <CheckoutTextInput
                    value={values.vatNumber}
                    onChange={set('vatNumber')}
                    placeholder={t('checkoutPage.vatNumber')}
                  />
                </CheckoutField>
                <CheckoutField label={t('checkoutPage.contactPerson')}>
                  <CheckoutTextInput
                    value={values.contactPerson}
                    onChange={set('contactPerson')}
                    placeholder={t('checkoutPage.contactPerson')}
                  />
                </CheckoutField>
              </>
            ) : null}

            <CheckoutField label={t('checkoutPage.firstName')}>
              <CheckoutTextInput
                value={values.firstName}
                onChange={set('firstName')}
                placeholder={t('checkoutPage.firstName')}
              />
            </CheckoutField>
            <CheckoutField label={t('checkoutPage.lastName')}>
              <CheckoutTextInput
                value={values.lastName}
                onChange={set('lastName')}
                placeholder={t('checkoutPage.lastName')}
              />
            </CheckoutField>

            <CheckoutField label={t('checkoutPage.email')}>
              <CheckoutTextInput
                type="email"
                value={values.email}
                onChange={set('email')}
                placeholder={t('checkoutPage.email')}
              />
            </CheckoutField>
            <CheckoutField label={t('checkoutPage.phone')}>
              <CheckoutTextInput
                type="tel"
                value={values.phone}
                onChange={set('phone')}
                placeholder={t('checkoutPage.phone')}
              />
            </CheckoutField>

            <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-3">
              <CheckoutField label={t('checkoutPage.address')} className="sm:col-span-3">
                <AddressAutocomplete
                  value={values.address}
                  onChange={set('address')}
                  onLocationSelect={(loc) => {
                    onChange({
                      ...values,
                      address: loc.address,
                      city: loc.city,
                      region: loc.region,
                    })
                  }}
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
          </>
        )}

        {showProjectFields ? (
          <>
            <CheckoutField
              label={t('checkoutPage.projectName')}
              className="sm:col-span-2"
            >
              <CheckoutTextInput
                value={values.projectName}
                onChange={set('projectName')}
                placeholder={t('checkoutPage.projectName')}
              />
            </CheckoutField>
            <CheckoutField
              label={t('checkoutPage.projectLocation')}
              className="sm:col-span-2"
            >
              <CheckoutTextInput
                value={values.projectLocation}
                onChange={set('projectLocation')}
                placeholder={t('checkoutPage.projectLocation')}
              />
            </CheckoutField>
          </>
        ) : null}
      </div>
    </section>
  )
}

export const emptyBillingValues = {
  companyName: '',
  vatNumber: '',
  contactPerson: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  region: '',
  city: '',
  zipCode: '',
  address: '',
  projectName: '',
  projectLocation: '',
}
