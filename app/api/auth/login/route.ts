import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations/auth";
import { authenticateCredentials, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const authResult = await authenticateCredentials(email, password);

    if (!authResult.success || !authResult.token || !authResult.session) {
      return NextResponse.json(
        { error: authResult.error || "Invalid email or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: authResult.session,
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: authResult.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}
