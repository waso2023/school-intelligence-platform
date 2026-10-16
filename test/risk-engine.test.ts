import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateStudentRisk } from "../lib/intelligence/risk/riskEngine";
import { StudentProfile } from "../lib/data/students-store";

describe("4-Vector Student Risk Diagnostic Engine", () => {
  const baseStudent: StudentProfile = {
    id: "test-std-01",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-TEST-001",
    firstName: "Test",
    lastName: "Student",
    dateOfBirth: "2012-01-01",
    gender: "Male",
    photoUrl: "",
    admissionDate: "2024-01-01",
    status: "ACTIVE",
    classId: "cls-1",
    className: "Grade 8",
    streamId: "st-1",
    streamName: "East",
    curriculum: "CBC",
    address: "Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "O+",
      allergies: [],
      emergencyDoctor: "Dr. Test",
      emergencyPhone: "+254 700 000 000",
    },
    parent: {
      id: "par-01",
      fullName: "Test Parent",
      relationship: "Father",
      phone: "+254 700 000 000",
      email: "test.parent@example.com",
      occupation: "Engineer",
      address: "Nairobi",
    },
    academic: {
      currentTermAverage: 82,
      previousTermAverage: 80,
      trend: "UP",
      rank: 2,
      totalInClass: 35,
      subjectGrades: [],
      termTrends: [],
    },
    attendance: {
      rate: 96,
      totalDays: 30,
      present: 29,
      absent: 1,
      late: 0,
      excused: 0,
      warningThresholdTriggered: false,
      recentLogs: [{ date: "2026-10-08", status: "PRESENT" }],
    },
    fees: {
      expectedAmount: 85000,
      paidAmount: 85000,
      balance: 0,
      status: "PAID",
      dueDate: "2026-10-31",
      transactions: [],
    },
    discipline: [],
    documents: [],
    communications: [],
  };

  it("should evaluate a high-performing student with low risk score", () => {
    const result = evaluateStudentRisk(baseStudent);
    assert.equal(result.overallRiskLevel, "LOW");
    assert.ok(result.overallScore <= 20);
    assert.equal(result.factors.length, 0);
  });

  it("should detect academic trajectory decline and add risk points", () => {
    const decliningStudent: StudentProfile = {
      ...baseStudent,
      academic: {
        ...baseStudent.academic,
        currentTermAverage: 58,
        previousTermAverage: 75, // 17% drop
        trend: "DOWN",
      },
    };

    const result = evaluateStudentRisk(decliningStudent);
    assert.ok(result.overallScore >= 30);
    assert.ok(result.factors.some((f) => f.category === "ACADEMIC"));
  });

  it("should flag chronic absenteeism and fee arrears with elevated severity", () => {
    const multiRiskStudent: StudentProfile = {
      ...baseStudent,
      attendance: {
        ...baseStudent.attendance,
        rate: 82, // Below 90%
        absent: 6,
        recentLogs: [
          { date: "2026-10-08", status: "ABSENT" },
          { date: "2026-10-07", status: "ABSENT" },
        ],
      },
      fees: {
        ...baseStudent.fees,
        balance: 45000, // Arrears > 25,000
        status: "OVERDUE",
      },
    };

    const result = evaluateStudentRisk(multiRiskStudent);
    assert.ok(result.overallRiskLevel === "MEDIUM" || result.overallRiskLevel === "HIGH" || result.overallRiskLevel === "CRITICAL");
    assert.ok(result.factors.some((f) => f.category === "ATTENDANCE"));
    assert.ok(result.factors.some((f) => f.category === "FINANCIAL"));
    assert.ok(result.recommendedInterventions.length > 0);
  });
});
