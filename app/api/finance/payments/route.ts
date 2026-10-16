import { NextRequest, NextResponse } from "next/server";
import { getTenantContext, assertTenantOwnership } from "@/lib/auth/tenant";
import { hasPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS } from "@/lib/permissions/permissions";
import { FinanceService } from "@/lib/finance/financeService";
import { getStudentById } from "@/lib/data/students-store";

export async function GET(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId") || undefined;

    const payments = await FinanceService.getPayments(tenantCtx.schoolId, studentId);

    return NextResponse.json({
      success: true,
      total: payments.length,
      data: payments,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(tenantCtx.user.permissions, PERMISSIONS.FEES_RECORD_PAYMENT)) {
      return NextResponse.json({ error: "Forbidden: fees.record_payment required" }, { status: 403 });
    }

    const body = await req.json();
    const { studentId, invoiceId, amount, paymentMethod, transactionReference, payerName, payerPhone, notes } = body;

    if (!studentId || !amount || !transactionReference) {
      return NextResponse.json(
        { error: "Missing required payment fields: studentId, amount, transactionReference" },
        { status: 400 }
      );
    }

    const student = getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await assertTenantOwnership(student.schoolId, tenantCtx);

    const payment = await FinanceService.recordPayment({
      schoolId: tenantCtx.schoolId,
      studentId,
      invoiceId,
      amount: Number(amount),
      paymentMethod: paymentMethod || "MPESA",
      transactionReference,
      payerName: payerName || `${student.parent.fullName}`,
      payerPhone: payerPhone || student.parent.phone,
      recordedByUserId: tenantCtx.user.email,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully recorded and receipt issued",
      data: payment,
    }, { status: 201 });
  } catch (error: any) {
    if (error?.message?.startsWith("DUPLICATE_TRANSACTION")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error?.message?.startsWith("SECURITY_VIOLATION")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: error?.message || "Failed to record payment" }, { status: 500 });
  }
}
