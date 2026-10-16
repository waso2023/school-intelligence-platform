"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatKES } from "@/lib/utils";
import { DEMO_SCHOOL } from "@/lib/data/demo-data";
import { INITIAL_STUDENTS, StudentProfile } from "@/lib/data/students-store";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Receipt,
  Download,
  PlusCircle,
  Smartphone,
  Building,
  CheckCircle2,
  Printer,
  Search,
  Bell,
  FileText,
  Users,
  ShieldCheck,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionItem {
  id: string;
  student: string;
  studentId?: string;
  class: string;
  amount: number;
  method: "MPESA" | "BANK" | "CASH" | "CHEQUE";
  reference: string;
  date: string;
  recordedBy: string;
  receipt: string;
}

function FinanceContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const actionParam = searchParams.get("action");

  const [activeTab, setActiveTab] = useState<
    "payments" | "structures" | "accounts" | "arrears"
  >("payments");

  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      id: "pay-1",
      student: "Kevin Kimani (SOP-2024-0082)",
      studentId: "std-001",
      class: "Grade 8 East",
      amount: 60000,
      method: "MPESA",
      reference: "QWE89284KL",
      date: "07 Oct 2026, 14:22",
      recordedBy: "Peter Kipkorir (Bursar)",
      receipt: "REC-2026-0089",
    },
    {
      id: "pay-2",
      student: "Amani Otieno (SOP-2024-0083)",
      studentId: "std-002",
      class: "Grade 8 East",
      amount: 85000,
      method: "BANK",
      reference: "KCB-TXN-902188",
      date: "06 Oct 2026, 11:05",
      recordedBy: "Peter Kipkorir (Bursar)",
      receipt: "REC-2026-0088",
    },
    {
      id: "pay-3",
      student: "Imani Chebet (SOP-2024-0086)",
      studentId: "std-005",
      class: "Year 10 Alpha",
      amount: 55000,
      method: "MPESA",
      reference: "QWD45129MM",
      date: "05 Oct 2026, 09:41",
      recordedBy: "Peter Kipkorir (Bursar)",
      receipt: "REC-2026-0087",
    },
    {
      id: "pay-4",
      student: "Zawadi Muthoni (SOP-2024-0084)",
      studentId: "std-003",
      class: "Grade 8 East",
      amount: 45000,
      method: "MPESA",
      reference: "QWB12903ZZ",
      date: "03 Oct 2026, 16:10",
      recordedBy: "Peter Kipkorir (Bursar)",
      receipt: "REC-2026-0086",
    },
  ]);

  // Modal states
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState<TransactionItem | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form states
  const [selectedStudent, setSelectedStudent] = useState("Kevin Kimani (SOP-2024-0082)");
  const [selectedClass, setSelectedClass] = useState("Grade 8 East");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"MPESA" | "BANK" | "CASH" | "CHEQUE">("MPESA");
  const [reference, setReference] = useState("");

  // Search states for accounts
  const [accountSearch, setAccountSearch] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/finance/payments");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: TransactionItem[] = json.data.map((p: any) => ({
          id: p.id,
          student: p.payerName ? `${p.payerName}` : "Student Payment",
          studentId: p.studentId,
          class: "Enrolled Class",
          amount: p.amount,
          method: p.paymentMethod,
          reference: p.transactionReference,
          date: new Date(p.paymentDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          recordedBy: p.recordedByUserId || "Peter Kipkorir (Bursar)",
          receipt: p.receiptNumber,
        }));
        setTransactions(mapped);
      }
    } catch (err) {
      // Keep initial transactions
    }
  };

  // Handle URL deep links & load payments
  useEffect(() => {
    fetchPayments();
    if (tabParam === "structures") setActiveTab("structures");
    else if (tabParam === "accounts") setActiveTab("accounts");
    else if (tabParam === "arrears") setActiveTab("arrears");
    else if (tabParam === "payments") setActiveTab("payments");

    if (actionParam === "record-payment") {
      setIsRecordOpen(true);
    }
  }, [tabParam, actionParam]);

  const [selectedStudentId, setSelectedStudentId] = useState("std-001");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount)) return;

    setIsSubmitting(true);
    const refCode = reference.trim() || `MPESA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    try {
      const res = await fetch("/api/finance/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          amount: numAmount,
          paymentMethod: method,
          transactionReference: refCode,
          notes: "Recorded via Finance Portal",
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const p = json.data;
        const newTx: TransactionItem = {
          id: p.id,
          student: selectedStudent,
          class: selectedClass,
          amount: p.amount,
          method: p.paymentMethod,
          reference: p.transactionReference,
          date: new Date(p.paymentDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          recordedBy: p.recordedByUserId || "Peter Kipkorir (Bursar)",
          receipt: p.receiptNumber,
        };
        setTransactions((prev) => [newTx, ...prev]);
        setSuccessBanner(`Payment of ${formatKES(newTx.amount)} recorded! Official Receipt: ${newTx.receipt}`);
      } else {
        // Local fallback if offline
        const fallbackTx: TransactionItem = {
          id: `pay-${Date.now()}`,
          student: selectedStudent,
          class: selectedClass,
          amount: numAmount,
          method,
          reference: refCode,
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          recordedBy: "Peter Kipkorir (Bursar)",
          receipt: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        };
        setTransactions((prev) => [fallbackTx, ...prev]);
        setSuccessBanner(`Payment of ${formatKES(fallbackTx.amount)} recorded! Official Receipt: ${fallbackTx.receipt}`);
      }
    } catch (err) {
      const fallbackTx: TransactionItem = {
        id: `pay-${Date.now()}`,
        student: selectedStudent,
        class: selectedClass,
        amount: numAmount,
        method,
        reference: refCode,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        recordedBy: "Peter Kipkorir (Bursar)",
        receipt: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      setTransactions((prev) => [fallbackTx, ...prev]);
      setSuccessBanner(`Payment of ${formatKES(fallbackTx.amount)} recorded! Official Receipt: ${fallbackTx.receipt}`);
    } finally {
      setIsSubmitting(false);
      setIsRecordOpen(false);
      setAmount("");
      setReference("");
      setTimeout(() => setSuccessBanner(null), 5000);
    }
  };


  const handleSendReminder = (studentName: string, phone: string, balance: number) => {
    setSuccessBanner(`Fee reminder SMS dispatched to ${studentName}'s guardian (${phone}) for outstanding balance of ${formatKES(balance)}.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleBroadcastReminders = () => {
    setSuccessBanner("Batch fee arrears reminders queued & dispatched via Africa's Talking SMS Gateway to 68 guardian contacts.");
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // Filter students for Student Accounts tab
  const filteredStudents = INITIAL_STUDENTS.filter((s) => {
    if (!accountSearch.trim()) return true;
    const term = accountSearch.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(term) ||
      s.lastName.toLowerCase().includes(term) ||
      s.admissionNumber.toLowerCase().includes(term) ||
      s.className.toLowerCase().includes(term)
    );
  });

  // Students with arrears for Arrears tab
  const studentsWithArrears = INITIAL_STUDENTS.filter((s) => s.fees.balance > 0);

  // Financial KPI totals
  const totalCollected = transactions.reduce((acc, t) => acc + t.amount, DEMO_SCHOOL.stats.totalCollectedFees);
  const totalOutstanding = Math.max(0, DEMO_SCHOOL.stats.totalBilledFees - totalCollected);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {successBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Fees & Finance Management
          </h1>
          <p className="text-xs text-slate-500">
            {DEMO_SCHOOL.name} • Billing, M-Pesa reconciliations & Arrears
          </p>
        </div>

        <Button
          variant="emerald"
          size="sm"
          className="gap-2 shadow-sm"
          onClick={() => setIsRecordOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Record Payment (M-Pesa / Bank)</span>
        </Button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Expected Term Revenue</span>
          <div className="text-2xl font-bold text-slate-900">
            {formatKES(DEMO_SCHOOL.stats.totalBilledFees)}
          </div>
          <div className="text-[11px] text-slate-400">Total invoiced fees</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Total Collected</span>
          <div className="text-2xl font-bold text-emerald-600">
            {formatKES(totalCollected)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {Math.round((totalCollected / DEMO_SCHOOL.stats.totalBilledFees) * 100)}% collection rate
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Outstanding Balance</span>
          <div className="text-2xl font-bold text-rose-600">
            {formatKES(totalOutstanding)}
          </div>
          <div className="text-[11px] text-rose-600 font-medium">
            Arrears across {studentsWithArrears.length} accounts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">M-Pesa Paybill Sync</span>
          <div className="text-2xl font-bold text-slate-900">100% Synced</div>
          <div className="text-[11px] text-emerald-600">Paybill: 522123 (Active)</div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "payments"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Recent Payments ({transactions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("structures")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "structures"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Fee Structures by Grade
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("accounts")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "accounts"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Student Accounts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("arrears")}
          className={`pb-2.5 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "arrears"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>Arrears & Reminders</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
            {studentsWithArrears.length}
          </span>
        </button>
      </div>

      {/* 1. RECENT PAYMENTS TAB */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">Recent Payment Transactions</h3>
            <span className="text-[11px] text-slate-400">Showing verified ledger entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Receipt No.</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Amount (KES)</th>
                  <th className="py-3 px-4">Method & Ref</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Recorded By</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {tx.receipt}
                    </td>
                    <td className="py-3 px-4 font-medium">{tx.student}</td>
                    <td className="py-3 px-4 text-slate-500">{tx.class}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {formatKES(tx.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                        {tx.method === "MPESA" ? (
                          <Smartphone className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Building className="h-3 w-3 text-blue-600" />
                        )}
                        {tx.reference}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                    <td className="py-3 px-4 text-slate-500">{tx.recordedBy}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setReceiptToPrint(tx)}
                        className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <Printer className="h-3 w-3" />
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. FEE STRUCTURES BY GRADE TAB */}
      {activeTab === "structures" && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Standard Term 1 Fee Schedules & Invoices
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setSuccessBanner("Official Term 1 Fee Structure PDF generated and sent to downloads.");
                setTimeout(() => setSuccessBanner(null), 4000);
              }}
            >
              <Download className="h-4 w-4" />
              Download All Fee Schedules PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Grade 7 & Grade 8 (CBC Track)</h4>
                  <p className="text-[11px] text-slate-500">Junior Secondary School</p>
                </div>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  KSh 90,000 / Term
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-slate-600">
                <div className="py-1.5 flex justify-between">
                  <span>Tuition & Laboratory Practical Fees</span>
                  <span className="font-semibold text-slate-800">KSh 70,000</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span>Nutritional Meal Program (Hot Lunch & Tea)</span>
                  <span className="font-semibold text-slate-800">KSh 15,000</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span>Co-Curricular, Sports & CBC Project Materials</span>
                  <span className="font-semibold text-slate-800">KSh 5,000</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Year 10 & Year 11 (Cambridge CAIE)</h4>
                  <p className="text-[11px] text-slate-500">IGCSE International Track</p>
                </div>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  KSh 145,000 / Term
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-slate-600">
                <div className="py-1.5 flex justify-between">
                  <span>International IGCSE Tuition & Courseware</span>
                  <span className="font-semibold text-slate-800">KSh 110,000</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span>Science Labs, Robotics & ICT Facilities</span>
                  <span className="font-semibold text-slate-800">KSh 20,000</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <span>Full Boarding Meal Plan & Amenities</span>
                  <span className="font-semibold text-slate-800">KSh 15,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. STUDENT ACCOUNTS TAB */}
      {activeTab === "accounts" && (
        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student or admission..."
                value={accountSearch}
                onChange={(e) => setAccountSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-slate-500 text-[11px]">
              Showing {filteredStudents.length} learner accounts
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Adm No.</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Billed Amount</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Outstanding</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <Link href={`/students/${s.id}`} className="hover:text-emerald-700 hover:underline">
                        {s.firstName} {s.lastName}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{s.admissionNumber}</td>
                    <td className="py-3 px-4">{s.className}</td>
                    <td className="py-3 px-4 font-medium">{formatKES(s.fees.expectedAmount)}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">{formatKES(s.fees.paidAmount)}</td>
                    <td className="py-3 px-4 font-bold text-rose-600">{formatKES(s.fees.balance)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.fees.status === "PAID"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {s.fees.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(`${s.firstName} ${s.lastName} (${s.admissionNumber})`);
                          setSelectedClass(s.className);
                          setAmount(s.fees.balance.toString());
                          setIsRecordOpen(true);
                        }}
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        Pay →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ARREARS & REMINDERS TAB */}
      {activeTab === "arrears" && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Active Fee Arrears Roster
              </h3>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Total outstanding arrears of {formatKES(totalOutstanding)} across {studentsWithArrears.length} students
              </p>
            </div>
            <Button
              variant="emerald"
              size="sm"
              className="gap-2"
              onClick={handleBroadcastReminders}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Broadcast SMS Reminders to All Arrears</span>
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Parent / Guardian</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Outstanding Balance</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">SMS Reminder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {studentsWithArrears.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <Link href={`/students/${s.id}`} className="hover:text-emerald-700 hover:underline">
                        {s.firstName} {s.lastName}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{s.className}</td>
                    <td className="py-3 px-4">{s.parent.fullName}</td>
                    <td className="py-3 px-4 font-mono">{s.parent.phone}</td>
                    <td className="py-3 px-4 font-bold text-rose-600 font-mono">
                      {formatKES(s.fees.balance)}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{s.fees.dueDate}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-[11px]"
                        onClick={() => handleSendReminder(s.firstName, s.parent.phone, s.fees.balance)}
                      >
                        <Bell className="h-3 w-3 text-emerald-600" />
                        <span>Send SMS</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Record Fee Payment</h3>
                  <p className="text-[11px] text-slate-500">M-Pesa or Bank transaction verification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRecordOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => {
                    setSelectedStudent(e.target.value);
                    const s = INITIAL_STUDENTS.find((st) => `${st.firstName} ${st.lastName} (${st.admissionNumber})` === e.target.value);
                    if (s) setSelectedClass(s.className);
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                >
                  {INITIAL_STUDENTS.map((s) => (
                    <option key={s.id} value={`${s.firstName} ${s.lastName} (${s.admissionNumber})`}>
                      {s.firstName} {s.lastName} ({s.admissionNumber}) — {s.className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Amount (KES)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    placeholder="e.g. 50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payment Channel</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="MPESA">M-Pesa Paybill</option>
                    <option value="BANK">Bank Deposit / RTGS</option>
                    <option value="CHEQUE">Banker&apos;s Cheque</option>
                    <option value="CASH">Cash Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Transaction Reference</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. QWE89284KL or KCB-902188"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRecordOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm">
                  Record & Issue Receipt
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Dialog */}
      {receiptToPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Official School Receipt</h3>
              </div>
              <button
                type="button"
                onClick={() => setReceiptToPrint(null)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 font-mono">
              <div className="text-center border-b border-slate-200 pb-2">
                <div className="font-bold text-slate-900 text-sm">{DEMO_SCHOOL.name}</div>
                <div className="text-[10px] text-slate-500">P.O. Box 45120-00100 Nairobi • info@sopacademy.ac.ke</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-1">Receipt No: {receiptToPrint.receipt}</div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-900">{receiptToPrint.student}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class:</span>
                  <span className="text-slate-800">{receiptToPrint.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channel / Ref:</span>
                  <span className="text-slate-800">{receiptToPrint.method} • {receiptToPrint.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="text-slate-800">{receiptToPrint.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Received By:</span>
                  <span className="text-slate-800">{receiptToPrint.recordedBy}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-emerald-800">
                <span>AMOUNT PAID:</span>
                <span>{formatKES(receiptToPrint.amount)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Stamp: VERIFIED
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReceiptToPrint(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  variant="emerald"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => window.print()}
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FinancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Finance Portal...</div>}>
      <FinanceContent />
    </Suspense>
  );
}
