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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            Student Management & Academic Records
          </h1>
          <p className="text-xs text-slate-500">
            SOP International Academy • {students.length} Enrolled Students across CBC & Cambridge
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="emerald"
            size="sm"
            onClick={() => setIsAdmitDialogOpen(true)}
            className="gap-2 shadow-sm shadow-emerald-600/20"
          >
            <UserPlus className="h-4 w-4" />
            <span>Admit New Student</span>
          </Button>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
        <Link
          href="/students"
          className="pb-2.5 border-b-2 border-emerald-600 text-emerald-700 whitespace-nowrap"
        >
          All Students ({students.length})
        </Link>
        <Link
          href="/students/classes"
          className="pb-2.5 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Classes & Streams
        </Link>
        <Link
          href="/students/subjects"
          className="pb-2.5 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Subjects & Curriculum
        </Link>
        <Link
          href="/students/attendance"
          className="pb-2.5 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Daily Attendance Register
        </Link>
        <Link
          href="/students/exams"
          className="pb-2.5 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Exams, Results & Rankings
        </Link>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, admission number, or parent phone..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 shadow-2xs"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Status: All</option>
            <option value="ACTIVE">Active</option>
            <option value="TRANSFERRED">Transferred</option>
            <option value="GRADUATED">Graduated</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Adm No.</th>
                <th className="py-3 px-4">Class & Stream</th>
                <th className="py-3 px-4">Parent / Contact</th>
                <th className="py-3 px-4">Term Average</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Fee Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
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
                          className="font-bold text-slate-900 hover:text-emerald-700 hover:underline block"
                        >
                          {std.firstName} {std.lastName}
                        </Link>
                        <span className="text-[10px] text-slate-400">{std.gender}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-emerald-700">
                    {std.admissionNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-semibold text-slate-800">{std.className}</span>
                    <span className="text-slate-400 ml-1">({std.streamName})</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium">{std.parent.fullName}</div>
                    <div className="text-slate-400 text-[10px] flex items-center gap-1 font-mono">
                      <Phone className="h-2.5 w-2.5" /> {std.parent.phone}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    <span className={std.academic.currentTermAverage < 65 ? "text-rose-600 font-bold" : "text-slate-900"}>
                      {std.academic.currentTermAverage}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        std.attendance.rate < 90 ? "text-amber-600 font-bold" : "text-emerald-700"
                      }`}
                    >
                      {std.attendance.rate}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        std.fees.balance === 0
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {std.fees.balance === 0 ? "Cleared" : formatKES(std.fees.balance)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        std.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {std.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/students/${std.id}`}
                      className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
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
