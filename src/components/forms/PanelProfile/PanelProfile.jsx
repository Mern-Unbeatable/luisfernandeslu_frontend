import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiUser } from 'react-icons/fi'
import { DEMO_PANEL_PROFILE } from '@/data/demoData'
import { Field, PrimaryButton, SecretInput, TextInput } from './FormControls'
import { resolveProfileConfig } from './roleConfig'
import {
  BuyerAccountSection,
  BuyerAddressCard,
  BuyerPasswordSection,
} from './BuyerProfileSections'

function emptyPassword() {
  return { currentPassword: '', newPassword: '', confirmPassword: '' }
}

function nextWarehouseId(list) {
  return `wh-${Date.now()}-${list.length + 1}`
}

function alignClass(align) {
  return align === 'start' ? 'justify-start' : 'justify-end'
}

function Card({ children, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 ${className}`}
    >
      {children}
    </section>
  )
}

function AvatarBlock({
  form,
  showAvatarActions,
  fileRef,
  fileInputId,
  onPick,
  onRemove,
  t,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-500 sm:size-[72px]">
        {form.avatarUrl ? (
          <img
            src={form.avatarUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <FiUser className="size-8" strokeWidth={1.5} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {showAvatarActions ? (
          <>
            <h2 className="text-base font-semibold text-[var(--primary-text)]">
              {t('panel.profile.profilePicture')}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              {t('panel.profile.profilePictureHint')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                ref={fileRef}
                id={fileInputId}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onPick}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex h-8 items-center rounded-md bg-emerald-400 px-3 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                {t('panel.profile.uploadNew')}
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-8 items-center rounded-md bg-rose-300 px-3 text-xs font-semibold text-white hover:bg-rose-400"
              >
                {t('panel.profile.remove')}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="truncate font-serif text-base font-semibold text-[var(--primary-text)] sm:text-lg">
              {form.displayName || form.name || '—'}
            </h2>
            <p className="truncate text-sm text-[var(--secondary-text)]">
              {form.displayEmail || form.email || '—'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function AccountFields({
  cfg,
  form,
  setField,
  onSave,
  withTopBorder = false,
  t,
}) {
  return (
    <div className={withTopBorder ? 'mt-8 border-t border-gray-100 pt-8' : 'mt-8'}>
      <h3 className="text-sm font-semibold text-[var(--primary-text)]">
        {t(cfg.accountTitleKey)}
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t(cfg.nameLabelKey)}>
          <TextInput
            value={form.name}
            onChange={setField('name')}
            placeholder={t('panel.profile.namePlaceholder')}
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
        {cfg.showAccountPhone ? (
          <Field label={t('panel.profile.phoneNumber')} className="sm:col-span-2">
            <TextInput
              value={form.phone}
              onChange={setField('phone')}
              placeholder={t('panel.profile.phonePlaceholder')}
            />
          </Field>
        ) : null}
      </div>
      <div className={`mt-5 flex ${alignClass(cfg.profileActionsAlign)}`}>
        <PrimaryButton onClick={onSave}>
          {t(cfg.updateProfileLabelKey)}
        </PrimaryButton>
      </div>
    </div>
  )
}

function WarehouseFields({ warehouses, onUpdate, onAdd, onSave, warehouseTitleKey, t }) {
  return (
    <div className="mt-8 border-t border-gray-100 pt-8">
      <h3 className="text-sm font-semibold text-[var(--primary-text)]">
        {t(warehouseTitleKey || 'panel.profile.warehouseLocation')}
      </h3>
      <div className="mt-4 space-y-4">
        {warehouses.map((item, index) => (
          <Field
            key={item.id}
            label={t('panel.profile.warehouseN', { n: index + 1 })}
          >
            <TextInput
              value={item.address}
              onChange={(address) => onUpdate(item.id, address)}
              placeholder={t('panel.profile.warehousePlaceholder')}
            />
          </Field>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 text-sm font-medium text-[var(--active)] hover:underline"
      >
        {t('panel.profile.addWarehouse')}
      </button>
      <div className="mt-5 flex justify-end">
        <PrimaryButton onClick={onSave}>{t('panel.profile.save')}</PrimaryButton>
      </div>
    </div>
  )
}

function PasswordFields({
  cfg,
  form,
  setField,
  onSave,
  withTopBorder = true,
  stacked = false,
  t,
}) {
  const isFull = cfg.passwordMode === 'full'
  const gridClass = stacked
    ? 'grid-cols-1'
    : isFull
      ? 'grid-cols-1 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2'

  return (
    <div className={withTopBorder ? 'mt-8 border-t border-gray-100 pt-8' : ''}>
      <h3 className="text-sm font-semibold text-[var(--primary-text)]">
        {t(cfg.passwordTitleKey)}
      </h3>
      <div className={`mt-4 grid gap-4 ${gridClass}`}>
        {isFull ? (
          <Field label={t('panel.profile.currentPassword')}>
            <SecretInput
              value={form.currentPassword}
              onChange={setField('currentPassword')}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>
        ) : null}
        <Field label={t(cfg.newPasswordLabelKey)}>
          <SecretInput
            value={form.newPassword}
            onChange={setField('newPassword')}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Field>
        <Field label={t(cfg.confirmPasswordLabelKey)}>
          <SecretInput
            value={form.confirmPassword}
            onChange={setField('confirmPassword')}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Field>
      </div>
      <div className={`mt-5 flex ${alignClass(cfg.passwordActionsAlign)}`}>
        <PrimaryButton size="lg" onClick={onSave}>
          {t(cfg.changePasswordLabelKey)}
        </PrimaryButton>
      </div>
    </div>
  )
}

function IbanCard({ cfg, form, setField, onSave, t }) {
  const ibanAlign = cfg.ibanActionsAlign || 'end'

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-8">
        <h3 className="text-sm font-bold tracking-wide text-[var(--primary-text)] uppercase">
          {t('panel.profile.ibanTitle')}
        </h3>
      </div>
      <div className="space-y-4 p-5 sm:p-8">
        <Field label={t('panel.profile.ibanNumber')}>
          <SecretInput
            value={form.iban}
            onChange={setField('iban')}
            placeholder={t('panel.profile.ibanPlaceholder')}
          />
        </Field>
        <Field label={t(cfg.ibanPhoneLabelKey)}>
          <SecretInput
            value={form.ibanPhone}
            onChange={setField('ibanPhone')}
            placeholder={t(cfg.ibanPhonePlaceholderKey)}
          />
        </Field>
        <div className={`flex pt-2 ${alignClass(ibanAlign)}`}>
          <PrimaryButton onClick={onSave}>
            {t('panel.profile.saveIban')}
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}

/**
 * Shared My Profile page for PanelLayout roles.
 * role drives layout + sections from the design mockups.
 */
export default function PanelProfile({
  role = 'supplier',
  value,
  defaultValue,
  onChange,
  onUpdateProfile,
  onSaveWarehouses,
  onChangePassword,
  onSaveIban,
  onSaveBillingAddress,
  onSaveShippingAddress,
  onUploadAvatar,
  onRemoveAvatar,
  title,
  subtitleKey,
  showAccountPhone,
  showWarehouses,
  showIban,
  passwordMode,
  ibanPhoneLabelKey,
  showAvatarActions,
  layout,
  className = '',
}) {
  const { t } = useTranslation()
  const cfg = resolveProfileConfig(role, {
    showAccountPhone,
    showWarehouses,
    showIban,
    passwordMode,
    ibanPhoneLabelKey,
    showAvatarActions,
    layout,
    ...(subtitleKey !== undefined ? { subtitleKey } : null),
  })

  const isControlled = value !== undefined
  const [internal, setInternal] = useState(
    () => defaultValue || DEMO_PANEL_PROFILE,
  )
  const form = isControlled ? value : internal
  const fileInputId = useId()
  const fileRef = useRef(null)

  const patch = (partial) => {
    const next = { ...form, ...partial }
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const setField = (key) => (nextValue) => patch({ [key]: nextValue })

  const updateWarehouse = (id, address) => {
    patch({
      warehouses: (form.warehouses || []).map((item) =>
        item.id === id ? { ...item, address } : item,
      ),
    })
  }

  const addWarehouse = () => {
    const list = form.warehouses || []
    patch({
      warehouses: [
        ...list,
        {
          id: nextWarehouseId(list),
          address: '',
        },
      ],
    })
  }

  const handleAvatarPick = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    onUploadAvatar?.(file)
    const url = URL.createObjectURL(file)
    patch({ avatarUrl: url })
    event.target.value = ''
  }

  const handleRemoveAvatar = async () => {
    try {
      await onRemoveAvatar?.()
      if (!isControlled) {
        patch({ avatarUrl: null })
      }
    } catch {
      // Parent handles error toast and restores avatar if needed.
    }
  }

  const handleUpdateProfile = () => {
    if (cfg.layout === 'buyer') {
      onUpdateProfile?.({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        region: form.region,
        city: form.city,
        zipCode: form.zipCode,
        address: form.address,
      })
      return
    }
    onUpdateProfile?.({
      name: form.name,
      email: form.email,
      phone: form.phone,
    })
  }

  const handleSaveWarehouses = () => {
    onSaveWarehouses?.(form.warehouses || [])
  }

  const handleChangePassword = () => {
    onChangePassword?.({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    })
    patch(emptyPassword())
  }

  const handleSaveIban = () => {
    onSaveIban?.({
      iban: form.iban,
      ibanPhone: form.ibanPhone,
    })
  }

  const warehouses = form.warehouses || []
  const isSplit = cfg.layout === 'split'
  const isBuyer = cfg.layout === 'buyer'
  const pageTitle = title || t('panel.profile.title')
  const showHeader = cfg.showPageHeader !== false

  return (
    <div className={`w-full ${className}`}>
      {showHeader ? (
        <header className="mb-6 sm:mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--primary-text)] sm:text-4xl">
            {pageTitle}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--secondary-text)]">
            {t(cfg.subtitleKey)}
          </p>
        </header>
      ) : null}

      <div className="space-y-6">
        {isBuyer ? (
          <>
            <Card>
              <BuyerAccountSection
                form={form}
                setField={setField}
                onSave={handleUpdateProfile}
                fileRef={fileRef}
                fileInputId={fileInputId}
                onPick={handleAvatarPick}
                cfg={cfg}
                t={t}
              />
              <BuyerPasswordSection
                cfg={cfg}
                form={form}
                setField={setField}
                onSave={handleChangePassword}
                t={t}
              />
            </Card>

            {cfg.showIban ? (
              <IbanCard
                cfg={cfg}
                form={form}
                setField={setField}
                onSave={handleSaveIban}
                t={t}
              />
            ) : null}

            {cfg.showAddressCards ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <BuyerAddressCard
                  titleKey="panel.profile.billingAddress"
                  values={form.billingAddress || {}}
                  onChange={(billingAddress) => patch({ billingAddress })}
                  onSave={() => onSaveBillingAddress?.(form.billingAddress)}
                  t={t}
                />
                <BuyerAddressCard
                  titleKey="panel.profile.shippingAddress"
                  values={form.shippingAddress || {}}
                  onChange={(shippingAddress) => patch({ shippingAddress })}
                  onSave={() => onSaveShippingAddress?.(form.shippingAddress)}
                  t={t}
                />
              </div>
            ) : null}
          </>
        ) : isSplit ? (
          <>
            <Card>
              <AvatarBlock
                form={form}
                showAvatarActions={cfg.showAvatarActions}
                fileRef={fileRef}
                fileInputId={fileInputId}
                onPick={handleAvatarPick}
                onRemove={handleRemoveAvatar}
                t={t}
              />
              <AccountFields
                cfg={cfg}
                form={form}
                setField={setField}
                onSave={handleUpdateProfile}
                t={t}
              />
            </Card>

            <Card>
              <PasswordFields
                cfg={cfg}
                form={form}
                setField={setField}
                onSave={handleChangePassword}
                withTopBorder={false}
                stacked
                t={t}
              />
            </Card>
          </>
        ) : (
          <Card>
            <AvatarBlock
              form={form}
              showAvatarActions={cfg.showAvatarActions}
              fileRef={fileRef}
              fileInputId={fileInputId}
              onPick={handleAvatarPick}
              onRemove={handleRemoveAvatar}
              t={t}
            />
            <AccountFields
              cfg={cfg}
              form={form}
              setField={setField}
              onSave={handleUpdateProfile}
              withTopBorder
              t={t}
            />
            {cfg.showWarehouses ? (
              <WarehouseFields
                warehouses={warehouses}
                onUpdate={updateWarehouse}
                onAdd={addWarehouse}
                onSave={handleSaveWarehouses}
                warehouseTitleKey={cfg.warehouseTitleKey}
                t={t}
              />
            ) : null}
            <PasswordFields
              cfg={cfg}
              form={form}
              setField={setField}
              onSave={handleChangePassword}
              t={t}
            />
          </Card>
        )}

        {!isBuyer && cfg.showIban ? (
          <IbanCard
            cfg={cfg}
            form={form}
            setField={setField}
            onSave={handleSaveIban}
            t={t}
          />
        ) : null}
      </div>
    </div>
  )
}
