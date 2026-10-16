import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { FinanceService } from "../lib/finance/financeService";

describe("School Finance & Ledger Management Engine", () => {
  const schoolId = "school-sop-001";

  it("should calculate institutional financial summary and aging brackets", async () => {
    const summary = await FinanceService.getFinancialSummary(schoolId);

    assert.equal(summary.schoolId, schoolId);
    assert.equal(summary.currency, "KES");
    assert.ok(summary.totalBilled > 0, "Total billed should be positive");
    assert.ok(summary.totalCollected > 0, "Total collected should be positive");
    assert.ok(summary.collectionRate >= 0 && summary.collectionRate <= 100, "Collection rate between 0-100%");
    assert.ok(summary.aging.overdue30 >= 0, "Aging overdue 30 bucket should be calculated");
  });

  it("should record a verified payment and issue unique receipt", async () => {
    const uniqueTxnRef = `TEST-TXN-${Date.now()}`;
    const payment = await FinanceService.recordPayment({
      schoolId,
      studentId: "std-001",
      amount: 5000,
      paymentMethod: "MPESA",
      transactionReference: uniqueTxnRef,
      payerName: "David Kimani",
      payerPhone: "+254 722 400 001",
      recordedByUserId: "finance.test@sopacademy.ac.ke",
      notes: "Test fee installment",
    });

    assert.ok(payment.id.startsWith("pay-"));
    assert.ok(payment.receiptNumber.startsWith("REC-2026-"));
    assert.equal(payment.amount, 5000);
    assert.equal(payment.transactionReference, uniqueTxnRef);
    assert.equal(payment.status, "VERIFIED");
  });

  it("should reject duplicate transaction references idempotently", async () => {
    const dupRef = `DUP-TXN-${Date.now()}`;
    await FinanceService.recordPayment({
      schoolId,
      studentId: "std-001",
      amount: 1000,
      paymentMethod: "MPESA",
      transactionReference: dupRef,
      payerName: "David Kimani",
      payerPhone: "+254 722 400 001",
      recordedByUserId: "finance.test@sopacademy.ac.ke",
    });

    // Second attempt with exact same reference must fail with DUPLICATE_TRANSACTION
    await assert.rejects(
      async () => {
        await FinanceService.recordPayment({
          schoolId,
          studentId: "std-001",
          amount: 1000,
          paymentMethod: "MPESA",
          transactionReference: dupRef,
          payerName: "David Kimani",
          payerPhone: "+254 722 400 001",
          recordedByUserId: "finance.test@sopacademy.ac.ke",
        });
      },
      /DUPLICATE_TRANSACTION/
    );
  });

  it("should reject zero or negative payment amounts", async () => {
    await assert.rejects(
      async () => {
        await FinanceService.recordPayment({
          schoolId,
          studentId: "std-001",
          amount: 0,
          paymentMethod: "CASH",
          transactionReference: `ZERO-${Date.now()}`,
          payerName: "Parent",
          payerPhone: "+254 700 000 000",
          recordedByUserId: "finance@sopacademy.ac.ke",
        });
      },
      /INVALID_AMOUNT/
    );
  });

  it("should return student ledger statements accurately", async () => {
    const ledger = await FinanceService.getStudentLedger("std-001", schoolId);
    assert.equal(ledger.studentId, "std-001");
    assert.ok(ledger.invoices.length > 0, "Student should have invoices");
    assert.ok(ledger.payments.length > 0, "Student should have payments");
    assert.equal(ledger.netBalance, Math.max(0, ledger.totalBilled - ledger.totalPaid));
  });
});
