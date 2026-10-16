export interface GradeBoundary {
  grade: string;
  min: number;
  max: number;
  points?: number;
  remarks: string;
}

export interface AssessmentWeightConfig {
  type: string;
  name: string;
  weightPercentage: number; // e.g. 30, 30, 40
}

export const DEFAULT_GRADE_BOUNDARIES: GradeBoundary[] = [
  { grade: "A", min: 80, max: 100, points: 12, remarks: "Excellent / Exceeding Expectations" },
  { grade: "A-", min: 75, max: 79, points: 11, remarks: "Very Good" },
  { grade: "B+", min: 70, max: 74, points: 10, remarks: "Good / Meeting Expectations" },
  { grade: "B", min: 65, max: 69, points: 9, remarks: "Above Average" },
  { grade: "B-", min: 60, max: 64, points: 8, remarks: "Average" },
  { grade: "C+", min: 55, max: 59, points: 7, remarks: "Satisfactory / Approaching Expectations" },
  { grade: "C", min: 50, max: 54, points: 6, remarks: "Pass" },
  { grade: "C-", min: 45, max: 49, points: 5, remarks: "Below Average" },
  { grade: "D+", min: 40, max: 44, points: 4, remarks: "Weak" },
  { grade: "D", min: 35, max: 39, points: 3, remarks: "Very Weak" },
  { grade: "E", min: 0, max: 34, points: 1, remarks: "Below Expectations / Needs Intensive Remediation" },
];

export const DEFAULT_ASSESSMENT_WEIGHTS: AssessmentWeightConfig[] = [
  { type: "CAT", name: "Continuous Assessment Tests (CATs)", weightPercentage: 30 },
  { type: "MIDTERM", name: "Mid-Term Examination", weightPercentage: 30 },
  { type: "FINAL", name: "End of Term Examination", weightPercentage: 40 },
];

/**
 * Maps a numerical percentage score to a grade boundary
 */
export function mapScoreToGrade(score: number, boundaries: GradeBoundary[] = DEFAULT_GRADE_BOUNDARIES): GradeBoundary {
  const rounded = Math.round(score * 10) / 10;
  const match = boundaries.find((b) => rounded >= b.min && rounded <= b.max);
  return match || boundaries[boundaries.length - 1];
}

/**
 * Calculates weighted composite score from assessment components
 */
export function calculateWeightedScore(
  scores: { catScore?: number; midScore?: number; finalScore?: number },
  weights: AssessmentWeightConfig[] = DEFAULT_ASSESSMENT_WEIGHTS
): number {
  const catWeight = weights.find((w) => w.type === "CAT")?.weightPercentage ?? 30;
  const midWeight = weights.find((w) => w.type === "MIDTERM")?.weightPercentage ?? 30;
  const finalWeight = weights.find((w) => w.type === "FINAL")?.weightPercentage ?? 40;

  const totalWeight = catWeight + midWeight + finalWeight;
  const catPart = (scores.catScore ?? 0) * (catWeight / 100);
  const midPart = (scores.midScore ?? 0) * (midWeight / 100);
  const finalPart = (scores.finalScore ?? 0) * (finalWeight / 100);

  const weighted = ((catPart + midPart + finalPart) / totalWeight) * 100;
  return Math.round(weighted * 10) / 10;
}

/**
 * Calculates class or cohort mean
 */
export function calculateMeanScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

/**
 * Calculates median score
 */
export function calculateMedianScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sorted = [...scores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
}

/**
 * Generates distribution of grades across cohort
 */
export function calculateGradeDistribution(scores: number[], boundaries: GradeBoundary[] = DEFAULT_GRADE_BOUNDARIES): Record<string, number> {
  const distribution: Record<string, number> = {};
  boundaries.forEach((b) => {
    distribution[b.grade] = 0;
  });

  scores.forEach((s) => {
    const grade = mapScoreToGrade(s, boundaries).grade;
    distribution[grade] = (distribution[grade] || 0) + 1;
  });

  return distribution;
}

/**
 * Calculates pass rate based on configurable threshold
 */
export function calculatePassRate(scores: number[], passMark: number = 50): number {
  if (scores.length === 0) return 0;
  const passing = scores.filter((s) => s >= passMark).length;
  return Math.round((passing / scores.length) * 1000) / 10;
}
