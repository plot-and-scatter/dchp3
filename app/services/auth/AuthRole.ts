export type AuthRole =
  | "Display" // Lowest level
  | "Student / Editor" // Intermediate level
  | "Research Assistant" // Senior level
  | "Superadmin" // Highest level

export type AuthPermission =
  | "bank:create"
  | "bank:deleteAny"
  | "bank:editAny"
  | "bank:editOwn"
  | "bank:read"
  | "det:createDraft"
  | "det:deleteAny"
  | "det:editAny"
  | "det:editOwn"
  | "det:publish"
  | "det:editReferences"
  | "det:TEST" // for testing only

const DISPLAY_PERMISSIONS: AuthPermission[] = ["bank:read"]
const STUDENT_EDITOR_PERMISSIONS: AuthPermission[] = [
  ...DISPLAY_PERMISSIONS,
  "bank:create",
  "bank:editOwn",
  "det:createDraft",
  "det:editOwn",
]
const RESEARCH_ASSISTANT_PERMISSIONS: AuthPermission[] = [
  ...STUDENT_EDITOR_PERMISSIONS,
  "bank:editAny",
  "det:editAny",
  "det:editReferences",
]
const SUPERADMIN_PERMISSIONS: AuthPermission[] = [
  ...RESEARCH_ASSISTANT_PERMISSIONS,
  "bank:deleteAny",
  "det:deleteAny",
  "det:publish",
]

export const AUTH_PERMISSION_ROLE_MAP: Record<AuthRole, AuthPermission[]> = {
  Display: DISPLAY_PERMISSIONS,
  "Student / Editor": STUDENT_EDITOR_PERMISSIONS,
  "Research Assistant": RESEARCH_ASSISTANT_PERMISSIONS,
  Superadmin: SUPERADMIN_PERMISSIONS,
}

export const getPermissionsMap = (roles: AuthRole[]) => {
  const map: Partial<Record<AuthRole, AuthPermission[]>> = {}

  roles.forEach((r) => (map[r] = AUTH_PERMISSION_ROLE_MAP[r]))

  return map
}

export const roleHasPermission = (
  role: AuthRole,
  permission: AuthPermission
): boolean => {
  const permissionsForRole = AUTH_PERMISSION_ROLE_MAP[role]
  return permissionsForRole.includes(permission)
}

export const roleHasAllPermissions = (
  role: AuthRole,
  permissions: AuthPermission[]
): boolean => {
  return permissions.every((p) => roleHasPermission(role, p))
}

export const rolesContainPermission = (
  roles: AuthRole[],
  permission: AuthPermission
): boolean => {
  return roles.find((r) => roleHasPermission(r, permission)) !== undefined
}
