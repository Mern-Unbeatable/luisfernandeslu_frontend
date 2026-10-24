import { useMemo, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import {
  getCategorySelectOptions,
  getProductTypeSelectOptions,
  getSubCategorySelectOptions,
} from '@/data/productCategories'
import BulkOptionSection, { AiTextSection } from './BulkOptionSection'
import { DEFAULT_ADD_PRODUCT } from './defaults'
import { Field, SelectInput, TextInput } from './FormControls'
import ImageDropzone from './ImageDropzone'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'

/**
 * Common Add Product form.
 * role: 'supplier' (default, full form) | 'factory' (simplified)
 *
 * Category / Sub Category / Product Type cascade from PRODUCT_CATEGORIES.
 * Pass categoryOptions / subCategoryOptions / productTypeOptions to override.
 */
export default function AddProduct({
  role = 'supplier',
  value,
  defaultValue,
  onChange,
  onSubmit,
  onBack,
  onAiAssist,
  breadcrumb = i18n.t('fallback.addProductBreadcrumb'),
  title = i18n.t('fallback.addProduct'),
  submitLabel = i18n.t('fallback.submit'),
  submitting = false,
  categoryOptions,
  subCategoryOptions,
  productTypeOptions,
  warehouseOptions,
  className = '',
}) {
  const { t } = useTranslation()
  const isFactory = role === 'factory'
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(
    () => defaultValue || DEFAULT_ADD_PRODUCT,
  )
  const [aiLoading, setAiLoading] = useState(null)

  const form = isControlled ? value : internal

  const patch = (partial) => {
    const next = { ...form, ...partial }
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const setField = (key) => (nextValue) => patch({ [key]: nextValue })

  const resolvedCategoryOptions = useMemo(
    () => categoryOptions ?? getCategorySelectOptions(),
    [categoryOptions],
  )

  const resolvedSubCategoryOptions = useMemo(
    () =>
      subCategoryOptions
      ?? getSubCategorySelectOptions(form.categoryId),
    [subCategoryOptions, form.categoryId],
  )

  const resolvedProductTypeOptions = useMemo(
    () =>
      productTypeOptions
      ?? getProductTypeSelectOptions(form.categoryId, form.subCategoryId),
    [productTypeOptions, form.categoryId, form.subCategoryId],
  )

  const handleCategoryChange = (categoryId) => {
    patch({
      categoryId,
      subCategoryId: '',
      productTypeId: '',
    })
  }

  const handleSubCategoryChange = (subCategoryId) => {
    patch({
      subCategoryId,
      productTypeId: '',
    })
  }

  const handleAi = async (section) => {
    if (!onAiAssist) return
    setAiLoading(section)
    try {
      const generated = await onAiAssist(section, form)
      if (typeof generated === 'string' && generated.trim()) {
        patch({ [section]: generated })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setAiLoading(null)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(form)
  }

  return (
    <div className={`w-full  ${className}`}>
      <header className="mb-8 flex flex-col gap-3">
        <p className="text-sm font-normal text-neutral-600">{breadcrumb}</p>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-[5px] text-sm text-black hover:text-[var(--active)]"
          >
            <FiArrowLeft className="size-6" strokeWidth={1.5} />
            {t('ui.back')}
          </button>
        ) : null}
        <h1 className="text-4xl font-semibold text-zinc-950">{title}</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {isFactory ? (
          <>
            <Field label={t('ui.warehouseLocation')}>
              <TextInput
                value={form.warehouseLocation}
                onChange={setField('warehouseLocation')}
                placeholder={t('ui.enterWarehouseLocation')}
              />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field label={t('ui.category')}>
                <SelectInput
                  value={form.categoryId}
                  onChange={handleCategoryChange}
                  options={resolvedCategoryOptions}
                />
              </Field>
              <Field label={t('ui.subCategory')}>
                <SelectInput
                  value={form.subCategoryId}
                  onChange={handleSubCategoryChange}
                  options={resolvedSubCategoryOptions}
                  disabled={!form.categoryId && !subCategoryOptions}
                />
              </Field>
              <Field label={t('ui.productType')}>
                <SelectInput
                  value={form.productTypeId}
                  onChange={setField('productTypeId')}
                  options={resolvedProductTypeOptions}
                  disabled={!form.subCategoryId && !productTypeOptions}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field label={t('ui.title')}>
                <TextInput
                  value={form.title}
                  onChange={setField('title')}
                  placeholder={t('ui.titlePlaceholder')}
                />
              </Field>
              <Field label={t('ui.price')}>
                <TextInput
                  value={form.basePrice}
                  onChange={setField('basePrice')}
                  placeholder="€00.00"
                />
              </Field>
              <Field label={t('ui.skuNumber')}>
                <TextInput
                  value={form.sku}
                  onChange={setField('sku')}
                  placeholder={t('ui.skuPlaceholder')}
                />
              </Field>
              <Field label={t('ui.weightKg')}>
                <TextInput
                  value={form.weight}
                  onChange={setField('weight')}
                  placeholder="50"
                />
              </Field>
            </div>
          </>
        ) : (
          <>
            <Field label="SKU">
              <TextInput
                value={form.sku}
                onChange={setField('sku')}
                placeholder={t('ui.skuNumberLower')}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field label={t('ui.warehouseLocation')}>
                {warehouseOptions ? (
                  <SelectInput
                    value={form.warehouseLocation}
                    onChange={setField('warehouseLocation')}
                    options={warehouseOptions}
                  />
                ) : (
                  <TextInput
                    value={form.warehouseLocation}
                    onChange={setField('warehouseLocation')}
                    placeholder={t('ui.enterWarehouseLocation')}
                  />
                )}
              </Field>
              <Field label={t('ui.category')}>
                <SelectInput
                  value={form.categoryId}
                  onChange={handleCategoryChange}
                  options={resolvedCategoryOptions}
                />
              </Field>
              <Field label={t('ui.subCategory')}>
                <SelectInput
                  value={form.subCategoryId}
                  onChange={handleSubCategoryChange}
                  options={resolvedSubCategoryOptions}
                  disabled={!form.categoryId && !subCategoryOptions}
                />
              </Field>
              <Field label={t('ui.productType')}>
                <SelectInput
                  value={form.productTypeId}
                  onChange={setField('productTypeId')}
                  options={resolvedProductTypeOptions}
                  disabled={!form.subCategoryId && !productTypeOptions}
                />
              </Field>
            </div>

            <Field label={t('ui.title')}>
              <TextInput
                value={form.title}
                onChange={setField('title')}
                placeholder={t('ui.titlePlaceholder')}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <Field label={t('ui.quantity')}>
                <TextInput
                  value={form.quantity}
                  onChange={setField('quantity')}
                  placeholder={t('ui.quantityExample')}
                />
              </Field>
              <Field label={t('ui.basePrice')}>
                <TextInput
                  value={form.basePrice}
                  onChange={setField('basePrice')}
                  placeholder="€120.00"
                />
              </Field>
              <Field label={t('ui.b2bDiscount')}>
                <TextInput
                  value={form.b2bDiscount}
                  onChange={setField('b2bDiscount')}
                  placeholder="20%"
                />
              </Field>
              <Field label={t('ui.minB2bQuantity')}>
                <TextInput
                  value={form.minB2bQuantity}
                  onChange={setField('minB2bQuantity')}
                  placeholder={t('ui.minQuantityExample')}
                />
              </Field>
              <Field label={t('ui.weight')}>
                <TextInput
                  value={form.weight}
                  onChange={setField('weight')}
                  placeholder={t('ui.weightExample')}
                />
              </Field>
            </div>
          </>
        )}

        <AiTextSection
          label={t('ui.description')}
          value={form.description}
          onChange={setField('description')}
          placeholder={t('ui.descriptionPlaceholder')}
          aiLabel={t('fallback.useAiDescription')}
          onAiClick={() => handleAi('description')}
          aiLoading={aiLoading === 'description'}
        />

        <AiTextSection
          label={t('ui.feature')}
          value={form.feature}
          onChange={setField('feature')}
          placeholder={t('ui.featurePlaceholder')}
          aiLabel={t('fallback.useAiFeature')}
          onAiClick={() => handleAi('feature')}
          aiLoading={aiLoading === 'feature'}
        />

        <AiTextSection
          label={t('ui.additionalInformation')}
          value={form.additionalInformation}
          onChange={setField('additionalInformation')}
          placeholder={t('ui.additionalPlaceholder')}
          aiLabel={t('fallback.useAiInformation')}
          onAiClick={() => handleAi('additionalInformation')}
          aiLoading={aiLoading === 'additionalInformation'}
        />

        <AiTextSection
          label={t('ui.specifications')}
          value={form.specifications}
          onChange={setField('specifications')}
          placeholder={t('ui.specificationsPlaceholder')}
          aiLabel={t('fallback.useAiSpecification')}
          onAiClick={() => handleAi('specifications')}
          aiLoading={aiLoading === 'specifications'}
        />

        {!isFactory ? (
          <BulkOptionSection
            enabled={form.bulkEnabled}
            tiers={form.bulkTiers}
            onToggle={(bulkEnabled) => patch({ bulkEnabled })}
            onTierChange={(bulkTiers) => patch({ bulkTiers })}
            onAddTier={() =>
              patch({
                bulkTiers: [
                  ...form.bulkTiers,
                  {
                    id: `tier-${Date.now()}`,
                    quantity: '',
                    price: '',
                  },
                ],
              })
            }
          />
        ) : null}

        <ImageDropzone
          label={t('ui.bannerImage')}
          files={form.bannerImage}
          maxFiles={1}
          onChange={(bannerImage) => patch({ bannerImage })}
        />

        <ImageDropzone
          label={t('ui.otherImages')}
          files={form.otherImages}
          maxFiles={8}
          meta={['JPEG, PNG', t('fallback.resolutionRecommended')]}
          onChange={(otherImages) => patch({ otherImages })}
        />

        <div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--active)] px-8 text-base font-bold tracking-tight text-white uppercase hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? t('ui.saving') : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
