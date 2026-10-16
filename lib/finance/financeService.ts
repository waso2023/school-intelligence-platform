import { getStudents, getStudentById, updateStudent } from "@/lib/data/students-store";
import { StudentInvoice, PaymentReceipt, FeeStructureItem } from "./interfaces";
import { assertTenantOwnership, TenantContext } from "@/lib/auth/tenant";
import { getPersistentCollection } from "@/lib/db/persistentStore";

export interface FeeStructureConfig {
  id: string;
  schoolId: string;
  name: string;
  gradeLevel: number;
  term: string;
  academicYear: string;
  items: Array<{
    category: string;
    description: string;
    amount: number; // in KES cents or exact KES
    isMandatory: boolean;
  }>;
  totalAmount: number;
}

export interface FinancialSummary {
  schoolId: string;
  currency: string;
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  totalStudentsBilled: number;
  paidInFullCount: number;
  partialCount: number;
  overdueCount: number;
  aging: {
    current: number;    // 0-30 days overdue
    overdue30: number;  // 31-60 days
    overdue60: number;  // 61-90 days
    overdue90Plus: number; // 90+ days
  };
}

// In-Memory Persistent Store for Finance Module (Synchronized across server lifetime)
let FEE_STRUCTURES: FeeStructureConfig[] = [
  {
    id: "fs-g7-t1",
    schoolId: "school-sop-001",
    name: "Grade 7 Term 1 Fee Schedule 2026",
    gradeLevel: 7,
    term: "Term 1",
    academicYear: "2026",
    items: [
      { category: "TUITION", description: "CBC Junior Secondary Tuition", amount: 55000, isMandatory: true },
      { category: "ACTIVITY", description: "ICT & Creative Arts Lab Levies", amount: 10000, isMandatory: true },
      { category: "LUNCH", description: "Hot Meal & Lunch Catering", amount: 15000, isMandatory: false },
    ],
    totalAmount: 80000,
  },
  {
    id: "fs-g8-t1",
    schoolId: "school-sop-001",
    name: "Grade 8 Term 1 Fee Schedule 2026",
    gradeLevel: 8,
    term: "Term 1",
    academicYear: "2026",
    items: [
      { category: "TUITION", description: "CBC Junior Secondary Tuition", amount: 60000, isMandatory: true },
      { category: "ACTIVITY", description: "Science Laboratory & Practical Materials", amount: 10000, isMandatory: true },
      { category: "LUNCH", description: "Hot Meal & Lunch Catering", amount: 15000, isMandatory: false },
    ],
    totalAmount: 85000,
  },
  {
    id: "fs-y10-t1",
    schoolId: "school-sop-001",
    name: "Year 10 Term 1 Cambridge IGCSE Fee Schedule 2026",
    gradeLevel: 10,
    term: "Term 1",
    academicYear: "2026",
    items: [
      { category: "TUITION", description: "Cambridge CAIE Core Tuition", amount: 70000, isMandatory: true },
      { category: "EXAMINATION", description: "IGCSE Coursework & Assessment Levy", amount: 15000, isMandatory: true },
      { category: "LUNCH", description: "Dining & Catering Package", amount: 15000, isMandatory: false },
    ],
    totalAmount: 100000,
  },
];

