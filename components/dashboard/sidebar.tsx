"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Building2,
  Sparkles,
  Settings,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  FileText,
  Bus,
  CalendarDays,
  Clock,
  BookOpen,
  PieChart,
  BrainCircuit,
  Lock,
  UserCheck,
  CheckCircle2,
  DollarSign,
  Award,
  Bell,
  Database,
} from "lucide-react";
import { DEMO_SCHOOL } from "@/lib/data/demo-data";
import { getTeacherProfile } from "@/lib/teachers/teachers-service";

interface SidebarProps {
  userPermissions: string[];
  userRole: string;
  userEmail?: string;
  userName?: string;
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ userPermissions, userRole, userEmail, userName, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    students: true,
    finance: true,
    intelligence: true,
    administration: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const isSuperAdmin = userRole === "SUPER_ADMIN" || userRole === "SCHOOL_ADMIN" || userRole === "PRINCIPAL";
  const isTeacher = userRole === "TEACHER";
  const isFinance = userRole === "FINANCE_OFFICER";
  const isReceptionist = userRole === "RECEPTIONIST";
  const isParent = userRole === "PARENT";
  const isStudent = userRole === "STUDENT";

  const teacherProfile = isTeacher ? getTeacherProfile(userEmail || userName || "") : null;
  const teacherClassLabel = teacherProfile
    ? `${teacherProfile.primaryClass} ${teacherProfile.primaryStream}`
    : "My Class";
  const teacherClassFilter = teacherProfile ? teacherProfile.primaryClass : "Grade 8";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* School Branding Crest */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/40">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate tracking-tight">
                {DEMO_SCHOOL.name}
              </div>
              <div className="text-[11px] font-semibold text-emerald-400 truncate flex items-center gap-1">
                <span>{DEMO_SCHOOL.code}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 font-mono uppercase text-[10px] bg-slate-800 px-1.5 py-0.2 rounded">
                  {userRole.replace("_", " ")}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links By Role */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-2 scrollbar-thin">
          {/* Main Dashboard (All Roles) */}
          <Link
            href="/dashboard"
            onClick={onClose}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              pathname === "/dashboard"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>
              {isParent ? "Parent Dashboard" : isStudent ? "Student Dashboard" : isTeacher ? "Teacher Dashboard" : isFinance ? "Finance Dashboard" : isReceptionist ? "Front Desk & Reception" : "Executive Dashboard"}
            </span>
          </Link>

