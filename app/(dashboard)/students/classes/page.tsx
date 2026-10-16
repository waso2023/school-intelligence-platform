"use client";

import { useState } from "react";
import Link from "next/link";
import { CLASSES_DATA, ClassItem } from "@/lib/data/academics-store";
import {
  RotateCw,
  Minus,
  X,
  Layers,
  Search,
  CheckCircle2,
  Users,
  GraduationCap,
  Building2,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";

export default function ClassesManagementPage() {
  const [classes, setClasses] = useState<ClassItem[]>(CLASSES_DATA);
  const [searchName, setSearchName] = useState("");
  const [searchCurriculum, setSearchCurriculum] = useState("ALL");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for "Add New Class"
  const [className, setClassName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("7");
  const [curriculum, setCurriculum] = useState<"CBC" | "Cambridge International">("CBC");
  const [teacher, setTeacher] = useState("");
  const [streamName, setStreamName] = useState("East");
  const [capacity, setCapacity] = useState("35");

  const handleResetForm = () => {
    setClassName("");
    setTeacher("");
    setStreamName("East");
    setCapacity("35");
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !teacher.trim()) {
      alert("Please enter Class Name and Class Teacher.");
      return;
    }

    const newClass: ClassItem = {
      id: `cls-${Date.now()}`,
      name: className.trim(),
      gradeLevel: Number(gradeLevel) || 7,
      academicYear: "2026",
      term: "Term 1",
      classTeacher: teacher.trim(),
      curriculum: curriculum,
      streams: [
        {
          id: `st-${Date.now()}-1`,
          name: streamName.trim() || "East",
          capacity: Number(capacity) || 35,
          currentEnrolled: 0,
          streamTeacher: teacher.trim(),
        },
      ],
    };

    setClasses([newClass, ...classes]);
    setSuccessMsg(`Class "${newClass.name}" created successfully!`);
    setTimeout(() => setSuccessMsg(null), 4000);
    handleResetForm();
  };

  const handleDeleteClass = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setClasses(classes.filter((c) => c.id !== id));
      setSuccessMsg(`Class "${name}" deleted.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const totalStudents = classes.reduce(
    (sum, c) => sum + c.streams.reduce((sSum, s) => sSum + s.currentEnrolled, 0),
    0
  );
  const totalCapacity = classes.reduce(
    (sum, c) => sum + c.streams.reduce((sSum, s) => sSum + s.capacity, 0),
    0
  );

  const filteredClasses = classes.filter((c) => {
    const matchesName = !searchName || c.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesCurriculum = searchCurriculum === "ALL" || c.curriculum === searchCurriculum;
    return matchesName && matchesCurriculum;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation (Akkhor Style) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/dashboard" className="text-slate-600 hover:text-[#ffbc00] transition-colors">
            Home
          </Link>
          <span>-</span>
          <span className="text-[#ffbc00] font-bold">Class</span>
        </div>

        <div className="text-xs text-slate-400">
          SOP School Management System
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
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
          className="pb-3 border-b-2 border-[#ffbc00] text-[#042954] font-bold whitespace-nowrap flex items-center gap-1.5"
        >
          <span>Classes & Streams</span>
          <span className="bg-[#ffbc00] text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
            {classes.length}
          </span>
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

      {/* Top 4 Vibrant KPI Metric Blocks (Akkhor Palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#ff4d4f] text-white rounded-md p-4 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded border-2 border-white/70 flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6 text-white stroke-[1.5]" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight">{classes.length}</div>
            <div className="text-[11px] text-white/90 font-medium">Grade Levels</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#52c41a] text-white rounded-md p-4 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded border-2 border-white/70 flex items-center justify-center shrink-0">
            <Layers className="h-6 w-6 text-white stroke-[1.5]" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight">
              {classes.reduce((acc, c) => acc + c.streams.length, 0)}
            </div>
            <div className="text-[11px] text-white/90 font-medium">Active Streams</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#1890ff] text-white rounded-md p-4 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded border-2 border-white/70 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6 text-white stroke-[1.5]" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight">
              {Math.round((totalStudents / totalCapacity) * 100)}%
            </div>
            <div className="text-[11px] text-white/90 font-medium">
              Capacity ({totalStudents}/{totalCapacity})
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#13c2c2] text-white rounded-md p-4 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded border-2 border-white/70 flex items-center justify-center shrink-0">
            <GraduationCap className="h-6 w-6 text-white stroke-[1.5]" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight">CBC & IGCSE</div>
            <div className="text-[11px] text-white/90 font-medium">Dual Curriculum</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout (Akkhor Class Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================================
            LEFT COLUMN: "Add New Class" Form Card (5 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
            {/* Card Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#ffbc00]" />
                Add New Class
              </h3>
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  type="button"
                  onClick={handleResetForm}
                  title="Refresh form"
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

            {/* Form Body */}
            <form onSubmit={handleCreateClass} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Class Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 9 or Year 11"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Grade Level *
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                  >
                    <option value="7">Grade 7</option>
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Year 10 (IGCSE)</option>
                    <option value="11">Year 11 (IGCSE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Curriculum *
                  </label>
                  <select
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                  >
                    <option value="CBC">Kenya CBC (Junior Sec)</option>
                    <option value="Cambridge International">Cambridge IGCSE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Class Teacher / Homeroom Lead *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dennis Njoroge"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Default Stream Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. East or Alpha"
                    value={streamName}
                    onChange={(e) => setStreamName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Stream Capacity
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                  />
                </div>
              </div>

              {/* Action Buttons (Akkhor Gold Save + Navy Reset) */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ffbc00] hover:bg-[#e5a800] text-slate-950 font-bold rounded shadow-xs transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-6 py-2 bg-[#042954] hover:bg-[#073b75] text-white font-bold rounded shadow-xs transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: "All Classes" Data Table Card (7 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
            {/* Card Header & Controls */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight shrink-0 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#042954]" />
                All Classes
              </h3>

              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  type="button"
                  onClick={() => setClasses(CLASSES_DATA)}
                  title="Reload defaults"
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

            {/* Filter / Search Bar (Akkhor Search Controls) */}
            <div className="p-4 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <input
                type="text"
                placeholder="Search by Class ..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#ffbc00] w-36"
              />
              <select
                value={searchCurriculum}
                onChange={(e) => setSearchCurriculum(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
              >
                <option value="ALL">All Curricula</option>
                <option value="CBC">CBC</option>
                <option value="Cambridge International">Cambridge</option>
              </select>

              <button
                type="button"
                className="px-4 py-1.5 bg-[#042954] hover:bg-[#073b75] text-white text-xs font-bold rounded transition-colors"
              >
                SEARCH
              </button>
            </div>

            {/* Classes Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#042954] text-white font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 w-8">
                      <input type="checkbox" className="rounded text-[#ffbc00] focus:ring-[#ffbc00]" />
                    </th>
                    <th className="py-2.5 px-3">Class Name</th>
                    <th className="py-2.5 px-3">Curriculum</th>
                    <th className="py-2.5 px-3">Class Teacher</th>
                    <th className="py-2.5 px-3">Streams</th>
                    <th className="py-2.5 px-3">Capacity</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredClasses.map((cls) => {
                    const enrolled = cls.streams.reduce((acc, s) => acc + s.currentEnrolled, 0);
                    const cap = cls.streams.reduce((acc, s) => acc + s.capacity, 0);
                    const pct = Math.round((enrolled / cap) * 100);

                    return (
                      <tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <input type="checkbox" className="rounded text-[#ffbc00] focus:ring-[#ffbc00]" />
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{cls.name}</div>
                          <div className="text-[10px] text-slate-400">
                            Academic Year {cls.academicYear}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cls.curriculum === "CBC"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-sky-50 text-sky-800 border border-sky-200"
                            }`}
                          >
                            {cls.curriculum === "CBC" ? "CBC" : "Cambridge"}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {cls.classTeacher}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {cls.streams.map((s) => (
                              <span
                                key={s.id}
                                className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono"
                              >
                                {s.name} ({s.currentEnrolled}/{s.capacity})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-slate-800">
                              {pct}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pct >= 90 ? "bg-[#ff4d4f]" : "bg-[#52c41a]"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-slate-500">
                            <Link
                              href={`/students/attendance?class=${encodeURIComponent(cls.name)}`}
                              title="Take Attendance"
                              className="p-1 hover:text-[#1890ff] hover:bg-sky-50 rounded transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setClassName(cls.name);
                                setTeacher(cls.classTeacher);
                                setCurriculum(cls.curriculum);
                              }}
                              title="Edit Class"
                              className="p-1 hover:text-[#ffbc00] hover:bg-amber-50 rounded transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5 text-[#ffbc00]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClass(cls.id, cls.name)}
                              title="Delete Class"
                              className="p-1 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div>
                Showing {filteredClasses.length} of {classes.length} classes
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="px-2 py-1 border border-slate-200 rounded text-slate-300 cursor-not-allowed"
                >
                  ‹
                </button>
                <span className="px-2.5 py-1 bg-[#042954] text-white font-bold rounded text-[11px]">
                  1
                </span>
                <button
                  type="button"
                  disabled
                  className="px-2 py-1 border border-slate-200 rounded text-slate-300 cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
