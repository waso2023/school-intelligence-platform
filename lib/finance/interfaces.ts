/**
 * Phase 3B Finance & Fees Contract Definitions
 * Prepares the architectural foundation for Tuition Invoicing, Fee Structures,
 * M-Pesa Express/Paybill Reconciliation, and Ledger Balances.
 */

export type FeeFrequency = "TERM" | "ANNUAL" | "ONE_TIME";

export type FeeItemCategory =
  | "TUITION"
  | "BOARDING"
  | "TRANSPORT"
  | "LUNCH"
  | "ACTIVITY"
  | "EXAMINATION"
  | "UNIFORM"
  | "CAUTION_MONEY";

export interface FeeStructureItem {
  id: string;
  code: string; // e.g. "TUI-G8"
  name: string;
  category: FeeItemCategory;
  amount: number; // in KES
  isMandatory: boolean;
  frequency: FeeFrequency;
  applicableGrades: number[]; // e.g. [7, 8, 9]
}

export interface StudentInvoice {
  id: string;
  schoolId: string;
  invoiceNumber: string; // "INV-2026-0001"
  studentId: string;
  academicYear: string;
  term: string;
  items: Array<{
    feeItemId: string;
    description: string;
    amount: number;
  }>;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: "PAID" | "PARTIAL" | "OVERDUE" | "PENDING";
  createdAt: string;
}

export interface PaymentReceipt {
  id: string;
  schoolId: string;
  receiptNumber: string; // "REC-2026-0099"
  invoiceId?: string;
  studentId: string;
  amount: number;
  paymentMethod: "MPESA" | "BANK_TRANSFER" | "CHEQUE" | "CASH";
  transactionReference: string; // M-Pesa receipt code e.g. "QJK891XYZ"
  payerName: string;
  payerPhone: string;
  recordedByUserId: string;
  notes?: string;
  paymentDate: string;
  status: "VERIFIED" | "PENDING_RECONCILIATION" | "REVERSED";
}

export interface FeeWaiverPolicy {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  discountPercentage?: number;
  fixedDiscountAmount?: number;
  applicableCategories: FeeItemCategory[];
  eligibilityCriteria: string;
}

export interface FinanceLedgerServiceContract {
  generateTermInvoices(schoolId: string, academicYear: string, term: string): Promise<number>;
  recordPayment(payment: Omit<PaymentReceipt, "id">): Promise<PaymentReceipt>;
  getStudentLedger(studentId: string): Promise<{ invoices: StudentInvoice[]; payments: PaymentReceipt[]; netBalance: number }>;
  reconcileMpesaTransaction(transactionCode: string): Promise<boolean>;
}
