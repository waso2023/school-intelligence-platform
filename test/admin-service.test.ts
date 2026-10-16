import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { AdministrationService } from "../lib/administration/adminService";

describe("School Administration & Conflict Validation Engine", () => {
  const schoolId = "school-sop-001";

  it("should successfully schedule a non-conflicting timetable lesson slot", async () => {
    // Clean up any existing test slot to guarantee idempotency across persistent disk runs
    const existingSlots = (await AdministrationService.getTimetable(schoolId)).filter(
      (s) => s.teacherName === "Dennis Njoroge" && s.dayOfWeek === "Tuesday" && s.period === 1
    );
    for (const s of existingSlots) {
      await AdministrationService.deleteTimetableSlot(s.id);
    }

    const slot = await AdministrationService.scheduleTimetableSlot({
      schoolId,
      dayOfWeek: "Tuesday",
      period: 1,
      startTime: "08:00 AM",
      endTime: "08:45 AM",
      className: "Grade 8",
      streamName: "West",
      subject: "Social Studies",
      teacherName: "Dennis Njoroge",
      room: "Room 12B",
    });

    assert.ok(slot.id.startsWith("tt-"));
    assert.equal(slot.subject, "Social Studies");
    assert.equal(slot.teacherName, "Dennis Njoroge");
  });

  it("should detect teacher collision and reject double-booking", async () => {
    // Dennis Njoroge is already scheduled Tuesday Period 1 in Room 12B
    // Attempting to schedule Dennis Njoroge at Tuesday Period 1 for another class must fail
    await assert.rejects(
      async () => {
        await AdministrationService.scheduleTimetableSlot({
          schoolId,
          dayOfWeek: "Tuesday",
          period: 1,
          startTime: "08:00 AM",
          endTime: "08:45 AM",
          className: "Grade 7",
          streamName: "South",
          subject: "History",
          teacherName: "Dennis Njoroge",
          room: "Room 9",
        });
      },
      /TIMETABLE_TEACHER_CONFLICT/
    );
  });

  it("should detect room collision and reject room double-booking", async () => {
    // Room 12B is occupied Tuesday Period 1
    // Attempting to schedule another teacher in Room 12B at Tuesday Period 1 must fail
    await assert.rejects(
      async () => {
        await AdministrationService.scheduleTimetableSlot({
          schoolId,
          dayOfWeek: "Tuesday",
          period: 1,
          startTime: "08:00 AM",
          endTime: "08:45 AM",
          className: "Grade 9",
          streamName: "East",
          subject: "Kiswahili",
          teacherName: "Grace Kilonzo",
          room: "Room 12B", // Room conflict
        });
      },
      /TIMETABLE_ROOM_CONFLICT/
    );
  });

  it("should retrieve transport bus fleet routes and vehicle capacities", async () => {
    const routes = await AdministrationService.getTransportRoutes(schoolId);
    assert.ok(routes.length >= 3, "At least 3 campus routes configured");
    assert.ok(routes.some((r) => r.busReg === "KDF 432B"));
    assert.ok(routes.every((r) => r.capacity > 0));
  });

  it("should record and query pastoral care discipline cases", async () => {
    const uniqueIncident = `Test Misconduct ${Date.now()}`;
    const newCase = await AdministrationService.logDisciplineCase({
      schoolId,
      studentId: "std-001",
      studentName: "Kevin Kimani",
      className: "Grade 8 East",
      incidentType: "Late to Science Lab",
      severity: "LOW",
      description: uniqueIncident,
      actionTaken: "Verbal reminder",
      reportedBy: "Science Teacher",
      status: "RESOLVED",
    });

    assert.ok(newCase.id.startsWith("disc-"));
    assert.equal(newCase.description, uniqueIncident);

    const cases = await AdministrationService.getDisciplineCases(schoolId);
    assert.ok(cases.some((c) => c.id === newCase.id));
  });
});
