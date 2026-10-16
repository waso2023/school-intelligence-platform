import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { AdministrationService } from "@/lib/administration/adminService";

export async function GET() {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staff = await AdministrationService.getStaff(tenantCtx.schoolId);
    return NextResponse.json({
      success: true,
      total: staff.length,
      data: staff,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch staff directory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, role, department, email, phone, workload } = body;

    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    const newStaff = await AdministrationService.addStaff({
      schoolId: tenantCtx.schoolId,
      name: name.trim(),
      role: role.trim(),
      department: department?.trim() || "Academics",
      email: email?.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@sopacademy.ac.ke`,
      phone: phone?.trim() || "+254 700 000 000",
      workload: workload?.trim() || "20 periods/wk",
    });

    return NextResponse.json({
      success: true,
      message: "Staff member added successfully",
      data: newStaff,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to add staff member" }, { status: 500 });
  }
}
