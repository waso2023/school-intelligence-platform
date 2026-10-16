export interface StudentFeeSummary {
  studentId: string;
  admissionNumber: string;
  studentName: string;
  className: string;
  expectedAmount: number;
  paidAmount: number;
  balance: number;
  status: "PAID" | "PARTIALLY_PAID" | "OUTSTANDING" | "OVERDUE";
  dueDate?: string;
}

export function calculateFinancialSummary(fees: StudentFeeSummary[]) {
  const totalBilled = fees.reduce((sum, f) => sum + f.expectedAmount, 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalOutstanding = fees.reduce((sum, f) => sum + f.balance, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 1000) / 10 : 0;

  const accountsWithArrears = fees.filter((f) => f.balance > 0);
  const overdueAccounts = fees.filter((f) => f.status === "OVERDUE" || (f.balance > 0 && f.dueDate && new Date(f.dueDate) < new Date()));

  return {
    totalBilled,
    totalCollected,
    totalOutstanding,
    collectionRate,
    arrearsAccountsCount: accountsWithArrears.length,
    overdueAccountsCount: overdueAccounts.length,
    topArrears: accountsWithArrears.sort((a, b) => b.balance - a.balance).slice(0, 10),
  };
}
