import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { hasAnyPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { AcademicConfigService } from "@/lib/academics/config";

export async function GET(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = await AcademicConfigService.getConfig(tenantCtx.tenantId);
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load academic configuration" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canManage = hasAnyPermission(tenantCtx.user.permissions, [
      PERMISSIONS.SETTINGS_MANAGE,
      PERMISSIONS.ACADEMICS_MANAGE,
    ]);

    if (!canManage) {
      return NextResponse.json(
        { error: "Forbidden: insufficient permissions to modify academic configuration" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = await AcademicConfigService.updateConfig(tenantCtx.tenantId, body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, config: result.config });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update academic configuration" },
      { status: 500 }
    );
  }
}
