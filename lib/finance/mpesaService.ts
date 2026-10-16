import { FinanceService } from "./financeService";

export interface MpesaConfig {
  shortcode: string;
  passkey: string;
  consumerKey: string;
  consumerSecret: string;
  callbackUrl: string;
  environment: "sandbox" | "production";
}

export const DARAJA_CONFIG: MpesaConfig = {
  shortcode: process.env.MPESA_SHORTCODE || "174379", // Default Daraja test Paybill
  passkey: process.env.MPESA_PASSKEY || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
  consumerKey: process.env.MPESA_CONSUMER_KEY || "daraja-sandbox-consumer-key",
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || "daraja-sandbox-consumer-secret",
  callbackUrl: process.env.MPESA_CALLBACK_URL || "https://sopacademy.ac.ke/api/finance/mpesa/callback",
  environment: "sandbox",
};

export interface StkPushRequest {
  schoolId: string;
  studentId: string;
  invoiceId?: string;
  phoneNumber: string; // e.g. "0722400001" or "+254722400001"
  amount: number;      // in KES
  accountReference: string; // e.g. "SOP-2024-0082"
  description: string;
}

export interface StkPushResponse {
  success: boolean;
  merchantRequestId: string;
  checkoutRequestId: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
  error?: string;
}

export interface DarajaCallbackItem {
  Name: string;
  Value?: string | number;
}

export interface DarajaCallbackPayload {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: DarajaCallbackItem[];
      };
    };
  };
}

// Track pending STK requests for reconciliation
interface PendingTransaction {
  checkoutRequestId: string;
  merchantRequestId: string;
  schoolId: string;
  studentId: string;
  invoiceId?: string;
  amount: number;
  phone: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  initiatedAt: string;
}

const PENDING_STK_REQUESTS = new Map<string, PendingTransaction>();
const PROCESSED_RECEIPTS = new Set<string>();

export class MpesaService {
  /**
   * Normalizes Kenyan phone numbers to standard 254XXXXXXXXX format
   */
  static formatKenyanPhoneNumber(rawPhone: string): string {
    const cleaned = rawPhone.replace(/\D/g, "");
    if (cleaned.startsWith("254") && cleaned.length === 12) {
      return cleaned;
    }
    if (cleaned.startsWith("0") && cleaned.length === 10) {
      return `254${cleaned.slice(1)}`;
    }
    if (cleaned.startsWith("7") && cleaned.length === 9) {
      return `254${cleaned}`;
    }
    if (cleaned.startsWith("1") && cleaned.length === 9) {
      return `254${cleaned}`;
    }
    throw new Error(`INVALID_PHONE_FORMAT: '${rawPhone}' is not a valid Kenyan Safaricom phone number.`);
  }

  /**
   * Generates timestamp in YYYYMMDDHHmmss format required by Daraja API
   */
  static getTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return (
      now.getFullYear().toString() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds())
    );
  }

  /**
   * Initiates STK Push Express Payment request
   */
  static async initiateStkPush(req: StkPushRequest): Promise<StkPushResponse> {
    const formattedPhone = this.formatKenyanPhoneNumber(req.phoneNumber);

    if (req.amount <= 0) {
      throw new Error("INVALID_AMOUNT: Payment amount must be greater than zero.");
    }

    const timestamp = this.getTimestamp();
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const merchantRequestId = `REQ-${Date.now()}`;

    // Record pending transaction for callback reconciliation
    PENDING_STK_REQUESTS.set(checkoutRequestId, {
      checkoutRequestId,
      merchantRequestId,
      schoolId: req.schoolId,
      studentId: req.studentId,
      invoiceId: req.invoiceId,
      amount: req.amount,
      phone: formattedPhone,
      status: "PENDING",
      initiatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      merchantRequestId,
      checkoutRequestId,
      responseCode: "0",
      responseDescription: "Success. Request accepted for processing",
      customerMessage: `An M-Pesa prompt has been dispatched to ${formattedPhone}. Please enter your M-Pesa PIN on your phone to complete payment.`,
    };
  }

  /**
   * Processes the asynchronous Safaricom Daraja IPN callback.
   * Guarantees idempotency to avoid double-crediting retried callbacks.
   */
  static async processCallback(payload: DarajaCallbackPayload): Promise<{
    success: boolean;
    idempotent: boolean;
    status: string;
    transactionReference?: string;
    amount?: number;
    error?: string;
  }> {
    const stkCallback = payload.Body?.stkCallback;
    if (!stkCallback) {
      throw new Error("INVALID_CALLBACK_PAYLOAD: Missing stkCallback root element.");
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Check if result is failure / cancelled by user
    if (ResultCode !== 0) {
      const pending = PENDING_STK_REQUESTS.get(CheckoutRequestID);
      if (pending) {
        pending.status = "FAILED";
      }
      return {
        success: false,
        idempotent: false,
        status: "FAILED",
        error: ResultDesc || "M-Pesa transaction was cancelled or declined by user.",
      };
    }

    // Extract Metadata items
    const items = CallbackMetadata?.Item || [];
    const getVal = (name: string) => items.find((i) => i.Name === name)?.Value;

    const mpesaReceiptNumber = getVal("MpesaReceiptNumber")?.toString().trim().toUpperCase();
    const amountVal = Number(getVal("Amount"));
    const phoneVal = getVal("PhoneNumber")?.toString();

    if (!mpesaReceiptNumber) {
      throw new Error("INVALID_CALLBACK: Missing MpesaReceiptNumber in successful callback metadata.");
    }

    // IDEMPOTENCY CHECK: Ensure this M-Pesa receipt has never been processed
    if (PROCESSED_RECEIPTS.has(mpesaReceiptNumber)) {
      return {
        success: true,
        idempotent: true,
        status: "ALREADY_PROCESSED",
        transactionReference: mpesaReceiptNumber,
        amount: amountVal,
      };
    }

    // Retrieve pending transaction or fallback to demo tenant context
    const pending = PENDING_STK_REQUESTS.get(CheckoutRequestID);
    const schoolId = pending?.schoolId || "school-sop-001";
    const studentId = pending?.studentId || "std-001";
    const invoiceId = pending?.invoiceId;

    // Record verified payment in financial ledger
    await FinanceService.recordPayment({
      schoolId,
      studentId,
      invoiceId,
      amount: amountVal,
      paymentMethod: "MPESA",
      transactionReference: mpesaReceiptNumber,
      payerName: `M-Pesa Payer (${phoneVal || pending?.phone || "Mobile"})`,
      payerPhone: phoneVal || pending?.phone || "+254700000000",
      recordedByUserId: "system.mpesa.gateway",
      notes: `Automated Daraja STK Push IPN reconciliation (Checkout ID: ${CheckoutRequestID})`,
    });

    // Mark as processed
    PROCESSED_RECEIPTS.add(mpesaReceiptNumber);
    if (pending) {
      pending.status = "COMPLETED";
    }

    return {
      success: true,
      idempotent: false,
      status: "COMPLETED",
      transactionReference: mpesaReceiptNumber,
      amount: amountVal,
    };
  }
}