const INITIAL_INVOICES: StudentInvoice[] = [
  {
    id: "inv-2026-001",
    schoolId: "school-sop-001",
    invoiceNumber: "INV-2026-0082",
    studentId: "std-001",
    academicYear: "2026",
    term: "Term 1",
    items: [
      { feeItemId: "tui-1", description: "CBC Junior Secondary Tuition", amount: 60000 },
      { feeItemId: "act-1", description: "Science Laboratory Materials", amount: 10000 },
      { feeItemId: "lch-1", description: "Hot Meal & Lunch Catering", amount: 15000 },
    ],
    totalAmount: 85000,
    paidAmount: 60000,
    balance: 25000,
    dueDate: "2026-10-31",
    status: "PARTIAL",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "inv-2026-002",
    schoolId: "school-sop-001",
    invoiceNumber: "INV-2026-0083",
    studentId: "std-002",
    academicYear: "2026",
    term: "Term 1",
    items: [
      { feeItemId: "tui-1", description: "CBC Junior Secondary Tuition", amount: 60000 },
      { feeItemId: "act-1", description: "Science Laboratory Materials", amount: 10000 },
      { feeItemId: "lch-1", description: "Hot Meal & Lunch Catering", amount: 15000 },
    ],
    totalAmount: 85000,
    paidAmount: 85000,
    balance: 0,
    dueDate: "2026-10-31",
    status: "PAID",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "inv-2026-003",
    schoolId: "school-sop-001",
    invoiceNumber: "INV-2026-0084",
    studentId: "std-003",
    academicYear: "2026",
    term: "Term 1",
    items: [
      { feeItemId: "tui-1", description: "CBC Junior Secondary Tuition", amount: 60000 },
      { feeItemId: "act-1", description: "Science Laboratory Materials", amount: 10000 },
      { feeItemId: "lch-1", description: "Hot Meal & Lunch Catering", amount: 15000 },
    ],
    totalAmount: 85000,
    paidAmount: 45000,
    balance: 40000,
    dueDate: "2026-09-30",
    status: "OVERDUE",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "inv-2026-004",
    schoolId: "school-sop-001",
    invoiceNumber: "INV-2026-0085",
    studentId: "std-004",
    academicYear: "2026",
    term: "Term 1",
    items: [
      { feeItemId: "tui-1", description: "CBC Junior Secondary Tuition", amount: 60000 },
      { feeItemId: "act-1", description: "Science Laboratory Materials", amount: 10000 },
      { feeItemId: "lch-1", description: "Hot Meal & Lunch Catering", amount: 15000 },
    ],
    totalAmount: 85000,
    paidAmount: 70000,
    balance: 15000,
    dueDate: "2026-10-31",
    status: "PARTIAL",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "inv-2026-005",
    schoolId: "school-sop-001",
    invoiceNumber: "INV-2026-0086",
    studentId: "std-005",
    academicYear: "2026",
    term: "Term 1",
    items: [
      { feeItemId: "tui-y10", description: "Cambridge CAIE Core Tuition", amount: 70000 },
      { feeItemId: "exm-1", description: "IGCSE Coursework Levy", amount: 15000 },
      { feeItemId: "lch-1", description: "Dining & Catering Package", amount: 15000 },
    ],
    totalAmount: 100000,
    paidAmount: 55000,
    balance: 45000,
    dueDate: "2026-09-25",
    status: "OVERDUE",
    createdAt: "2026-09-01T08:00:00Z",
  },
];

const INITIAL_PAYMENTS: PaymentReceipt[] = [
  {
    id: "pay-001",
    schoolId: "school-sop-001",
    receiptNumber: "REC-2026-0089",
    invoiceId: "inv-2026-001",
    studentId: "std-001",
    amount: 60000,
    paymentMethod: "MPESA",
    transactionReference: "QWE89284KL",
    payerName: "David Kimani",
    payerPhone: "+254 722 400 001",
    recordedByUserId: "finance.peter@sopacademy.ac.ke",
    notes: "Term 1 initial installment via M-Pesa Express",
    paymentDate: "2026-10-07T14:22:00Z",
    status: "VERIFIED",
  },
  {
    id: "pay-002",
    schoolId: "school-sop-001",
    receiptNumber: "REC-2026-0088",
    invoiceId: "inv-2026-002",
    studentId: "std-002",
    amount: 85000,
    paymentMethod: "BANK_TRANSFER",
    transactionReference: "KCB-TXN-902188",
    payerName: "Grace Otieno",
    payerPhone: "+254 722 500 002",
    recordedByUserId: "finance.peter@sopacademy.ac.ke",
    notes: "Full term payment via KCB Bank wire",
    paymentDate: "2026-10-06T11:05:00Z",
    status: "VERIFIED",
  },
  {
    id: "pay-003",
    schoolId: "school-sop-001",
    receiptNumber: "REC-2026-0087",
    invoiceId: "inv-2026-005",
    studentId: "std-005",
    amount: 55000,
    paymentMethod: "MPESA",
    transactionReference: "QWD45129MM",
    payerName: "Hassan Chebet",
    payerPhone: "+254 722 600 005",
    recordedByUserId: "finance.peter@sopacademy.ac.ke",
    notes: "Term 1 partial payment",
    paymentDate: "2026-10-05T09:41:00Z",
    status: "VERIFIED",
  },
  {
    id: "pay-004",
    schoolId: "school-sop-001",
    receiptNumber: "REC-2026-0086",
    invoiceId: "inv-2026-003",
    studentId: "std-003",
    amount: 45000,
    paymentMethod: "MPESA",
    transactionReference: "QWB12903ZZ",
    payerName: "Lucy Muthoni",
    payerPhone: "+254 722 555 123",
    recordedByUserId: "finance.peter@sopacademy.ac.ke",
    notes: "Term 1 installment",
    paymentDate: "2026-10-03T16:10:00Z",
    status: "VERIFIED",
  },
];

