import { cookies } from "next/headers";
import { verifySessionToken, signSessionToken, SessionPayload } from "./jwt";
import { verifyPassword } from "./password";
import { DEMO_USERS, DEMO_SCHOOL } from "../data/demo-data";
import { prisma } from "../db/prisma";
import { getPermissionsForRole, hasPermission } from "../permissions/rbac";
import { PermissionCode } from "../permissions/permissions";

export const SESSION_COOKIE_NAME = "sop_school_session";

/**
 * Retrieves the current authenticated user session from HTTP cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Enforces authentication. Throws or returns session.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Enforces a specific permission for the current tenant user.
 */
export async function requirePermission(permission: PermissionCode | string): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!hasPermission(session.permissions, permission)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

/**
 * Authenticates user credentials with DB first, falling back to Demo Store
 */
export async function authenticateCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; session?: SessionPayload; token?: string; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Try Prisma Database if accessible
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { school: true, customRole: true },
    });

    if (dbUser) {
      const isPasswordValid = await verifyPassword(password, dbUser.passwordHash);
      if (isPasswordValid) {
        const permissions = getPermissionsForRole(dbUser.role);
        const payload: SessionPayload = {
          userId: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          schoolId: dbUser.schoolId,
          schoolName: dbUser.school.name,
          permissions,
          avatarUrl: dbUser.avatarUrl,
        };

        const token = await signSessionToken(payload);
        return { success: true, session: payload, token };
      }
    }
  } catch (dbError) {
    // Database may not be connected yet in local environment, fallback to demo store
  }

  // 2. Demo Store Authentication Fallback
  const demoUser = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (demoUser) {
    const isValid = demoUser.password === password;
    if (!isValid) {
      return { success: false, error: "Invalid credentials. Please verify your password." };
    }

    const payload: SessionPayload = {
      userId: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role,
      schoolId: demoUser.schoolId,
      schoolName: DEMO_SCHOOL.name,
      permissions: demoUser.permissions,
      avatarUrl: demoUser.avatarUrl,
    };

    const token = await signSessionToken(payload);
    return { success: true, session: payload, token };
  }

  return { success: false, error: "No school account found with that email address." };
}
