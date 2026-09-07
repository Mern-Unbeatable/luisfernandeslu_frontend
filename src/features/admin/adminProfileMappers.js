export function mapAdminProfileToForm(profile) {
  if (!profile) {
    return {
      displayName: '',
      displayEmail: '',
      name: '',
      email: '',
      avatarUrl: null,
      iban: '',
      ibanPhone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      warehouses: [],
    }
  }

  return {
    displayName: profile.displayName ?? profile.name ?? '',
    displayEmail: profile.displayEmail ?? profile.email ?? '',
    name: profile.name ?? '',
    email: profile.email ?? '',
    avatarUrl: profile.avatarUrl ?? null,
    iban: profile.iban ?? '',
    ibanPhone: profile.ibanPhone ?? '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    warehouses: [],
  }
}
