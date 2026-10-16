"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Search,
  Filter,
  Send,
  FileCheck,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Building,
  Phone,
  Mail,
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  TeacherMonitoringRecord,
  FacultySupervisionSummary,
  recordSupervisoryAction,
} from "@/lib/teachers/teachers-service";

interface FacultyMonitorProps {
  summary: FacultySupervisionSummary;
}

export function FacultyMonitor({ summary }: FacultyMonitorProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "ATTENDANCE" | "PROGRESS" | "ATTENTION">("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [curriculumFilter, setCurriculumFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherMonitoringRecord | null>(null);

  // Supervisory Notice State
  const [noticeTargetTeacher, setNoticeTargetTeacher] = useState<TeacherMonitoringRecord | null>(null);
  const [noticeType, setNoticeType] = useState<"COMMENDATION" | "REMINDER" | "LESSON_PLAN_QUERY" | "MEETING_REQUEST">("COMMENDATION");
  const [noticeMessage, setNoticeMessage] = useState<string>("");
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Filter records
  const filteredRecords = summary.records.filter((t) => {
    // Tab filter
    if (activeTab === "ATTENTION") {
      const needsAttention =
        t.attendance.statusToday === "PRESENT_LATE" ||
        t.progress.syllabusStatus === "BEHIND" ||
        t.progress.schemesOfWorkStatus !== "APPROVED" ||
        t.progress.gradebookMarksEnteredPct < 85;
      if (!needsAttention) return false;
    }

    // Department filter
    if (departmentFilter !== "ALL" && t.department !== departmentFilter) {
      return false;
    }

    // Curriculum filter
    if (curriculumFilter !== "ALL" && !t.curriculum.includes(curriculumFilter)) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchRole = t.primaryRole.toLowerCase().includes(q);
      const matchSubject = t.subjects.some((s) => s.toLowerCase().includes(q));
      const matchClass = t.classesTaught.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchRole && !matchSubject && !matchClass) {
        return false;
      }
    }

    return true;
  });

  const handleOpenNoticeModal = (
    teacher: TeacherMonitoringRecord,
    defaultType: "COMMENDATION" | "REMINDER" | "LESSON_PLAN_QUERY" | "MEETING_REQUEST" = "COMMENDATION"
  ) => {
    setNoticeTargetTeacher(teacher);
    setNoticeType(defaultType);
    if (defaultType === "COMMENDATION") {
      setNoticeMessage(`Dear ${teacher.name}, outstanding work on keeping ${teacher.classesTaught[0]} syllabus delivery at ${teacher.progress.syllabusCoveragePct}% (+${teacher.progress.syllabusCoveragePct - summary.syllabusTarget}% ahead of term target). Commended by the Principal.`);
    } else if (defaultType === "REMINDER") {
      setNoticeMessage(`Dear ${teacher.name}, friendly reminder regarding punctuality and roll-call completion. Please check in with the Deputy Principal's office.`);
    } else if (defaultType === "LESSON_PLAN_QUERY") {
      setNoticeMessage(`Dear ${teacher.name}, please update and submit your schemes of work / lesson pacing plans for ${teacher.subjects[0]} for review.`);
    } else {
      setNoticeMessage(`Dear ${teacher.name}, the Principal requests a brief 10-minute briefing in the Executive Office today at 3:45 PM.`);
    }
  };

  const handleSendSupervisoryNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTargetTeacher) return;

    recordSupervisoryAction(noticeTargetTeacher.id, noticeType, noticeMessage);
    setActionSuccessNotice(`Official notice successfully dispatched to ${noticeTargetTeacher.name} via Staff Portal and SMS!`);
    setNoticeTargetTeacher(null);
    setNoticeMessage("");

    setTimeout(() => {
      setActionSuccessNotice(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {actionSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-900 text-white border border-emerald-700 shadow-md flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3 text-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{actionSuccessNotice}</span>
          </div>
          <button
            onClick={() => setActionSuccessNotice(null)}
            className="text-emerald-300 hover:text-white text-xs px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner & Executive Overview */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border border-slate-700/80 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Principal Executive Command
              </span>
              <span className="text-xs text-slate-400">• Term 1 Week 7 Oversight</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Faculty Attendance & Academic Delivery Monitor
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Real-time supervision of faculty clock-ins, daily roll calls, syllabus completion pacing against curriculum benchmarks, and gradebook compliance across CBC and Cambridge divisions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setActiveTab("ATTENTION");
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{summary.attentionRequiredCount} Flagged For Attention</span>
            </button>
            <Link
              href="/administration?tab=timetable"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Master Timetable</span>
            </Link>
          </div>
        </div>

        {/* 5 Macro Executive KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-6 border-t border-slate-700/60 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Present Today</span>
              <Users className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {summary.presentToday} / {summary.totalFaculty}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">
              {Math.round((summary.presentToday / summary.totalFaculty) * 100)}% on campus & duty
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Punctuality Rate</span>
              <Clock className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {summary.overallOnTimeRate}%
            </div>
            <div className="text-[10px] text-slate-400">
              {summary.onTimeCount} on time • {summary.lateCount} late arrival
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Avg Syllabus Pacing</span>
              <BookOpen className="h-3.5 w-3.5 text-teal-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400">
              {summary.avgSyllabusCoverage}%
            </div>
            <div className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+{(summary.avgSyllabusCoverage - summary.syllabusTarget).toFixed(1)}% vs Wk 7 Target ({summary.syllabusTarget}%)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Gradebook Entry</span>
              <FileCheck className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {summary.avgGradebookCompliance}%
            </div>
            <div className="text-[10px] text-slate-400">
              CAT 1 & Formative marks logged
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1 col-span-2 md:col-span-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Supervisory Alerts</span>
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-400">
              {summary.attentionRequiredCount}
            </div>
            <div className="text-[10px] text-amber-300/80">
              1 late • 1 behind • 1 schemes review
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Tab Navigation Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tab Selection */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "ALL"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Faculty Summary ({summary.records.length})
            </button>
            <button
              onClick={() => setActiveTab("ATTENDANCE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "ATTENDANCE"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Live Clock-In & Attendance Ledger
            </button>
            <button
              onClick={() => setActiveTab("PROGRESS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "PROGRESS"
                  ? "bg-white text-blue-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Syllabus Coverage & Academic Progress
            </button>
            <button
              onClick={() => setActiveTab("ATTENTION")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "ATTENTION"
                  ? "bg-amber-100 text-amber-900 shadow-xs border border-amber-300"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              <span>Needs Attention ({summary.attentionRequiredCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search teacher, subject, class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Department and Curriculum Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter by:</span>
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:outline-hidden focus:border-emerald-500"
          >
            <option value="ALL">All Departments</option>
            <option value="STEM & Mathematics">STEM & Mathematics</option>
            <option value="Languages & Literature">Languages & Literature</option>
            <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
            <option value="Cambridge Senior Sciences">Cambridge Senior Sciences</option>
          </select>

          <select
            value={curriculumFilter}
            onChange={(e) => setCurriculumFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:outline-hidden focus:border-emerald-500"
          >
            <option value="ALL">All Curriculums</option>
            <option value="CBC">CBC (Competency Based)</option>
            <option value="Cambridge">Cambridge International</option>
          </select>

          {(departmentFilter !== "ALL" || curriculumFilter !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setDepartmentFilter("ALL");
                setCurriculumFilter("ALL");
                setSearchQuery("");
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium ml-auto flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Faculty Roster Grid / Table */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-2">
            <Users className="h-8 w-8 text-slate-300 mx-auto" />
            <div className="text-sm font-semibold text-slate-800">No faculty members found</div>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or clear the filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredRecords.map((teacher) => {
              const isAhead = teacher.progress.syllabusStatus === "AHEAD";
              const isBehind = teacher.progress.syllabusStatus === "BEHIND";
              const isLate = teacher.attendance.statusToday === "PRESENT_LATE";
              const isExcused = teacher.attendance.statusToday === "EXCUSED_LEAVE";
              const isOffsite = teacher.attendance.statusToday === "ON_DUTY_FIELD";
              const isPendingSchemes = teacher.progress.schemesOfWorkStatus === "PENDING_APPROVAL";

              return (
                <div
                  key={teacher.id}
                  className={`p-4 rounded-2xl bg-white border transition-all hover:shadow-xs ${
                    isLate || isBehind || isPendingSchemes
                      ? "border-amber-300/80 bg-amber-50/20"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Teacher Basic Profile */}
                    <div className="flex items-start gap-3 min-w-[280px]">
                      <div className="relative">
                        <img
                          src={teacher.avatarUrl}
                          alt={teacher.name}
                          className="h-11 w-11 rounded-full object-cover border-2 border-slate-200"
                        />
                        <span
                          className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                            teacher.attendance.statusToday === "PRESENT_ON_TIME"
                              ? "bg-emerald-500"
                              : isLate
                              ? "bg-amber-500"
                              : isOffsite
                              ? "bg-blue-500"
                              : "bg-slate-400"
                          }`}
                          title={teacher.attendance.statusToday}
                        />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{teacher.name}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {teacher.curriculum}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{teacher.primaryRole}</p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            {teacher.subjects.join(", ")}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-600">
                            {teacher.classesTaught.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic View Content based on Tab */}
                    {activeTab === "ATTENDANCE" ? (
                      /* ATTENDANCE SPECIFIC COLUMNS */
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 flex-1 px-2 border-y lg:border-y-0 lg:border-x border-slate-100 py-3 lg:py-0">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Today&apos;s Arrival
                          </span>
                          <div className="flex items-center gap-1.5">
                            {teacher.attendance.statusToday === "PRESENT_ON_TIME" && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {teacher.attendance.clockInTime} (On Time)
                              </span>
                            )}
                            {isLate && (
                              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                                {teacher.attendance.clockInTime} (Late)
                              </span>
                            )}
                            {isOffsite && (
                              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                Offsite Duty
                              </span>
                            )}
                            {isExcused && (
                              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                Excused Medical
                              </span>
                            )}
                          </div>
                          {teacher.attendance.arrivalNote && (
                            <p className="text-[10px] text-amber-700 line-clamp-1 italic">
                              {teacher.attendance.arrivalNote}
                            </p>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Weekly Rate
                          </span>
                          <div className="text-xs font-bold text-slate-900">
                            {teacher.attendance.weeklyAttendanceRate}%
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {teacher.attendance.consecutiveDaysPresent} day streak
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Term Punctuality
                          </span>
                          <div className="text-xs font-bold text-slate-900">
                            {teacher.attendance.termPunctualityRate}%
                          </div>
                          <span className="text-[10px] text-emerald-600 font-medium">On-time index</span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Today&apos;s Periods
                          </span>
                          <div className="text-xs font-bold text-slate-900">
                            {teacher.attendance.periodsToday.completed} of {teacher.attendance.periodsToday.scheduled} taught
                          </div>
                          <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{
                                width: `${
                                  teacher.attendance.periodsToday.scheduled > 0
                                    ? (teacher.attendance.periodsToday.completed /
                                        teacher.attendance.periodsToday.scheduled) *
                                      100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : activeTab === "PROGRESS" ? (
                      /* PROGRESS SPECIFIC COLUMNS */
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 flex-1 px-2 border-y lg:border-y-0 lg:border-x border-slate-100 py-3 lg:py-0">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium uppercase tracking-wider">
                              Syllabus Coverage
                            </span>
                            <span
                              className={`font-bold ${
                                isAhead ? "text-emerald-600" : isBehind ? "text-rose-600" : "text-blue-600"
                              }`}
                            >
                              {teacher.progress.syllabusCoveragePct}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isAhead ? "bg-emerald-500" : isBehind ? "bg-rose-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${teacher.progress.syllabusCoveragePct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Target: {summary.syllabusTarget}% ({isAhead ? `+${teacher.progress.syllabusCoveragePct - summary.syllabusTarget}%` : isBehind ? `${teacher.progress.syllabusCoveragePct - summary.syllabusTarget}%` : "On Target"})
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Schemes of Work
                          </span>
                          <div>
                            {teacher.progress.schemesOfWorkStatus === "APPROVED" ? (
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Week 7 Approved
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                                Pending Approval
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">Deputy Principal Signed</span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Gradebook Entry
                          </span>
                          <div className="text-xs font-bold text-slate-900">
                            {teacher.progress.gradebookMarksEnteredPct}% Marks
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Class Mean: <strong className="text-slate-700">{teacher.progress.classAcademicMean}%</strong>
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Interventions
                          </span>
                          <div className="text-xs font-bold text-slate-900">
                            {teacher.progress.activeAlertsCount} At-Risk
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {teacher.progress.parentCommunicationCount} parents engaged
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* COMBINED SUMMARY COLUMNS (Default ALL / ATTENTION) */
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-6 flex-1 px-2 border-y lg:border-y-0 lg:border-x border-slate-100 py-3 lg:py-0">
                        {/* Status Today */}
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Attendance Today
                          </span>
                          <div>
                            {teacher.attendance.statusToday === "PRESENT_ON_TIME" && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                {teacher.attendance.clockInTime}
                              </span>
                            )}
                            {isLate && (
                              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 inline-flex items-center gap-1">
                                <Clock className="h-3 w-3 text-amber-600" />
                                Late ({teacher.attendance.clockInTime})
                              </span>
                            )}
                            {isOffsite && (
                              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                Field Duty
                              </span>
                            )}
                            {isExcused && (
                              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                Excused Leave
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {teacher.attendance.periodsToday.completed}/{teacher.attendance.periodsToday.scheduled} periods taught
                          </span>
                        </div>

                        {/* Syllabus Coverage */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium uppercase tracking-wider">
                              Syllabus
                            </span>
                            <span
                              className={`font-bold ${
                                isAhead ? "text-emerald-600" : isBehind ? "text-rose-600" : "text-blue-600"
                              }`}
                            >
                              {teacher.progress.syllabusCoveragePct}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isAhead ? "bg-emerald-500" : isBehind ? "bg-rose-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${teacher.progress.syllabusCoveragePct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {isAhead ? "Ahead of Schedule" : isBehind ? "Behind target" : "On Track"}
                          </span>
                        </div>

                        {/* Gradebook Marks */}
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Gradebook
                          </span>
                          <div className="text-xs font-bold text-slate-900">
                            {teacher.progress.gradebookMarksEnteredPct}% Logged
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Mean: {teacher.progress.classAcademicMean}%
                          </span>
                        </div>

                        {/* Recent Activity */}
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Live Activity
                          </span>
                          <p className="text-[11px] text-slate-700 line-clamp-2 leading-tight">
                            {teacher.recentActivity}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Supervisory Action Buttons */}
                    <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                      <button
                        onClick={() => setSelectedTeacher(teacher)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1"
                        title="View teacher academic dossier, timetable, and alerts"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => handleOpenNoticeModal(
                          teacher,
                          isAhead ? "COMMENDATION" : isLate ? "REMINDER" : isBehind ? "LESSON_PLAN_QUERY" : "COMMENDATION"
                        )}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 ${
                          isAhead
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : isLate || isBehind
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "bg-slate-800 hover:bg-slate-900 text-white"
                        }`}
                      >
                        <Send className="h-3 w-3" />
                        <span>{isAhead ? "Commend" : isLate ? "Notice" : isBehind ? "Pacing Query" : "Action"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL 1: TEACHER DETAILED DOSSIER & SUPERVISORY PROFILE
         ========================================================================= */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeacher.avatarUrl}
                  alt={selectedTeacher.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-emerald-400/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedTeacher.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {selectedTeacher.department}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{selectedTeacher.qualification}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Contact and Overview Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="h-4 w-4 text-emerald-600" />
                  <span className="font-mono">{selectedTeacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <span>{selectedTeacher.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Layers className="h-4 w-4 text-emerald-600" />
                  <span>Role: <strong>{selectedTeacher.primaryRole}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  <span>Curriculum: <strong>{selectedTeacher.curriculum}</strong></span>
                </div>
              </div>

              {/* Attendance Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  Attendance & Daily Clock-in Record
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase">Today&apos;s Arrival</span>
                    <div className="text-sm font-bold text-slate-900">{selectedTeacher.attendance.clockInTime}</div>
                    <span className="text-[10px] text-emerald-600 font-medium">{selectedTeacher.attendance.statusToday.replace("_", " ")}</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase">Weekly Attendance</span>
                    <div className="text-sm font-bold text-slate-900">{selectedTeacher.attendance.weeklyAttendanceRate}%</div>
                    <span className="text-[10px] text-slate-500">Term avg</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase">Term Punctuality</span>
                    <div className="text-sm font-bold text-slate-900">{selectedTeacher.attendance.termPunctualityRate}%</div>
                    <span className="text-[10px] text-slate-500">On-time arrivals</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase">Daily Periods</span>
                    <div className="text-sm font-bold text-slate-900">
                      {selectedTeacher.attendance.periodsToday.completed} / {selectedTeacher.attendance.periodsToday.scheduled}
                    </div>
                    <span className="text-[10px] text-slate-500">Taught today</span>
                  </div>
                </div>
                {selectedTeacher.attendance.arrivalNote && (
                  <p className="text-xs p-2.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                    <strong>Arrival Note:</strong> {selectedTeacher.attendance.arrivalNote}
                  </p>
                )}
              </div>

              {/* Academic Progress & Syllabus Delivery */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  Syllabus Pacing & Formative Gradebook
                </h4>
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        Term 1 Syllabus Completion: {selectedTeacher.progress.syllabusCoveragePct}%
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Curriculum benchmark for Week 7: {summary.syllabusTarget}%
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        selectedTeacher.progress.syllabusStatus === "AHEAD"
                          ? "bg-emerald-100 text-emerald-800"
                          : selectedTeacher.progress.syllabusStatus === "BEHIND"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {selectedTeacher.progress.syllabusStatus === "AHEAD"
                        ? "Ahead of Pace (+6%)"
                        : selectedTeacher.progress.syllabusStatus === "BEHIND"
                        ? "Attention Needed (-6%)"
                        : "On Pace"}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        selectedTeacher.progress.syllabusStatus === "AHEAD"
                          ? "bg-emerald-500"
                          : selectedTeacher.progress.syllabusStatus === "BEHIND"
                          ? "bg-rose-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${selectedTeacher.progress.syllabusCoveragePct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Gradebook Marks Logged</span>
                      <div className="font-bold text-slate-900">{selectedTeacher.progress.gradebookMarksEnteredPct}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Class Mean Score</span>
                      <div className="font-bold text-slate-900">{selectedTeacher.progress.classAcademicMean}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Schemes of Work</span>
                      <div className="font-bold text-emerald-700">{selectedTeacher.progress.schemesOfWorkStatus}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Classes and Subjects */}
              <div className="space-y-1.5">
                <span className="text-slate-500 font-medium">Assigned Classes:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTeacher.classesTaught.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                Close Dossier
              </button>
              <button
                onClick={() => {
                  const t = selectedTeacher;
                  setSelectedTeacher(null);
                  handleOpenNoticeModal(t);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Dispatch Supervisory Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: SEND SUPERVISORY NOTICE / COMMENDATION
         ========================================================================= */}
      {noticeTargetTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleSendSupervisoryNotice}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-0"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Send className="h-4 w-4 text-emerald-400" />
                  Dispatch Supervisory Notice
                </h3>
                <p className="text-xs text-slate-300">
                  Recipient: <strong>{noticeTargetTeacher.name}</strong> ({noticeTargetTeacher.primaryRole})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNoticeTargetTeacher(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Notice Category / Directive
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNoticeType("COMMENDATION");
                      setNoticeMessage(`Dear ${noticeTargetTeacher.name}, outstanding work on keeping syllabus delivery at ${noticeTargetTeacher.progress.syllabusCoveragePct}% (+${noticeTargetTeacher.progress.syllabusCoveragePct - summary.syllabusTarget}% ahead of target). Commended by the Principal.`);
                    }}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      noticeType === "COMMENDATION"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    🏆 Executive Commendation
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNoticeType("REMINDER");
                      setNoticeMessage(`Dear ${noticeTargetTeacher.name}, please be reminded of campus arrival policy (07:30 AM). Please submit explanation for late arrival.`);
                    }}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      noticeType === "REMINDER"
                        ? "border-amber-500 bg-amber-50 text-amber-900"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    ⏱️ Punctuality Reminder
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNoticeType("LESSON_PLAN_QUERY");
                      setNoticeMessage(`Dear ${noticeTargetTeacher.name}, please update your scheme of work and lesson pacing for ${noticeTargetTeacher.subjects[0]} before Friday 4 PM.`);
                    }}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      noticeType === "LESSON_PLAN_QUERY"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    📑 Lesson Plan / Pacing Query
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNoticeType("MEETING_REQUEST");
                      setNoticeMessage(`Dear ${noticeTargetTeacher.name}, the Principal requests a brief 10-minute briefing in the Executive Office today at 3:45 PM.`);
                    }}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      noticeType === "MEETING_REQUEST"
                        ? "border-purple-500 bg-purple-50 text-purple-900"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    ☕ Principal Executive Briefing
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Message Content (Dispatched via Portal & SMS)
                </label>
                <textarea
                  rows={4}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Dispatch Channels:</div>
                <div>• Staff Portal Notification Feed</div>
                <div>• Africa&apos;s Talking SMS to {noticeTargetTeacher.phone}</div>
                <div>• Audited in Administrative Ledger under Principal User ID</div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setNoticeTargetTeacher(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Confirm & Send Notice</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
