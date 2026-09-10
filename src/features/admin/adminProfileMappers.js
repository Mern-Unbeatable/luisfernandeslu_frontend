export function mapAdminProfileToForm(profile) {
  if (!profile) {
    return {
      displayName: '',
      displayEmail: '',
      name: '',
      email: '',
      avatarUrl: null,
      eupagoApiKey: '',
      eupagoExternKey: '',
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
    eupagoApiKey: '',
    eupagoExternKey: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    warehouses: [],
  }
}
