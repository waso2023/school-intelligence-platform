import { INITIAL_STUDENTS, StudentProfile, getStudents } from "@/lib/data/students-store";

export interface TeacherSchedulePeriod {
  period: number;
  time: string;
  className: string;
  streamName: string;
  subject: string;
  room: string;
  status: "COMPLETED" | "CURRENT" | "UPCOMING";
}

export interface TeacherClassInfo {
  classId: string;
  className: string;
  streams: string[];
  role: "CLASS_TEACHER" | "SUBJECT_TEACHER";
  studentCount: number;
  attendanceRate: number;
  academicAverage: number;
}

export interface TeacherAlert {
  id: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  studentName: string;
  admNo: string;
  className: string;
  streamName: string;
  issue: string;
  action: string;
}

export interface TeacherProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatarUrl: string;
  qualification: string;
  specialization: string;
  primaryClass: string;
  primaryStream: string;
  assignedClasses: TeacherClassInfo[];
  subjectsTaught: string[];
  todaySchedule: TeacherSchedulePeriod[];
  alerts: TeacherAlert[];
}

export const TEACHERS_REGISTRY: Record<string, TeacherProfile> = {
  // 1. Sarah Wanjiku - Grade 8 East Class Teacher (Sciences & Math)
  "teacher.sarah@sopacademy.ac.ke": {
    id: "user-teacher-sarah",
    email: "teacher.sarah@sopacademy.ac.ke",
    name: "Sarah Wanjiku",
    phone: "+254 722 300 003",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    qualification: "B.Ed Science (Kenyatta University)",
    specialization: "Integrated Science & Mathematics",
    primaryClass: "Grade 8",
    primaryStream: "East",
    assignedClasses: [
      {
        classId: "cls-2-east",
        className: "Grade 8",
        streams: ["East", "West"],
        role: "CLASS_TEACHER",
        studentCount: 38,
        attendanceRate: 97.4,
        academicAverage: 74.2,
      },
      {
        classId: "cls-2-west",
        className: "Grade 8",
        streams: ["West"],
        role: "SUBJECT_TEACHER",
        studentCount: 36,
        attendanceRate: 91.8,
        academicAverage: 69.5,
      },
      {
        classId: "cls-1-north",
        className: "Grade 7",
        streams: ["North"],
        role: "SUBJECT_TEACHER",
        studentCount: 36,
        attendanceRate: 95.1,
        academicAverage: 76.8,
      },
    ],
    subjectsTaught: ["Integrated Science", "Mathematics"],
    todaySchedule: [
      {
        period: 1,
        time: "08:00 AM - 08:30 AM",
        className: "Grade 8",
        streamName: "East",
        subject: "Morning Roll Call & Registration",
        room: "Homeroom 14",
        status: "COMPLETED",
      },
      {
        period: 2,
        time: "09:30 AM - 10:15 AM",
        className: "Grade 8",
        streamName: "East",
        subject: "Integrated Science (Lab Practical)",
        room: "Science Lab 2",
        status: "CURRENT",
      },
      {
        period: 3,
        time: "11:15 AM - 12:00 PM",
        className: "Grade 8",
        streamName: "East",
        subject: "Mathematics (Algebra Formulations)",
        room: "Room 14",
        status: "UPCOMING",
      },
      {
        period: 4,
        time: "02:00 PM - 02:45 PM",
        className: "Grade 8",
        streamName: "West",
        subject: "Integrated Science (Cell Biology)",
        room: "Science Lab 2",
        status: "UPCOMING",
      },
    ],
    alerts: [
      {
        id: "alert-sw-1",
        severity: "HIGH",
        studentName: "Zawadi Muthoni",
        admNo: "SOP-2024-0084",
        className: "Grade 8",
        streamName: "West",
        issue: "Declined from 74% to 59% in Science with 2 consecutive unexcused absences.",
        action: "Schedule parent conference and assign remedial practical.",
      },
      {
        id: "alert-sw-2",
        severity: "LOW",
        studentName: "Amani Otieno",
        admNo: "SOP-2024-0083",
        className: "Grade 8",
        streamName: "East",
        issue: "Exceeding expectations in Algebra CAT (scored 88%).",
        action: "Recommend for Inter-School Junior Math Olympiad.",
      },
    ],
  },

  // 2. James Mutua - Grade 7 North Class Teacher (Social Studies & CRE)
  "teacher.james@sopacademy.ac.ke": {
    id: "user-teacher-james",
    email: "teacher.james@sopacademy.ac.ke",
    name: "James Mutua",
    phone: "+254 722 300 014",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    qualification: "M.Ed Curriculum & Social Studies (University of Nairobi)",
    specialization: "Social Studies, CRE & Kenyan History",
    primaryClass: "Grade 7",
    primaryStream: "North",
    assignedClasses: [
      {
        classId: "cls-1-north",
        className: "Grade 7",
        streams: ["North"],
        role: "CLASS_TEACHER",
        studentCount: 36,
        attendanceRate: 98.2,
        academicAverage: 79.5,
      },
      {
        classId: "cls-1-east",
        className: "Grade 7",
        streams: ["East"],
        role: "SUBJECT_TEACHER",
        studentCount: 35,
        attendanceRate: 96.0,
        academicAverage: 75.3,
      },
      {
        classId: "cls-2-east",
        className: "Grade 8",
        streams: ["East"],
        role: "SUBJECT_TEACHER",
        studentCount: 38,
        attendanceRate: 97.4,
        academicAverage: 72.8,
      },
    ],
    subjectsTaught: ["Social Studies & CRE", "Kenyan Heritage"],
    todaySchedule: [
      {
        period: 1,
        time: "08:00 AM - 08:30 AM",
        className: "Grade 7",
        streamName: "North",
        subject: "Morning Roll Call & Class Assembly",
        room: "Homeroom 11",
        status: "COMPLETED",
      },
      {
        period: 2,
        time: "09:00 AM - 09:45 AM",
        className: "Grade 7",
        streamName: "North",
        subject: "Social Studies: East African Trade Networks",
        room: "Room 11",
        status: "CURRENT",
      },
      {
        period: 3,
        time: "10:45 AM - 11:30 AM",
        className: "Grade 7",
        streamName: "East",
        subject: "CRE: Ethical Foundations & Community Values",
        room: "Room 12",
        status: "UPCOMING",
      },
      {
        period: 4,
        time: "01:30 PM - 02:15 PM",
        className: "Grade 8",
        streamName: "East",
        subject: "Social Studies & Governance",
        room: "Room 14",
        status: "UPCOMING",
      },
    ],
    alerts: [
      {
        id: "alert-jm-1",
        severity: "MEDIUM",
        studentName: "Brian Kimutai",
        admNo: "SOP-2024-0088",
        className: "Grade 7",
        streamName: "North",
        issue: "Missed Social Studies CAT 1 due to medical leave.",
        action: "Administer makeup assessment Thursday period 5.",
      },
      {
        id: "alert-jm-2",
        severity: "LOW",
        studentName: "Jabari Kiprono",
        admNo: "SOP-2024-0085",
        className: "Grade 7",
        streamName: "North",
        issue: "Consistently scoring above 82% in African History modules.",
        action: "Nominated as Class Lead for Heritage Day Exhibition.",
      },
    ],
  },

  // 3. Brian Odhiambo - Year 10 Alpha Class Teacher (Cambridge Physics & Chemistry)
  "teacher.brian@sopacademy.ac.ke": {
    id: "user-teacher-brian",
    email: "teacher.brian@sopacademy.ac.ke",
    name: "Brian Odhiambo",
    phone: "+254 722 300 025",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    qualification: "B.Sc Physics, Cambridge International Dip. (Strathmore)",
    specialization: "Cambridge IGCSE Physics & Chemistry",
    primaryClass: "Year 10",
    primaryStream: "Alpha",
    assignedClasses: [
      {
        classId: "cls-4-alpha",
        className: "Year 10",
        streams: ["Alpha"],
        role: "CLASS_TEACHER",
        studentCount: 25,
        attendanceRate: 96.5,
        academicAverage: 78.4,
      },
      {
        classId: "cls-4-beta",
        className: "Year 10",
        streams: ["Beta"],
        role: "SUBJECT_TEACHER",
        studentCount: 20,
        attendanceRate: 94.0,
        academicAverage: 73.1,
      },
      {
        classId: "cls-5-alpha",
        className: "Year 11",
        streams: ["Alpha"],
        role: "SUBJECT_TEACHER",
        studentCount: 22,
        attendanceRate: 98.0,
        academicAverage: 82.0,
      },
    ],
    subjectsTaught: ["IGCSE Physics", "IGCSE Chemistry"],
    todaySchedule: [
      {
        period: 1,
        time: "08:00 AM - 08:30 AM",
        className: "Year 10",
        streamName: "Alpha",
        subject: "Morning Registration & International Form Check",
        room: "Room 21",
        status: "COMPLETED",
      },
      {
        period: 2,
        time: "09:15 AM - 10:15 AM",
        className: "Year 10",
        streamName: "Alpha",
        subject: "IGCSE Physics: Kinematics & Free Fall Lab",
        room: "Physics Lab 1",
        status: "CURRENT",
      },
      {
        period: 3,
        time: "11:30 AM - 12:30 PM",
        className: "Year 10",
        streamName: "Beta",
        subject: "IGCSE Chemistry: Stoichiometry & Titrations",
        room: "Chem Lab 2",
        status: "UPCOMING",
      },
      {
        period: 4,
        time: "02:30 PM - 03:30 PM",
        className: "Year 11",
        streamName: "Alpha",
        subject: "A-Level Mechanics Prep Clinic",
        room: "Physics Lab 1",
        status: "UPCOMING",
      },
    ],
    alerts: [
      {
        id: "alert-bo-1",
        severity: "HIGH",
        studentName: "Imani Chebet",
        admNo: "SOP-2024-0086",
        className: "Year 10",
        streamName: "Alpha",
        issue: "Declined from 78% to 68.4% in Chemistry. Laboratory report outstanding.",
        action: "Remedial lab session required before midterm coursework submission.",
      },
      {
        id: "alert-bo-2",
        severity: "LOW",
        studentName: "Liam Kipkemboi",
        admNo: "SOP-2024-0091",
        className: "Year 10",
        streamName: "Alpha",
        issue: "Top performer in Thermal Physics assessment (scored 94%).",
        action: "Selected for East African Science Fair delegation.",
      },
    ],
  },

  // 4. Grace Kilonzo - Grade 9 East Class Teacher (English & Literature)
  "teacher.grace@sopacademy.ac.ke": {
    id: "user-teacher-grace",
    email: "teacher.grace@sopacademy.ac.ke",
    name: "Grace Kilonzo",
    phone: "+254 722 300 036",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    qualification: "B.Ed Arts (English & Literature, Moi University)",
    specialization: "English Language & African Literature",
    primaryClass: "Grade 9",
    primaryStream: "East",
    assignedClasses: [
      {
        classId: "cls-3-east",
        className: "Grade 9",
        streams: ["East"],
        role: "CLASS_TEACHER",
        studentCount: 32,
        attendanceRate: 96.8,
        academicAverage: 77.2,
      },
      {
        classId: "cls-3-west",
        className: "Grade 9",
        streams: ["West"],
        role: "SUBJECT_TEACHER",
        studentCount: 30,
        attendanceRate: 94.5,
        academicAverage: 73.0,
      },
    ],
    subjectsTaught: ["English Language", "Literature in English"],
    todaySchedule: [
      {
        period: 1,
        time: "08:00 AM - 08:30 AM",
        className: "Grade 9",
        streamName: "East",
        subject: "Morning Registration & Pastoral Check",
        room: "Homeroom 15",
        status: "COMPLETED",
      },
      {
        period: 2,
        time: "09:15 AM - 10:00 AM",
        className: "Grade 9",
        streamName: "East",
        subject: "English Language: Expository Writing Workshop",
        room: "Room 15",
        status: "CURRENT",
      },
      {
        period: 3,
        time: "11:00 AM - 11:45 AM",
        className: "Grade 9",
        streamName: "West",
        subject: "African Literature: 'The River Between' Seminar",
        room: "Library Wing B",
        status: "UPCOMING",
      },
    ],
    alerts: [
      {
        id: "alert-gk-1",
        severity: "MEDIUM",
        studentName: "Ethan Kipchirchir",
        admNo: "SOP-2024-0090",
        className: "Grade 9",
        streamName: "West",
        issue: "Draft essay submission overdue by 3 days.",
        action: "Send reminder notice to guardian.",
      },
    ],
  },
};

