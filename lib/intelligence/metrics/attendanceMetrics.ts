export interface AttendanceCounts {
  present: number;
  absent: number;
  late: number;
  excused: number;
  totalDays: number;
}

/**
 * Calculates net attendance rate percentage (excluding excused or weighting late)
 */
export function calculateAttendancePercentage(counts: AttendanceCounts): number {
  if (counts.totalDays === 0) return 100;
  // Late counts as attendance with slight penalty or present
  const effectivePresent = counts.present + counts.late;
  const rate = (effectivePresent / counts.totalDays) * 100;
  return Math.round(rate * 10) / 10;
}

/**
 * Calculates raw absence rate
 */
export function calculateAbsenceRate(counts: AttendanceCounts): number {
  if (counts.totalDays === 0) return 0;
  const rate = (counts.absent / counts.totalDays) * 100;
  return Math.round(rate * 10) / 10;
}

/**
 * Calculates lateness rate
 */
export function calculateLatenessRate(counts: AttendanceCounts): number {
  if (counts.totalDays === 0) return 0;
  const rate = (counts.late / counts.totalDays) * 100;
  return Math.round(rate * 10) / 10;
}

/**
 * Detects persistent / consecutive unexcused absences
 */
export function detectPersistentAbsence(
  logs: Array<{ date: string; status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" }>,
  consecutiveThreshold: number = 2
): { isPersistent: boolean; maxConsecutiveAbsent: number } {
  let maxConsecutive = 0;
  let currentStreak = 0;

  for (const log of logs) {
    if (log.status === "ABSENT") {
      currentStreak += 1;
      if (currentStreak > maxConsecutive) {
        maxConsecutive = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  return {
    isPersistent: maxConsecutive >= consecutiveThreshold,
    maxConsecutiveAbsent: maxConsecutive,
  };
}
