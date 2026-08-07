import { useMemo, useState } from 'react'
import { FiArrowLeft, FiCalendar, FiX } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { getCategorySelectOptions } from '@/data/productCategories'
import { Field, SelectInput, TextInput } from '../AddProduct/FormControls'
import { DEFAULT_CREATE_PROMO_CODE } from './defaults'

export default function CreatePromoCode({
  value,
  defaultValue,
  onChange,
  onSubmit,
  onBack,
  productOptions = [],
  userOptions,
  breadcrumb,
  title,
  submitLabel,
  className = '',
}) {
  const { t } = useTranslation()
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(
    () => defaultValue || DEFAULT_CREATE_PROMO_CODE,
  )

  const form = isControlled ? value : internal

  const patch = (partial) => {
    const next = { ...form, ...partial }
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const setField = (key) => (nextValue) => patch({ [key]: nextValue })

  const resolvedBreadcrumb =
    breadcrumb ?? t('panel.supplierPromoCodes.create.breadcrumb')
  const resolvedTitle = title ?? t('panel.supplierPromoCodes.create.title')
  const resolvedSubmitLabel =
    submitLabel ?? t('panel.supplierPromoCodes.create.submit')

  const categoryOptions = useMemo(
    () => getCategorySelectOptions(t('panel.supplierPromoCodes.create.selectCategory')),
    [t],
  )

  const resolvedUserOptions = useMemo(
    () =>
      userOptions ?? [
        {
          value: 'all',
          label: t('panel.supplierPromoCodes.create.allUsers'),
        },
        {
          value: 'company',
          label: t('panel.supplierPromoCodes.create.companyUsers'),
        },
      ],
    [userOptions, t],
  )

  const productLabelMap = useMemo(
    () =>
      Object.fromEntries(
        productOptions.map((option) => [option.value, option.label]),
      ),
    [productOptions],
  )

  const availableProductOptions = useMemo(
    () => [
      { value: '', label: t('panel.supplierPromoCodes.create.selectProduct') },
      ...productOptions,
    ],
    [productOptions, t],
  )

  const productSelectValue = form.applicableProductIds[0] || ''

  const addProduct = (productId) => {
    if (!productId || form.applicableProductIds.includes(productId)) return
    patch({
      applicableProductIds: [...form.applicableProductIds, productId],
    })
  }

  const removeProduct = (productId) => {
    patch({
      applicableProductIds: form.applicableProductIds.filter(
        (id) => id !== productId,
      ),
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(form)
  }

  const discountToggleClass = (type) =>
    `h-10 rounded-sm border px-2.5 text-sm transition-colors ${
      form.discountType === type
        ? 'border-[var(--active)] bg-[color-mix(in_srgb,var(--active)_12%,white)] font-medium text-[var(--primary-text)]'
        : 'border-black/20 bg-white text-[var(--primary-text)] hover:border-gray-300'
    }`

  return (
    <div className={`w-full ${className}`}>
      <header className="mb-8 flex flex-col gap-3">
        <p className="text-sm font-normal text-neutral-600">
          {resolvedBreadcrumb}
        </p>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-[5px] text-sm text-black hover:text-[var(--active)]"
          >
            <FiArrowLeft className="size-6" strokeWidth={1.5} />
            {t('panel.supplierPromoCodes.create.back')}
          </button>
        ) : null}
        <h1 className="text-4xl font-semibold text-zinc-950">{resolvedTitle}</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Field label={t('panel.supplierPromoCodes.create.promoCode')}>
          <TextInput
            value={form.code}
            onChange={setField('code')}
            placeholder={t('panel.supplierPromoCodes.create.promoCodePlaceholder')}
          />
        </Field>

        <Field label={t('panel.supplierPromoCodes.create.discountType')}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setField('discountType')('percentage')}
              className={discountToggleClass('percentage')}
            >
              {t('panel.supplierPromoCodes.create.discountTypePercentage')}
            </button>
            <button
              type="button"
              onClick={() => setField('discountType')('fixed')}
              className={discountToggleClass('fixed')}
            >
              {t('panel.supplierPromoCodes.create.discountTypeFixed')}
            </button>
          </div>
        </Field>

        <Field label={t('panel.supplierPromoCodes.create.discountValue')}>
          <TextInput
            value={form.discountValue}
            onChange={setField('discountValue')}
            placeholder={
              form.discountType === 'fixed'
                ? t('panel.supplierPromoCodes.create.discountValueFixedPlaceholder')
                : t('panel.supplierPromoCodes.create.discountValuePercentagePlaceholder')
            }
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Field label={t('panel.supplierPromoCodes.create.minOrderAmount')}>
            <TextInput
              value={form.minOrderAmount}
              onChange={setField('minOrderAmount')}
              placeholder={t('panel.supplierPromoCodes.create.minOrderPlaceholder')}
            />
          </Field>

          <Field label={t('panel.supplierPromoCodes.create.expiryDate')}>
            <div className="relative">
              <input
                type="date"
                value={form.expiryDate}
                onChange={(event) => setField('expiryDate')(event.target.value)}
                className="w-full rounded-sm border border-black/20 bg-white h-10 px-2.5 pr-9 text-sm text-[var(--primary-text)] outline-none transition-colors focus:border-[var(--active)] [color-scheme:light]"
              />
              <FiCalendar
                className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
            </div>
          </Field>

          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-normal text-gray-800">
                {t('panel.supplierPromoCodes.create.usageLimit')}
              </span>
              <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="checkbox"
                  checked={form.usageUnlimited}
                  onChange={(event) =>
                    patch({
                      usageUnlimited: event.target.checked,
                      usageLimit: event.target.checked ? '' : form.usageLimit,
                    })
                  }
                  className="size-4 rounded border-gray-300 text-[var(--active)] focus:ring-[var(--active)]"
                />
                {t('panel.supplierPromoCodes.unlimited')}
              </label>
            </div>
            <TextInput
              value={form.usageLimit}
              onChange={setField('usageLimit')}
              placeholder={t('panel.supplierPromoCodes.create.usageLimitPlaceholder')}
              disabled={form.usageUnlimited}
              className={form.usageUnlimited ? 'bg-gray-50 opacity-70' : ''}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Field label={t('panel.supplierPromoCodes.create.applicableUsers')}>
            <SelectInput
              value={form.applicableUsers}
              onChange={setField('applicableUsers')}
              options={resolvedUserOptions}
            />
          </Field>

          <Field label={t('panel.supplierPromoCodes.create.applicableCategory')}>
            <SelectInput
              value={form.applicableCategory}
              onChange={setField('applicableCategory')}
              options={categoryOptions}
            />
          </Field>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Field label={t('panel.supplierPromoCodes.create.applicableProduct')}>
            <SelectInput
              value={productSelectValue}
              onChange={(productId) => {
                if (!productId) return
                if (!form.applicableProductIds.includes(productId)) {
                  addProduct(productId)
                }
              }}
              options={availableProductOptions}
            />
          </Field>

          {form.applicableProductIds.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {form.applicableProductIds.map((productId) => (
                <span
                  key={productId}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm text-[var(--primary-text)]"
                >
                  {productLabelMap[productId] || productId}
                  <button
                    type="button"
                    onClick={() => removeProduct(productId)}
                    className="rounded p-0.5 text-[var(--secondary-text)] transition-colors hover:bg-gray-200 hover:text-[var(--primary-text)]"
                    aria-label={t('panel.supplierPromoCodes.create.removeProduct')}
                  >
                    <FiX className="size-3.5" aria-hidden />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--active)] px-8 text-base font-bold tracking-tight text-white uppercase hover:brightness-95"
          >
            {resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
