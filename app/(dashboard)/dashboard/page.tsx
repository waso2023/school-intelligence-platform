import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { formatKES } from "@/lib/utils";
import { DEMO_SCHOOL, DEMO_INTELLIGENCE_ALERTS, DEMO_CLASSES } from "@/lib/data/demo-data";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  GraduationCap,
  Sparkles,
  Clock,
  BookOpen,
  FileText,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Award,
  Bell,
  Calendar,
  Phone,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { RoleBadge } from "@/components/dashboard/role-badge";
import { TeacherDashboard } from "@/components/dashboard/teacher-dashboard";
import { ReceptionistDashboard } from "@/components/dashboard/receptionist-dashboard";
import { FacultyMonitor } from "@/components/dashboard/faculty-monitor";
import {
  getTeacherProfile,
  getStudentsForTeacher,
  getFacultySupervisionSummary,
} from "@/lib/teachers/teachers-service";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const role = session.role;
  const isSuperAdmin = role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN" || role === "PRINCIPAL";
  const isTeacher = role === "TEACHER";
  const isFinance = role === "FINANCE_OFFICER";
  const isReceptionist = role === "RECEPTIONIST";
  const isParent = role === "PARENT";
  const isStudent = role === "STUDENT";

  const teacherProfile = isTeacher ? getTeacherProfile(session.email || session.name) : null;
  const teacherStudents = isTeacher ? getStudentsForTeacher(session.email || session.name) : [];
  const facultySummary = isSuperAdmin ? getFacultySupervisionSummary() : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner - Tailored to Role */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl text-white shadow-md border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RoleBadge role={role} />
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
              Tenant: {session.schoolId}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isSuperAdmin && `Executive Command Center — Welcome, ${session.name}`}
            {isTeacher && `Faculty & Classroom Portal — Welcome, ${session.name}`}
            {isFinance && `Bursary & Accounts Directorate — Welcome, ${session.name}`}
            {isReceptionist && `Front Desk & Admissions Hub — Welcome, ${session.name}`}
            {isParent && `Guardian Portal — Welcome, ${session.name}`}
            {isStudent && `Learner Workspace — Welcome, ${session.name}`}
          </h1>
          <p className="text-xs text-slate-300">
            {isTeacher && teacherProfile
              ? `${DEMO_SCHOOL.name} • Class Teacher: ${teacherProfile.primaryClass} ${teacherProfile.primaryStream} • ${teacherProfile.specialization}`
              : isReceptionist
              ? `${DEMO_SCHOOL.name} • Karen Main Gate & Admissions Desk • Campus Reception`
              : `${DEMO_SCHOOL.name} • Academic Year ${DEMO_SCHOOL.academicYear} • ${DEMO_SCHOOL.currentTerm}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSuperAdmin && (
            <Link
              href="/intelligence"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 hover:opacity-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch School Intelligence AI</span>
            </Link>
          )}

          {isTeacher && (
            <Link
              href={`/students/attendance?class=${encodeURIComponent(teacherProfile?.primaryClass || "Grade 8")}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 hover:opacity-95 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Take Today&apos;s Roll Call ({teacherProfile?.primaryClass || "Grade 8"})</span>
            </Link>
          )}

          {isFinance && (
            <Link
              href="/finance?action=record-payment"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 hover:opacity-95 transition-all"
            >
              <CreditCard className="h-4 w-4" />
              <span>Record Payment (M-Pesa / Bank)</span>
            </Link>
          )}

          {isReceptionist && (
            <Link
              href="/students?action=admit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 hover:opacity-95 transition-all"
            >
              <Users className="h-4 w-4" />
              <span>Admit New Student Intake</span>
            </Link>
          )}

          {isParent && (
            <Link
              href="/students/std-001"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 hover:opacity-95 transition-all"
            >
              <Award className="h-4 w-4" />
              <span>Kevin&apos;s Report Card</span>
            </Link>
          )}

          {isStudent && (
            <Link
              href="/administration?tab=timetable"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 hover:opacity-95 transition-all"
            >
              <Clock className="h-4 w-4" />
              <span>View My Timetable</span>
            </Link>
          )}
        </div>
      </div>

      {/* =========================================================================
          1. SUPER ADMIN / PRINCIPAL / SCHOOL ADMIN VIEW
         ========================================================================= */}
      {isSuperAdmin && (
        <div className="space-y-8">
          {/* Flagship AI Intelligence Alert Feed */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Today&apos;s Institutional Intelligence Insights
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      3 Real-time Flags
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Automated heuristic & vector analytics synthesized for {DEMO_SCHOOL.name}
                  </p>
                </div>
              </div>
              <Link
                href="/intelligence"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Ask AI Assistant <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {DEMO_INTELLIGENCE_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                    alert.severity === "HIGH"
                      ? "bg-rose-50/80 border-rose-200 text-rose-950"
                      : alert.severity === "MEDIUM"
                      ? "bg-amber-50/80 border-amber-200 text-amber-950"
                      : "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      {alert.severity === "HIGH" ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                      ) : alert.severity === "MEDIUM" ? (
                        <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      )}
                      {alert.type.replace("_", " ")}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/70">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 leading-snug">{alert.title}</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{alert.detail}</p>
                  <div className="pt-1 text-[11px] font-medium text-slate-800 flex items-center gap-1">
                    <span className="text-emerald-700 font-bold">Action:</span> {alert.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Total Enrolled Students</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {DEMO_SCHOOL.stats.totalStudents}
              </div>
              <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>+14 new admissions this term</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Today&apos;s Attendance</span>
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {DEMO_SCHOOL.stats.todayAttendanceRate}%
              </div>
              <div className="text-[11px] text-slate-500">
                295 present • 17 absent / excused
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Term Fee Collections</span>
                <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {formatKES(DEMO_SCHOOL.stats.totalCollectedFees)}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                {DEMO_SCHOOL.stats.feeCollectionRate}% collection rate
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Outstanding Arrears</span>
                <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-rose-700">
                {formatKES(DEMO_SCHOOL.stats.totalOutstandingFees)}
              </div>
              <div className="text-[11px] text-rose-600 font-medium">
                68 student accounts pending payment
              </div>
            </div>
          </div>

          {/* Principal & Executive Faculty Oversight (Attendance, Punctuality & Syllabus Progress) */}
          {facultySummary && <FacultyMonitor summary={facultySummary} />}

          {/* Academic & Class Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Classes & Grade Distribution</h3>
                  <p className="text-xs text-slate-500">Enrolled streams across CBC & International</p>
                </div>
                <Link
                  href="/students"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View All Classes
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {DEMO_CLASSES.map((cls) => (
                  <div key={cls.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900">{cls.name}</span>
                      <span className="text-slate-400 ml-2">
                        Streams: {cls.streams.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500">Teacher: {cls.teacher}</span>
                      <span className="font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {cls.studentCount} Students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & System Health */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Executive Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/students?action=admit"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-xs font-medium text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                    <span>Admit New Student</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/finance?action=record-payment"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-xs font-medium text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span>Record M-Pesa / Bank Payment</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/communication?action=broadcast"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-xs font-medium text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span>Send School-Wide SMS Notice</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/intelligence"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-xs font-medium text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>Generate Executive AI Analytics</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  RBAC & Tenant Scoped
                </span>
                <span className="font-mono text-emerald-700">Audit Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. TEACHER DASHBOARD VIEW (Dynamic Classroom & Faculty Command)
         ========================================================================= */}
      {isTeacher && teacherProfile && (
        <TeacherDashboard teacher={teacherProfile} students={teacherStudents} />
      )}

      {/* =========================================================================
          3. FINANCE OFFICER VIEW (Bursary & Accounts Directorate)
         ========================================================================= */}
      {isFinance && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Total Billed Fees (Term 1)</span>
              <div className="text-xl font-bold text-slate-900">
                {formatKES(DEMO_SCHOOL.stats.totalBilledFees)}
              </div>
              <div className="text-[11px] text-slate-500">312 enrolled student billings</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Collected via M-Pesa / Bank</span>
              <div className="text-xl font-bold text-emerald-600">
                {formatKES(DEMO_SCHOOL.stats.totalCollectedFees)}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                {DEMO_SCHOOL.stats.feeCollectionRate}% reconciled in bank
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Pending Arrears Balance</span>
              <div className="text-xl font-bold text-rose-600">
                {formatKES(DEMO_SCHOOL.stats.totalOutstandingFees)}
              </div>
              <div className="text-[11px] text-rose-600 font-medium">
                68 student accounts pending payment
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live M-Pesa & Bank Collections Ledger</h3>
                  <p className="text-xs text-slate-500">Real-time payment reconciliations for Term 1</p>
                </div>
                <Link
                  href="/finance?action=record-payment"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Record New Payment →
                </Link>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">David Kimani (for Kevin Kimani)</span>
                    <span className="text-slate-400 ml-2 font-mono">Ref: QWE89284KL</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700">KSh 60,000</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                      M-Pesa Verified
                    </span>
                  </div>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">Mary Wambui (for Jane Wambui)</span>
                    <span className="text-slate-400 ml-2 font-mono">Ref: BANK-NCBA-0912</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700">KSh 85,000</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                      Bank Transfer
                    </span>
                  </div>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900">Peter Ochieng (for Brian Ochieng)</span>
                    <span className="text-slate-400 ml-2 font-mono">Ref: MPESA-7821</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700">KSh 70,000</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                      M-Pesa Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Finance Operations</h3>
              <div className="space-y-2 text-xs">
                <Link
                  href="/finance?action=record-payment"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 font-medium text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span>Record Direct Payment</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/finance?tab=structures"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 font-medium text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span>Fee Structures by Grade</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/finance?tab=arrears"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 font-medium text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="h-4 w-4 text-rose-600" />
                    <span>Send SMS Arrears Reminders</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/intelligence"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 font-medium text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>Financial Forecasting AI</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. PARENT VIEW (Guardian Portal for Kevin Kimani)
         ========================================================================= */}
      {isParent && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Child: Kevin Mwangi Kimani</h2>
                <p className="text-xs text-slate-500">Grade 8 East • Class Teacher: Sarah Wanjiku (+254 722 300 003)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded font-semibold">
                  Adm: SOP-2024-0082
                </span>
                <Link
                  href="/students/std-001"
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Full Report Card →
                </Link>
              </div>
            </div>

            {/* Child Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Term 1 Fee Balance</span>
                <div className="text-2xl font-bold text-rose-600">KSh 25,000</div>
                <div className="text-[11px] text-slate-500">Expected: KSh 85,000 • Paid: KSh 60,000 via M-Pesa</div>
                <div className="pt-2">
                  <Link
                    href="/finance"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors"
                  >
                    <CreditCard className="h-3 w-3" />
                    <span>Pay Balance Online (M-Pesa)</span>
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Term Attendance Record</span>
                <div className="text-2xl font-bold text-emerald-600">96.8%</div>
                <div className="text-[11px] text-slate-500">30 of 31 days present • 1 day excused</div>
                <div className="pt-2">
                  <Link
                    href="/students/std-001?tab=attendance"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>View Attendance History</span>
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Academic Performance</span>
                <div className="text-2xl font-bold text-slate-900">76.0% (Grade B+)</div>
                <div className="text-[11px] text-slate-500">Rank: 6 of 38 in Grade 8 East</div>
                <div className="pt-2">
                  <Link
                    href="/students/std-001?tab=academic"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <Award className="h-3 w-3 text-amber-500" />
                    <span>View Subject Grades</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Subject Performance Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kevin&apos;s Formative Assessment Marks (Term 1)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
                  <div className="text-slate-500 text-[11px]">Mathematics</div>
                  <div className="text-lg font-bold text-emerald-700">82%</div>
                  <div className="text-[10px] text-emerald-800 font-medium">Grade A</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
                  <div className="text-slate-500 text-[11px]">Integrated Science</div>
                  <div className="text-lg font-bold text-emerald-700">78%</div>
                  <div className="text-[10px] text-emerald-800 font-medium">Grade B+</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-slate-500 text-[11px]">English Language</div>
                  <div className="text-lg font-bold text-slate-900">74%</div>
                  <div className="text-[10px] text-slate-600 font-medium">Grade B</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-slate-500 text-[11px]">Social Studies</div>
                  <div className="text-lg font-bold text-slate-900">72%</div>
                  <div className="text-[10px] text-slate-600 font-medium">Grade B</div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
                  <div className="text-slate-500 text-[11px]">Kiswahili</div>
                  <div className="text-lg font-bold text-amber-700">68%</div>
                  <div className="text-[10px] text-amber-800 font-medium">Grade C+</div>
                </div>
              </div>
            </div>

            {/* School Bulletins for Parents */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Bell className="h-4 w-4 text-emerald-600" />
                <span>School Notices for Parents</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>• Mid-Term Parent-Teacher Consultation: Friday Oct 16 (09:00 AM)</span>
                  <span className="text-[10px] text-slate-400">Notice #12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Annual Inter-House Athletics & Sports Day: Saturday Nov 07</span>
                  <span className="text-[10px] text-slate-400">Notice #11</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. STUDENT VIEW (Learner Workspace for Kevin Kimani)
         ========================================================================= */}
      {isStudent && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">My Student Dashboard — Grade 8 East</h2>
                <p className="text-xs text-slate-500">Student: Kevin Mwangi Kimani • Homeroom Teacher: Sarah Wanjiku</p>
              </div>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded font-semibold">
                Adm: SOP-2024-0082
              </span>
            </div>

            {/* Student Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                <span className="text-xs text-emerald-800 font-medium">Next Lesson Today</span>
                <div className="text-lg font-bold text-emerald-950">Integrated Science (Lab 2)</div>
                <div className="text-xs text-emerald-700">01:30 PM - 02:15 PM • Teacher Sarah</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Recent Exam Grade</span>
                <div className="text-lg font-bold text-slate-900">82% (Grade A)</div>
                <div className="text-xs text-slate-500">Mathematics Formative CAT 1</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-medium">My Attendance Record</span>
                <div className="text-lg font-bold text-emerald-600">96.8% Present</div>
                <div className="text-xs text-slate-500">30 of 31 days completed</div>
              </div>
            </div>

            {/* Today's Timetable */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Today&apos;s Class Schedule (Grade 8 East)
                </h3>
                <Link href="/administration?tab=timetable" className="text-xs text-emerald-600 font-semibold hover:underline">
                  Full Timetable →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-400 text-[10px]">08:30 - 09:15 AM</div>
                  <div className="font-semibold text-slate-900">Mathematics</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Completed</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-400 text-[10px]">10:30 - 11:15 AM</div>
                  <div className="font-semibold text-slate-900">English Language</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Completed</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1">
                  <div className="text-emerald-700 text-[10px] font-bold">01:30 - 02:15 PM (Next)</div>
                  <div className="font-semibold text-emerald-950">Integrated Science</div>
                  <div className="text-[10px] text-emerald-700 font-medium">Science Lab 2</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-slate-400 text-[10px]">02:30 - 03:15 PM</div>
                  <div className="font-semibold text-slate-900">Physical Education</div>
                  <div className="text-[10px] text-slate-500 font-medium">Sports Ground</div>
                </div>
              </div>
            </div>

            {/* Quick Links for Learner */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs border-t border-slate-100 gap-2">
              <Link href="/students/std-001" className="font-semibold text-emerald-700 hover:underline">
                View My Complete Report Card & Teacher Remarks →
              </Link>
              <Link href="/administration?tab=documents" className="font-semibold text-slate-600 hover:underline">
                School Rules & Student Code of Conduct →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. RECEPTIONIST VIEW (Front Desk, Gate Passes, Visitors & Admissions)
         ========================================================================= */}
      {isReceptionist && <ReceptionistDashboard />}
    </div>
  );
}
