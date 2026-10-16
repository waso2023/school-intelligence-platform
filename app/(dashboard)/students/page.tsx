"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatKES } from "@/lib/utils";
import { INITIAL_STUDENTS, StudentProfile } from "@/lib/data/students-store";
import { DEMO_CLASSES } from "@/lib/data/demo-data";
import {
  Users,
  Search,
  UserPlus,
  ArrowRight,
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  RotateCw,
  Minus,
  X,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { StudentAdmissionDialog } from "@/components/students/student-admission-dialog";

export default function StudentsDirectoryPage() {
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isAdmitDialogOpen, setIsAdmitDialogOpen] = useState(false);

  useEffect(() => {
    handleRefresh();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "admit") {
        setIsAdmitDialogOpen(true);
      }
      const classParam = params.get("class");
      if (classParam) {
        setSelectedClass(classParam);
      }
    }
  }, []);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parent.phone.includes(searchTerm);

    const matchesClass =
      selectedClass === "All Classes" || s.className === selectedClass;

    const matchesStatus =
      selectedStatus === "ALL" || s.status === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleRefresh = async () => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (data.data) {
        setStudents(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation (Akkhor Style) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/dashboard" className="text-slate-600 hover:text-[#ffbc00] transition-colors">
            Home
          </Link>
          <span>-</span>
          <span className="text-[#ffbc00] font-bold">Students</span>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          SOP School Management System
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#042954] flex items-center gap-2">
            <Users className="h-5 w-5 text-[#ffbc00]" />
            Student Management & Academic Records
          </h1>
          <p className="text-xs text-slate-500">
            SOP School Management System • {students.length} Enrolled Students across CBC & Cambridge
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAdmitDialogOpen(true)}
            className="px-4 py-2 bg-[#ffbc00] hover:bg-[#e5a800] text-slate-950 font-bold rounded shadow-xs flex items-center gap-2 text-xs transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Admit New Student</span>
          </button>
        </div>
      </div>

      {/* Subnavigation Bar (Akkhor Navy & Gold Theme) */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto bg-white px-5 pt-3.5 rounded-t-md shadow-2xs">
        <Link
          href="/students"
          className="pb-3 border-b-2 border-[#ffbc00] text-[#042954] font-bold whitespace-nowrap flex items-center gap-1.5"
        >
          <span>All Students</span>
          <span className="bg-[#ffbc00] text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
            {students.length}
          </span>
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
          className="pb-3 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Daily Attendance Register
        </Link>
        <Link
          href="/students/exams"
          className="pb-3 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Exams, Results & Rankings
        </Link>
      </div>

      {/* Main Container Card (Akkhor Style) */}
      <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
        {/* Card Header & Controls */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#042954]" />
            All Students Directory
          </h3>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh list"
              className="p-1 hover:text-emerald-500 transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5 text-emerald-500" />
            </button>
            <button
              type="button"
              title="Minimize"
              className="p-1 hover:text-[#ffbc00] transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Close"
              className="p-1 hover:text-rose-500 transition-colors"
            >
              <X className="h-3.5 w-3.5 text-rose-500" />
            </button>
          </div>
        </div>

        {/* Filter and Search Toolbar (Akkhor Search Controls) */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, admission number, or phone..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900"
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-700"
          >
            <option>All Classes</option>
            {DEMO_CLASSES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-700"
          >
            <option value="ALL">Status: All</option>
            <option value="ACTIVE">Active</option>
            <option value="TRANSFERRED">Transferred</option>
            <option value="GRADUATED">Graduated</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <button
            type="button"
            className="px-5 py-1.5 bg-[#042954] hover:bg-[#073b75] text-white font-bold rounded text-xs transition-colors"
          >
            SEARCH
          </button>
        </div>

        {/* Students Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#042954] text-white font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Adm No.</th>
                <th className="py-3 px-4">Class & Stream</th>
                <th className="py-3 px-4">Parent / Contact</th>
                <th className="py-3 px-3 text-center">Term Average</th>
                <th className="py-3 px-3 text-center">Attendance</th>
                <th className="py-3 px-4 text-center">Fee Balance</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={std.photoUrl}
                        alt={std.firstName}
                        className="h-9 w-9 rounded-md object-cover border border-slate-200"
                      />
                      <div>
                        <Link
                          href={`/students/${std.id}`}
                          className="font-bold text-[#042954] hover:text-[#ffbc00] hover:underline block"
                        >
                          {std.firstName} {std.lastName}
                        </Link>
                        <span className="text-[10px] text-slate-400">{std.gender}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#042954]">
                    {std.admissionNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-semibold text-slate-800">{std.className}</span>
                    <span className="text-slate-400 ml-1">({std.streamName})</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-semibold">{std.parent.fullName}</div>
                    <div className="text-slate-400 text-[10px] flex items-center gap-1 font-mono">
                      <Phone className="h-2.5 w-2.5" /> {std.parent.phone}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold">
                    <span className={std.academic.currentTermAverage < 65 ? "text-[#ff4d4f]" : "text-slate-900"}>
                      {std.academic.currentTermAverage}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        std.attendance.rate < 90
                          ? "bg-amber-100 text-amber-900"
                          : "bg-[#52c41a]/15 text-[#52c41a]"
                      }`}
                    >
                      {std.attendance.rate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        std.fees.balance === 0
                          ? "bg-[#52c41a]/15 text-[#52c41a]"
                          : "bg-[#ff4d4f]/15 text-[#ff4d4f]"
                      }`}
                    >
                      {std.fees.balance === 0 ? "Cleared" : formatKES(std.fees.balance)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        std.status === "ACTIVE"
                          ? "bg-[#52c41a]/15 text-[#52c41a]"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {std.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/students/${std.id}`}
                      className="inline-flex items-center gap-1 text-[#042954] hover:text-[#ffbc00] font-bold hover:underline"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between text-slate-500 text-[11px] gap-2">
          <div>
            Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> enrolled students
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">SOP School Management System</span>
          </div>
        </div>
      </div>

      {/* Admission Dialog Modal */}
      <StudentAdmissionDialog
        isOpen={isAdmitDialogOpen}
        onClose={() => setIsAdmitDialogOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