/**
 * Returns the TeacherProfile for the given email or name.
 * If not specifically registered, generates an intelligent profile dynamically.
 */
export function getTeacherProfile(emailOrName: string): TeacherProfile {
  const normalized = emailOrName.trim().toLowerCase();

  // 1. Direct email lookup
  if (TEACHERS_REGISTRY[normalized]) {
    return TEACHERS_REGISTRY[normalized];
  }

  // 2. Name search
  for (const key of Object.keys(TEACHERS_REGISTRY)) {
    const t = TEACHERS_REGISTRY[key];
    if (t.name.toLowerCase() === normalized || normalized.includes(t.name.toLowerCase())) {
      return t;
    }
  }

  // 3. Fallback default: Sarah Wanjiku
  return TEACHERS_REGISTRY["teacher.sarah@sopacademy.ac.ke"];
}

/**
 * Returns students belonging to a teacher's assigned classes.
 * Can filter specifically by class and stream.
 */
export function getStudentsForTeacher(
  teacherIdentifier: string,
  selectedClass?: string,
  selectedStream?: string
): StudentProfile[] {
  const teacher = getTeacherProfile(teacherIdentifier);
  const allStudents = getStudents();

  // If specific class selected (e.g. "Grade 8")
  if (selectedClass && selectedClass !== "ALL") {
    return allStudents.filter((s) => {
      const matchClass = s.className.toLowerCase() === selectedClass.toLowerCase();
      if (!matchClass) return false;

      if (selectedStream && selectedStream !== "ALL") {
        return s.streamName.toLowerCase() === selectedStream.toLowerCase();
      }
      return true;
    });
  }

  // Otherwise, return all students matching any class managed or taught by this teacher
  const managedClassNames = teacher.assignedClasses.map((c) => c.className.toLowerCase());
  return allStudents.filter((s) => managedClassNames.includes(s.className.toLowerCase()));
}

