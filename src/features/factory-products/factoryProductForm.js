const AI_FIELD_MAP = {
  description: 'description',
  feature: 'feature',
  additionalInformation: 'additionalInfo',
  specifications: 'specifications',
}

export function mapAiFormField(section) {
  return AI_FIELD_MAP[section] || section
}

export function extractAiGeneratedText(response, field) {
  const apiField = mapAiFormField(field)
  return (
    response?.[apiField]
    ?? response?.content
    ?? response?.text
    ?? response?.generated
    ?? ''
  )
}

export function buildFactoryProductFormData(form, { isEdit = false } = {}) {
  const formData = new FormData()

  const createFields = {
    sku: form.sku,
    title: form.title,
    warehouseLocation: form.warehouseLocation,
    categoryId: form.categoryId,
    subCategoryId: form.subCategoryId,
    productTypeId: form.productTypeId,
    basePrice: form.basePrice,
    weightKg: form.weightKg ?? form.weight,
    description: form.description,
    feature: form.feature,
    additionalInfo: form.additionalInformation,
    specifications: form.specifications,
  }

  const editFields = {
    title: form.title,
    warehouseLocation: form.warehouseLocation,
    basePrice: form.basePrice,
    weightKg: form.weightKg ?? form.weight,
    description: form.description,
    feature: form.feature,
    additionalInfo: form.additionalInformation,
    specifications: form.specifications,
  }

  const fields = isEdit ? editFields : createFields

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      formData.append(key, String(value).trim())
    }
  })

  if (form.bannerImage instanceof File) {
    formData.append('bannerImage', form.bannerImage)
  }

  const otherImages = Array.isArray(form.otherImages) ? form.otherImages : []
  otherImages.forEach((file) => {
    if (file instanceof File) {
      formData.append('images', file)
    }
  })

  return formData
}
