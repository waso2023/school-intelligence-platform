import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { hasPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { AdministrationService } from "@/lib/administration/adminService";
import { getStudentById } from "@/lib/data/students-store";

export async function GET(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(tenantCtx.user.permissions, PERMISSIONS.DISCIPLINE_VIEW)) {
      return NextResponse.json({ error: "Forbidden: discipline.view required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    const cases = await AdministrationService.getDisciplineCases(tenantCtx.schoolId, status);

    return NextResponse.json({
      success: true,
      total: cases.length,
      data: cases,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch discipline records" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(tenantCtx.user.permissions, PERMISSIONS.DISCIPLINE_MANAGE)) {
      return NextResponse.json({ error: "Forbidden: discipline.manage required" }, { status: 403 });
    }

    const body = await req.json();
    const { studentId, incidentType, severity, description, actionTaken, status } = body;

    if (!studentId || !incidentType || !description) {
      return NextResponse.json(
        { error: "Missing required discipline fields: studentId, incidentType, description" },
        { status: 400 }
      );
    }

    const student = getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const incident = await AdministrationService.logDisciplineCase({
      schoolId: tenantCtx.schoolId,
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      className: `${student.className} ${student.streamName}`,
      incidentType,
      severity: severity || "LOW",
      description,
      actionTaken: actionTaken || "Counseling initiated",
      reportedBy: `${tenantCtx.user.name} (${tenantCtx.userRole})`,
      status: status || "RESOLVED",
    });

    return NextResponse.json({
      success: true,
      message: "Pastoral care / discipline incident recorded",
      data: incident,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to record incident" }, { status: 500 });
  }
}