// =========================================================================
// PRINCIPAL & EXECUTIVE FACULTY MONITORING ENGINE
// =========================================================================

export type TeacherAttendanceStatus =
  | "PRESENT_ON_TIME"
  | "PRESENT_LATE"
  | "EXCUSED_LEAVE"
  | "ON_DUTY_FIELD";

export type SyllabusPacingStatus = "ON_TRACK" | "AHEAD" | "BEHIND";
export type SchemesApprovalStatus = "APPROVED" | "PENDING_APPROVAL" | "OVERDUE";
export type FacultyDepartment =
  | "STEM & Mathematics"
  | "Languages & Literature"
  | "Humanities & Social Sciences"
  | "Cambridge Senior Sciences"
  | "Creative Arts & PE";

export interface TeacherMonitoringRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  qualification: string;
  specialization: string;
  department: FacultyDepartment;
  curriculum: "CBC" | "Cambridge" | "Dual (CBC & Cambridge)";
  primaryRole: string;
  classesTaught: string[];
  subjects: string[];
  attendance: {
    statusToday: TeacherAttendanceStatus;
    clockInTime: string;
    weeklyAttendanceRate: number;
    termPunctualityRate: number;
    periodsToday: {
      scheduled: number;
      completed: number;
      inProgress: number;
    };
    consecutiveDaysPresent: number;
    arrivalNote?: string;
  };
  progress: {
    syllabusCoveragePct: number;
    syllabusTargetPct: number;
    syllabusStatus: SyllabusPacingStatus;
    schemesOfWorkStatus: SchemesApprovalStatus;
    lessonPlansCurrent: boolean;
    gradebookMarksEnteredPct: number;
    classAcademicMean: number;
    parentCommunicationCount: number;
    activeAlertsCount: number;
  };
  recentActivity: string;
}