const invoicesCollection = getPersistentCollection<StudentInvoice>("invoices", () => INITIAL_INVOICES);
const paymentsCollection = getPersistentCollection<PaymentReceipt>("payments", () => INITIAL_PAYMENTS);

export class FinanceService {
  /**
   * Retrieves all fee structures for a given school tenant
   */
  static async getFeeStructures(schoolId: string): Promise<FeeStructureConfig[]> {
    return FEE_STRUCTURES.filter((fs) => fs.schoolId === schoolId);
  }

  /**
   * Retrieves invoices with optional filters
   */
  static async getInvoices(
    schoolId: string,
    filters?: {
      studentId?: string;
      term?: string;
      status?: "PAID" | "PARTIAL" | "OVERDUE" | "PENDING";
    }
  ): Promise<StudentInvoice[]> {
    let results = invoicesCollection.getAll().filter((inv) => inv.schoolId === schoolId);

    if (filters?.studentId) {
      results = results.filter((inv) => inv.studentId === filters.studentId);
    }
    if (filters?.term) {
      results = results.filter((inv) => inv.term === filters.term);
    }
    if (filters?.status) {
      results = results.filter((inv) => inv.status === filters.status);
    }

    return results;
  }

  /**
   * Retrieves all payments/receipts for a school tenant
   */
  static async getPayments(schoolId: string, studentId?: string): Promise<PaymentReceipt[]> {
    let list = paymentsCollection.getAll().filter((p) => p.schoolId === schoolId);
    if (studentId) {
      list = list.filter((p) => p.studentId === studentId);
    }
    return list;
  }

  /**
   * Calculates comprehensive institutional financial metrics & aging buckets
   */
  static async getFinancialSummary(schoolId: string): Promise<FinancialSummary> {
    const invoices = invoicesCollection.getAll().filter((i) => i.schoolId === schoolId);
    const totalBilled = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalCollected = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
    const totalOutstanding = invoices.reduce((sum, i) => sum + i.balance, 0);

    const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 1000) / 10 : 0;

    const paidInFullCount = invoices.filter((i) => i.balance <= 0).length;
    const partialCount = invoices.filter((i) => i.paidAmount > 0 && i.balance > 0).length;
    const overdueCount = invoices.filter((i) => i.status === "OVERDUE" || (i.balance > 0 && new Date(i.dueDate) < new Date())).length;

    // Aging breakdown (relative to today)
    const now = new Date();
    let current = 0;
    let overdue30 = 0;
    let overdue60 = 0;
    let overdue90Plus = 0;

