import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MpesaService, DarajaCallbackPayload } from "../lib/finance/mpesaService";

describe("Safaricom Daraja M-Pesa Gateway Engine", () => {
  it("should normalize valid Kenyan mobile phone numbers", () => {
    assert.equal(MpesaService.formatKenyanPhoneNumber("0722400001"), "254722400001");
    assert.equal(MpesaService.formatKenyanPhoneNumber("+254 722 400 001"), "254722400001");
    assert.equal(MpesaService.formatKenyanPhoneNumber("254722400001"), "254722400001");
    assert.equal(MpesaService.formatKenyanPhoneNumber("0110123456"), "254110123456");
  });

  it("should reject invalid phone numbers", () => {
    assert.throws(() => MpesaService.formatKenyanPhoneNumber("12345"), /INVALID_PHONE_FORMAT/);
    assert.throws(() => MpesaService.formatKenyanPhoneNumber("abcdef"), /INVALID_PHONE_FORMAT/);
  });

  it("should initiate STK Push request and return checkout request id", async () => {
    const result = await MpesaService.initiateStkPush({
      schoolId: "school-sop-001",
      studentId: "std-001",
      phoneNumber: "0722400001",
      amount: 2500,
      accountReference: "SOP-2024-0082",
      description: "Tuition installment",
    });

    assert.equal(result.success, true);
    assert.equal(result.responseCode, "0");
    assert.ok(result.checkoutRequestId.startsWith("ws_CO_"));
    assert.ok(result.customerMessage.includes("254722400001"));
  });

  it("should process callback and guarantee idempotency on retries", async () => {
    const uniqueMpesaCode = `QWE${Date.now().toString().slice(-7)}`;
    const callbackPayload: DarajaCallbackPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: "29115-34620561-1",
          CheckoutRequestID: `ws_CO_${Date.now()}_99999`,
          ResultCode: 0,
          ResultDesc: "The service request is processed successfully.",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 3000 },
              { Name: "MpesaReceiptNumber", Value: uniqueMpesaCode },
              { Name: "TransactionDate", Value: 20261008123000 },
              { Name: "PhoneNumber", Value: 254722400001 },
            ],
          },
        },
      },
    };

    // First delivery of IPN callback
    const res1 = await MpesaService.processCallback(callbackPayload);
    assert.equal(res1.success, true);
    assert.equal(res1.idempotent, false);
    assert.equal(res1.status, "COMPLETED");
    assert.equal(res1.transactionReference, uniqueMpesaCode);

    // Second delivery of EXACT SAME IPN callback (e.g. network retry from Safaricom)
    const res2 = await MpesaService.processCallback(callbackPayload);
    assert.equal(res2.success, true);
    assert.equal(res2.idempotent, true, "Retried callback must be recognized as idempotent");
    assert.equal(res2.status, "ALREADY_PROCESSED");
    assert.equal(res2.transactionReference, uniqueMpesaCode);
  });

  it("should handle cancelled or failed user STK prompts gracefully", async () => {
    const failedPayload: DarajaCallbackPayload = {
      Body: {
        stkCallback: {
          MerchantRequestID: "29115-34620561-2",
          CheckoutRequestID: `ws_CO_${Date.now()}_failed`,
          ResultCode: 1032,
          ResultDesc: "Request cancelled by user.",
        },
      },
    };

    const result = await MpesaService.processCallback(failedPayload);
    assert.equal(result.success, false);
    assert.equal(result.status, "FAILED");
    assert.ok(result.error?.includes("cancelled"));
  });
});