export interface FacultySupervisionSummary {
  totalFaculty: number;
  presentToday: number;
  onTimeCount: number;
  lateCount: number;
  excusedCount: number;
  onDutyFieldCount: number;
  overallOnTimeRate: number;
  avgSyllabusCoverage: number;
  syllabusTarget: number;
  avgGradebookCompliance: number;
  attentionRequiredCount: number;
  records: TeacherMonitoringRecord[];
}

export const TEACHER_MONITORING_RECORDS: TeacherMonitoringRecord[] = [
  {
    id: "user-teacher-sarah",
    name: "Sarah Wanjiku",
    email: "teacher.sarah@sopacademy.ac.ke",
    phone: "+254 722 300 003",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    qualification: "B.Ed Science (Kenyatta University)",
    specialization: "Integrated Science & Mathematics",
    department: "STEM & Mathematics",
    curriculum: "CBC",
    primaryRole: "Grade 8 East Class Teacher & Science Lead",
    classesTaught: ["Grade 8 East", "Grade 8 West", "Grade 7 North"],
    subjects: ["Integrated Science", "Mathematics"],
    attendance: {
      statusToday: "PRESENT_ON_TIME",
      clockInTime: "07:38 AM",
      weeklyAttendanceRate: 98.5,
      termPunctualityRate: 97.0,
      periodsToday: {
        scheduled: 4,
        completed: 3,
        inProgress: 1,
      },
      consecutiveDaysPresent: 18,
    },
    progress: {
      syllabusCoveragePct: 76,
      syllabusTargetPct: 70,
      syllabusStatus: "AHEAD",
      schemesOfWorkStatus: "APPROVED",
      lessonPlansCurrent: true,
      gradebookMarksEnteredPct: 94,
      classAcademicMean: 74.2,
      parentCommunicationCount: 22,
      activeAlertsCount: 2,
    },
    recentActivity: "Completed Grade 8 Science Lab Practical in Science Lab 2 at 10:15 AM",
  },
  {
    id: "user-teacher-james",
    name: "James Mutua",
    email: "teacher.james@sopacademy.ac.ke",
    phone: "+254 722 300 014",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    qualification: "M.Ed Curriculum (Univ. of Nairobi)",
    specialization: "Social Studies, CRE & Kenyan History",
    department: "Humanities & Social Sciences",
    curriculum: "CBC",
    primaryRole: "Grade 7 North Class Teacher & Social Studies Lead",
    classesTaught: ["Grade 7 North", "Grade 7 East", "Grade 8 East"],
    subjects: ["Social Studies & CRE", "Kenyan Heritage"],
    attendance: {
      statusToday: "PRESENT_ON_TIME",
      clockInTime: "07:44 AM",
      weeklyAttendanceRate: 99.0,
      termPunctualityRate: 98.5,
      periodsToday: {
        scheduled: 4,
        completed: 3,
        inProgress: 1,
      },
      consecutiveDaysPresent: 24,
    },
    progress: {
      syllabusCoveragePct: 78,
      syllabusTargetPct: 70,
      syllabusStatus: "AHEAD",
      schemesOfWorkStatus: "APPROVED",
      lessonPlansCurrent: true,
      gradebookMarksEnteredPct: 100,
      classAcademicMean: 79.5,
      parentCommunicationCount: 19,
      activeAlertsCount: 2,
    },
    recentActivity: "Submitted Formative Assessment scores for Grade 7 North Heritage topic",
  },
  {
    id: "user-teacher-brian",
    name: "Brian Odhiambo",
    email: "teacher.brian@sopacademy.ac.ke",
    phone: "+254 722 300 025",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    qualification: "B.Sc Physics, Cambridge Dip.",
    specialization: "Cambridge IGCSE Physics & Chemistry",
    department: "Cambridge Senior Sciences",
    curriculum: "Cambridge",
    primaryRole: "Year 10 Alpha Class Teacher & Physics Lead",
    classesTaught: ["Year 10 Alpha", "Year 10 Beta", "Year 11 Alpha"],
    subjects: ["IGCSE Physics", "IGCSE Chemistry"],
    attendance: {
      statusToday: "PRESENT_ON_TIME",
      clockInTime: "07:32 AM",
      weeklyAttendanceRate: 97.5,
      termPunctualityRate: 95.0,
      periodsToday: {
        scheduled: 4,
        completed: 3,
        inProgress: 1,
      },
      consecutiveDaysPresent: 15,
    },
    progress: {
      syllabusCoveragePct: 72,
      syllabusTargetPct: 70,
      syllabusStatus: "ON_TRACK",
      schemesOfWorkStatus: "APPROVED",
      lessonPlansCurrent: true,
      gradebookMarksEnteredPct: 89,
      classAcademicMean: 78.4,
      parentCommunicationCount: 14,
      activeAlertsCount: 2,
    },
    recentActivity: "Supervised Year 10 Kinematics Free Fall experiment in Physics Lab 1",
  },
  {
    id: "user-teacher-grace",
    name: "Grace Kilonzo",
    email: "teacher.grace@sopacademy.ac.ke",
    phone: "+254 722 300 036",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    qualification: "B.Ed Arts (English & Literature, Moi Univ.)",
    specialization: "English Language & African Literature",
    department: "Languages & Literature",
    curriculum: "CBC",
    primaryRole: "Grade 9 East Class Teacher & English Lead",
    classesTaught: ["Grade 9 East", "Grade 9 West"],
    subjects: ["English Language", "Literature in English"],
    attendance: {
      statusToday: "PRESENT_LATE",
      clockInTime: "08:12 AM",
      arrivalNote: "Ngong Road traffic bottleneck, notified reception at 07:40 AM",
      weeklyAttendanceRate: 94.0,
      termPunctualityRate: 87.5,
      periodsToday: {
        scheduled: 3,
        completed: 2,
        inProgress: 1,
      },
      consecutiveDaysPresent: 9,
    },
    progress: {
      syllabusCoveragePct: 64,
      syllabusTargetPct: 70,
      syllabusStatus: "BEHIND",
      schemesOfWorkStatus: "APPROVED",
      lessonPlansCurrent: true,
      gradebookMarksEnteredPct: 82,
      classAcademicMean: 77.2,
      parentCommunicationCount: 11,
      activeAlertsCount: 1,
    },
    recentActivity: "Conducted Expository Writing seminar with Grade 9 East",
  },
  {
    id: "user-teacher-esther",
    name: "Esther Chebet",
    email: "teacher.esther@sopacademy.ac.ke",
    phone: "+254 722 300 047",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    qualification: "M.Sc Cell Biology, Cambridge Certified",
    specialization: "Cambridge Biology & Physiology",
    department: "Cambridge Senior Sciences",
    curriculum: "Cambridge",
    primaryRole: "Year 11 Alpha Class Teacher & Senior Biology Specialist",
    classesTaught: ["Year 11 Alpha", "Year 11 Beta"],
    subjects: ["Cambridge IGCSE Biology", "Human Physiology"],
    attendance: {
      statusToday: "PRESENT_ON_TIME",
      clockInTime: "07:28 AM",
      weeklyAttendanceRate: 100.0,
      termPunctualityRate: 99.0,
      periodsToday: {
        scheduled: 4,
        completed: 4,
        inProgress: 0,
      },
      consecutiveDaysPresent: 32,
    },
    progress: {
      syllabusCoveragePct: 81,
      syllabusTargetPct: 70,
      syllabusStatus: "AHEAD",
      schemesOfWorkStatus: "APPROVED",
      lessonPlansCurrent: true,
      gradebookMarksEnteredPct: 97,
      classAcademicMean: 82.0,
      parentCommunicationCount: 25,
      activeAlertsCount: 0,
    },
    recentActivity: "Marked Year 11 Genetics coursework and updated online tracker",
  },
  {
    id: "user-teacher-dennis",
    name: "Dennis Njoroge",
    email: "teacher.dennis@sopacademy.ac.ke",
    phone: "+254 722 300 058",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    qualification: "B.Ed Arts (Kiswahili & History, Egerton Univ.)",
    specialization: "Kiswahili Lugha na Fasihi & History",
    department: "Humanities & Social Sciences",
    curriculum: "CBC",
    primaryRole: "Grade 8 West Subject Teacher & Kiswahili Lead",
    classesTaught: ["Grade 8 West", "Grade 8 East", "Grade 9 West"],
    subjects: ["Kiswahili Lugha na Fasihi", "Social Studies"],
    attendance: {
      statusToday: "PRESENT_ON_TIME",
      clockInTime: "07:51 AM",
      weeklyAttendanceRate: 96.0,
      termPunctualityRate: 94.0,
      periodsToday: {
        scheduled: 3,
        completed: 2,
        inProgress: 1,
      },
      consecutiveDaysPresent: 12,
    },
    progress: {
      syllabusCoveragePct: 69,
      syllabusTargetPct: 70,
      syllabusStatus: "ON_TRACK",
      schemesOfWorkStatus: "PENDING_APPROVAL",
      lessonPlansCurrent: true,
      gradebookMarksEnteredPct: 86,
      classAcademicMean: 71.5,
      parentCommunicationCount: 15,
      activeAlertsCount: 1,
    },
    recentActivity: "Conducted Insha writing workshop for Grade 8 West",
  },
  {
    id: "user-teacher-kelvin",
    name: "Kelvin Otieno",
    email: "teacher.kelvin@sopacademy.ac.ke",
    phone: "+254 722 300 069",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    qualification: "B.Sc Computer Science, Strathmore Univ.",
    specialization: "Robotics, Coding & Computational Thinking",
    department: "STEM & Mathematics",
    curriculum: "Dual (CBC & Cambridge)",
    primaryRole: "ICT, Computer Science & Robotics Lead",
    classesTaught: ["Grade 7 East", "Grade 8 East", "Year 10 Alpha"],
    subjects: ["Computer Science", "Robotics & Coding", "ICT"],
    attendance: {
      statusToday: "ON_DUTY_FIELD",
      clockInTime: "07:30 AM",
      arrivalNote: "Leading SOP Academy Robotics Delegation at KICC National STEM Expo",
      weeklyAttendanceRate: 98.0,
      termPunctualityRate: 96.0,
      periodsToday: {
        scheduled: 3,
        completed: 3,
        inProgress: 0,
      },
      consecutiveDaysPresent: 20,
    },
    progress: {
      syllabusCoveragePct: 75,
      syllabusTargetPct: 70,
      syllabusStatus: "AHEAD",
      schemesOfWorkStatus: "APPROVED",
      lessonPlansCurrent: true,
      gradebookMarksEnteredPct: 92,
      classAcademicMean: 80.5,
      parentCommunicationCount: 8,
      activeAlertsCount: 0,
    },
    recentActivity: "Offsite supervision: Robotics competition team advance to national semifinals",
  },
  {
    id: "user-teacher-mary",
    name: "Mary Nyambura",
    email: "teacher.mary@sopacademy.ac.ke",
    phone: "+254 722 300 080",
    avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200",
    qualification: "M.A French Linguistics, Alliance Française",
    specialization: "Cambridge French & Foreign Languages",
    department: "Languages & Literature",
    curriculum: "Cambridge",
    primaryRole: "Year 10 Beta Teacher & Foreign Languages Head",
    classesTaught: ["Year 10 Beta", "Year 11 Beta"],
    subjects: ["Cambridge IGCSE French", "European Literature"],
    attendance: {
      statusToday: "EXCUSED_LEAVE",
      clockInTime: "-",
      arrivalNote: "Approved Medical Leave (Deputy Principal noted). Reliever Mrs. Kariuki covering periods",
      weeklyAttendanceRate: 80.0,
      termPunctualityRate: 90.0,
      periodsToday: {
        scheduled: 3,
        completed: 2,
        inProgress: 1,
      },
      consecutiveDaysPresent: 0,
    },
    progress: {
      syllabusCoveragePct: 68,
      syllabusTargetPct: 70,
      syllabusStatus: "ON_TRACK",
      schemesOfWorkStatus: "APPROVED",
      lessonPlansCurrent: true,
      gradebookMarksEnteredPct: 85,
      classAcademicMean: 75.8,
      parentCommunicationCount: 12,
      activeAlertsCount: 0,
    },
    recentActivity: "Reliever teacher Mrs. Kariuki completed Period 2 French grammar drills",
  },
];

