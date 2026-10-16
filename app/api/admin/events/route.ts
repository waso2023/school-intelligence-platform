import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { AdministrationService } from "@/lib/administration/adminService";

export async function GET() {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await AdministrationService.getEvents(tenantCtx.schoolId);
    return NextResponse.json({
      success: true,
      total: events.length,
      data: events,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, date, time, venue, category } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
    }

    const newEvent = await AdministrationService.addEvent({
      schoolId: tenantCtx.schoolId,
      title: title.trim(),
      date: date.trim(),
      time: time?.trim() || "09:00 AM - 12:00 PM",
      venue: venue?.trim() || "School Campus",
      category: category || "ACADEMIC",
    });

    return NextResponse.json({
      success: true,
      message: "Event added to master calendar successfully",
      data: newEvent,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to add event" }, { status: 500 });
  }
}
