"use client";

import { useState } from "react";
import Link from "next/link";
import { EXAMS_DATA, ExamRecord } from "@/lib/data/academics-store";
import {
  Award,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  BarChart3,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface GradeEntry {
  rank: number;
  studentId: string;
  name: string;
  admNo: string;
  marks: number;
  percentage: number;
  grade: string;
  previousTerm: number;
  trend: "UP" | "DOWN" | "STABLE";
  remarks: string;
}

const TERM_TREND_DATA = [
  { term: "2025 Term 1", Grade7: 71.2, Grade8: 69.5, Year10: 72.4 },
  { term: "2025 Term 2", Grade7: 72.8, Grade8: 70.1, Year10: 74.0 },
  { term: "2025 Term 3", Grade7: 74.5, Grade8: 71.4, Year10: 75.8 },
  { term: "2026 Term 1", Grade7: 75.1, Grade8: 68.2, Year10: 71.6 }, // Note Grade 8 drop!
];

const SUBJECT_PERFORMANCE_DATA = [
  { subject: "Math", average: 71.4, target: 75 },
  { subject: "English", average: 76.8, target: 75 },
  { subject: "Science", average: 74.2, target: 75 },
  { subject: "Kiswahili", average: 73.0, target: 72 },
  { subject: "Social St.", average: 69.4, target: 72 },
  { subject: "Physics", average: 68.2, target: 70 },
  { subject: "Chemistry", average: 67.5, target: 70 },
];

export default function ExamsAndResultsPage() {
  const [selectedExam, setSelectedExam] = useState("ex-1");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [admNo, setAdmNo] = useState("");
  const [marks, setMarks] = useState("");
  const [prevMarks, setPrevMarks] = useState("70");
  const [remarks, setRemarks] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [studentGrades, setStudentGrades] = useState<GradeEntry[]>([
    {
      rank: 1,
      studentId: "std-002",
      name: "Amani Otieno",
      admNo: "SOP-2024-0083",
      marks: 88,
      percentage: 88.0,
      grade: "A",
      previousTerm: 82.5,
      trend: "UP",
      remarks: "Outstanding conceptual mastery and problem execution.",
    },
    {
      rank: 2,
      studentId: "std-004",
      name: "Jabari Kiprono",
      admNo: "SOP-2024-0085",
      marks: 84,
      percentage: 84.0,
      grade: "A-",
      previousTerm: 78.5,
      trend: "UP",
      remarks: "Demonstrates consistent analytical rigour.",
    },
    {
      rank: 3,
      studentId: "std-001",
      name: "Kevin Kimani",
      admNo: "SOP-2024-0082",
      marks: 79,
      percentage: 79.0,
      grade: "A-",
      previousTerm: 78.0,
      trend: "STABLE",
      remarks: "Very solid effort; slight improvement in geometry.",
    },
    {
      rank: 4,
      studentId: "std-005",
      name: "Imani Chebet",
      admNo: "SOP-2024-0086",
      marks: 68,
      percentage: 68.0,
      grade: "B",
      previousTerm: 78.0,
      trend: "DOWN",
      remarks: "Noticeable drop in exam timing. Needs coursework review.",
    },
    {
      rank: 5,
      studentId: "std-003",
      name: "Zawadi Muthoni",
      admNo: "SOP-2024-0084",
      marks: 59,
      percentage: 59.0,
      grade: "C",
      previousTerm: 74.0,
      trend: "DOWN",
      remarks: "Significant academic decline (-15%). Remedial action required.",
    },
  ]);

  const calculateGrade = (m: number): string => {
    if (m >= 80) return "A";
    if (m >= 75) return "A-";
    if (m >= 70) return "B+";
    if (m >= 65) return "B";
    if (m >= 60) return "B-";
    if (m >= 55) return "C+";
    if (m >= 50) return "C";
    if (m >= 45) return "C-";
    if (m >= 40) return "D+";
    return "E";
  };

  const handleCreateGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const numMarks = Number(marks);
    const numPrev = Number(prevMarks) || 70;
    if (!studentName.trim() || isNaN(numMarks)) return;

    let trend: "UP" | "DOWN" | "STABLE" = "STABLE";
    if (numMarks - numPrev >= 3) trend = "UP";
    else if (numPrev - numMarks >= 3) trend = "DOWN";

    const newEntry: GradeEntry = {
      rank: 1,
      studentId: `std-${Date.now()}`,
      name: studentName.trim(),
      admNo: admNo.trim() || `SOP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      marks: numMarks,
      percentage: numMarks,
      grade: calculateGrade(numMarks),
      previousTerm: numPrev,
      trend,
      remarks: remarks.trim() || "Performance recorded in Term 1 assessment register.",
    };

    // Combine and sort by marks descending
    const updated = [...studentGrades, newEntry].sort((a, b) => b.marks - a.marks);
    // Assign ranks
    const ranked = updated.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    setStudentGrades(ranked);
    setIsCreateOpen(false);
    setSuccessMsg(`Exam results for ${newEntry.name} (${newEntry.marks}%, Grade ${newEntry.grade}) recorded and ranked successfully!`);
    setTimeout(() => setSuccessMsg(null), 4000);

    setStudentName("");
    setAdmNo("");
    setMarks("");
    setRemarks("");
  };

  // Flagged students with significant academic decline (drop > 10%)
  const declineFlaggedStudents = studentGrades.filter(
    (s) => s.previousTerm - s.percentage >= 10
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
            <Award className="h-5 w-5 text-emerald-600" />
            Exams, Grading & Visual Performance Trends
          </h1>
          <p className="text-xs text-slate-500">
            Term assessments, automated rankings, CBC grade conversions & trend analysis
          </p>
        </div>

        <Button
          variant="emerald"
          size="sm"
          className="gap-2 shadow-sm"
          onClick={() => setIsCreateOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Enter New Exam Results</span>
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
          className="pb-2.5 border-b-2 border-emerald-600 text-emerald-700 whitespace-nowrap"
        >
          Exams, Results & Rankings
        </Link>
      </div>

      {/* Flagged Significant Decline Banner */}
      {declineFlaggedStudents.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-rose-200 text-rose-900 flex items-center justify-center shrink-0">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-rose-900">
                AI Academic Decline Alert: {declineFlaggedStudents.length} Students Flagged
              </span>
              <p className="text-rose-800 text-[11px] mt-0.5">
                {declineFlaggedStudents
                  .map(
                    (s) =>
                      `${s.name} (${s.previousTerm}% → ${s.percentage}%, -${Math.round(
                        s.previousTerm - s.percentage
                      )}%)`
                  )
                  .join("; ")} have shown a steep drop this term.
              </p>
            </div>
          </div>
          <Link
            href="/intelligence"
            className="text-xs font-semibold text-rose-900 bg-rose-200 hover:bg-rose-300 px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            Open AI Intervention Suite →
          </Link>
        </div>
      )}

      {/* Visual Analytics Section with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Term-over-Term Trend Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                Term-over-Term Grade Progression
              </h3>
              <p className="text-slate-500 text-[11px]">Academic performance trajectory by grade level</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
              Multi-Term
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TERM_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="term" stroke="#64748b" fontSize={11} />
                <YAxis domain={[55, 90]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="Grade7"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  name="Grade 7 (CBC)"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Grade8"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  name="Grade 8 (Declining)"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Year10"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  name="Year 10 (IGCSE)"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Average vs Benchmark Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                Subject Average vs School Benchmark (75%)
              </h3>
              <p className="text-slate-500 text-[11px]">Departmental performance comparison</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
              Term 1 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SUBJECT_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="average" fill="#059669" radius={[4, 4, 0, 0]} name="Class Average (%)" />
                <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Target Benchmark (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gradebook and Rankings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">
              Mathematics Term 1 Mid-Term Gradebook & Official Rankings
            </h3>
            <p className="text-slate-500 text-[11px]">
              Grade 8 East • Subject Teacher: Sarah Wanjiku • Max Marks: 100
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              {EXAMS_DATA.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.subjectName})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-slate-500 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Adm No.</th>
                <th className="py-3 px-4">Marks (100)</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Previous Term</th>
                <th className="py-3 px-4">Trend</th>
                <th className="py-3 px-4">Teacher Evaluation Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {studentGrades.map((g) => (
                <tr key={g.studentId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-full font-bold text-xs ${
                        g.rank === 1
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : g.rank === 2
                          ? "bg-slate-200 text-slate-800"
                          : g.rank === 3
                          ? "bg-amber-50 text-amber-800"
                          : "text-slate-600"
                      }`}
                    >
                      {g.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <Link
                      href={`/students/${g.studentId}`}
                      className="hover:text-emerald-700 hover:underline"
                    >
                      {g.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-600">
                    {g.admNo}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {g.marks}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        g.grade.startsWith("A")
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : g.grade.startsWith("B")
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {g.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    {g.previousTerm}%
                  </td>
                  <td className="py-3 px-4">
                    {g.trend === "UP" ? (
                      <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                        <TrendingUp className="h-3.5 w-3.5" /> +{Math.round(g.percentage - g.previousTerm)}%
                      </span>
                    ) : g.trend === "DOWN" ? (
                      <span className="text-rose-600 flex items-center gap-1 font-bold">
                        <TrendingDown className="h-3.5 w-3.5" /> -{Math.round(g.previousTerm - g.percentage)}%
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Stable</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {g.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enter Exam Results Modal Dialog */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Enter Exam Marks & Evaluation</h3>
                  <p className="text-[11px] text-slate-500">Record score and calculate automatic grade & ranking</p>
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

            <form onSubmit={handleCreateGrade} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Kipchoge"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Admission Number</label>
                <input
                  type="text"
                  placeholder="e.g. SOP-2024-0092"
                  value={admNo}
                  onChange={(e) => setAdmNo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Current Marks (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 82"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Previous Term Mark</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 75"
                    value={prevMarks}
                    onChange={(e) => setPrevMarks(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Teacher Evaluation Remarks</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Commendable improvement in analytical sections."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
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
                  Record & Rank Results
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