/**
 * Returns complete list of faculty monitoring records for Principal / Admin oversight.
 */
export function getTeachersMonitoringRecords(): TeacherMonitoringRecord[] {
  return TEACHER_MONITORING_RECORDS;
}

/**
 * Aggregates high-level faculty attendance and academic progress statistics for the executive dashboard.
 */
export function getFacultySupervisionSummary(): FacultySupervisionSummary {
  const records = TEACHER_MONITORING_RECORDS;
  const totalFaculty = records.length;

  const presentToday = records.filter(
    (r) =>
      r.attendance.statusToday === "PRESENT_ON_TIME" ||
      r.attendance.statusToday === "PRESENT_LATE" ||
      r.attendance.statusToday === "ON_DUTY_FIELD"
  ).length;

  const onTimeCount = records.filter(
    (r) => r.attendance.statusToday === "PRESENT_ON_TIME"
  ).length;

  const lateCount = records.filter(
    (r) => r.attendance.statusToday === "PRESENT_LATE"
  ).length;

  const excusedCount = records.filter(
    (r) => r.attendance.statusToday === "EXCUSED_LEAVE"
  ).length;

  const onDutyFieldCount = records.filter(
    (r) => r.attendance.statusToday === "ON_DUTY_FIELD"
  ).length;

  const overallOnTimeRate =
    presentToday > 0 ? Math.round((onTimeCount / presentToday) * 1000) / 10 : 0;

  const avgSyllabusCoverage =
    Math.round(
      (records.reduce((acc, r) => acc + r.progress.syllabusCoveragePct, 0) /
        totalFaculty) *
        10
    ) / 10;

  const avgGradebookCompliance =
    Math.round(
      (records.reduce((acc, r) => acc + r.progress.gradebookMarksEnteredPct, 0) /
        totalFaculty) *
        10
    ) / 10;

  const attentionRequiredCount = records.filter(
    (r) =>
      r.attendance.statusToday === "PRESENT_LATE" ||
      r.progress.syllabusStatus === "BEHIND" ||
      r.progress.schemesOfWorkStatus !== "APPROVED" ||
      r.progress.gradebookMarksEnteredPct < 85
  ).length;

  return {
    totalFaculty,
    presentToday,
    onTimeCount,
    lateCount,
    excusedCount,
    onDutyFieldCount,
    overallOnTimeRate,
    avgSyllabusCoverage,
    syllabusTarget: 70,
    avgGradebookCompliance,
    attentionRequiredCount,
    records,
  };
}

/**
 * Records a supervisory communication or action sent to a teacher by the Principal.
 */
export function recordSupervisoryAction(
  teacherId: string,
  actionType: "COMMENDATION" | "REMINDER" | "LESSON_PLAN_QUERY" | "MEETING_REQUEST",
  note: string
): { success: boolean; id: string; timestamp: string } {
  return {
    success: true,
    id: `sup-act-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
}
