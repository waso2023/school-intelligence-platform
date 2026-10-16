import { NextResponse } from "next/server";
import { getStudents, addStudent, StudentProfile } from "@/lib/data/students-store";
import { StudentAdmissionSchema } from "@/lib/validations/student";
import { requirePermission } from "@/lib/auth/session";
import { getTenantContext, filterStudentsForUser } from "@/lib/auth/tenant";
import { PERMISSIONS } from "@/lib/permissions/permissions";

export async function GET(request: Request) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const className = searchParams.get("class");
    const status = searchParams.get("status");

    // Apply strict tenant scope and role relationship filtering
    let students = filterStudentsForUser(getStudents(), tenantCtx);

    if (search) {
      students = students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(search) ||
          s.lastName.toLowerCase().includes(search) ||
          s.admissionNumber.toLowerCase().includes(search) ||
          s.parent.phone.includes(search)
      );
    }

    if (className && className !== "All Classes") {
      students = students.filter((s) => s.className === className);
    }

    if (status && status !== "ALL") {
      students = students.filter((s) => s.status === status);
    }

    return NextResponse.json({
      success: true,
      total: students.length,
      data: students,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Enforce permission
    await requirePermission(PERMISSIONS.STUDENTS_CREATE);

    const body = await request.json();
    const validation = StudentAdmissionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const d = validation.data;
    const newStudentId = `std-${Date.now()}`;

    const newStudent: StudentProfile = {
      id: newStudentId,
      schoolId: tenantCtx.schoolId, // Strict server-side tenant scope

      admissionNumber: d.admissionNumber,
      firstName: d.firstName,
      middleName: d.middleName,
      lastName: d.lastName,
      dateOfBirth: d.dateOfBirth,
      gender: d.gender,
      photoUrl: d.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      admissionDate: d.admissionDate,
      status: d.status,
      classId: `cls-${d.className.replace(/\s+/g, "").toLowerCase()}`,
      className: d.className,
      streamId: `st-${d.streamName.toLowerCase()}`,
      streamName: d.streamName,
      curriculum: d.curriculum,
      address: d.address,
      county: d.county,
      medicalInfo: {
        bloodGroup: d.bloodGroup || "O+",
        allergies: d.allergies ? d.allergies.split(",").map((s) => s.trim()) : [],
        emergencyDoctor: d.emergencyDoctor || "General Emergency",
        emergencyPhone: d.emergencyPhone,
      },
      parent: {
        id: `par-${Date.now()}`,
        fullName: d.parentFullName,
        relationship: d.parentRelationship,
        phone: d.parentPhone,
        email: d.parentEmail,
        occupation: d.parentOccupation || "Guardian",
        address: d.address,
      },
      academic: {
        currentTermAverage: 0,
        previousTermAverage: 0,
        trend: "STABLE",
        rank: 0,
        totalInClass: 35,
        subjectGrades: [],
        termTrends: [],
      },
      attendance: {
        rate: 100,
        totalDays: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        warningThresholdTriggered: false,
        recentLogs: [],
      },
      fees: {
        expectedAmount: 85000,
        paidAmount: 0,
        balance: 85000,
        status: "OUTSTANDING",
        dueDate: "2026-10-31",
        transactions: [],
      },
      discipline: [],
      documents: [],
      communications: [
        {
          id: `comm-admit-${Date.now()}`,
          date: new Date().toLocaleDateString("en-GB"),
          channel: "SMS",
          recipient: d.parentPhone,
          subject: "Admission Confirmation",
          body: `Welcome to SOP International Academy. Admission confirmed for ${d.firstName} ${d.lastName} (${d.admissionNumber}) in ${d.className} ${d.streamName}.`,
          status: "DELIVERED",
        },
      ],
    };

    addStudent(newStudent);

    return NextResponse.json({
      success: true,
      message: "Student admitted successfully",
      student: newStudent,
    }, { status: 201 });
  } catch (error: any) {
    if (error?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Permission denied (students.create required)" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to admit student" }, { status: 500 });
  }
}
