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

    const announcements = await CommunicationService.getAnnouncements(tenantCtx.schoolId);

    return NextResponse.json({
      success: true,
      total: announcements.length,
      data: announcements,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(tenantCtx.user.permissions, PERMISSIONS.COMMUNICATION_ANNOUNCEMENTS)) {
      return NextResponse.json({ error: "Forbidden: communication.announcements required" }, { status: 403 });
    }

    const body = await req.json();
    const { title, channel, targetRole, content, status } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const announcement = await CommunicationService.createAnnouncement({
      schoolId: tenantCtx.schoolId,
      title,
      channel: channel || "SMS & EMAIL",
      targetRole: targetRole || "ALL",
      content,
      status: status || "PUBLISHED",
      author: `${tenantCtx.user.name} (${tenantCtx.userRole})`,
    });

    return NextResponse.json({
      success: true,
      message: "Announcement published successfully",
      data: announcement,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create announcement" }, { status: 500 });
  }
}
