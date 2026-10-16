"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CreditCard,
  Building2,
  Sparkles,
  Settings,
  ChevronDown,
  ChevronRight,
  FileText,
  Bus,
  Clock,
  BookOpen,
  CheckCircle2,
  Award,
  Bell,
  Mail,
  Home,
  Menu,
  Shield,
  Layers,
} from "lucide-react";

interface SidebarProps {
  userPermissions: string[];
  userRole: string;
  userEmail?: string;
  userName?: string;
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ userRole, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams?.get("view");

  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [teachersOpen, setTeachersOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" && !currentView;
    }
    return pathname.startsWith(href);
  };

  const isParentActive =
    (pathname === "/dashboard" && currentView === "parents") ||
    (pathname === "/dashboard" && userRole === "PARENT" && !currentView);

  const isAdminActive =
    (pathname === "/dashboard" && currentView === "admin") ||
    (pathname === "/dashboard" && userRole !== "PARENT" && userRole !== "STUDENT" && !currentView);

  const isStudentActive =
    (pathname === "/dashboard" && currentView === "student") ||
    (pathname === "/dashboard" && userRole === "STUDENT" && !currentView);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#042954] text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top-Left Brand Logo Block (Akkhor Style Yellow Banner) */}
        <div className="h-16 bg-[#ffbc00] text-slate-900 px-6 flex items-center justify-between shadow-xs shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-extrabold text-2xl tracking-tight text-slate-950 flex items-center">
              SOP<span className="text-xs ml-1 font-bold text-slate-800 tracking-normal align-top">TM</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-black/10 transition-colors text-slate-950 font-bold"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
          {/* 1. Dashboard Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setDashboardOpen(!dashboardOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold text-slate-200 hover:text-[#ffbc00] hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 text-[#ffbc00] shrink-0" />
                <span>Dashboard</span>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                  dashboardOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>

            {dashboardOpen && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-xs">
                <Link
                  href="/dashboard?view=admin"
                  onClick={onClose}
                  className={`block px-2.5 py-1.5 rounded transition-colors ${
                    isAdminActive
                      ? "text-[#ffbc00] font-bold bg-white/10"
                      : "text-slate-300 hover:text-[#ffbc00]"
                  }`}
                >
                  › Admin
                </Link>
                <Link
                  href="/dashboard?view=student"
                  onClick={onClose}
                  className={`block px-2.5 py-1.5 rounded transition-colors ${
                    isStudentActive
                      ? "text-[#ffbc00] font-bold bg-white/10"
                      : "text-slate-300 hover:text-[#ffbc00]"
                  }`}
                >
                  › Student
                </Link>
                <Link
                  href="/dashboard?view=parents"
                  onClick={onClose}
                  className={`block px-2.5 py-1.5 rounded transition-colors ${
                    isParentActive
                      ? "text-[#ffbc00] font-bold bg-white/10"
                      : "text-slate-300 hover:text-[#ffbc00]"
                  }`}
                >
                  › Parents
                </Link>
              </div>
            )}
          </div>

          {/* 2. Teachers */}
          <Link
            href="/administration?tab=staff"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold text-slate-200 hover:text-[#ffbc00] hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Teachers</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 3. Library */}
          <Link
            href="/administration?tab=documents"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold text-slate-200 hover:text-[#ffbc00] hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Library</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 4. Account (Finance / Expenses) */}
          <Link
            href="/finance"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
              isLinkActive("/finance")
                ? "text-[#ffbc00] bg-white/10"
                : "text-slate-200 hover:text-[#ffbc00] hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Account</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 5. Class */}
          <Link
            href="/students/classes"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
              isLinkActive("/students/classes")
                ? "text-[#ffbc00] bg-white/10"
                : "text-slate-200 hover:text-[#ffbc00] hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Class</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 6. Subject */}
          <Link
            href="/students/subjects"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
              isLinkActive("/students/subjects")
                ? "text-[#ffbc00] bg-white/10"
                : "text-slate-200 hover:text-[#ffbc00] hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Subject</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 7. Class Routine (Timetable) */}
          <Link
            href="/administration?tab=timetable"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold text-slate-200 hover:text-[#ffbc00] hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Clas Routine</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 8. Attendance */}
          <Link
            href="/students/attendance"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
              isLinkActive("/students/attendance")
                ? "text-[#ffbc00] bg-white/10"
                : "text-slate-200 hover:text-[#ffbc00] hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Attendance</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 9. Exam */}
          <Link
            href="/students/exams"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
              isLinkActive("/students/exams")
                ? "text-[#ffbc00] bg-white/10"
                : "text-slate-200 hover:text-[#ffbc00] hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Exam</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 10. Transport */}
          <Link
            href="/administration?tab=transport"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold text-slate-200 hover:text-[#ffbc00] hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bus className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Transport</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 11. Hostel */}
          <Link
            href="/administration?tab=discipline"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold text-slate-200 hover:text-[#ffbc00] hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Hostel</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 12. Notice */}
          <Link
            href="/communication"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
              isLinkActive("/communication")
                ? "text-[#ffbc00] bg-white/10"
                : "text-slate-200 hover:text-[#ffbc00] hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Notice</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 13. Message */}
          <Link
            href="/communication?tab=messages"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold text-slate-200 hover:text-[#ffbc00] hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Message</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 14. Account / Settings */}
          <Link
            href="/settings"
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold transition-colors ${
              isLinkActive("/settings")
                ? "text-[#ffbc00] bg-white/10"
                : "text-slate-200 hover:text-[#ffbc00] hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-[#ffbc00] shrink-0" />
              <span>Account</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          {/* 15. Flagship AI School Intelligence */}
          <div className="pt-3 pb-2">
            <Link
              href="/intelligence"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-bold transition-all ${
                isLinkActive("/intelligence")
                  ? "bg-[#ffbc00] text-slate-950 shadow-md"
                  : "bg-white/5 text-amber-300 border border-amber-400/30 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#ffbc00] shrink-0" />
                <span>SOP AI Intelligence</span>
              </div>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono">
                AI
              </span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
