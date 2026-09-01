// The role names below are the names of the roles in the Auth0 tenant. They
// arrive on the `https://dchp.ca/roles` claim and are the single source of
// truth for what a user may do -- see docs/auth/roles.md. Renaming a role in
// Auth0 without changing this list will stop that role granting anything.
export const AUTH_ROLES = [
  "Display", // Lowest level
  "Student / Editor", // Intermediate level
  "Research Assistant", // Senior level
  "Superadmin", // Highest level
] as const

export type AuthRole = typeof AUTH_ROLES[number]

export const isAuthRole = (value: unknown): value is AuthRole =>
  typeof value === "string" && (AUTH_ROLES as readonly string[]).includes(value)

/**
 * Turn the raw `https://dchp.ca/roles` claim into roles this application
 * recognises. The claim is whatever Auth0 put in the token, so it is treated
 * as unknown: a missing claim, a claim that is not an array, and a role name
 * that is not one of AUTH_ROLES all yield no role rather than a role whose
 * permission set does not exist.
 */
export const parseAuthRoles = (claim: unknown): AuthRole[] => {
  if (!Array.isArray(claim)) return []
  return claim.filter(isAuthRole)
}

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
  | "det:viewUsers"
  | "det:manageUsers"
  | "det:viewEdits"
  | "det:editReferences"
  | "det:TEST" // for testing only

const DISPLAY_PERMISSIONS: AuthPermission[] = ["bank:read"]
const STUDENT_EDITOR_PERMISSIONS: AuthPermission[] = [
  ...DISPLAY_PERMISSIONS,
  "bank:create",
  "bank:editOwn",
  "det:createDraft",
  "det:editOwn",
  "det:viewEdits",
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
  "det:viewUsers",
  "det:manageUsers",
  // det:viewEdits is not repeated here: STUDENT_EDITOR_PERMISSIONS already
  // grants it and this list spreads that one, so listing it again showed the
  // permission twice on /admin.
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
  // A role name this application does not know grants nothing. parseAuthRoles
  // keeps unknown names out of new sessions, but a session cookie issued
  // before that check existed can still carry one, and looking its permissions
  // up unguarded turned a denial into a 500.
  const permissionsForRole = AUTH_PERMISSION_ROLE_MAP[role] as
    | AuthPermission[]
    | undefined
  return permissionsForRole?.includes(permission) ?? false
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
