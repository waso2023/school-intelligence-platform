import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { hasPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { FinanceService } from "@/lib/finance/financeService";

export async function GET(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(tenantCtx.user.permissions, PERMISSIONS.FEES_VIEW)) {
      return NextResponse.json({ error: "Forbidden: fees.view required" }, { status: 403 });
    }

    const summary = await FinanceService.getFinancialSummary(tenantCtx.schoolId);

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch financial summary" }, { status: 500 });
  }
}
