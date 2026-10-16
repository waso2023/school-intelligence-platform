import { NextResponse } from "next/server";
import { DEMO_USERS, DEMO_SCHOOL } from "@/lib/data/demo-data";
import { signSessionToken, SessionPayload } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, email } = body;

    const targetUser = email
      ? DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
      : DEMO_USERS.find((u) => u.role === role);

    if (!targetUser) {
      return NextResponse.json({ error: `Demo account not found` }, { status: 404 });
    }

    const payload: SessionPayload = {
      userId: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      schoolId: targetUser.schoolId,
      schoolName: DEMO_SCHOOL.name,
      permissions: targetUser.permissions,
      avatarUrl: targetUser.avatarUrl,
    };

    const token = await signSessionToken(payload);

    const response = NextResponse.json({
      success: true,
      message: `Switched session to ${targetUser.name} (${targetUser.role})`,
      user: payload,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to switch demo role" }, { status: 500 });
  }
}
