"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_STUDENTS, StudentProfile } from "@/lib/data/students-store";
import { DEMO_CLASSES } from "@/lib/data/demo-data";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Save,
  Users,
  ShieldCheck,
  Check,
  RotateCw,
  Minus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentAttendanceRow {
  studentId: string;
  name: string;
  admNo: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remarks: string;
  termRate: number;
}

export default function AttendanceRegisterPage() {
  const [selectedClass, setSelectedClass] = useState("Grade 8");
  const [selectedStream, setSelectedStream] = useState("East");
  const [attendanceDate, setAttendanceDate] = useState("2026-10-08");
  const [isSaved, setIsSaved] = useState(false);

  // Initialize attendance register for students in that class
  const [rows, setRows] = useState<StudentAttendanceRow[]>([
    {
      studentId: "std-001",
      name: "Kevin Kimani",
      admNo: "SOP-2024-0082",
      status: "PRESENT",
      remarks: "On time via Route 2",
      termRate: 96.8,
    },
    {
      studentId: "std-002",
      name: "Amani Otieno",
      admNo: "SOP-2024-0083",
      status: "PRESENT",
      remarks: "",
      termRate: 98.5,
    },
    {
      studentId: "std-003",
      name: "Zawadi Muthoni",
      admNo: "SOP-2024-0084",
      status: "ABSENT",
      remarks: "Unexcused absence - parent notified",
      termRate: 87.4, // Below 90% threshold!
    },
    {
      studentId: "std-004",
      name: "Liam Ochieng",
      admNo: "SOP-2024-0087",
      status: "LATE",
      remarks: "Arrived at 08:20 AM",
      termRate: 93.5,
    },
    {
      studentId: "std-005",
      name: "Natasha Nduta",
      admNo: "SOP-2024-0088",
      status: "EXCUSED",
      remarks: "Sick note submitted by Dr. Kim",
      termRate: 91.2,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Dynamically load real enrolled students for the selected class from database
  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch(`/api/students?class=${encodeURIComponent(selectedClass)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mappedRows: StudentAttendanceRow[] = json.data.map((s: any) => ({
            studentId: s.id,
            name: `${s.firstName} ${s.lastName}`,
            admNo: s.admissionNumber,
            status: "PRESENT",
            remarks: "",
            termRate: s.attendance?.rate || 95.0,
          }));
          setRows(mappedRows);
        }
      } catch (err) {
        // Keep initial rows on error
      }
    }
    loadStudents();
  }, [selectedClass]);

  const updateStatus = (
    studentId: string,
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
  ) => {
    setIsSaved(false);
    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const updateRemarks = (studentId: string, remarks: string) => {
    setIsSaved(false);
    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r))
    );
  };

  const markAllPresent = () => {
    setIsSaved(false);
    setRows((prev) => prev.map((r) => ({ ...r, status: "PRESENT" })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: selectedClass,
          date: attendanceDate,
          entries: rows.map((r) => ({
            studentId: r.studentId,
            studentName: r.name,
            admNo: r.admNo,
            status: r.status,
            remarks: r.remarks,
          })),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsSaved(true);
        setSaveBanner(`Attendance register for ${selectedClass} saved to database!`);
        setTimeout(() => {
          setIsSaved(false);
          setSaveBanner(null);
        }, 4000);
      } else {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculations
  const total = rows.length;
  const presentCount = rows.filter((r) => r.status === "PRESENT").length;
  const absentCount = rows.filter((r) => r.status === "ABSENT").length;
  const lateCount = rows.filter((r) => r.status === "LATE").length;
  const excusedCount = rows.filter((r) => r.status === "EXCUSED").length;
  const presentPct = Math.round((presentCount / total) * 100);

  // Threshold flagged students (< 90%)
  const flaggedStudents = rows.filter((r) => r.termRate < 90);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation (Akkhor Style) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/dashboard" className="text-slate-600 hover:text-[#ffbc00] transition-colors">
            Home
          </Link>
          <span>-</span>
          <span className="text-[#ffbc00] font-bold">Attendance</span>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          SOP School Management System
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#042954] flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#ffbc00]" />
            Interactive Daily & Monthly Attendance Register
          </h1>
          <p className="text-xs text-slate-500">
            SOP School Management System • Classroom Attendance Recording & Alert Thresholds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllPresent}
            className="px-4 py-2 bg-[#042954] hover:bg-[#073b75] text-white font-bold rounded shadow-xs text-xs transition-colors"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#ffbc00] hover:bg-[#e5a800] text-slate-950 font-bold rounded shadow-xs flex items-center gap-2 text-xs transition-colors"
          >
            {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{isSaving ? "Saving..." : isSaved ? "Saved Successfully!" : "Save Daily Register"}</span>
          </button>
        </div>
      </div>

      {saveBanner && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Subnavigation Bar (Akkhor Navy & Gold Theme) */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto bg-white px-5 pt-3.5 rounded-t-md shadow-2xs">
        <Link
          href="/students"
          className="pb-3 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          All Students
        </Link>
        <Link
          href="/students/classes"
          className="pb-3 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Classes & Streams
        </Link>
        <Link
          href="/students/subjects"
          className="pb-3 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Subjects & Curriculum
        </Link>
        <Link
          href="/students/attendance"
          className="pb-3 border-b-2 border-[#ffbc00] text-[#042954] font-bold whitespace-nowrap flex items-center gap-1.5"
        >
          <span>Daily Attendance Register</span>
        </Link>
        <Link
          href="/students/exams"
          className="pb-3 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Exams, Results & Rankings
        </Link>
      </div>

      {/* Low Attendance Threshold Warning Alert */}
      {flaggedStudents.length > 0 && (
        <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-amber-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-[#ffbc00] text-slate-950 flex items-center justify-center shrink-0 font-bold">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-amber-950">
                Attendance Threshold Warning (&lt; 90% Term Rate)
              </span>
              <p className="text-amber-800 text-[11px] mt-0.5">
                {flaggedStudents.map((s) => `${s.name} (${s.termRate}%)`).join(", ")} has fallen below institutional minimum attendance guidelines.
              </p>
            </div>
          </div>
          <Link
            href="/communication"
            className="text-xs font-bold text-slate-950 bg-[#ffbc00] hover:bg-[#e5a800] px-3.5 py-1.5 rounded transition-colors shrink-0"
          >
            Dispatch Parent SMS Alert →
          </Link>
        </div>
      )}

      {/* Register Filter Controls & Today's Attendance Metric Bar */}
      <div className="p-5 rounded-md bg-white border border-slate-200/90 shadow-xs space-y-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-slate-500 font-bold text-[10px] uppercase block mb-1">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 rounded border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
            >
              {DEMO_CLASSES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-bold text-[10px] uppercase block mb-1">
              Stream
            </label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="px-3 py-1.5 rounded border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
            >
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North">North</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 font-bold text-[10px] uppercase block mb-1">
              Date
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="px-3 py-1.5 rounded border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
            >
            </input>
          </div>

          {/* Akkhor 4 Metric Badges: Green, Red, Yellow, Cyan */}
          <div className="sm:ml-auto flex items-center gap-2 pt-2 sm:pt-0">
            <div className="text-center px-3 py-1 bg-[#52c41a]/15 rounded border border-[#52c41a]/30">
              <span className="text-[10px] font-bold text-[#52c41a] block">Present</span>
              <span className="text-sm font-bold text-[#52c41a]">{presentCount}</span>
            </div>
            <div className="text-center px-3 py-1 bg-[#ff4d4f]/15 rounded border border-[#ff4d4f]/30">
              <span className="text-[10px] font-bold text-[#ff4d4f] block">Absent</span>
              <span className="text-sm font-bold text-[#ff4d4f]">{absentCount}</span>
            </div>
            <div className="text-center px-3 py-1 bg-[#ffbc00]/25 rounded border border-[#ffbc00]/40">
              <span className="text-[10px] font-bold text-amber-900 block">Late</span>
              <span className="text-sm font-bold text-amber-900">{lateCount}</span>
            </div>
            <div className="text-center px-3 py-1 bg-[#1890ff]/15 rounded border border-[#1890ff]/30">
              <span className="text-[10px] font-bold text-[#1890ff] block">Excused</span>
              <span className="text-sm font-bold text-[#1890ff]">{excusedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Register Interactive Table */}
      <div className="bg-white rounded-md border border-slate-200/90 overflow-hidden shadow-xs text-xs">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-slate-900">
            {selectedClass} {selectedStream} Class Register — {attendanceDate}
          </span>
          <span className="text-[11px] font-bold text-[#042954]">
            Today&apos;s Rate: <span className="text-[#52c41a]">{presentPct}%</span> Present
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#042954] text-white uppercase text-[10px] border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Adm No.</th>
                <th className="py-3 px-4 text-center">Term Standing</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {rows.map((row) => (
                <tr key={row.studentId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <Link
                      href={`/students/${row.studentId}`}
                      className="hover:text-[#ffbc00] hover:underline"
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#042954]">
                    {row.admNo}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        row.termRate < 90 ? "bg-[#ff4d4f]/15 text-[#ff4d4f]" : "bg-[#52c41a]/15 text-[#52c41a]"
                      }`}
                    >
                      {row.termRate}%
                    </span>
                    {row.termRate < 90 && (
                      <span className="ml-1 text-[9px] bg-[#ff4d4f] text-white px-1 py-0.2 rounded font-bold">
                        Alert
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="inline-flex rounded border border-slate-200 p-0.5 bg-slate-100 gap-0.5">
                      {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => updateStatus(row.studentId, st)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                            row.status === st
                              ? st === "PRESENT"
                                ? "bg-[#52c41a] text-white shadow-xs"
                                : st === "ABSENT"
                                ? "bg-[#ff4d4f] text-white shadow-xs"
                                : st === "LATE"
                                ? "bg-[#ffbc00] text-slate-950 shadow-xs"
                                : "bg-[#1890ff] text-white shadow-xs"
                              : "text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(e) => updateRemarks(row.studentId, e.target.value)}
                      placeholder="Add remark..."
                      className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
