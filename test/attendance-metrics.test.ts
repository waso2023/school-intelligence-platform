import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateAttendancePercentage,
  calculateAbsenceRate,
  calculateLatenessRate,
  detectPersistentAbsence,
} from "../lib/intelligence/metrics/attendanceMetrics";

describe("Attendance Metrics & Truancy Detection", () => {
  it("should calculate attendance percentage correctly", () => {
    const rate = calculateAttendancePercentage({
      present: 18,
      late: 2,
      absent: 2,
      excused: 0,
      totalDays: 22,
    });
    // present (18) + late (2) = 20 / 22 = 90.9%
    assert.equal(rate, 90.9);
  });

  it("should calculate absence and lateness rates accurately", () => {
    const absenceRate = calculateAbsenceRate({
      present: 18,
      late: 2,
      absent: 2,
      excused: 0,
      totalDays: 22,
    });
    const latenessRate = calculateLatenessRate({
      present: 18,
      late: 2,
      absent: 2,
      excused: 0,
      totalDays: 22,
    });
    assert.equal(absenceRate, 9.1);
    assert.equal(latenessRate, 9.1);
  });

  it("should detect persistent consecutive unexcused absences", () => {
    const logs = [
      { date: "2026-10-08", status: "ABSENT" as const },
      { date: "2026-10-07", status: "ABSENT" as const },
      { date: "2026-10-06", status: "PRESENT" as const },
    ];
    const result = detectPersistentAbsence(logs, 2);
    assert.equal(result.isPersistent, true);
    assert.equal(result.maxConsecutiveAbsent, 2);
  });

  it("should not flag persistent absence if separated by present days", () => {
    const logs = [
      { date: "2026-10-08", status: "ABSENT" as const },
      { date: "2026-10-07", status: "PRESENT" as const },
      { date: "2026-10-06", status: "ABSENT" as const },
    ];
    const result = detectPersistentAbsence(logs, 2);
    assert.equal(result.isPersistent, false);
    assert.equal(result.maxConsecutiveAbsent, 1);
  });
});
