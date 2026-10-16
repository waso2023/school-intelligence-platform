import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "eduintel-kenya-production-jwt-secret-key-super-secure-32-bytes";
const JWT_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  schoolId: string;
  schoolName: string;
  permissions: string[];
  avatarUrl?: string | null;
}

/**
 * Sign a new JWT session token (valid for 7 days)
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_KEY);
}

/**
 * Verify and decode an existing JWT session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_KEY);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
