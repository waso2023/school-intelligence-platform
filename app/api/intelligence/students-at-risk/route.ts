import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { hasAnyPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { SchoolMetricsService } from "@/lib/intelligence/schoolMetricsService";

export async function GET(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canView = hasAnyPermission(tenantCtx.user.permissions, [
      PERMISSIONS.AI_USE,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.STUDENTS_VIEW,
      PERMISSIONS.ACADEMICS_VIEW,
    ]);

    if (!canView) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
    }

    const atRiskStudents = await SchoolMetricsService.getStudentsAtRisk(tenantCtx.tenantId);

    return NextResponse.json({
      success: true,
      count: atRiskStudents.length,
      data: atRiskStudents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error fetching at-risk student evaluations" },
      { status: 500 }
    );
  }
}
