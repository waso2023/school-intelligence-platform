import { NextResponse } from "next/server";
import { getStudentById, updateStudent } from "@/lib/data/students-store";
import { getTenantContext, assertStudentAccess, assertTenantOwnership } from "@/lib/auth/tenant";
import { requirePermission } from "@/lib/auth/session";
import { PERMISSIONS } from "@/lib/permissions/permissions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const student = getStudentById(id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Enforce Tenant Scope + Parent-Child link + Student ownership
    await assertStudentAccess(student, tenantCtx);

    return NextResponse.json({ success: true, data: student });
  } catch (error: any) {
    if (error?.message?.startsWith("SECURITY_VIOLATION")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch student profile" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Require edit permission
    await requirePermission(PERMISSIONS.STUDENTS_EDIT);

    const { id } = await params;
    const student = getStudentById(id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Assert that student belongs to current tenant
    await assertTenantOwnership(student.schoolId, tenantCtx);

    const body = await request.json();
    const updated = updateStudent(id, body);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error?.message?.startsWith("SECURITY_VIOLATION") || error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Permission denied or cross-tenant access rejected" }, { status: 403 });
    }
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

