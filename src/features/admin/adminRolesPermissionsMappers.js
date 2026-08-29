/** Map backend permission matrix row */
export function mapAdminRolePermissionEditRow(row) {
  return {
    id: row.id,
    module: row.module,
    editEnabled: Boolean(row.editEnabled),
  }
}

export function mapAdminRolePermissionVisibilityRow(row) {
  return {
    id: row.id,
    module: row.module,
    visible: Boolean(row.visible),
  }
}

export function mapAdminRolePermissionRole(role) {
  return {
    value: role.value,
    name: role.name,
  }
}

/** Build PUT payload from edit matrix rows */
export function toAdminRolePermissionEditPayload(rows) {
  return rows.map((row) => ({
    id: row.id,
    editEnabled: Boolean(row.editEnabled),
  }))
}
