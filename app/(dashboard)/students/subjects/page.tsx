"use client";

import { useState } from "react";
import Link from "next/link";
import { SUBJECTS_DATA, SubjectItem } from "@/lib/data/academics-store";
import {
  RotateCw,
  Minus,
  X,
  Search,
  BookOpen,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Layers,
  FileCheck,
  GraduationCap,
} from "lucide-react";

export default function SubjectsCurriculumPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>(SUBJECTS_DATA);
  const [selectedCurriculum, setSelectedCurriculum] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [activeDetailSubject, setActiveDetailSubject] = useState<SubjectItem | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for "Add New Subject"
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<SubjectItem["department"]>("Sciences");
  const [curriculum, setCurriculum] = useState<"CBC" | "Cambridge International">("CBC");
  const [subjectType, setSubjectType] = useState("Core Theory");
  const [headTeacher, setHeadTeacher] = useState("");
  const [periodsPerWeek, setPeriodsPerWeek] = useState("5");
  const [gradeLevel, setGradeLevel] = useState("Grade 8");
  const [description, setDescription] = useState("");

  const handleResetForm = () => {
    setCode("");
    setName("");
    setHeadTeacher("");
    setDescription("");
    setPeriodsPerWeek("5");
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !headTeacher.trim()) {
      alert("Please fill in Subject Name, Code, and Head Teacher.");
      return;
    }

    const newSub: SubjectItem = {
      id: `sub-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      curriculum,
      department,
      gradeLevels: [gradeLevel],
      headTeacher: headTeacher.trim(),
      periodsPerWeek: Number(periodsPerWeek) || 5,
      description:
        description.trim() ||
        `Curriculum track for ${name.trim()} aligned with ${curriculum} standards.`,
      syllabusOverview: `Core thematic strands and competency projects for ${curriculum}.`,
    };

    setSubjects([newSub, ...subjects]);
    setSuccessMsg(`Subject "${newSub.name}" (${newSub.code}) registered successfully!`);
    setTimeout(() => setSuccessMsg(null), 4000);
    handleResetForm();
  };

  const handleDeleteSubject = (id: string, subName: string) => {
    if (confirm(`Are you sure you want to delete "${subName}"?`)) {
      setSubjects(subjects.filter((s) => s.id !== id));
      setSuccessMsg(`Subject "${subName}" deleted.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchCurriculum =
      selectedCurriculum === "ALL" || s.curriculum === selectedCurriculum;
    const matchDept = selectedDept === "ALL" || s.department === selectedDept;
    const matchCode =
      !searchCode || s.code.toLowerCase().includes(searchCode.toLowerCase());
    const matchName =
      !searchName || s.name.toLowerCase().includes(searchName.toLowerCase());
    return matchCurriculum && matchDept && matchCode && matchName;
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
          <span className="text-[#ffbc00] font-bold">Subject</span>
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
          className="pb-3 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Classes & Streams
        </Link>
        <Link
          href="/students/subjects"
          className="pb-3 border-b-2 border-[#ffbc00] text-[#042954] font-bold whitespace-nowrap flex items-center gap-1.5"
        >
          <span>Subjects & Curriculum</span>
          <span className="bg-[#ffbc00] text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
            {subjects.length}
          </span>
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

      {/* Main 2-Column Responsive Layout (Akkhor Subject Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================================
            LEFT COLUMN: "Add New Subject" Form Card (5 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
            {/* Card Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#ffbc00]" />
                Add New Subject
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
            <form onSubmit={handleCreateSubject} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Integrated Science"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SCI-801"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Subject Type
                  </label>
                  <select
                    value={subjectType}
                    onChange={(e) => setSubjectType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                  >
                    <option value="Core Theory">Core Theory</option>
                    <option value="Theory + Practical">Theory + Practical</option>
                    <option value="Laboratory">Science Laboratory</option>
                    <option value="Language / Lit">Language & Literature</option>
                    <option value="Elective">Elective / Technical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Languages">Languages</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Technical & Applied">Technical & Applied</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Target Class / Grade
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                  >
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Year 10">Year 10 (IGCSE)</option>
                    <option value="Year 11">Year 11 (IGCSE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Periods / Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={periodsPerWeek}
                    onChange={(e) => setPeriodsPerWeek(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Head Teacher / Subject Lead *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Wanjiku"
                  value={headTeacher}
                  onChange={(e) => setHeadTeacher(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Syllabus Overview & Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter competency strands, laboratory safety requirements or Cambridge exam codes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
                />
              </div>

              {/* Action Buttons (Akkhor Save in Gold, Reset in Navy) */}
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
            RIGHT COLUMN: "All Subjects" Data Table Card (7 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
            {/* Card Header & Search Controls */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight shrink-0 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#042954]" />
                All Subjects
              </h3>

              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  type="button"
                  onClick={() => setSubjects(SUBJECTS_DATA)}
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

            {/* Filter / Search Bar Bar (Akkhor Search Controls) */}
            <div className="p-4 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <input
                type="text"
                placeholder="Search by Code ..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#ffbc00] w-28 sm:w-32"
              />
              <input
                type="text"
                placeholder="Search by Name ..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#ffbc00] w-32 sm:w-36"
              />
              <select
                value={selectedCurriculum}
                onChange={(e) => setSelectedCurriculum(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
              >
                <option value="ALL">All Curricula</option>
                <option value="CBC">CBC</option>
                <option value="Cambridge International">Cambridge</option>
              </select>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#ffbc00]"
              >
                <option value="ALL">All Depts</option>
                <option value="Sciences">Sciences</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Languages">Languages</option>
                <option value="Humanities">Humanities</option>
              </select>

              <button
                type="button"
                className="px-4 py-1.5 bg-[#042954] hover:bg-[#073b75] text-white text-xs font-bold rounded transition-colors"
              >
                SEARCH
              </button>
            </div>

            {/* Subjects Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#042954] text-white font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 w-8">
                      <input type="checkbox" className="rounded text-[#ffbc00] focus:ring-[#ffbc00]" />
                    </th>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Curriculum</th>
                    <th className="py-2.5 px-3">Teacher</th>
                    <th className="py-2.5 px-3 text-center">Periods</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        No subjects match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <input type="checkbox" className="rounded text-[#ffbc00] focus:ring-[#ffbc00]" />
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {sub.code}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800">{sub.name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {sub.gradeLevels.join(", ")}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {sub.department}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sub.curriculum === "CBC"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-sky-50 text-sky-800 border border-sky-200"
                            }`}
                          >
                            {sub.curriculum === "CBC" ? "CBC" : "Cambridge"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-semibold">
                          {sub.headTeacher}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600">
                          {sub.periodsPerWeek}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-slate-500">
                            {/* View Dossier Button */}
                            <button
                              type="button"
                              onClick={() => setActiveDetailSubject(sub)}
                              title="View syllabus details"
                              className="p-1 hover:text-[#1890ff] hover:bg-sky-50 rounded transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setCode(sub.code);
                                setName(sub.name);
                                setDepartment(sub.department);
                                setCurriculum(sub.curriculum);
                                setHeadTeacher(sub.headTeacher);
                                setPeriodsPerWeek(String(sub.periodsPerWeek));
                                setDescription(sub.description);
                              }}
                              title="Edit Subject"
                              className="p-1 hover:text-[#ffbc00] hover:bg-amber-50 rounded transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5 text-[#ffbc00]" />
                            </button>
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSubject(sub.id, sub.name)}
                              title="Delete Subject"
                              className="p-1 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Counter */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div>
                Showing {filteredSubjects.length} of {subjects.length} subjects
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

      {/* Syllabus Detail Modal */}
      {activeDetailSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-md shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white bg-[#042954] px-2 py-0.5 rounded">
                  {activeDetailSubject.code}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  {activeDetailSubject.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailSubject(null)}
                className="p-1 text-slate-400 hover:text-rose-500 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium">Curriculum:</span>
                  <div className="font-bold text-slate-800">{activeDetailSubject.curriculum}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Department:</span>
                  <div className="font-bold text-slate-800">{activeDetailSubject.department}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Head Teacher:</span>
                  <div className="font-bold text-slate-800">{activeDetailSubject.headTeacher}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Workload:</span>
                  <div className="font-bold text-slate-800">{activeDetailSubject.periodsPerWeek} periods/wk</div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Description:
                </span>
                <p className="text-slate-700 leading-relaxed mt-1">
                  {activeDetailSubject.description}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Syllabus Mapping:
                </span>
                <p className="text-slate-700 leading-relaxed mt-1 italic bg-amber-50/60 p-3 rounded border border-amber-200">
                  {activeDetailSubject.syllabusOverview}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveDetailSubject(null)}
                  className="px-5 py-2 bg-[#042954] text-white font-bold rounded text-xs hover:bg-[#073b75] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
