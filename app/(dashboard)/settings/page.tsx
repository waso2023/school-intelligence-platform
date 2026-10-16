import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/permissions/rbac";
import { PERMISSIONS, ALL_PERMISSIONS, ROLE_PERMISSIONS_MAP } from "@/lib/permissions/permissions";
import { DEMO_SCHOOL, DEMO_USERS } from "@/lib/data/demo-data";
import {
  Settings,
  Shield,
  Users,
  Building,
  Key,
  History,
  CheckCircle,
  XCircle,
  Lock,
} from "lucide-react";
import { RoleBadge } from "@/components/dashboard/role-badge";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const canManage = hasPermission(session.permissions, PERMISSIONS.SETTINGS_MANAGE);
  if (!canManage) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-rose-600">Access Denied</h2>
        <p className="text-xs text-slate-500 mt-1">
          Settings and RBAC management requires administrator privileges.
        </p>
      </div>
    );
  }

  const sampleAuditLogs = [
    {
      id: "log-1",
      user: "Peter Kipkorir (Finance Officer)",
      action: "PAYMENT_RECORDED",
      entity: "Payment (REC-2026-0089)",
      details: "Recorded M-Pesa KSh 60,000 for Kevin Kimani",
      time: "10 mins ago",
      ip: "197.237.142.18",
    },
    {
      id: "log-2",
      user: "Sarah Wanjiku (Teacher)",
      action: "ATTENDANCE_MARKED",
      entity: "Attendance (Grade 8 East)",
      details: "37 present, 1 excused",
      time: "2 hours ago",
      ip: "197.237.142.22",
    },
    {
      id: "log-3",
      user: "Dr. Evelyn Mwangi (Super Admin)",
      action: "USER_LOGIN",
      entity: "Session",
      details: "Successful JWT authentication",
      time: "4 hours ago",
      ip: "105.163.0.45",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-600" />
          Settings, RBAC & Institutional Governance
        </h1>
        <p className="text-xs text-slate-500">
          Tenant isolation, role-based permission matrix, and system audit trail
        </p>
      </div>

      {/* School Profile Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building className="h-4 w-4 text-emerald-600" />
            Institutional Profile (SaaS Tenant)
          </h2>
          <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Tenant ID: {DEMO_SCHOOL.code}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">School Name</span>
            <span className="font-semibold text-slate-900">{DEMO_SCHOOL.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Campus Address</span>
            <span className="font-semibold text-slate-900">{DEMO_SCHOOL.address}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Curriculum System</span>
            <span className="font-semibold text-slate-900">{DEMO_SCHOOL.curriculum}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Current Academic Term</span>
            <span className="font-semibold text-slate-900">{DEMO_SCHOOL.currentTerm}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Official Contact</span>
            <span className="font-semibold text-slate-900">{DEMO_SCHOOL.phone} • {DEMO_SCHOOL.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Billing Currency</span>
            <span className="font-semibold text-slate-900">Kenyan Shilling (KES / KSh)</span>
          </div>
        </div>
      </div>

      {/* System Administration & Configuration Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/settings/academics"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Academic Engine & Grading Rules
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
              Configure →
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Customize assessment weightings (CAT, Mid, Finals = 100%), CBC/Cambridge performance bands, pass marks, and class position ranking visibility.
          </p>
        </a>

        {session.role === "SUPER_ADMIN" ? (
          <a
            href="/settings/data-import"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all group block"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                    Data Migration & Import Center
                    <span className="text-[9px] uppercase tracking-wider font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Super Admin
                    </span>
                  </h3>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                Launch Wizard →
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Bulk import student records, staff registers, and fee balances from Excel (.xlsx) and CSV spreadsheets with duplicate resolution and rollback.
            </p>
          </a>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs opacity-75">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-200 text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-600 flex items-center gap-2">
                  Data Migration & Import Center
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                    Restricted
                  </span>
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Super Admin Only
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct spreadsheet entity persistence and batch database rollbacks are strictly restricted to the Super Administrator.
            </p>
          </div>
        )}
      </div>

      {/* RBAC Permission Matrix */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Role-Based Access Control (RBAC) Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Granular permission mapping enforced on server endpoints and database queries
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Permission</th>
                <th className="py-2.5 px-2 text-center">Super Admin</th>
                <th className="py-2.5 px-2 text-center">Principal</th>
                <th className="py-2.5 px-2 text-center">Teacher</th>
                <th className="py-2.5 px-2 text-center">Finance</th>
                <th className="py-2.5 px-2 text-center">Parent</th>
                <th className="py-2.5 px-2 text-center">Student</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ALL_PERMISSIONS.slice(0, 10).map((perm) => (
                <tr key={perm.code} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-500">{perm.module}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-slate-900">{perm.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{perm.code}</div>
                  </td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-2 text-center">
                    {ROLE_PERMISSIONS_MAP.PRINCIPAL.includes(perm.code) ? (
                      <span className="text-emerald-600 font-bold">✓</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {ROLE_PERMISSIONS_MAP.TEACHER.includes(perm.code) ? (
                      <span className="text-emerald-600 font-bold">✓</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {ROLE_PERMISSIONS_MAP.FINANCE_OFFICER.includes(perm.code) ? (
                      <span className="text-emerald-600 font-bold">✓</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {ROLE_PERMISSIONS_MAP.PARENT.includes(perm.code) ? (
                      <span className="text-emerald-600 font-bold">✓</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {ROLE_PERMISSIONS_MAP.STUDENT.includes(perm.code) ? (
                      <span className="text-emerald-600 font-bold">✓</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail System */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <History className="h-4 w-4 text-emerald-600" />
          Audit Trail Log (Kenya Data Protection Act 2019)
        </h2>
        <div className="divide-y divide-slate-100 text-xs">
          {sampleAuditLogs.map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="font-semibold text-slate-900">{log.user}</span>
                <span className="text-slate-500 ml-2">[{log.action}]</span>
                <p className="text-slate-600 text-[11px] mt-0.5">{log.details}</p>
              </div>
              <div className="text-right text-slate-400 text-[11px] font-mono">
                <div>{log.time}</div>
                <div>IP: {log.ip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