    for (const inv of invoices) {
      if (inv.balance <= 0) continue;
      const dueDate = new Date(inv.dueDate);
      const diffDays = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        current += inv.balance;
      } else if (diffDays <= 30) {
        overdue30 += inv.balance;
      } else if (diffDays <= 60) {
        overdue60 += inv.balance;
      } else {
        overdue90Plus += inv.balance;
      }
    }

    return {
      schoolId,
      currency: "KES",
      totalBilled,
      totalCollected,
      totalOutstanding,
      collectionRate,
      totalStudentsBilled: invoices.length,
      paidInFullCount,
      partialCount,
      overdueCount,
      aging: {
        current,
        overdue30,
        overdue60,
        overdue90Plus,
      },
    };
  }

  /**
   * Retrieves a student's full financial ledger statement
   */
  static async getStudentLedger(studentId: string, schoolId: string) {
    const invoices = invoicesCollection.getAll().filter((i) => i.studentId === studentId && i.schoolId === schoolId);
    const payments = paymentsCollection.getAll().filter((p) => p.studentId === studentId && p.schoolId === schoolId);

    const totalBilled = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalPaid = payments.filter((p) => p.status === "VERIFIED").reduce((sum, p) => sum + p.amount, 0);
    const netBalance = Math.max(0, totalBilled - totalPaid);

    return {
      studentId,
      schoolId,
      totalBilled,
      totalPaid,
      netBalance,
      invoices,
      payments,
    };
  }

  /**
   * Records a verified payment, updates invoice balance, and issues a receipt.
   * Guarantees transaction reference uniqueness.
   */
  static async recordPayment(
    data: Omit<PaymentReceipt, "id" | "receiptNumber" | "paymentDate" | "status"> & {
      paymentDate?: string;
    }
  ): Promise<PaymentReceipt> {
    // 1. Transaction Reference Uniqueness Check (Idempotency)
    const normalizedRef = data.transactionReference.trim().toUpperCase();
    const existing = paymentsCollection.find(
      (p) => p.schoolId === data.schoolId && p.transactionReference.toUpperCase() === normalizedRef
    );

    if (existing) {
      throw new Error(`DUPLICATE_TRANSACTION: Payment with reference '${normalizedRef}' has already been processed.`);
    }

    // 2. Amount Validation (Must be positive integer/cents)
    if (data.amount <= 0) {
      throw new Error("INVALID_AMOUNT: Payment amount must be greater than zero.");
    }

    // 3. Issue Sequence Receipt Number
    const allPayments = paymentsCollection.getAll();
    const receiptSeq = (allPayments.length + 90).toString().padStart(4, "0");
    const receiptNumber = `REC-2026-${receiptSeq}`;
    const paymentId = `pay-${Date.now()}`;
    const paymentDate = data.paymentDate || new Date().toISOString();

    const newPayment: PaymentReceipt = {
      id: paymentId,
      schoolId: data.schoolId,
      receiptNumber,
      invoiceId: data.invoiceId,
      studentId: data.studentId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      transactionReference: normalizedRef,
      payerName: data.payerName,
      payerPhone: data.payerPhone,
      recordedByUserId: data.recordedByUserId,
      notes: data.notes,
      paymentDate,
      status: "VERIFIED",
    };

    paymentsCollection.insert(newPayment);

    // 4. Update Target Invoice Balance
    let targetInvoice = data.invoiceId
      ? invoicesCollection.find((i) => i.id === data.invoiceId)
      : invoicesCollection.find((i) => i.studentId === data.studentId && i.balance > 0);

    if (targetInvoice) {
      const newPaid = targetInvoice.paidAmount + data.amount;
      const newBalance = Math.max(0, targetInvoice.totalAmount - newPaid);
      invoicesCollection.update(targetInvoice.id, {
        paidAmount: newPaid,
        balance: newBalance,
        status: newBalance === 0 ? "PAID" : "PARTIAL",
      });
    }

    // 5. Synchronize Student Profile Fee Summary
    const student = getStudentById(data.studentId);
    if (student) {
      const newStudentPaid = student.fees.paidAmount + data.amount;
      const newStudentBalance = Math.max(0, student.fees.expectedAmount - newStudentPaid);
      const newFeeStatus = newStudentBalance === 0 ? "PAID" : "PARTIALLY_PAID";

      updateStudent(data.studentId, {
        fees: {
          ...student.fees,
          paidAmount: newStudentPaid,
          balance: newStudentBalance,
          status: newFeeStatus,
          transactions: [
            {
              id: paymentId,
              receiptNumber,
              amount: data.amount,
              method: data.paymentMethod === "MPESA" ? "MPESA" : "BANK",
              reference: normalizedRef,
              date: new Date(paymentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
              balanceAfter: newStudentBalance,
            },
            ...student.fees.transactions,
          ],
        },
      });
    }

    return newPayment;
  }
}
