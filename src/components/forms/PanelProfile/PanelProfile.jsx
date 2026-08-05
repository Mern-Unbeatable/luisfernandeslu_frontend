import { useId, useRef, useState } from 'react'
import { FiUser } from 'react-icons/fi'
import { DEMO_PANEL_PROFILE } from '@/data/demoData'
import { Field, PrimaryButton, SecretInput, TextInput } from './FormControls'
import { resolveProfileConfig } from './roleConfig'

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
              Profile Picture
            </h2>
            <p className="mt-0.5 text-sm text-[var(--secondary-text)]">
              Manage your personal information and account settings.
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
                Upload New
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-8 items-center rounded-md bg-rose-300 px-3 text-xs font-semibold text-white hover:bg-rose-400"
              >
                Remove
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
}) {
  return (
    <div className={withTopBorder ? 'mt-8 border-t border-gray-100 pt-8' : 'mt-8'}>
      <h3 className="text-sm font-semibold text-[var(--primary-text)]">
        {cfg.accountTitle}
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={cfg.nameLabel}>
          <TextInput
            value={form.name}
            onChange={setField('name')}
            placeholder="Your name or company"
          />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            value={form.email}
            onChange={setField('email')}
            placeholder="you@example.com"
          />
        </Field>
        {cfg.showAccountPhone ? (
          <Field label="Phone Number" className="sm:col-span-2">
            <TextInput
              value={form.phone}
              onChange={setField('phone')}
              placeholder="+1 (555) 000-0000"
            />
          </Field>
        ) : null}
      </div>
      <div className={`mt-5 flex ${alignClass(cfg.profileActionsAlign)}`}>
        <PrimaryButton onClick={onSave}>{cfg.updateProfileLabel}</PrimaryButton>
      </div>
    </div>
  )
}

function WarehouseFields({ warehouses, onUpdate, onAdd, onSave }) {
  return (
    <div className="mt-8 border-t border-gray-100 pt-8">
      <h3 className="text-sm font-semibold text-[var(--primary-text)]">
        Warehouse Location
      </h3>
      <div className="mt-4 space-y-4">
        {warehouses.map((item) => (
          <Field key={item.id} label={item.label || 'Warehouse'}>
            <TextInput
              value={item.address}
              onChange={(address) => onUpdate(item.id, address)}
              placeholder="Street, city, region, postal code"
            />
          </Field>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 text-sm font-medium text-[var(--active)] hover:underline"
      >
        + Add New Warehouse
      </button>
      <div className="mt-5 flex justify-end">
        <PrimaryButton onClick={onSave}>Save</PrimaryButton>
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
        {cfg.passwordTitle}
      </h3>
      <div className={`mt-4 grid gap-4 ${gridClass}`}>
        {isFull ? (
          <Field label="Current Password">
            <SecretInput
              value={form.currentPassword}
              onChange={setField('currentPassword')}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>
        ) : null}
        <Field label={cfg.newPasswordLabel}>
          <SecretInput
            value={form.newPassword}
            onChange={setField('newPassword')}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Field>
        <Field label={cfg.confirmPasswordLabel}>
          <SecretInput
            value={form.confirmPassword}
            onChange={setField('confirmPassword')}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Field>
      </div>
      <div className={`mt-5 flex ${alignClass(cfg.passwordActionsAlign)}`}>
        <PrimaryButton onClick={onSave}>{cfg.changePasswordLabel}</PrimaryButton>
      </div>
    </div>
  )
}

function IbanCard({ cfg, form, setField, onSave }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-8">
        <h3 className="text-sm font-bold tracking-wide text-[var(--primary-text)] uppercase">
          IBAN Number
        </h3>
      </div>
      <div className="space-y-4 p-5 sm:p-8">
        <Field label="IBAN Number">
          <SecretInput
            value={form.iban}
            onChange={setField('iban')}
            placeholder="PT50 0000 0000 0000 0000 0000 0"
          />
        </Field>
        <Field label={cfg.ibanPhoneLabel}>
          <SecretInput
            value={form.ibanPhone}
            onChange={setField('ibanPhone')}
            placeholder={cfg.ibanPhonePlaceholder}
          />
        </Field>
        <div className="flex justify-end pt-2">
          <PrimaryButton onClick={onSave}>SAVE</PrimaryButton>
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
  onUploadAvatar,
  onRemoveAvatar,
  title = 'My Profile',
  subtitle,
  showAccountPhone,
  showWarehouses,
  showIban,
  passwordMode,
  ibanPhoneLabel,
  showAvatarActions,
  layout,
  className = '',
}) {
  const cfg = resolveProfileConfig(role, {
    showAccountPhone,
    showWarehouses,
    showIban,
    passwordMode,
    ibanPhoneLabel,
    showAvatarActions,
    layout,
    ...(subtitle !== undefined ? { subtitle } : null),
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
          label: `Warehouse ${list.length + 1}`,
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

  const handleRemoveAvatar = () => {
    onRemoveAvatar?.()
    patch({ avatarUrl: null })
  }

  const handleUpdateProfile = () => {
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

  return (
    <div className={`w-full  ${className}`}>
      <header className="mb-6 sm:mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--primary-text)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--secondary-text)]">
          {cfg.subtitle}
        </p>
      </header>

      <div className="space-y-6">
        {isSplit ? (
          <>
            <Card>
              <AvatarBlock
                form={form}
                showAvatarActions={cfg.showAvatarActions}
                fileRef={fileRef}
                fileInputId={fileInputId}
                onPick={handleAvatarPick}
                onRemove={handleRemoveAvatar}
              />
              <AccountFields
                cfg={cfg}
                form={form}
                setField={setField}
                onSave={handleUpdateProfile}
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
            />
            <AccountFields
              cfg={cfg}
              form={form}
              setField={setField}
              onSave={handleUpdateProfile}
              withTopBorder
            />
            {cfg.showWarehouses ? (
              <WarehouseFields
                warehouses={warehouses}
                onUpdate={updateWarehouse}
                onAdd={addWarehouse}
                onSave={handleSaveWarehouses}
              />
            ) : null}
            <PasswordFields
              cfg={cfg}
              form={form}
              setField={setField}
              onSave={handleChangePassword}
            />
          </Card>
        )}

        {cfg.showIban ? (
          <IbanCard
            cfg={cfg}
            form={form}
            setField={setField}
            onSave={handleSaveIban}
          />
        ) : null}
      </div>
    </div>
  )
}
