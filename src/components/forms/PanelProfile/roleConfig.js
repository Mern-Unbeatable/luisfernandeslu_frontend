/**
 * Exact section map from the My Profile mockups (per role).
 *
 * 1 admin       — name+email, full password, IBAN
 * 2 affiliate   — name+email+phone, simple password, IBAN
 * 3 transporter — split cards, avatar upload, personal info, IBAN
 * 4 factory     — phone + warehouses, simple password, IBAN
 * 5 supplier    — phone + warehouses, full password, IBAN
 */
export const PANEL_PROFILE_ROLE_CONFIG = {
  admin: {
    layout: 'combined',
    showAvatarActions: false,
    showAccountPhone: false,
    showWarehouses: false,
    passwordMode: 'full',
    showIban: true,
    subtitle: 'Manage your account and store preferences.',
    accountTitle: 'Account Information',
    nameLabel: 'Name',
    passwordTitle: 'Change Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    updateProfileLabel: 'Update Profile',
    changePasswordLabel: 'Change Password',
    profileActionsAlign: 'end',
    passwordActionsAlign: 'end',
    ibanPhoneLabel: 'Phone number ( Eupago number )',
    ibanPhonePlaceholder: '8+ characters',
  },
  affiliate: {
    layout: 'combined',
    showAvatarActions: false,
    showAccountPhone: true,
    showWarehouses: false,
    passwordMode: 'simple',
    showIban: true,
    subtitle: 'Manage your account and store preferences.',
    accountTitle: 'Account Information',
    nameLabel: 'Name',
    passwordTitle: 'Change Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    updateProfileLabel: 'Update Profile',
    changePasswordLabel: 'Change Password',
    profileActionsAlign: 'end',
    passwordActionsAlign: 'end',
    ibanPhoneLabel: 'Phone number ( E-pagar number )',
    ibanPhonePlaceholder: '8+ characters',
  },
  transporter: {
    layout: 'split',
    showAvatarActions: true,
    showAccountPhone: true,
    showWarehouses: false,
    passwordMode: 'simple',
    showIban: true,
    subtitle: 'Manage your account preferences and business configuration.',
    accountTitle: 'Personal Information',
    nameLabel: 'Full Name',
    passwordTitle: 'Update your password.',
    newPasswordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    updateProfileLabel: 'SAVE CHANGES',
    changePasswordLabel: 'SAVE CHANGES',
    profileActionsAlign: 'end',
    passwordActionsAlign: 'end',
    ibanPhoneLabel: 'Phone number ( backup number )',
    ibanPhonePlaceholder: '8+ characters',
  },
  factory: {
    layout: 'combined',
    showAvatarActions: false,
    showAccountPhone: true,
    showWarehouses: true,
    passwordMode: 'simple',
    showIban: true,
    subtitle: 'Manage your account and store preferences.',
    accountTitle: 'Account Information',
    nameLabel: 'Name',
    passwordTitle: 'Change Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    updateProfileLabel: 'Update Profile',
    changePasswordLabel: 'Change Password',
    profileActionsAlign: 'end',
    passwordActionsAlign: 'end',
    ibanPhoneLabel: 'Phone number ( backup number )',
    ibanPhonePlaceholder: '11+ characters',
  },
  supplier: {
    layout: 'combined',
    showAvatarActions: false,
    showAccountPhone: true,
    showWarehouses: true,
    passwordMode: 'full',
    showIban: true,
    subtitle: 'Manage your account and store preferences.',
    accountTitle: 'Account Information',
    nameLabel: 'Name',
    passwordTitle: 'Change Password',
    newPasswordLabel: 'New Password',
    confirmPasswordLabel: 'Confirm New Password',
    updateProfileLabel: 'Update Profile',
    changePasswordLabel: 'Change Password',
    profileActionsAlign: 'end',
    passwordActionsAlign: 'end',
    ibanPhoneLabel: 'Phone number ( Eupago number )',
    ibanPhonePlaceholder: '8+ characters',
  },
}

export function resolveProfileConfig(role, overrides = {}) {
  const base =
    PANEL_PROFILE_ROLE_CONFIG[role] || PANEL_PROFILE_ROLE_CONFIG.supplier
  const cleaned = Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => value !== undefined),
  )
  return { ...base, ...cleaned }
}
