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
  breadcrumb = 'Product > Add Product',
  title = 'Add Product',
  submitLabel = 'Submit',
  categoryOptions,
  subCategoryOptions,
  productTypeOptions,
  warehouseOptions,
  className = '',
}) {
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
            Back
          </button>
        ) : null}
        <h1 className="text-4xl font-semibold text-zinc-950">{title}</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {isFactory ? (
          <>
            <Field label="Warehouse Location">
              <TextInput
                value={form.warehouseLocation}
                onChange={setField('warehouseLocation')}
                placeholder="Enter warehouse location"
              />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field label="Title">
                <TextInput
                  value={form.title}
                  onChange={setField('title')}
                  placeholder="Portland Cement Quick Set"
                />
              </Field>
              <Field label="Price">
                <TextInput
                  value={form.basePrice}
                  onChange={setField('basePrice')}
                  placeholder="€00.00"
                />
              </Field>
              <Field label="SKU Number">
                <TextInput
                  value={form.sku}
                  onChange={setField('sku')}
                  placeholder="write product sku number"
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
                placeholder="SKU number"
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Warehouse Location">
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
                    placeholder="Enter warehouse location"
                  />
                )}
              </Field>
              <Field label="Category">
                <SelectInput
                  value={form.categoryId}
                  onChange={handleCategoryChange}
                  options={resolvedCategoryOptions}
                />
              </Field>
              <Field label="Sub Category">
                <SelectInput
                  value={form.subCategoryId}
                  onChange={handleSubCategoryChange}
                  options={resolvedSubCategoryOptions}
                  disabled={!form.categoryId && !subCategoryOptions}
                />
              </Field>
              <Field label="Product Type">
                <SelectInput
                  value={form.productTypeId}
                  onChange={setField('productTypeId')}
                  options={resolvedProductTypeOptions}
                  disabled={!form.subCategoryId && !productTypeOptions}
                />
              </Field>
            </div>

            <Field label="Title">
              <TextInput
                value={form.title}
                onChange={setField('title')}
                placeholder="Portland Cement Quick Set"
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <Field label="Quantity">
                <TextInput
                  value={form.quantity}
                  onChange={setField('quantity')}
                  placeholder="800 Bags"
                />
              </Field>
              <Field label="Base Price">
                <TextInput
                  value={form.basePrice}
                  onChange={setField('basePrice')}
                  placeholder="€120.00"
                />
              </Field>
              <Field label="B2B Discount">
                <TextInput
                  value={form.b2bDiscount}
                  onChange={setField('b2bDiscount')}
                  placeholder="20%"
                />
              </Field>
              <Field label="Minimum B2B Quantity">
                <TextInput
                  value={form.minB2bQuantity}
                  onChange={setField('minB2bQuantity')}
                  placeholder="10 pcs"
                />
              </Field>
              <Field label="Weight">
                <TextInput
                  value={form.weight}
                  onChange={setField('weight')}
                  placeholder="900 kg"
                />
              </Field>
            </div>
          </>
        )}

        <AiTextSection
          label="Description"
          value={form.description}
          onChange={setField('description')}
          placeholder="Write product description..."
          aiLabel="Use AI Description"
          onAiClick={() => handleAi('description')}
          aiLoading={aiLoading === 'description'}
        />

        <AiTextSection
          label="Feature"
          value={form.feature}
          onChange={setField('feature')}
          placeholder={'High Strength & Durability\nSmooth Workability'}
          aiLabel="Use AI Feature"
          onAiClick={() => handleAi('feature')}
          aiLoading={aiLoading === 'feature'}
        />

        <AiTextSection
          label="Additional Information"
          value={form.additionalInformation}
          onChange={setField('additionalInformation')}
          placeholder="Write additional information..."
          aiLabel="Use AI Information"
          onAiClick={() => handleAi('additionalInformation')}
          aiLoading={aiLoading === 'additionalInformation'}
        />

        <AiTextSection
          label="Specifications"
          value={form.specifications}
          onChange={setField('specifications')}
          placeholder="Write product specifications..."
          aiLabel="Use AI Specification"
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
          label="Product Banner Image"
          files={form.bannerImage}
          maxFiles={1}
          onChange={(bannerImage) => patch({ bannerImage })}
        />

        <ImageDropzone
          label="Others Images"
          files={form.otherImages}
          maxFiles={8}
          meta={['JPEG, PNG', '1920x1080px recommended']}
          onChange={(otherImages) => patch({ otherImages })}
        />

        <div>
          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--active)] px-8 text-base font-bold tracking-tight text-white uppercase hover:brightness-95"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
