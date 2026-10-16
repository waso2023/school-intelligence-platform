import { getPermissionsForRole } from "../permissions/rbac";

export interface DemoUser {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  password: string; // Plaintext for easy demo display, verified via bcrypt or direct match
  role: string;
  title: string;
  avatarUrl: string;
  phone: string;
  permissions: string[];
}

export const DEMO_SCHOOL = {
  id: "school-sop-001",
  code: "SOP-001",
  name: "SOP International Academy",
  slug: "sop-international-academy",
  motto: "Excellence in Knowledge & Character",
  logoUrl: "/images/sop-logo.png",
  phone: "+254 712 345 678",
  email: "info@sopacademy.ac.ke",
  address: "Dagoretti Road, Karen, Nairobi",
  county: "Nairobi",
  country: "Kenya",
  curriculum: "CBC & Cambridge International",
  currency: "KES",
  academicYear: "2026",
  currentTerm: "Term 1, 2026",
  stats: {
    totalStudents: 312,
    totalClasses: 18,
    activeStaff: 42,
    todayAttendanceRate: 94.6,
    feeCollectionRate: 78.4,
    totalBilledFees: 24960000, // KSh 24.96M
    totalCollectedFees: 19568000, // KSh 19.56M
    totalOutstandingFees: 5392000, // KSh 5.39M
    academicAverage: 71.8,
    activeIncidents: 3,
  },
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "user-super-admin",
    schoolId: DEMO_SCHOOL.id,
    name: "Dr. Evelyn Mwangi",
    email: "superadmin@sopacademy.ac.ke",
    password: "Admin@2026!",
    role: "SUPER_ADMIN",
    title: "System Executive Administrator",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    phone: "+254 722 100 001",
    permissions: ["*"],
  },
  {
    id: "user-principal",
    schoolId: DEMO_SCHOOL.id,
    name: "Prof. Arthur Ochieng",
    email: "principal@sopacademy.ac.ke",
    password: "Principal@2026!",
    role: "PRINCIPAL",
    title: "Head of School & Principal",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    phone: "+254 722 200 002",
    permissions: getPermissionsForRole("PRINCIPAL"),
  },
  {
    id: "user-teacher",
    schoolId: DEMO_SCHOOL.id,
    name: "Sarah Wanjiku",
    email: "teacher.sarah@sopacademy.ac.ke",
    password: "Teacher@2026!",
    role: "TEACHER",
    title: "Class Teacher - Grade 8 East (Sciences & Math)",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    phone: "+254 722 300 003",
    permissions: getPermissionsForRole("TEACHER"),
  },
  {
    id: "user-teacher-james",
    schoolId: DEMO_SCHOOL.id,
    name: "James Mutua",
    email: "teacher.james@sopacademy.ac.ke",
    password: "Teacher@2026!",
    role: "TEACHER",
    title: "Class Teacher - Grade 7 North (Social Studies)",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    phone: "+254 722 300 014",
    permissions: getPermissionsForRole("TEACHER"),
  },
  {
    id: "user-teacher-brian",
    schoolId: DEMO_SCHOOL.id,
    name: "Brian Odhiambo",
    email: "teacher.brian@sopacademy.ac.ke",
    password: "Teacher@2026!",
    role: "TEACHER",
    title: "Class Teacher - Year 10 Alpha (Cambridge Sciences)",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    phone: "+254 722 300 025",
    permissions: getPermissionsForRole("TEACHER"),
  },
  {
    id: "user-finance",
    schoolId: DEMO_SCHOOL.id,
    name: "Peter Kipkorir",
    email: "finance.peter@sopacademy.ac.ke",
    password: "Finance@2026!",
    role: "FINANCE_OFFICER",
    title: "Senior Bursar & Finance Controller",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    phone: "+254 722 400 004",
    permissions: getPermissionsForRole("FINANCE_OFFICER"),
  },
  {
    id: "user-parent",
    schoolId: DEMO_SCHOOL.id,
    name: "David Kimani",
    email: "parent.david@sopacademy.ac.ke",
    password: "Parent@2026!",
    role: "PARENT",
    title: "Parent / Guardian (Kevin Kimani - Grade 8 East)",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    phone: "+254 722 500 005",
    permissions: getPermissionsForRole("PARENT"),
  },
  {
    id: "user-student",
    schoolId: DEMO_SCHOOL.id,
    name: "Kevin Kimani",
    email: "student.kevin@sopacademy.ac.ke",
    password: "Student@2026!",
    role: "STUDENT",
    title: "Student - Grade 8 East (Adm: SOP-2024-0082)",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    phone: "+254 722 600 006",
    permissions: getPermissionsForRole("STUDENT"),
  },
  {
    id: "user-receptionist",
    schoolId: DEMO_SCHOOL.id,
    name: "Grace Auma",
    email: "reception@sopacademy.ac.ke",
    password: "Reception@2026!",
    role: "RECEPTIONIST",
    title: "Admissions & Front Desk Coordinator",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    phone: "+254 722 700 007",
    permissions: getPermissionsForRole("RECEPTIONIST"),
  },
];

export const DEMO_CLASSES = [
  { id: "cls-1", name: "Grade 7", streams: ["East", "West", "North"], studentCount: 84, teacher: "James Mutua" },
  { id: "cls-2", name: "Grade 8", streams: ["East", "West", "North"], studentCount: 79, teacher: "Sarah Wanjiku" },
  { id: "cls-3", name: "Grade 9", streams: ["East", "West"], studentCount: 62, teacher: "Grace Kilonzo" },
  { id: "cls-4", name: "Year 10", streams: ["Alpha", "Beta"], studentCount: 45, teacher: "Brian Odhiambo" },
  { id: "cls-5", name: "Year 11", streams: ["Alpha", "Beta"], studentCount: 42, teacher: "Esther Chebet" },
];

export const DEMO_INTELLIGENCE_ALERTS = [
  {
    id: "ai-1",
    type: "ACADEMIC_RISK",
    severity: "HIGH",
    title: "8 students showing persistent academic decline",
    detail: "Mathematics and Integrated Sciences term average dropped by >12% across Grade 8 East.",
    action: "Schedule academic clinic with Subject Teachers and parents.",
  },
  {
    id: "ai-2",
    type: "FINANCE_ARREARS",
    severity: "MEDIUM",
    title: "KSh 5,392,000 outstanding fee arrears across school",
    detail: "Grade 8 and Year 10 represent 42% of unpaid balances ahead of mid-term exams.",
    action: "Automated WhatsApp and SMS reminder batches prepared.",
  },
  {
    id: "ai-3",
    type: "ATTENDANCE_ANOMALY",
    severity: "LOW",
    title: "Attendance improved by 6.2% compared to last month",
    detail: "Average daily presence at 94.6% following school bus route optimization.",
    action: "Maintain current transport schedule.",
  },
];
