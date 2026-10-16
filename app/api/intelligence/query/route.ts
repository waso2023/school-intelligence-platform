import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { hasAnyPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { AIToolDispatcher } from "@/lib/ai/tools/toolsRegistry";
import { AIContext } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canUseAI = hasAnyPermission(tenantCtx.user.permissions, [
      PERMISSIONS.AI_USE,
      PERMISSIONS.AI_CHAT,
    ]);

    if (!canUseAI) {
      return NextResponse.json(
        { error: "Forbidden: user does not have permission to use AI Intelligence" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const aiContext: AIContext = {
      tenantId: tenantCtx.tenantId,
      userId: tenantCtx.user.id,
      userName: tenantCtx.user.name,
      userRole: tenantCtx.user.role,
      permissions: tenantCtx.user.permissions,
    };

    const analysis = await AIToolDispatcher.processInquiry(query, aiContext);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process AI query" },
      { status: 500 }
    );
  }
}
