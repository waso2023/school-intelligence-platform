import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenant";
import { getStudents, getStudentById, updateStudent } from "@/lib/data/students-store";
import { getPersistentCollection } from "@/lib/db/persistentStore";

export interface AttendanceSessionRecord {
  id: string;
  schoolId: string;
  className: string;
  date: string;
  recordedBy: string;
  recordedAt: string;
  summary: {
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    presentRate: number;
  };
  entries: Array<{
    studentId: string;
    studentName: string;
    admNo: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    remarks?: string;
  }>;
}

const attendanceCollection = getPersistentCollection<AttendanceSessionRecord>("attendance", () => []);

export async function GET(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const className = searchParams.get("class");
    const date = searchParams.get("date");

    const history = attendanceCollection.getAll().filter((a) => {
      const matchSchool = a.schoolId === tenantCtx.schoolId;
      const matchClass = !className || a.className === className;
      const matchDate = !date || a.date === date;
      return matchSchool && matchClass && matchDate;
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch attendance records" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { className, date, entries } = body;

    if (!className || !Array.isArray(entries)) {
      return NextResponse.json(
        { error: "className and entries array are required" },
        { status: 400 }
      );
    }

    const targetDate = date || new Date().toISOString().split("T")[0];

    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    // Process each student's attendance update
    for (const entry of entries) {
      if (entry.status === "PRESENT") present++;
      else if (entry.status === "ABSENT") absent++;
      else if (entry.status === "LATE") late++;
      else if (entry.status === "EXCUSED") excused++;

      const student = getStudentById(entry.studentId);
      if (student) {
        const curAtt = student.attendance;
        const newTotal = (curAtt.totalDays || 0) + 1;
        const newPresent = (curAtt.present || 0) + (entry.status === "PRESENT" || entry.status === "LATE" ? 1 : 0);
        const newAbsent = (curAtt.absent || 0) + (entry.status === "ABSENT" ? 1 : 0);
        const newLate = (curAtt.late || 0) + (entry.status === "LATE" ? 1 : 0);
        const newExcused = (curAtt.excused || 0) + (entry.status === "EXCUSED" ? 1 : 0);
        const newRate = newTotal > 0 ? Math.round((newPresent / newTotal) * 1000) / 10 : 100;

        const updatedLogs = [
          { date: targetDate, status: entry.status },
          ...(curAtt.recentLogs || []).slice(0, 9),
        ];

        updateStudent(student.id, {
          attendance: {
            ...curAtt,
            totalDays: newTotal,
            present: newPresent,
            absent: newAbsent,
            late: newLate,
            excused: newExcused,
            rate: newRate,
            warningThresholdTriggered: newRate < 90,
            recentLogs: updatedLogs,
          },
        });
      }
    }

    const total = entries.length;
    const presentRate = total > 0 ? Math.round(((present + late) / total) * 1000) / 10 : 100;

    const sessionRecord: AttendanceSessionRecord = {
      id: `att-${Date.now()}`,
      schoolId: tenantCtx.schoolId,
      className,
      date: targetDate,
      recordedBy: tenantCtx.user.name || tenantCtx.user.email,
      recordedAt: new Date().toISOString(),
      summary: {
        total,
        present,
        absent,
        late,
        excused,
        presentRate,
      },
      entries,
    };

    attendanceCollection.insert(sessionRecord);

    return NextResponse.json({
      success: true,
      message: `Daily attendance for ${className} recorded successfully.`,
      record: sessionRecord,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to save attendance" }, { status: 500 });
  }
}
