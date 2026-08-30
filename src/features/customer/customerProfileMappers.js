function emptyAddressForm() {
  return {
    firstName: '',
    lastName: '',
    companyName: '',
    address: '',
    region: '',
    city: '',
    zipCode: '',
    email: '',
    phone: '',
    country: '',
  }
}

export function emptyCustomerProfileForm() {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    region: '',
    city: '',
    zipCode: '',
    address: '',
    avatarUrl: null,
    iban: '',
    ibanPhone: '',
    companyName: '',
    billingAddress: emptyAddressForm(),
    shippingAddress: emptyAddressForm(),
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

function mapAddressToForm(address) {
  if (!address) return emptyAddressForm()

  return {
    id: address.id,
    firstName: address.firstName ?? '',
    lastName: address.lastName ?? '',
    companyName: address.companyName ?? '',
    address: address.address ?? '',
    region: address.region ?? '',
    city: address.city ?? '',
    zipCode: address.zipCode ?? '',
    email: address.email ?? '',
    phone: address.phone ?? '',
    country: address.country ?? '',
  }
}

/** Map backend customer profile → PanelProfile buyer form */
export function mapCustomerProfileToForm(profile) {
  if (!profile) return emptyCustomerProfileForm()

  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    region: profile.region ?? '',
    city: profile.city ?? '',
    zipCode: profile.zipCode ?? '',
    address: profile.address ?? '',
    avatarUrl: profile.avatarUrl ?? null,
    iban: profile.iban ?? '',
    ibanPhone: profile.ibanPhone ?? '',
    companyName: profile.companyName ?? '',
    billingAddress: mapAddressToForm(profile.billingAddress),
    shippingAddress: mapAddressToForm(profile.shippingAddress),
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

export function mapCustomerProfileToPayload(form) {
  return {
    firstName: String(form.firstName || '').trim(),
    lastName: String(form.lastName || '').trim(),
    email: String(form.email || '').trim(),
    phone: String(form.phone || '').trim(),
    region: String(form.region || '').trim(),
    city: String(form.city || '').trim(),
    zipCode: String(form.zipCode || '').trim(),
    address: String(form.address || '').trim(),
  }
}

export function mapCustomerAddressToPayload(address = {}) {
  return {
    firstName: String(address.firstName || '').trim(),
    lastName: String(address.lastName || '').trim(),
    companyName: String(address.companyName || '').trim(),
    address: String(address.address || '').trim(),
    region: String(address.region || '').trim(),
    city: String(address.city || '').trim(),
    zipCode: String(address.zipCode || '').trim(),
    email: String(address.email || '').trim(),
    phone: String(address.phone || '').trim(),
  }
}
