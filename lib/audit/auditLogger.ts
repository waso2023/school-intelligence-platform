export interface AuditLogEntry {
  id: string;
  schoolId: string;
  userId?: string;
  userName?: string;
  role?: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

const auditLogsStore: AuditLogEntry[] = [
  {
    id: "log-seed-1",
    schoolId: "school-sop-001",
    userId: "usr-demo-fin",
    userName: "Peter Kipkorir",
    role: "FINANCE_OFFICER",
    action: "PAYMENT_RECORDED",
    entity: "Payment",
    entityId: "REC-2026-0089",
    details: "Recorded M-Pesa KSh 60,000 for Kevin Kimani (Grade 8 East)",
    ipAddress: "197.237.142.18",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "log-seed-2",
    schoolId: "school-sop-001",
    userId: "usr-demo-tch",
    userName: "Sarah Wanjiku",
    role: "TEACHER",
    action: "ATTENDANCE_MARKED",
    entity: "Attendance",
    entityId: "att-cls-2",
    details: "Class register marked for Grade 8 East: 37 present, 1 excused",
    ipAddress: "197.237.142.22",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "log-seed-3",
    schoolId: "school-sop-001",
    userId: "usr-demo-sa",
    userName: "Dr. Evelyn Mwangi",
    role: "SUPER_ADMIN",
    action: "USER_AUTHENTICATION",
    entity: "Session",
    entityId: "sess-jwt-sop",
    details: "Super Administrator session authenticated via secure JWT cookie",
    ipAddress: "105.163.0.45",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

export async function logAuditEvent(params: {
  schoolId: string;
  userId?: string;
  userName?: string;
  role?: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
}): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    schoolId: params.schoolId,
    userId: params.userId,
    userName: params.userName || "System",
    role: params.role || "SYSTEM",
    action: params.action,
    entity: params.entity,
    entityId: params.entityId,
    details: params.details,
    ipAddress: params.ipAddress || "127.0.0.1",
    createdAt: new Date().toISOString(),
  };

  auditLogsStore.unshift(entry);
  return entry;
}

export async function getAuditLogs(
  schoolId: string,
  limit: number = 50
): Promise<AuditLogEntry[]> {
  return auditLogsStore
    .filter((l) => l.schoolId === schoolId)
    .slice(0, limit);
}
