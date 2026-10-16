import { NextRequest, NextResponse } from "next/server";
import { getTenantContext, assertStudentAccess } from "@/lib/auth/tenant";
import { getStudentById } from "@/lib/data/students-store";
import { hasAnyPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { SchoolMetricsService } from "@/lib/intelligence/schoolMetricsService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canView = hasAnyPermission(tenantCtx.user.permissions, [
      PERMISSIONS.AI_USE,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.STUDENTS_VIEW,
    ]);

    if (!canView) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
    }

    const { id: studentId } = await params;
    const student = getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found in this school" }, { status: 404 });
    }

    // Verify parent-child link, student ownership, and tenant scope
    await assertStudentAccess(student, tenantCtx);

    const evaluation = await SchoolMetricsService.getStudentRiskById(tenantCtx.tenantId, studentId);

    if (!evaluation) {
      return NextResponse.json({ error: "Risk evaluation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: evaluation,
    });
  } catch (error: any) {
    if (error?.message?.startsWith("SECURITY_VIOLATION")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: error?.message || "Internal server error fetching student risk data" },
      { status: 500 }
    );
  }
}

