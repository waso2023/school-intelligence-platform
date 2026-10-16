import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { hasPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { CommunicationService } from "@/lib/communication/communicationService";

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(tenantCtx.user.permissions, PERMISSIONS.COMMUNICATION_SEND)) {
      return NextResponse.json({ error: "Forbidden: communication.send required" }, { status: 403 });
    }

    const body = await req.json();
    const { recipientName, studentName, recipientPhone, recipientEmail, channel, subject, body: messageBody } = body;

    if (!messageBody || (!recipientPhone && !recipientEmail)) {
      return NextResponse.json(
        { error: "Recipient phone/email and message body are required" },
        { status: 400 }
      );
    }

    const log = await CommunicationService.sendMessage({
      schoolId: tenantCtx.schoolId,
      recipientName: recipientName || "Guardian",
      studentName,
      recipientPhone,
      recipientEmail,
      channel: channel || "SMS",
      subject,
      body: messageBody,
      sender: `${tenantCtx.user.name} (${tenantCtx.userRole})`,
    });

    return NextResponse.json({
      success: true,
      message: "Message queued and delivered via messaging gateway",
      data: log,
    }, { status: 201 });
  } catch (error: any) {
    if (error?.message?.startsWith("DUPLICATE_MESSAGE_DETECTED")) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    return NextResponse.json({ error: error?.message || "Failed to dispatch message" }, { status: 500 });
  }
}
