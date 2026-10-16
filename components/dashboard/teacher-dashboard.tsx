"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
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
} from "lucide-react";
import { TeacherProfile } from "@/lib/teachers/teachers-service";
import { StudentProfile } from "@/lib/data/students-store";

interface TeacherDashboardProps {
  teacher: TeacherProfile;
  students: StudentProfile[];
}

export function TeacherDashboard({ teacher, students }: TeacherDashboardProps) {
  // Default to primary class/stream
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const activeClass = teacher.assignedClasses[selectedClassIndex] || teacher.assignedClasses[0];

  // Local attendance state to allow quick inline roll call marking
  const [attendanceStates, setAttendanceStates] = useState<Record<string, "PRESENT" | "LATE" | "ABSENT" | "EXCUSED">>({
    "std-001": "PRESENT",
    "std-002": "PRESENT",
    "std-003": "EXCUSED",
    "std-004": "PRESENT",
    "std-006": "PRESENT",
    "std-007": "PRESENT",
    "std-008": "PRESENT",
    "std-009": "PRESENT",
    "std-010": "PRESENT",
  });

  // Filter students for active class and stream
  const classStudents = students.filter((s) => {
    const matchClass = s.className.toLowerCase() === activeClass.className.toLowerCase();
    if (!matchClass) return false;
    // If streams are specified, match stream
    if (activeClass.streams.length > 0) {
      return activeClass.streams.some(
        (str) => str.toLowerCase() === s.streamName.toLowerCase()
      );
    }
    return true;
  });

  const toggleAttendance = (studentId: string, status: "PRESENT" | "LATE" | "ABSENT" | "EXCUSED") => {
    setAttendanceStates((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Calculate live stats for the selected class
  const totalEnrolled = classStudents.length > 0 ? classStudents.length : activeClass.studentCount;
  const presentCount = classStudents.filter(
    (s) => (attendanceStates[s.id] || "PRESENT") === "PRESENT"
  ).length;
  const liveAttendanceRate =
    classStudents.length > 0
      ? Math.round((presentCount / classStudents.length) * 1000) / 10
      : activeClass.attendanceRate;

  const averageScore =
    classStudents.length > 0
      ? Math.round(
          classStudents.reduce((acc, s) => acc + (s.academic.currentTermAverage || 70), 0) /
            classStudents.length
        )
      : activeClass.academicAverage;

  return (
    <div className="space-y-6">
      {/* Teacher Class Switcher Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Assigned Teaching Portfolio</div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{teacher.name}</span>
              <span className="text-xs font-normal text-slate-400">•</span>
              <span className="text-xs text-emerald-700 font-medium">{teacher.specialization}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Class & Stream Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Switch Class:</span>
          {teacher.assignedClasses.map((cls, idx) => (
            <button
              key={cls.classId}
              type="button"
              onClick={() => setSelectedClassIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedClassIndex === idx
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
              }`}
            >
              <span>{cls.className} ({cls.streams.join(", ")})</span>
              <span className="ml-1.5 text-[10px] opacity-80 font-normal">
                {cls.role === "CLASS_TEACHER" ? "Homeroom" : "Subject"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Class Header Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Selected Class & Streams</span>
          <div className="text-xl font-bold text-slate-900">
            {activeClass.className} ({activeClass.streams.join(", ")})
          </div>
          <div className="text-[11px] text-slate-500">
            {totalEnrolled} students enrolled • {activeClass.role === "CLASS_TEACHER" ? "Class Teacher" : "Subject Faculty"}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Today&apos;s Roll Call Presence</span>
          <div className="text-xl font-bold text-emerald-600">
            {presentCount} / {totalEnrolled} ({liveAttendanceRate}%)
          </div>
          <div className="text-[11px] text-slate-500">
            {totalEnrolled - presentCount} absent / excused
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Subject Academic Average</span>
          <div className="text-xl font-bold text-slate-900">{averageScore}% Class Average</div>
          <div className="text-[11px] text-slate-500">
            {teacher.subjectsTaught.join(", ")}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium">Students Needing Attention</span>
          <div className="text-xl font-bold text-amber-600">
            {teacher.alerts.length} Flagged
          </div>
          <div className="text-[11px] text-slate-500">
            Academic decline or attendance alerts
          </div>
        </div>
      </div>

      {/* Class Specific Alerts (If any) */}
      {teacher.alerts.length > 0 && (
        <div className="p-4 rounded-2xl border border-amber-200/90 bg-amber-50/50 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Classroom Intelligence Alerts for {teacher.name}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teacher.alerts.map((alt) => (
              <div
                key={alt.id}
                className="p-3 rounded-xl bg-white border border-amber-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900">
                    {alt.studentName} ({alt.admNo}) • {alt.className} {alt.streamName}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      alt.severity === "HIGH"
                        ? "bg-rose-100 text-rose-800"
                        : alt.severity === "MEDIUM"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {alt.severity}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{alt.issue}</p>
                <div className="text-[11px] text-slate-800 font-medium pt-0.5">
                  <span className="text-emerald-700 font-bold">Suggested Action:</span> {alt.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Section: Class Register & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Register for Selected Class */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activeClass.className} ({activeClass.streams.join(", ")}) — Daily Roll Call Register
              </h3>
              <p className="text-xs text-slate-500">
                Click status pill to mark attendance, or click student name for full profile
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/students/attendance?class=${encodeURIComponent(activeClass.className)}`}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                Full Attendance Sheet →
              </Link>
              <Link
                href={`/students/exams?class=${encodeURIComponent(activeClass.className)}`}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Enter Marks →
              </Link>
            </div>
          </div>

          {classStudents.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No students found registered in {activeClass.className} ({activeClass.streams.join(", ")}).
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {classStudents.map((std) => {
                const currentStatus = attendanceStates[std.id] || "PRESENT";
                return (
                  <div key={std.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={std.photoUrl}
                        alt={std.firstName}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <Link
                          href={`/students/${std.id}`}
                          className="font-bold text-slate-900 hover:text-emerald-700 hover:underline"
                        >
                          {std.firstName} {std.lastName}
                        </Link>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                          <span>{std.admissionNumber}</span>
                          <span>•</span>
                          <span className="text-slate-600 font-sans font-medium">
                            {std.className} {std.streamName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">
                          {std.academic.currentTermAverage}%
                        </div>
                        <div className="text-[10px] text-slate-400">Term Average</div>
                      </div>

                      {/* Interactive Attendance Pill */}
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() => toggleAttendance(std.id, "PRESENT")}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            currentStatus === "PRESENT"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAttendance(std.id, "LATE")}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            currentStatus === "LATE"
                              ? "bg-amber-500 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAttendance(std.id, "ABSENT")}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            currentStatus === "ABSENT"
                              ? "bg-rose-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAttendance(std.id, "EXCUSED")}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            currentStatus === "EXCUSED"
                              ? "bg-blue-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Teacher's Schedule Today & Quick Shortcuts */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {teacher.name}&apos;s Daily Timetable
              </h3>
              <Link
                href="/administration?tab=timetable"
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Full Week →
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              {teacher.todaySchedule.map((item) => (
                <div
                  key={item.period}
                  className={`p-3 rounded-xl border space-y-1 transition-all ${
                    item.status === "CURRENT"
                      ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30"
                      : item.status === "COMPLETED"
                      ? "bg-slate-50/60 border-slate-200 text-slate-600"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>{item.subject}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        item.status === "CURRENT"
                          ? "bg-emerald-600 text-white font-bold"
                          : item.status === "COMPLETED"
                          ? "bg-slate-200 text-slate-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {item.time}
                    </span>
                    <span className="font-medium text-slate-700">
                      {item.className} {item.streamName} • {item.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Classroom Faculty Actions */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Faculty Quick Actions</h3>
            <div className="space-y-2 text-xs">
              <Link
                href={`/students/exams?class=${encodeURIComponent(activeClass.className)}`}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 font-medium text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Enter Term 1 CAT & Exam Marks</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>

              <Link
                href="/administration?tab=discipline"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 font-medium text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                  <span>Log Behavior or Incident Note</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>

              <Link
                href="/students/subjects"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 font-medium text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span>Curriculum & Lesson Schemes</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>

              <Link
                href="/intelligence"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 font-medium text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Ask AI Teacher Assistant</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
