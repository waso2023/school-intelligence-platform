import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { hasPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { FinanceService } from "@/lib/finance/financeService";
import { getStudents } from "@/lib/data/students-store";

export async function GET(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentIdParam = searchParams.get("studentId");
    const statusParam = searchParams.get("status") as any;

    let targetStudentId = studentIdParam || undefined;

    // Relationship check: If parent, restrict strictly to linked children
    if (tenantCtx.userRole === "PARENT") {
      const parentEmail = tenantCtx.user.email.toLowerCase();
      const linkedStudent = getStudents().find(
        (s) => s.schoolId === tenantCtx.schoolId && s.parent.email.toLowerCase() === parentEmail
      );
      if (!linkedStudent) {
        return NextResponse.json({ success: true, total: 0, data: [] });
      }
      targetStudentId = linkedStudent.id;
    } else if (tenantCtx.userRole === "STUDENT") {
      // If student, restrict to own record (e.g. std-001)
      targetStudentId = "std-001";
    } else {
      // Staff/Finance/Admin requires FEES_VIEW
      if (!hasPermission(tenantCtx.user.permissions, PERMISSIONS.FEES_VIEW)) {
        return NextResponse.json({ error: "Forbidden: fees.view required" }, { status: 403 });
      }
    }

    const invoices = await FinanceService.getInvoices(tenantCtx.schoolId, {
      studentId: targetStudentId,
      status: statusParam,
    });

    return NextResponse.json({
      success: true,
      total: invoices.length,
      data: invoices,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
