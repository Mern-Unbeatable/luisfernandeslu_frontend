import { FiCamera, FiUser } from 'react-icons/fi'
import AddressAutocomplete from '@/pages/public_page/checkout/components/AddressAutocomplete'
import { Field, PrimaryButton, SecretInput, TextInput, PhoneInput } from './FormControls'

const controlInputClass =
  'w-full rounded-md border border-gray-200 bg-white text-sm text-[var(--primary-text)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--active)] h-11 px-3'

export const PORTUGAL_DISTRICTS = [
  'Aveiro',
  'Beja',
  'Braga',
  'Bragança',
  'Castelo Branco',
  'Coimbra',
  'Évora',
  'Faro',
  'Guarda',
  'Leiria',
  'Lisboa',
  'Portalegre',
  'Porto',
  'Santarém',
  'Setúbal',
  'Viana do Castelo',
  'Vila Real',
  'Viseu',
  'Região Autónoma dos Açores',
  'Região Autónoma da Madeira',
]

function PortugalDistrictsDatalist({ id = 'portugal-districts' }) {
  return (
    <datalist id={id}>
      {PORTUGAL_DISTRICTS.map((district) => (
        <option key={district} value={district}>
          {district}
        </option>
      ))}
    </datalist>
  )
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-sm font-bold tracking-wide text-[var(--primary-text)] uppercase">
      {children}
    </h3>
  )
}

export function BuyerAvatar({ form, fileRef, fileInputId, onPick, onRemove, t }) {
  return (
    <div className="inline-flex flex-col items-start gap-2">
      <div className="relative inline-flex">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-500 sm:size-24">
          {form.avatarUrl ? (
            <img src={form.avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <FiUser className="size-10" strokeWidth={1.5} />
          )}
        </div>
        <input
          ref={fileRef}
          id={fileInputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={onPick}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-[var(--active)] text-white shadow-sm hover:opacity-90"
          aria-label={t('panel.profile.uploadNew')}
        >
          <FiCamera className="size-4" strokeWidth={2} />
        </button>
      </div>
      {form.avatarUrl && onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-semibold text-red-600 hover:underline"
        >
          {t('panel.profile.remove')}
        </button>
      ) : null}
    </div>
  )
}

export function BuyerAccountSection({
  form,
  setField,
  onPatch,
  onSave,
  saving = false,
  fileRef,
  fileInputId,
  onPick,
  onRemove,
  cfg,
  t,
}) {
  const handleLocationSelect = (loc) => {
    onPatch?.({
      address: loc.address || form.address,
      city: loc.city || form.city,
      region: loc.region || form.region,
      zipCode: loc.zipCode || form.zipCode,
    })
  }

  return (
    <div>
      <PortugalDistrictsDatalist id="portugal-districts-account" />
      <SectionTitle>{t(cfg.accountTitleKey)}</SectionTitle>
      <div className="mt-5">
        <BuyerAvatar
          form={form}
          fileRef={fileRef}
          fileInputId={fileInputId}
          onPick={onPick}
          onRemove={onRemove}
          t={t}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t('panel.profile.firstName')}>
          <TextInput
            value={form.firstName}
            onChange={setField('firstName')}
            placeholder={t('panel.profile.firstName')}
          />
        </Field>
        <Field label={t('panel.profile.lastName')}>
          <TextInput
            value={form.lastName}
            onChange={setField('lastName')}
            placeholder={t('panel.profile.lastNamePlaceholder')}
          />
        </Field>
        <Field label={t('panel.profile.email')}>
          <TextInput
            type="email"
            value={form.email}
            readOnly
            aria-readonly="true"
            className="cursor-default bg-gray-50 text-[var(--secondary-text)] focus:border-gray-200"
          />
        </Field>
        <Field label={t('panel.profile.phoneNumber')}>
          <PhoneInput
            value={form.phone}
            onChange={setField('phone')}
            placeholder={t('panel.profile.phonePlaceholder')}
          />
        </Field>
        <Field label={t('panel.profile.streetAddress')} className="sm:col-span-2">
          <AddressAutocomplete
            value={form.address}
            onChange={setField('address')}
            onLocationSelect={handleLocationSelect}
            placeholder={t('panel.profile.streetAddress')}
            inputClassName={controlInputClass}
          />
        </Field>
        <Field label={t('panel.profile.region')}>
          <TextInput
            value={form.region}
            onChange={setField('region')}
            list="portugal-districts-account"
            placeholder={t('checkoutPage.region', 'Região / Distrito')}
          />
        </Field>
        <Field label={t('panel.profile.city')}>
          <TextInput
            value={form.city}
            onChange={setField('city')}
            placeholder={t('checkoutPage.city', 'Cidade')}
          />
        </Field>
        <Field label={t('panel.profile.zipCode')}>
          <TextInput
            value={form.zipCode}
            onChange={setField('zipCode')}
            placeholder={t('panel.profile.zipCode')}
          />
        </Field>
      </div>

      <div className="mt-6 flex justify-start">
        <PrimaryButton size="lg" onClick={onSave} loading={saving}>
          {t(cfg.updateProfileLabelKey)}
        </PrimaryButton>
      </div>
    </div>
  )
}

