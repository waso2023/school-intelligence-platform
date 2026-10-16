"use client";

import { useState } from "react";
import Link from "next/link";
import { CLASSES_DATA, ClassItem } from "@/lib/data/academics-store";
import {
  Building2,
  Users,
  PlusCircle,
  GraduationCap,
  Calendar,
  Layers,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClassesManagementPage() {
  const [classes, setClasses] = useState<ClassItem[]>(CLASSES_DATA);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newGradeLevel, setNewGradeLevel] = useState("7");
  const [newCurriculum, setNewCurriculum] = useState<"CBC" | "Cambridge International">("CBC");
  const [newTeacher, setNewTeacher] = useState("");
  const [newStreamName, setNewStreamName] = useState("East");
  const [newCapacity, setNewCapacity] = useState("35");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !newTeacher.trim()) return;

    const newClass: ClassItem = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      gradeLevel: Number(newGradeLevel) || 7,
      academicYear: "2026",
      term: "Term 1",
      classTeacher: newTeacher.trim(),
      curriculum: newCurriculum,
      streams: [
        {
          id: `st-${Date.now()}-1`,
          name: newStreamName.trim() || "East",
          capacity: Number(newCapacity) || 35,
          currentEnrolled: 0,
          streamTeacher: newTeacher.trim(),
        },
      ],
    };

    setClasses([newClass, ...classes]);
    setIsCreateOpen(false);
    setSuccessMsg(`Class "${newClass.name}" created successfully!`);
    setTimeout(() => setSuccessMsg(null), 4000);
    setNewClassName("");
    setNewTeacher("");
  };

  // Stats calculation
  const totalStudents = classes.reduce(
    (sum, c) => sum + c.streams.reduce((sSum, s) => sSum + s.currentEnrolled, 0),
    0
  );
  const totalCapacity = classes.reduce(
    (sum, c) => sum + c.streams.reduce((sSum, s) => sSum + s.capacity, 0),
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-600" />
            Classes & Streams Architecture
          </h1>
          <p className="text-xs text-slate-500">
            SOP International Academy • Academic Year 2026 • Term 1 System
          </p>
        </div>

        <Button
          variant="emerald"
          size="sm"
          className="gap-2 shadow-sm"
          onClick={() => setIsCreateOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Class / Stream</span>
        </Button>
      </div>

      {/* Subnavigation Bar */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
        <Link
          href="/students"
          className="pb-2.5 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          All Students
        </Link>
        <Link
          href="/students/classes"
          className="pb-2.5 border-b-2 border-emerald-600 text-emerald-700 whitespace-nowrap"
        >
          Classes & Streams ({classes.length})
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

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Total Grade Levels</span>
          <div className="text-2xl font-bold text-slate-900">{classes.length} Classes</div>
          <div className="text-slate-500 text-[11px]">Grade 7 through Year 11</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Active Streams</span>
          <div className="text-2xl font-bold text-emerald-600">
            {classes.reduce((acc, c) => acc + c.streams.length, 0)} Streams
          </div>
          <div className="text-slate-500 text-[11px]">East, West, North, Alpha, Beta</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Capacity Utilization</span>
          <div className="text-2xl font-bold text-slate-900">
            {Math.round((totalStudents / totalCapacity) * 100)}%
          </div>
          <div className="text-slate-500 text-[11px]">
            {totalStudents} enrolled of {totalCapacity} seats
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Curriculum Binding</span>
          <div className="text-base font-bold text-emerald-700 mt-1">CBC & Cambridge</div>
          <div className="text-slate-500 text-[11px]">Dual accreditation tracks</div>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classes.map((cls) => {
          const classStudents = cls.streams.reduce((acc, s) => acc + s.currentEnrolled, 0);
          const classCap = cls.streams.reduce((acc, s) => acc + s.capacity, 0);
          const percentage = Math.round((classStudents / classCap) * 100);

          return (
            <div
              key={cls.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{cls.name}</h2>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {cls.curriculum}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Class Teacher: <strong>{cls.classTeacher}</strong> • Academic Year: {cls.academicYear} ({cls.term})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-slate-900">{classStudents}</span>
                  <span className="text-slate-400 text-xs"> / {classCap} Students</span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Class Stream Capacity</span>
                  <span className="font-semibold text-slate-700">{percentage}% Occupied</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentage >= 90
                        ? "bg-rose-500"
                        : percentage >= 75
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Streams Breakdown Table */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                  Assigned Streams & Teachers
                </h3>
                <div className="divide-y divide-slate-100">
                  {cls.streams.map((stream) => (
                    <div key={stream.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {cls.name} {stream.name}
                        </span>
                        <span className="text-slate-400 text-[11px]">• Teacher: {stream.streamTeacher}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 font-mono text-[11px]">
                          {stream.currentEnrolled} / {stream.capacity}
                        </span>
                        <Link
                          href={`/students?class=${encodeURIComponent(cls.name)}`}
                          className="text-emerald-700 font-semibold hover:underline"
                        >
                          Roster →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Class / Stream Modal Dialog */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Create Class & Stream</h3>
                  <p className="text-[11px] text-slate-500">Configure grade placement and class teacher</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Class / Grade Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 10 or Year 12"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grade Level</label>
                  <input
                    type="number"
                    min="1"
                    max="13"
                    required
                    value={newGradeLevel}
                    onChange={(e) => setNewGradeLevel(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Curriculum</label>
                  <select
                    value={newCurriculum}
                    onChange={(e) => setNewCurriculum(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="CBC">CBC (Kenya)</option>
                    <option value="Cambridge International">Cambridge (CAIE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Class Teacher Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dennis Njoroge"
                  value={newTeacher}
                  onChange={(e) => setNewTeacher(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Stream</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. East"
                    value={newStreamName}
                    onChange={(e) => setNewStreamName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stream Capacity</label>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    required
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm">
                  Save New Class
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
