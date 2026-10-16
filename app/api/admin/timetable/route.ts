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

    const { searchParams } = new URL(req.url);
    const className = searchParams.get("class") || undefined;

    const slots = await AdministrationService.getTimetable(tenantCtx.schoolId, className);

    return NextResponse.json({
      success: true,
      total: slots.length,
      data: slots,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch timetable" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(tenantCtx.user.permissions, PERMISSIONS.TIMETABLE_MANAGE)) {
      return NextResponse.json({ error: "Forbidden: timetable.manage required" }, { status: 403 });
    }

    const body = await req.json();
    const { dayOfWeek, period, startTime, endTime, className, streamName, subject, teacherName, room } = body;

    if (!dayOfWeek || !period || !className || !subject || !teacherName || !room) {
      return NextResponse.json(
        { error: "Missing required timetable parameters: dayOfWeek, period, className, subject, teacherName, room" },
        { status: 400 }
      );
    }

    const slot = await AdministrationService.scheduleTimetableSlot({
      schoolId: tenantCtx.schoolId,
      dayOfWeek,
      period: Number(period),
      startTime: startTime || "08:00 AM",
      endTime: endTime || "08:45 AM",
      className,
      streamName: streamName || "East",
      subject,
      teacherName,
      room,
    });

    return NextResponse.json({
      success: true,
      message: "Timetable lesson slot scheduled successfully without conflicts",
      data: slot,
    }, { status: 201 });
  } catch (error: any) {
    if (error?.message?.startsWith("TIMETABLE_TEACHER_CONFLICT") || error?.message?.startsWith("TIMETABLE_ROOM_CONFLICT")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: error?.message || "Failed to schedule timetable slot" }, { status: 500 });
  }
}
