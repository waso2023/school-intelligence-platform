import { StudentProfile } from "@/lib/data/students-store";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RiskFactor {
  category: "ACADEMIC" | "ATTENDANCE" | "FINANCIAL" | "DISCIPLINE";
  scoreContribution: number;
  label: string;
  observedData: string;
}

export interface StudentRiskEvaluation {
  studentId: string;
  admissionNumber: string;
  studentName: string;
  className: string;
  streamName: string;
  overallScore: number; // 0 - 100
  overallRiskLevel: RiskLevel;
  primaryRiskCategory: "ACADEMIC" | "ATTENDANCE" | "FINANCIAL" | "DISCIPLINE" | "COMBINED";
  reasons: string[];
  factors: RiskFactor[];
  recommendedInterventions: string[];
  observedMetrics: {
    academicAverage: number;
    termOverTermDrop: number;
    attendanceRate: number;
    unexcusedAbsences: number;
    feeBalance: number;
    disciplineIncidents: number;
  };
}

export interface RiskEngineConfig {
  academicDeclineThreshold: number; // drop >= 10 points
  academicLowAverageThreshold: number; // average < 60%
  attendanceWarningThreshold: number; // rate < 90%
  consecutiveAbsenceThreshold: number; // >= 2 days
  highFeeBalanceThreshold: number; // >= 25000 KES
}

export const DEFAULT_RISK_CONFIG: RiskEngineConfig = {
  academicDeclineThreshold: 10,
  academicLowAverageThreshold: 60,
  attendanceWarningThreshold: 90,
  consecutiveAbsenceThreshold: 2,
  highFeeBalanceThreshold: 25000,
};

/**
 * Deterministic, Explainable Student Risk Evaluation Engine.
 * Evaluates academic trends, attendance rates, fee balances, and discipline logs.
 */
