import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { MpesaService } from "@/lib/finance/mpesaService";
import { getStudentById } from "@/lib/data/students-store";

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, invoiceId, phoneNumber, amount, description } = body;

    if (!studentId || !phoneNumber || !amount) {
      return NextResponse.json(
        { error: "Missing required STK push parameters: studentId, phoneNumber, amount" },
        { status: 400 }
      );
    }

    const student = getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const result = await MpesaService.initiateStkPush({
      schoolId: tenantCtx.schoolId,
      studentId,
      invoiceId,
      phoneNumber,
      amount: Number(amount),
      accountReference: student.admissionNumber,
      description: description || `Term 1 Fee Payment for ${student.firstName} ${student.lastName}`,
    });

    return NextResponse.json({
      success: true,
      message: "M-Pesa STK Push initiated successfully",
      data: result,
    });
  } catch (error: any) {
    if (error?.message?.startsWith("INVALID_PHONE_FORMAT") || error?.message?.startsWith("INVALID_AMOUNT")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: error?.message || "Failed to initiate M-Pesa STK Push" }, { status: 500 });
  }
}
