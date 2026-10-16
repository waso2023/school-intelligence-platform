import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { hasPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { AdministrationService } from "@/lib/administration/adminService";

export async function GET(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(tenantCtx.user.permissions, PERMISSIONS.TRANSPORT_VIEW)) {
      return NextResponse.json({ error: "Forbidden: transport.view required" }, { status: 403 });
    }

    const routes = await AdministrationService.getTransportRoutes(tenantCtx.schoolId);

    return NextResponse.json({
      success: true,
      total: routes.length,
      data: routes,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch transport routes" }, { status: 500 });
  }
}