export function evaluateStudentRisk(
  student: StudentProfile,
  config: RiskEngineConfig = DEFAULT_RISK_CONFIG
): StudentRiskEvaluation {
  let score = 0;
  const factors: RiskFactor[] = [];
  const reasons: string[] = [];
  const recommendedInterventions: string[] = [];

  const previousAvg = student.academic.previousTermAverage || 70;
  const currentAvg = student.academic.currentTermAverage || 70;
  const termDrop = Math.max(0, Math.round((previousAvg - currentAvg) * 10) / 10);
  const attendanceRate = student.attendance.rate;
  const feeBalance = student.fees.balance;
  const incidents = student.discipline.length;

  // 1. Academic Risk Factors
  if (termDrop >= config.academicDeclineThreshold) {
    const pts = Math.min(35, Math.round(termDrop * 2));
    score += pts;
    factors.push({
      category: "ACADEMIC",
      scoreContribution: pts,
      label: `Significant Term Academic Drop (-${termDrop}%)`,
      observedData: `Previous: ${previousAvg}%, Current: ${currentAvg}%`,
    });
    reasons.push(`Academic average dropped from ${previousAvg}% to ${currentAvg}% (-${termDrop}% decline)`);
    recommendedInterventions.push("Schedule diagnostic evaluation with Class Teacher & Subject Educators");
  }

  if (currentAvg > 0 && currentAvg < config.academicLowAverageThreshold) {
    score += 25;
    factors.push({
      category: "ACADEMIC",
      scoreContribution: 25,
      label: `Below Minimum Academic Pass Benchmark (${currentAvg}%)`,
      observedData: `Class average is ~72%, student is at ${currentAvg}%`,
    });
    reasons.push(`Overall performance is currently below 60% benchmark`);
    recommendedInterventions.push("Assign targeted remedial tutoring sessions in core subjects");
  }

  // 2. Attendance Risk Factors
  if (attendanceRate < config.attendanceWarningThreshold) {
    const gap = Math.round((config.attendanceWarningThreshold - attendanceRate) * 2);
    const pts = Math.min(30, 15 + gap);
    score += pts;
    factors.push({
      category: "ATTENDANCE",
      scoreContribution: pts,
      label: `Attendance Below 90% Benchmark (${attendanceRate}%)`,
      observedData: `${student.attendance.present} of ${student.attendance.totalDays} sessions attended (${student.attendance.absent} absences)`,
    });
    reasons.push(`Cumulative attendance (${attendanceRate}%) is beneath the institutional 90% guideline`);
    recommendedInterventions.push("Conduct pastoral conference with parent regarding missed school days");
  }

  if (student.attendance.absent >= 2) {
    score += 10;
    factors.push({
      category: "ATTENDANCE",
      scoreContribution: 10,
      label: "Frequent / Unexcused Absences",
      observedData: `${student.attendance.absent} unexcused absences logged`,
    });
    reasons.push(`${student.attendance.absent} unexcused absence sessions recorded this term`);
  }

  // 3. Financial Arrears Factors
  if (feeBalance >= config.highFeeBalanceThreshold) {
    const pts = 15;
    score += pts;
    factors.push({
      category: "FINANCIAL",
      scoreContribution: pts,
      label: `High Outstanding Fee Balance (KSh ${feeBalance.toLocaleString()})`,
      observedData: `Expected: KSh ${student.fees.expectedAmount.toLocaleString()}, Balance: KSh ${feeBalance.toLocaleString()}`,
    });
    reasons.push(`Outstanding term fee arrears of KSh ${feeBalance.toLocaleString()}`);
    recommendedInterventions.push("Send bursary payment plan reminder via automated SMS/WhatsApp");
  }

  // 4. Disciplinary Factors
  if (incidents > 0) {
    const pts = Math.min(20, incidents * 10);
    score += pts;
    factors.push({
      category: "DISCIPLINE",
      scoreContribution: pts,
      label: `Behavioral Disciplinary Record (${incidents} incident${incidents > 1 ? "s" : ""})`,
      observedData: student.discipline.map((d) => d.type).join(", "),
    });
    reasons.push(`${incidents} behavioral infraction${incidents > 1 ? "s" : ""} recorded in pastoral log`);
    recommendedInterventions.push("Schedule pastoral guidance meeting with Head of Discipline");
  }

  // Cap score to 100
  score = Math.min(100, score);

  // Map to Level
  let level: RiskLevel = "LOW";
  if (score >= 80) level = "CRITICAL";
  else if (score >= 60) level = "HIGH";
  else if (score >= 35) level = "MEDIUM";

  // Determine Primary Category
  const catSums: Record<string, number> = { ACADEMIC: 0, ATTENDANCE: 0, FINANCIAL: 0, DISCIPLINE: 0 };
  factors.forEach((f) => {
    catSums[f.category] = (catSums[f.category] || 0) + f.scoreContribution;
  });

  let maxCat = "ACADEMIC";
  let maxVal = 0;
  let activeCats = 0;
  for (const [cat, val] of Object.entries(catSums)) {
    if (val > 0) activeCats += 1;
    if (val > maxVal) {
      maxVal = val;
      maxCat = cat;
    }
  }

  const primaryCategory = activeCats >= 2 && level !== "LOW" ? "COMBINED" : (maxCat as any);

  if (reasons.length === 0) {
    reasons.push("Academic performance and attendance are within optimal institutional parameters.");
    recommendedInterventions.push("Maintain standard continuous progress monitoring.");
  }

  return {
    studentId: student.id,
    admissionNumber: student.admissionNumber,
    studentName: `${student.firstName} ${student.lastName}`,
    className: student.className,
    streamName: student.streamName,
    overallScore: score,
    overallRiskLevel: level,
    primaryRiskCategory: primaryCategory,
    reasons,
    factors,
    recommendedInterventions,
    observedMetrics: {
      academicAverage: currentAvg,
      termOverTermDrop: termDrop,
      attendanceRate,
      unexcusedAbsences: student.attendance.absent,
      feeBalance,
      disciplineIncidents: incidents,
    },
  };
}
