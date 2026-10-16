import { NextRequest, NextResponse } from "next/server";
import { MpesaService } from "@/lib/finance/mpesaService";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const result = await MpesaService.processCallback(payload);

    // Always acknowledge Safaricom IPN with standard 200 JSON
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted and processed",
      data: result,
    });
  } catch (error: any) {
    // Safaricom expects a 200 response to avoid infinite retries
    return NextResponse.json({
      ResultCode: 1,
      ResultDesc: error?.message || "Internal error processing callback",
    }, { status: 200 });
  }
}
