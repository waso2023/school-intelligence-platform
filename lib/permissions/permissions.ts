// Granular Permissions Definition for School Intelligence Platform

export const PERMISSIONS = {
  // Students Module
  STUDENTS_VIEW: "students.view",
  STUDENTS_CREATE: "students.create",
  STUDENTS_EDIT: "students.edit",
  STUDENTS_DELETE: "students.delete",

  // Academics & Exams
  ACADEMICS_VIEW: "academics.view",
  ACADEMICS_MANAGE: "academics.manage",
  ACADEMICS_GRADES_ENTER: "academics.grades.enter",

  // Attendance
  ATTENDANCE_VIEW: "attendance.view",
  ATTENDANCE_MARK: "attendance.mark",

  // Fees & Finance
  FEES_VIEW: "fees.view",
  FEES_MANAGE: "fees.manage",
  FEES_RECORD_PAYMENT: "fees.record_payment",
  FEES_REPORTS: "fees.reports",

  // Communication
  COMMUNICATION_VIEW: "communication.view",
  COMMUNICATION_SEND: "communication.send",
  COMMUNICATION_ANNOUNCEMENTS: "communication.announcements",

  // Administration & Staff
  STAFF_VIEW: "staff.view",
  STAFF_MANAGE: "staff.manage",
  TIMETABLE_MANAGE: "timetable.manage",
  EVENTS_MANAGE: "events.manage",
  TRANSPORT_VIEW: "transport.view",
  TRANSPORT_MANAGE: "transport.manage",
  DISCIPLINE_VIEW: "discipline.view",
  DISCIPLINE_MANAGE: "discipline.manage",
  DOCUMENTS_VIEW: "documents.view",
  DOCUMENTS_MANAGE: "documents.manage",

  // AI Intelligence
  AI_USE: "ai.use",
  AI_CHAT: "ai.chat",
  AI_REPORTS: "ai.reports",
  AI_INSIGHTS: "ai.insights",

  // Reports
  REPORTS_VIEW: "reports.view",
  REPORTS_GENERATE: "reports.generate",

  // Settings & System
  SETTINGS_MANAGE: "settings.manage",
  AUDIT_VIEW: "audit.view",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface PermissionDefinition {
  code: PermissionCode;
  name: string;
  module: string;
  description: string;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // Students
  { code: PERMISSIONS.STUDENTS_VIEW, name: "View Students", module: "Students", description: "Can view student directory and profiles" },
  { code: PERMISSIONS.STUDENTS_CREATE, name: "Create Students", module: "Students", description: "Can admit new students" },
  { code: PERMISSIONS.STUDENTS_EDIT, name: "Edit Students", module: "Students", description: "Can edit student profile details" },
  { code: PERMISSIONS.STUDENTS_DELETE, name: "Delete Students", module: "Students", description: "Can archive or delete students" },

  // Academics
  { code: PERMISSIONS.ACADEMICS_VIEW, name: "View Academics", module: "Academics", description: "Can view subjects, exams and grade sheets" },
  { code: PERMISSIONS.ACADEMICS_MANAGE, name: "Manage Academics", module: "Academics", description: "Can create exams, subjects and grading policies" },
  { code: PERMISSIONS.ACADEMICS_GRADES_ENTER, name: "Enter Grades", module: "Academics", description: "Can submit student marks and remarks" },

  // Attendance
  { code: PERMISSIONS.ATTENDANCE_VIEW, name: "View Attendance", module: "Attendance", description: "Can view daily and monthly attendance" },
  { code: PERMISSIONS.ATTENDANCE_MARK, name: "Mark Attendance", module: "Attendance", description: "Can take student and class attendance" },

  // Finance
  { code: PERMISSIONS.FEES_VIEW, name: "View Fees", module: "Finance", description: "Can view fee balances and invoices" },
  { code: PERMISSIONS.FEES_MANAGE, name: "Manage Fee Structures", module: "Finance", description: "Can configure fee heads and term billing" },
  { code: PERMISSIONS.FEES_RECORD_PAYMENT, name: "Record Payments", module: "Finance", description: "Can log M-Pesa, bank and cash payments" },
  { code: PERMISSIONS.FEES_REPORTS, name: "Finance Reports", module: "Finance", description: "Can view arrears and revenue reports" },

  // Communication
  { code: PERMISSIONS.COMMUNICATION_VIEW, name: "View Messages", module: "Communication", description: "Can view message logs and announcements" },
  { code: PERMISSIONS.COMMUNICATION_SEND, name: "Send Messages", module: "Communication", description: "Can send SMS, Email, and WhatsApp to parents" },
  { code: PERMISSIONS.COMMUNICATION_ANNOUNCEMENTS, name: "Publish Announcements", module: "Communication", description: "Can post school-wide notices" },

  // Administration
  { code: PERMISSIONS.STAFF_VIEW, name: "View Staff", module: "Administration", description: "Can view staff and teacher directory" },
  { code: PERMISSIONS.STAFF_MANAGE, name: "Manage Staff", module: "Administration", description: "Can add and edit employee profiles" },
  { code: PERMISSIONS.TIMETABLE_MANAGE, name: "Manage Timetable", module: "Administration", description: "Can schedule lessons and classrooms" },
  { code: PERMISSIONS.EVENTS_MANAGE, name: "Manage Events", module: "Administration", description: "Can schedule school events and calendar" },
  { code: PERMISSIONS.TRANSPORT_VIEW, name: "View Transport", module: "Administration", description: "Can view bus routes and stops" },
  { code: PERMISSIONS.TRANSPORT_MANAGE, name: "Manage Transport", module: "Administration", description: "Can assign buses and drivers" },
  { code: PERMISSIONS.DISCIPLINE_VIEW, name: "View Discipline", module: "Administration", description: "Can view behavioral incidents" },
  { code: PERMISSIONS.DISCIPLINE_MANAGE, name: "Manage Discipline", module: "Administration", description: "Can log and resolve disciplinary cases" },
  { code: PERMISSIONS.DOCUMENTS_VIEW, name: "View Documents", module: "Administration", description: "Can read school policy handbooks" },
  { code: PERMISSIONS.DOCUMENTS_MANAGE, name: "Manage Documents", module: "Administration", description: "Can upload policy files for AI RAG ingestion" },

  // AI Intelligence
  { code: PERMISSIONS.AI_USE, name: "Access AI Intelligence", module: "AI", description: "Can open the AI School Intelligence dashboard" },
  { code: PERMISSIONS.AI_CHAT, name: "AI Chat Queries", module: "AI", description: "Can ask natural language questions about school data" },
  { code: PERMISSIONS.AI_REPORTS, name: "Generate AI Reports", module: "AI", description: "Can synthesize automated monthly executive reports" },
  { code: PERMISSIONS.AI_INSIGHTS, name: "View Risk Insights", module: "AI", description: "Can view student academic and financial risk flags" },

  // Reports
  { code: PERMISSIONS.REPORTS_VIEW, name: "View Reports", module: "Reports", description: "Can view management analytics" },
  { code: PERMISSIONS.REPORTS_GENERATE, name: "Generate Reports", module: "Reports", description: "Can export academic and fee summaries" },

  // Settings & System
  { code: PERMISSIONS.SETTINGS_MANAGE, name: "Manage Settings", module: "Settings", description: "Can modify school configuration and roles" },
  { code: PERMISSIONS.AUDIT_VIEW, name: "View Audit Logs", module: "Audit", description: "Can view system-wide audit trail logs" },
];

/**
 * Role-to-Permissions Matrix
 */
export const ROLE_PERMISSIONS_MAP: Record<string, PermissionCode[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),

  SCHOOL_ADMIN: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_EDIT,
    PERMISSIONS.STUDENTS_DELETE,
    PERMISSIONS.ACADEMICS_VIEW,
    PERMISSIONS.ACADEMICS_MANAGE,
    PERMISSIONS.ACADEMICS_GRADES_ENTER,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.FEES_MANAGE,
    PERMISSIONS.FEES_RECORD_PAYMENT,
    PERMISSIONS.FEES_REPORTS,
    PERMISSIONS.COMMUNICATION_VIEW,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.COMMUNICATION_ANNOUNCEMENTS,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.STAFF_MANAGE,
    PERMISSIONS.TIMETABLE_MANAGE,
    PERMISSIONS.EVENTS_MANAGE,
    PERMISSIONS.TRANSPORT_VIEW,
    PERMISSIONS.TRANSPORT_MANAGE,
    PERMISSIONS.DISCIPLINE_VIEW,
    PERMISSIONS.DISCIPLINE_MANAGE,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_MANAGE,
    PERMISSIONS.AI_USE,
    PERMISSIONS.AI_CHAT,
    PERMISSIONS.AI_REPORTS,
    PERMISSIONS.AI_INSIGHTS,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
  ],

  PRINCIPAL: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.ACADEMICS_VIEW,
    PERMISSIONS.ACADEMICS_MANAGE,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.FEES_REPORTS,
    PERMISSIONS.COMMUNICATION_VIEW,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.COMMUNICATION_ANNOUNCEMENTS,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.TIMETABLE_MANAGE,
    PERMISSIONS.EVENTS_MANAGE,
    PERMISSIONS.TRANSPORT_VIEW,
    PERMISSIONS.DISCIPLINE_VIEW,
    PERMISSIONS.DISCIPLINE_MANAGE,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_MANAGE,
    PERMISSIONS.AI_USE,
    PERMISSIONS.AI_CHAT,
    PERMISSIONS.AI_REPORTS,
    PERMISSIONS.AI_INSIGHTS,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.AUDIT_VIEW,
  ],

  TEACHER: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.ACADEMICS_VIEW,
    PERMISSIONS.ACADEMICS_GRADES_ENTER,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.COMMUNICATION_VIEW,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.DISCIPLINE_VIEW,
    PERMISSIONS.DISCIPLINE_MANAGE,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.AI_USE,
    PERMISSIONS.AI_CHAT,
  ],

  FINANCE_OFFICER: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.FEES_MANAGE,
    PERMISSIONS.FEES_RECORD_PAYMENT,
    PERMISSIONS.FEES_REPORTS,
    PERMISSIONS.COMMUNICATION_VIEW,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.AI_USE,
    PERMISSIONS.AI_CHAT,
  ],

  RECEPTIONIST: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.COMMUNICATION_VIEW,
    PERMISSIONS.COMMUNICATION_SEND,
    PERMISSIONS.EVENTS_MANAGE,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.TRANSPORT_VIEW,
  ],

  PARENT: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.ACADEMICS_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.FEES_VIEW,
    PERMISSIONS.COMMUNICATION_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.AI_USE,
    PERMISSIONS.AI_CHAT,
  ],

  STUDENT: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.ACADEMICS_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
  ],

  DRIVER: [
    PERMISSIONS.TRANSPORT_VIEW,
    PERMISSIONS.COMMUNICATION_VIEW,
  ],
};
