import { PERMISSIONS, PermissionCode, ROLE_PERMISSIONS_MAP } from "./permissions";

/**
 * Checks if a given list of permissions grants access to a specific permission.
 * Super Admin or "*" wildcard grants all permissions.
 */
export function hasPermission(
  userPermissions: string[] | undefined | null,
  requiredPermission: PermissionCode | string
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  if (userPermissions.includes("*")) return true;
  return userPermissions.includes(requiredPermission);
}

/**
 * Checks if user has ANY of the required permissions
 */
export function hasAnyPermission(
  userPermissions: string[] | undefined | null,
  requiredPermissions: (PermissionCode | string)[]
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  if (userPermissions.includes("*")) return true;
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Checks if user has ALL of the required permissions
 */
export function hasAllPermissions(
  userPermissions: string[] | undefined | null,
  requiredPermissions: (PermissionCode | string)[]
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;
  if (userPermissions.includes("*")) return true;
  return requiredPermissions.every((perm) => userPermissions.includes(perm));
}

/**
 * Returns the default set of permissions for a role
 */
export function getPermissionsForRole(role: string): PermissionCode[] {
  return ROLE_PERMISSIONS_MAP[role] || [];
}

/**
 * Route access map to verify permissions for dashboard sections
 */
export const ROUTE_PERMISSIONS: Record<string, PermissionCode[]> = {
  "/dashboard": [], // Accessible to all authenticated users
  "/dashboard/students": [PERMISSIONS.STUDENTS_VIEW],
  "/dashboard/finance": [PERMISSIONS.FEES_VIEW],
  "/dashboard/communication": [PERMISSIONS.COMMUNICATION_VIEW],
  "/dashboard/administration": [
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.TIMETABLE_MANAGE,
    PERMISSIONS.EVENTS_MANAGE,
    PERMISSIONS.TRANSPORT_VIEW,
    PERMISSIONS.DISCIPLINE_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
  ],
  "/dashboard/intelligence": [PERMISSIONS.AI_USE],
  "/dashboard/settings": [PERMISSIONS.SETTINGS_MANAGE],
};
