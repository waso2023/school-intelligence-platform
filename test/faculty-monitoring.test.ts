import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getTeachersMonitoringRecords,
  getFacultySupervisionSummary,
  recordSupervisoryAction,
} from "../lib/teachers/teachers-service";

describe("Principal Faculty Supervision & Teacher Progress Engine", () => {
  test("should return all faculty monitoring records with structured attendance and academic metrics", () => {
    const records = getTeachersMonitoringRecords();
    assert.ok(Array.isArray(records));
    assert.ok(records.length >= 8, `Expected at least 8 teacher records, got ${records.length}`);

    for (const teacher of records) {
      assert.ok(teacher.id, "Teacher must have an id");
      assert.ok(teacher.name, "Teacher must have a name");
      assert.ok(teacher.email, "Teacher must have an email");
      assert.ok(teacher.department, "Teacher must belong to a department");
      assert.ok(teacher.curriculum, "Teacher must have a curriculum track");

      // Validate attendance structure
      assert.ok(
        ["PRESENT_ON_TIME", "PRESENT_LATE", "EXCUSED_LEAVE", "ON_DUTY_FIELD"].includes(
          teacher.attendance.statusToday
        ),
        `Invalid attendance status: ${teacher.attendance.statusToday}`
      );
      assert.strictEqual(typeof teacher.attendance.weeklyAttendanceRate, "number");
      assert.ok(teacher.attendance.weeklyAttendanceRate >= 0 && teacher.attendance.weeklyAttendanceRate <= 100);
      assert.strictEqual(typeof teacher.attendance.periodsToday.scheduled, "number");
      assert.strictEqual(typeof teacher.attendance.periodsToday.completed, "number");

      // Validate progress structure
      assert.strictEqual(typeof teacher.progress.syllabusCoveragePct, "number");
      assert.ok(teacher.progress.syllabusCoveragePct >= 0 && teacher.progress.syllabusCoveragePct <= 100);
      assert.ok(["ON_TRACK", "AHEAD", "BEHIND"].includes(teacher.progress.syllabusStatus));
      assert.ok(["APPROVED", "PENDING_APPROVAL", "OVERDUE"].includes(teacher.progress.schemesOfWorkStatus));
      assert.strictEqual(typeof teacher.progress.gradebookMarksEnteredPct, "number");
      assert.strictEqual(typeof teacher.progress.classAcademicMean, "number");
    }
  });

  test("should compute institutional faculty supervision summary accurately", () => {
    const summary = getFacultySupervisionSummary();

    assert.strictEqual(summary.totalFaculty, 8);
    assert.strictEqual(summary.presentToday, 7); // 5 on time + 1 late + 1 on duty field
    assert.strictEqual(summary.onTimeCount, 5);
    assert.strictEqual(summary.lateCount, 1);
    assert.strictEqual(summary.excusedCount, 1);
    assert.strictEqual(summary.onDutyFieldCount, 1);

    // On time rate calculation: 5 / 7 = 71.4%
    assert.strictEqual(summary.overallOnTimeRate, 71.4);

    // Pacing and compliance checks
    assert.ok(summary.avgSyllabusCoverage > 65, "Avg syllabus coverage should be above 65%");
    assert.strictEqual(summary.syllabusTarget, 70);
    assert.ok(summary.avgGradebookCompliance >= 85, "Gradebook compliance should be >= 85%");
    assert.ok(summary.attentionRequiredCount >= 1, "Should identify teachers needing attention");
  });

  test("should correctly flag teachers requiring supervisory attention", () => {
    const records = getTeachersMonitoringRecords();

    // Teacher Grace Kilonzo was late and is behind on syllabus pacing
    const grace = records.find((t) => t.name === "Grace Kilonzo");
    assert.ok(grace, "Grace Kilonzo should exist");
    assert.strictEqual(grace?.attendance.statusToday, "PRESENT_LATE");
    assert.strictEqual(grace?.progress.syllabusStatus, "BEHIND");

    // Teacher Dennis Njoroge has pending schemes of work
    const dennis = records.find((t) => t.name === "Dennis Njoroge");
    assert.ok(dennis, "Dennis Njoroge should exist");
    assert.strictEqual(dennis?.progress.schemesOfWorkStatus, "PENDING_APPROVAL");

    // Teacher Sarah Wanjiku is ahead of schedule and on-time
    const sarah = records.find((t) => t.name === "Sarah Wanjiku");
    assert.ok(sarah, "Sarah Wanjiku should exist");
    assert.strictEqual(sarah?.attendance.statusToday, "PRESENT_ON_TIME");
    assert.strictEqual(sarah?.progress.syllabusStatus, "AHEAD");
  });

  test("should record supervisory actions and directives successfully", () => {
    const action = recordSupervisoryAction(
      "user-teacher-sarah",
      "COMMENDATION",
      "Excellent syllabus delivery pace in Grade 8 Science."
    );

    assert.strictEqual(action.success, true);
    assert.ok(action.id.startsWith("sup-act-"));
    assert.ok(action.timestamp);
  });
});
