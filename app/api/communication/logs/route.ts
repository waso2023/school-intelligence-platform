import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { hasPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { CommunicationService } from "@/lib/communication/communicationService";

export async function GET(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(tenantCtx.user.permissions, PERMISSIONS.COMMUNICATION_VIEW)) {
      return NextResponse.json({ error: "Forbidden: communication.view required" }, { status: 403 });
    }

    const logs = await CommunicationService.getMessageLogs(tenantCtx.schoolId);

    return NextResponse.json({
      success: true,
      total: logs.length,
      data: logs,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch communication logs" }, { status: 500 });
  }
}
