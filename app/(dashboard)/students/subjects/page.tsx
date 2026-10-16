"use client";

import { useState } from "react";
import Link from "next/link";
import { SUBJECTS_DATA, SubjectItem } from "@/lib/data/academics-store";
import {
  BookOpen,
  PlusCircle,
  GraduationCap,
  Clock,
  Layers,
  ArrowRight,
  Search,
  CheckCircle2,
  Users,
  Sparkles,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubjectsCurriculumPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>(SUBJECTS_DATA);
  const [selectedCurriculum, setSelectedCurriculum] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeDetailSubject, setActiveDetailSubject] = useState<SubjectItem | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<SubjectItem["department"]>("Sciences");
  const [curriculum, setCurriculum] = useState<"CBC" | "Cambridge International">("CBC");
  const [headTeacher, setHeadTeacher] = useState("");
  const [periodsPerWeek, setPeriodsPerWeek] = useState("5");
  const [description, setDescription] = useState("");
  const [syllabusOverview, setSyllabusOverview] = useState("");

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !headTeacher.trim()) return;

    const newSub: SubjectItem = {
      id: `sub-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      curriculum,
      department,
      gradeLevels: [curriculum === "CBC" ? "Grade 8" : "Year 10"],
      headTeacher: headTeacher.trim(),
      periodsPerWeek: Number(periodsPerWeek) || 5,
      description:
        description.trim() ||
        `Comprehensive curriculum track for ${name.trim()} aligned with ${curriculum} standards.`,
      syllabusOverview:
        syllabusOverview.trim() ||
        `Core thematic strands and competency projects for ${curriculum}.`,
    };

    setSubjects([newSub, ...subjects]);
    setIsCreateOpen(false);
    setSuccessMsg(`Subject "${newSub.name}" (${newSub.code}) registered successfully!`);
    setTimeout(() => setSuccessMsg(null), 4000);

    // Reset
    setCode("");
    setName("");
    setHeadTeacher("");
    setDescription("");
    setSyllabusOverview("");
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchCurriculum =
      selectedCurriculum === "ALL" || s.curriculum === selectedCurriculum;
    const matchDept = selectedDept === "ALL" || s.department === selectedDept;
    return matchCurriculum && matchDept;
  });

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
            <BookOpen className="h-5 w-5 text-emerald-600" />
            Subjects & Curriculum Syllabus Tracking
          </h1>
          <p className="text-xs text-slate-500">
            CBC & Cambridge International IGCSE syllabi, subject codes and teacher allocations
          </p>
        </div>

        <Button
          variant="emerald"
          size="sm"
          className="gap-2 shadow-sm"
          onClick={() => setIsCreateOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Subject</span>
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
          className="pb-2.5 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Classes & Streams
        </Link>
        <Link
          href="/students/subjects"
          className="pb-2.5 border-b-2 border-emerald-600 text-emerald-700 whitespace-nowrap"
        >
          Subjects & Curriculum ({subjects.length})
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

      {/* Filter toolbar */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedCurriculum}
          onChange={(e) => setSelectedCurriculum(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500"
        >
          <option value="ALL">All Curricula</option>
          <option value="CBC">CBC (Competency Based)</option>
          <option value="Cambridge International">Cambridge International</option>
        </select>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500"
        >
          <option value="ALL">All Departments</option>
          <option value="Sciences">Sciences</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Languages">Languages</option>
          <option value="Humanities">Humanities</option>
        </select>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((sub) => (
          <div
            key={sub.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {sub.code}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {sub.department}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{sub.name}</h3>
                <span className="text-[11px] text-emerald-800 font-medium">{sub.curriculum} Track</span>
              </div>

              <p className="text-slate-600 leading-relaxed text-[11px]">{sub.description}</p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Syllabus Mapping:
                </div>
                <div className="text-slate-600 italic">{sub.syllabusOverview}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <span>Head Teacher: </span>
                  <strong className="text-slate-800">{sub.headTeacher}</strong>
                </div>
                <div className="font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {sub.periodsPerWeek} p/wk
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setActiveDetailSubject(sub)}
                  className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  View Syllabus Details
                </button>
                <Link
                  href="/students"
                  className="text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  Students
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Subject Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Add New Curriculum Subject</h3>
                  <p className="text-[11px] text-slate-500">Configure subject code, syllabus and teacher assignment</p>
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

            <form onSubmit={handleCreateSubject} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BIO-8 or CSC-10"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as SubjectItem["department"])}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Languages">Languages</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Creative Arts & Tech">Creative Arts & Tech</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Integrated Science & Ecology"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Curriculum Framework</label>
                  <select
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="CBC">CBC (Kenya)</option>
                    <option value="Cambridge International">Cambridge International</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Periods / Week</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={periodsPerWeek}
                    onChange={(e) => setPeriodsPerWeek(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lead / Head Teacher</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Christine Wanjiru"
                  value={headTeacher}
                  onChange={(e) => setHeadTeacher(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of course goals and competencies covered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Syllabus Overview & Strands</label>
                <textarea
                  rows={2}
                  placeholder="Key curriculum strands, assessment rubrics and practical projects..."
                  value={syllabusOverview}
                  onChange={(e) => setSyllabusOverview(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
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
                  Register Subject
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Syllabus Detail Modal */}
      {activeDetailSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {activeDetailSubject.code}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{activeDetailSubject.name}</h3>
                <span className="text-slate-500 text-[11px]">{activeDetailSubject.department} Department</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailSubject(null)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Curriculum Framework</span>
                <p className="font-medium text-slate-900">{activeDetailSubject.curriculum} Standard</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Faculty Lead</span>
                <p className="font-medium text-slate-900">{activeDetailSubject.headTeacher} ({activeDetailSubject.periodsPerWeek} lessons/week)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Syllabus Strands & Mapping</span>
                <p className="text-slate-700 italic leading-relaxed">{activeDetailSubject.syllabusOverview}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Course Description</span>
                <p className="text-slate-600 leading-relaxed">{activeDetailSubject.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                variant="emerald"
                size="sm"
                onClick={() => setActiveDetailSubject(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
