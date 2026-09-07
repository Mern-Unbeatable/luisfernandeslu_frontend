import { FiCamera, FiUser } from 'react-icons/fi'
import {
  CHECKOUT_CITY_OPTIONS,
  CHECKOUT_REGION_OPTIONS,
} from '@/pages/public_page/checkout/data/checkoutDemo'
import { Field, PrimaryButton, SecretInput, SelectInput, TextInput, PhoneInput } from './FormControls'

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
  onSave,
  fileRef,
  fileInputId,
  onPick,
  onRemove,
  cfg,
  t,
}) {
  return (
    <div>
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
            onChange={setField('email')}
            placeholder={t('panel.profile.emailPlaceholder')}
          />
        </Field>
        <Field label={t('panel.profile.phoneNumber')}>
          <PhoneInput
            value={form.phone}
            onChange={setField('phone')}
            placeholder={t('panel.profile.phonePlaceholder')}
          />
        </Field>
        <Field label={t('panel.profile.region')}>
          <SelectInput
            value={form.region}
            onChange={setField('region')}
            options={CHECKOUT_REGION_OPTIONS}
          />
        </Field>
        <Field label={t('panel.profile.city')}>
          <SelectInput
            value={form.city}
            onChange={setField('city')}
            options={CHECKOUT_CITY_OPTIONS}
          />
        </Field>
        <Field label={t('panel.profile.zipCode')}>
          <TextInput
            value={form.zipCode}
            onChange={setField('zipCode')}
            placeholder={t('panel.profile.zipCode')}
          />
        </Field>
        <Field label={t('panel.profile.streetAddress')} className="sm:col-span-2">
          <TextInput
            value={form.address}
            onChange={setField('address')}
            placeholder={t('panel.profile.streetAddress')}
          />
        </Field>
      </div>

      <div className="mt-6 flex justify-start">
        <PrimaryButton size="lg" onClick={onSave}>
          {t(cfg.updateProfileLabelKey)}
        </PrimaryButton>
      </div>
    </div>
  )
}

export function BuyerPasswordSection({ cfg, form, setField, onSave, t }) {
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
        <PrimaryButton size="lg" onClick={onSave}>
          {t(cfg.changePasswordLabelKey)}
        </PrimaryButton>
      </div>
    </div>
  )
}

export function BuyerAddressCard({ titleKey, values, onChange, onSave, t }) {
  const set = (key) => (value) => onChange({ ...values, [key]: value })

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
            <TextInput value={values.address} onChange={set('address')} />
          </Field>
          <Field label={t('panel.profile.region')} className="sm:col-span-2">
            <SelectInput
              value={values.region}
              onChange={set('region')}
              options={CHECKOUT_REGION_OPTIONS}
            />
          </Field>
          <Field label={t('panel.profile.city')}>
            <SelectInput
              value={values.city}
              onChange={set('city')}
              options={CHECKOUT_CITY_OPTIONS}
            />
          </Field>
          <Field label={t('panel.profile.zipCode')}>
            <TextInput value={values.zipCode} onChange={set('zipCode')} />
          </Field>
          <Field label={t('panel.profile.email')} className="sm:col-span-2">
            <TextInput
              type="email"
              value={values.email}
              onChange={set('email')}
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
          <PrimaryButton size="lg" onClick={onSave}>
            {t('panel.profile.saveChanges')}
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}