          {/* ========================================================
              1. SUPER ADMIN / PRINCIPAL NAVIGATION
             ======================================================== */}
          {isSuperAdmin && (
            <>
              {/* Flagship AI Intelligence */}
              <div className="pt-1">
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                  <span>AI Intelligence</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px]">
                    Flagship
                  </span>
                </div>
                <Link
                  href="/intelligence"
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isLinkActive("/intelligence")
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-emerald-300 shrink-0" />
                    <span>School Intelligence AI</span>
                  </div>
                  <BrainCircuit className="h-3.5 w-3.5 text-emerald-400 opacity-80" />
                </Link>
              </div>

              {/* Students & Academics */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleSection("students")}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>Students & Academics</span>
                  </div>
                  {expandedSections.students ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </button>

                {expandedSections.students && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    <Link href="/students" onClick={onClose} className={`block px-2.5 py-1.5 rounded-md text-xs transition-colors ${pathname === "/students" ? "text-emerald-400 font-semibold bg-slate-900" : "text-slate-400 hover:text-white"}`}>
                      All Students
                    </Link>
                    <Link href="/students/classes" onClick={onClose} className={`block px-2.5 py-1.5 rounded-md text-xs transition-colors ${pathname.startsWith("/students/classes") ? "text-emerald-400 font-semibold bg-slate-900" : "text-slate-400 hover:text-white"}`}>
                      Classes & Streams
                    </Link>
                    <Link href="/students/subjects" onClick={onClose} className={`block px-2.5 py-1.5 rounded-md text-xs transition-colors ${pathname.startsWith("/students/subjects") ? "text-emerald-400 font-semibold bg-slate-900" : "text-slate-400 hover:text-white"}`}>
                      Subjects & Curriculum
                    </Link>
                    <Link href="/students/attendance" onClick={onClose} className={`block px-2.5 py-1.5 rounded-md text-xs transition-colors ${pathname.startsWith("/students/attendance") ? "text-emerald-400 font-semibold bg-slate-900" : "text-slate-400 hover:text-white"}`}>
                      Daily Attendance Register
                    </Link>
                    <Link href="/students/exams" onClick={onClose} className={`block px-2.5 py-1.5 rounded-md text-xs transition-colors ${pathname.startsWith("/students/exams") ? "text-emerald-400 font-semibold bg-slate-900" : "text-slate-400 hover:text-white"}`}>
                      Exams, Results & Rankings
                    </Link>
                  </div>
                )}
              </div>

              {/* Finance Module */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleSection("finance")}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>Fees & Finance</span>
                  </div>
                  {expandedSections.finance ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </button>

                {expandedSections.finance && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    <Link href="/finance" onClick={onClose} className={`block px-2.5 py-1.5 rounded-md text-xs transition-colors ${pathname === "/finance" ? "text-emerald-400 font-semibold bg-slate-900" : "text-slate-400 hover:text-white"}`}>
                      Financial Overview
                    </Link>
                    <Link href="/finance?tab=structures" onClick={onClose} className="block px-2.5 py-1.5 rounded-md text-xs transition-colors text-slate-400 hover:text-white">
                      Fee Structures by Grade
                    </Link>
                    <Link href="/finance?tab=payments" onClick={onClose} className="block px-2.5 py-1.5 rounded-md text-xs transition-colors text-slate-400 hover:text-white">
                      M-Pesa & Bank Ledger
                    </Link>
                    <Link href="/finance?tab=arrears" onClick={onClose} className="block px-2.5 py-1.5 rounded-md text-xs transition-colors text-slate-400 hover:text-white">
                      Arrears & Defaulters
                    </Link>
                  </div>
                )}
              </div>

              {/* Parent Communication */}
              <Link
                href="/communication"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isLinkActive("/communication") ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-slate-400" />
                <span>Parent Communication</span>
              </Link>

              {/* Administration Module */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => toggleSection("administration")}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>Administration</span>
                  </div>
                  {expandedSections.administration ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                </button>

                {expandedSections.administration && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    <Link href="/administration?tab=staff" onClick={onClose} className="block px-2.5 py-1.5 rounded-md text-xs transition-colors text-slate-400 hover:text-white">
                      Staff Directory
                    </Link>
                    <Link href="/administration?tab=timetable" onClick={onClose} className="block px-2.5 py-1.5 rounded-md text-xs transition-colors text-slate-400 hover:text-white">
                      Master Timetable
                    </Link>
                    <Link href="/administration?tab=events" onClick={onClose} className="block px-2.5 py-1.5 rounded-md text-xs transition-colors text-slate-400 hover:text-white">
                      Events Calendar
                    </Link>
                    <Link href="/administration?tab=transport" onClick={onClose} className="block px-2.5 py-1.5 rounded-md text-xs transition-colors text-slate-400 hover:text-white">
                      Transport & Fleet
                    </Link>
                    <Link href="/administration?tab=discipline" onClick={onClose} className="block px-2.5 py-1.5 rounded-md text-xs transition-colors text-slate-400 hover:text-white">
                      Discipline Log
                    </Link>
                    <Link href="/administration?tab=documents" onClick={onClose} className="block px-2.5 py-1.5 rounded-md text-xs transition-colors text-slate-400 hover:text-white">
                      Policy Docs (RAG)
                    </Link>
                  </div>
                )}
              </div>

              {/* Settings & System */}
              <div className="pt-1 space-y-1">
                <Link
                  href="/settings/academics"
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    pathname.startsWith("/settings") && pathname !== "/settings/data-import" ? "bg-slate-800 text-white font-semibold" : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Settings className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>Settings & Academics</span>
                </Link>
                {userRole === "SUPER_ADMIN" && (
                  <Link
                    href="/settings/data-import"
                    onClick={onClose}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                      pathname === "/settings/data-import"
                        ? "bg-emerald-600 text-white font-semibold shadow-sm"
                        : "text-emerald-400/90 hover:bg-slate-900 hover:text-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>Data Migration & Import</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300 border border-emerald-800/60">
                      Super Admin
                    </span>
                  </Link>
                )}
              </div>
            </>
          )}

          {/* ========================================================
              2. TEACHER NAVIGATION (Classroom & Faculty)
             ======================================================== */}
          {isTeacher && (
            <div className="pt-2 space-y-1.5">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                <span>Classroom Tools</span>
                <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-900/50">
                  {teacherClassLabel}
                </span>
              </div>
              <Link
                href="/students/attendance"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  pathname.startsWith("/students/attendance") ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Daily Roll Call / Attendance</span>
              </Link>
              <Link
                href="/students/exams"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  pathname.startsWith("/students/exams") ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Award className="h-4 w-4 text-amber-400" />
                <span>Enter Exam Marks & Grades</span>
              </Link>
              <Link
                href={`/students?class=${encodeURIComponent(teacherClassFilter)}`}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  pathname === "/students" ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Users className="h-4 w-4 text-blue-400" />
                <span>{teacherClassLabel} Students</span>
              </Link>
              <Link
                href="/students/subjects"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  pathname.startsWith("/students/subjects") ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <BookOpen className="h-4 w-4 text-purple-400" />
                <span>CBC & IGCSE Syllabi</span>
              </Link>
              <Link
                href="/administration?tab=timetable"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Clock className="h-4 w-4 text-teal-400" />
                <span>My Teaching Timetable</span>
              </Link>
              <Link
                href="/administration?tab=discipline"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>Behavioral & Discipline Log</span>
              </Link>
              <Link
                href="/intelligence"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>AI Teacher Assistant</span>
              </Link>
            </div>
          )}

          {/* ========================================================
              3. FINANCE OFFICER NAVIGATION (Bursary)
             ======================================================== */}
          {isFinance && (
            <div className="pt-2 space-y-1.5">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Bursary & Accounts
              </div>
              <Link
                href="/finance?action=record-payment"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow-sm"
              >
                <CreditCard className="h-4 w-4" />
                <span>Record Payment (M-Pesa / Bank)</span>
              </Link>
              <Link
                href="/finance?tab=payments"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>Receipts & Transaction Ledger</span>
              </Link>
              <Link
                href="/finance?tab=structures"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <PieChart className="h-4 w-4 text-blue-400" />
                <span>Fee Structures by Grade</span>
              </Link>
              <Link
                href="/finance?tab=accounts"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Users className="h-4 w-4 text-teal-400" />
                <span>Student Fee Accounts</span>
              </Link>
              <Link
                href="/finance?tab=arrears"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <DollarSign className="h-4 w-4 text-rose-400" />
                <span>Arrears & SMS Reminders</span>
              </Link>
              <Link
                href="/intelligence"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Financial Intelligence AI</span>
              </Link>
            </div>
          )}

          {/* ========================================================
              4. PARENT NAVIGATION (Guardian Portal)
             ======================================================== */}
          {isParent && (
            <div className="pt-2 space-y-1.5">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Child: Kevin Kimani
              </div>
              <Link
                href="/students/std-001"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Award className="h-4 w-4 text-amber-400" />
                <span>Kevin&apos;s Academic Report Card</span>
              </Link>
              <Link
                href="/students/std-001"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Attendance Logs (96.8%)</span>
              </Link>
              <Link
                href="/finance"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <CreditCard className="h-4 w-4 text-rose-400" />
                <span>Fee Balance & Pay Online</span>
              </Link>
              <Link
                href="/communication"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Bell className="h-4 w-4 text-blue-400" />
                <span>School Notices & Bulletins</span>
              </Link>
              <Link
                href="/administration?tab=documents"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <BookOpen className="h-4 w-4 text-purple-400" />
                <span>School Handbook & Policies</span>
              </Link>
              <Link
                href="/intelligence"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>AI Parent Assistant</span>
              </Link>
            </div>
          )}

          {/* ========================================================
              5. STUDENT NAVIGATION (Learner Portal)
             ======================================================== */}
          {isStudent && (
            <div className="pt-2 space-y-1.5">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Grade 8 East
              </div>
              <Link
                href="/administration?tab=timetable"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Clock className="h-4 w-4 text-teal-400" />
                <span>My Class Timetable</span>
              </Link>
              <Link
                href="/students/std-001"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Award className="h-4 w-4 text-amber-400" />
                <span>My Grades & CAT Scores</span>
              </Link>
              <Link
                href="/students/std-001"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>My Attendance Record</span>
              </Link>
              <Link
                href="/administration?tab=documents"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <BookOpen className="h-4 w-4 text-purple-400" />
                <span>School Rules & Handbooks</span>
              </Link>
            </div>
          )}

          {/* ========================================================
              6. RECEPTIONIST NAVIGATION (Front Desk & Admissions)
             ======================================================== */}
          {isReceptionist && (
            <div className="pt-2 space-y-1.5">
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                <span>Front Desk Operations</span>
                <span className="text-[9px] font-mono text-indigo-300 bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-900/50">
                  Main Gate
                </span>
              </div>
              <Link
                href="/dashboard"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  pathname === "/dashboard"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Users className="h-4 w-4 text-emerald-400" />
                <span>Visitor Log & Gate Passes</span>
              </Link>
              <Link
                href="/students?action=admit"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <UserCheck className="h-4 w-4 text-emerald-400" />
                <span>Admissions & New Intake</span>
              </Link>
              <Link
                href="/students/attendance"
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  pathname.startsWith("/students/attendance")
                    ? "bg-emerald-600 text-white"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Clock className="h-4 w-4 text-amber-400" />
                <span>Gate Arrivals & Late Register</span>
              </Link>
              <Link
                href="/administration?tab=staff"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Building2 className="h-4 w-4 text-blue-400" />
                <span>Staff Extensions & Intercom</span>
              </Link>
              <Link
                href="/administration?tab=transport"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <Bus className="h-4 w-4 text-teal-400" />
                <span>Transport & Bus Fleet</span>
              </Link>
              <Link
                href="/communication?action=broadcast"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-purple-400" />
                <span>Parent SMS Broadcast</span>
              </Link>
              <Link
                href="/administration?tab=events"
                onClick={onClose}
                className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <CalendarDays className="h-4 w-4 text-rose-400" />
                <span>Campus Events & Calendar</span>
              </Link>
            </div>
          )}
        </div>

        {/* Tenant Isolation Footer Badge */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/60 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span className="truncate max-w-[140px]">{DEMO_SCHOOL.name}</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900/50">
            {DEMO_SCHOOL.code}
          </span>
        </div>
      </aside>
    </>
  );
}