export function BuyerPasswordSection({
  cfg,
  form,
  setField,
  onSave,
  saving = false,
  t,
}) {
  return (
    <div className="mt-10 border-t border-gray-100 pt-10">
      <SectionTitle>{t(cfg.passwordTitleKey)}</SectionTitle>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <Field label={t('panel.profile.currentPassword')}>
          <SecretInput
            value={form.currentPassword}
            onChange={setField('currentPassword')}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Field>
        <Field label={t('panel.profile.newPassword')}>
          <SecretInput
            value={form.newPassword}
            onChange={setField('newPassword')}
            placeholder={t('panel.profile.passwordMinPlaceholder')}
            autoComplete="new-password"
          />
        </Field>
        <Field label={t('panel.profile.confirmNewPassword')}>
          <SecretInput
            value={form.confirmPassword}
            onChange={setField('confirmPassword')}
            placeholder={t('panel.profile.passwordMinPlaceholder')}
            autoComplete="new-password"
          />
        </Field>
      </div>
      <div className="mt-6 flex justify-start">
        <PrimaryButton size="lg" onClick={onSave} loading={saving}>
          {t(cfg.changePasswordLabelKey)}
        </PrimaryButton>
      </div>
    </div>
  )
}

export function BuyerAddressCard({
  titleKey,
  values,
  onChange,
  onSave,
  saving = false,
  t,
}) {
  const set = (key) => (value) => onChange({ ...values, [key]: value })

  const handleLocationSelect = (loc) => {
    onChange({
      ...values,
      address: loc.address || values.address,
      city: loc.city || values.city,
      region: loc.region || values.region,
      zipCode: loc.zipCode || values.zipCode,
      country: loc.country || values.country,
    })
  }

  const datalistId = `portugal-districts-${titleKey.replace(/[^a-zA-Z0-9]/g, '-')}`

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <PortugalDistrictsDatalist id={datalistId} />
      <div className="border-b border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
        <h3 className="text-sm font-bold tracking-wide text-[var(--primary-text)] uppercase">
          {t(titleKey)}
        </h3>
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('panel.profile.firstName')}>
            <TextInput
              value={values.firstName}
              onChange={set('firstName')}
            />
          </Field>
          <Field label={t('panel.profile.lastName')}>
            <TextInput
              value={values.lastName}
              onChange={set('lastName')}
            />
          </Field>
          <Field label={t('panel.profile.companyOptional')} className="sm:col-span-2">
            <TextInput
              value={values.companyName}
              onChange={set('companyName')}
            />
          </Field>
          <Field label={t('panel.profile.streetAddress')} className="sm:col-span-2">
            <AddressAutocomplete
              value={values.address}
              onChange={set('address')}
              onLocationSelect={handleLocationSelect}
              placeholder={t('panel.profile.streetAddress')}
              inputClassName={controlInputClass}
            />
          </Field>
          <Field label={t('panel.profile.region')} className="sm:col-span-2">
            <TextInput
              value={values.region}
              onChange={set('region')}
              list={datalistId}
              placeholder={t('checkoutPage.region', 'Região / Distrito')}
            />
          </Field>
          <Field label={t('panel.profile.city')}>
            <TextInput
              value={values.city}
              onChange={set('city')}
              placeholder={t('checkoutPage.city', 'Cidade')}
            />
          </Field>
          <Field label={t('panel.profile.zipCode')}>
            <TextInput
              value={values.zipCode}
              onChange={set('zipCode')}
              placeholder={t('panel.profile.zipCode')}
            />
          </Field>
          <Field label={t('panel.profile.email')} className="sm:col-span-2">
            <TextInput
              type="email"
              value={values.email}
              readOnly
              aria-readonly="true"
              className="cursor-default bg-gray-50 text-[var(--secondary-text)] focus:border-gray-200"
            />
          </Field>
          <Field label={t('panel.profile.phoneNumber')} className="sm:col-span-2">
            <PhoneInput
              value={values.phone}
              onChange={set('phone')}
              placeholder={t('panel.profile.phonePlaceholder')}
            />
          </Field>
        </div>
        <div className="flex justify-start pt-2">
          <PrimaryButton size="lg" onClick={onSave} loading={saving}>
            {t('panel.profile.saveChanges')}
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}
