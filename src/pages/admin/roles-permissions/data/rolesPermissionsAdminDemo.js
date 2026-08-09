export const INVITE_ROLE_OPTIONS = [
  { value: 'moderator', labelKey: 'roles.moderator' },
  { value: 'admin', labelKey: 'roles.admin' },
  { value: 'viewer', labelKey: 'roles.viewer' },
]

export const ADMIN_PERMISSION_EDIT_MATRIX = [
  {
    id: 'dashboard-overview',
    moduleKey: 'modules.dashboardOverview',
    editEnabled: false,
  },
  {
    id: 'product-management',
    moduleKey: 'modules.productManagement',
    editEnabled: true,
  },
  {
    id: 'supplier-management',
    moduleKey: 'modules.supplierManagement',
    editEnabled: true,
  },
  {
    id: 'factory-management',
    moduleKey: 'modules.factoryManagement',
    editEnabled: true,
  },
  {
    id: 'transporter-management',
    moduleKey: 'modules.transporterManagement',
    editEnabled: false,
  },
  {
    id: 'product-moderation',
    moduleKey: 'modules.productModeration',
    editEnabled: false,
  },
]

export const ADMIN_PERMISSION_VISIBILITY_MATRIX = [
  {
    id: 'overview-analytics',
    moduleKey: 'visibilityModules.overviewAnalytics',
    visible: false,
  },
  {
    id: 'classes-courses',
    moduleKey: 'visibilityModules.classesCourses',
    visible: true,
  },
  {
    id: 'member-database',
    moduleKey: 'visibilityModules.memberDatabase',
    visible: true,
  },
  {
    id: 'instructor-directory',
    moduleKey: 'visibilityModules.instructorDirectory',
    visible: true,
  },
]
