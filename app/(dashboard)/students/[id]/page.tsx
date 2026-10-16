"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { formatKES } from "@/lib/utils";
import { INITIAL_STUDENTS, StudentProfile, getStudentById } from "@/lib/data/students-store";
import {
  ArrowLeft,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Users,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  Clock,
  Download,
  ShieldAlert,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Award,
  Sparkles,
  BrainCircuit,
  Eye,
  Printer,
  Share2,
  RotateCw,
  Minus,
  X,
  BookOpen,
  DollarSign,
  Edit,
  PlusCircle,
} from "lucide-react";
import { evaluateStudentRisk } from "@/lib/intelligence/risk/riskEngine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState<
    "overview" | "academic" | "attendance" | "fees" | "discipline" | "documents" | "communication"
  >("academic");

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [isSendNoticeOpen, setIsSendNoticeOpen] = useState(false);
  const [noticeSubject, setNoticeSubject] = useState("");
  const [noticeBody, setNoticeBody] = useState("");
  const [noticeChannel, setNoticeChannel] = useState<"SMS" | "WHATSAPP" | "EMAIL">("SMS");

  // State for adding/updating a subject score
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [subjectNameInput, setSubjectNameInput] = useState("");
  const [subjectCodeInput, setSubjectCodeInput] = useState("");
  const [subjectTeacherInput, setSubjectTeacherInput] = useState("");
  const [catMarksInput, setCatMarksInput] = useState("25");
  const [midMarksInput, setMidMarksInput] = useState("26");
  const [finalMarksInput, setFinalMarksInput] = useState("35");
  const [subjectRemarksInput, setSubjectRemarksInput] = useState("Good grasp of syllabus concepts.");

  useEffect(() => {
    // Find student from store or fallback to first student
    const s = getStudentById(resolvedParams.id) || INITIAL_STUDENTS[0];
    setStudent(s);

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get("tab");
      if (
        tabParam &&
        ["overview", "academic", "attendance", "fees", "discipline", "documents", "communication"].includes(
          tabParam
        )
      ) {
        setActiveTab(tabParam as any);
      }
    }
  }, [resolvedParams.id]);

  if (!student) {
    return (
      <div className="p-8 text-center bg-white rounded-md border border-slate-200">
        <p className="text-sm text-slate-500">Loading student profile...</p>
      </div>
    );
  }

  const handleUploadStudentDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim(),
      type: "PDF",
      fileSize: "1.4 MB",
      uploadedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      url: "#",
    };

    setStudent({
      ...student,
      documents: [newDoc, ...student.documents],
    });
    setIsUploadDocOpen(false);
    setNewDocName("");
    setToastMessage(`Document "${newDoc.name}" uploaded to student file successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSendStudentNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeSubject.trim() || !noticeBody.trim()) return;

    const newComm = {
      id: `comm-${Date.now()}`,
      date: "Just now",
      channel: noticeChannel,
      subject: noticeSubject.trim(),
      body: noticeBody.trim(),
      status: "DELIVERED" as const,
      recipient: `${student.parent.fullName} (${student.parent.phone})`,
    };

    setStudent({
      ...student,
      communications: [newComm, ...student.communications],
    });
    setIsSendNoticeOpen(false);
    setNoticeSubject("");
    setNoticeBody("");
    setToastMessage(`Notice sent to guardian via ${noticeChannel} successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const calculateGradeFromTotal = (total: number) => {
    if (total >= 80) return "A";
    if (total >= 75) return "A-";
    if (total >= 70) return "B+";
    if (total >= 65) return "B";
    if (total >= 60) return "B-";
    if (total >= 50) return "C+";
    if (total >= 40) return "D+";
    return "E";
  };

  const handleAddSubjectGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectNameInput.trim()) return;

    const cat = Number(catMarksInput) || 0;
    const mid = Number(midMarksInput) || 0;
    const finalScore = Number(finalMarksInput) || 0;
    const total = cat + mid + finalScore;
    const grade = calculateGradeFromTotal(total);

    const newSubGrade = {
      subjectName: subjectNameInput.trim(),
      subjectCode: subjectCodeInput.trim().toUpperCase() || "SUB-01",
      teacher: subjectTeacherInput.trim() || "Lead Instructor",
      term1Cat: cat,
      term1Mid: mid,
      term1Final: finalScore,
      grade,
      remarks: subjectRemarksInput.trim(),
    };

    setStudent({
      ...student,
      academic: {
        ...student.academic,
        subjectGrades: [newSubGrade, ...student.academic.subjectGrades],
      },
    });

    setIsAddSubjectModalOpen(false);
    setSubjectNameInput("");
    setSubjectCodeInput("");
    setSubjectTeacherInput("");
    setToastMessage(`Subject "${newSubGrade.subjectName}" record updated successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const riskEval = evaluateStudentRisk(student);
  const isElevated = riskEval.overallRiskLevel !== "LOW";

  const rollNumber = student.admissionNumber.replace("SOP-2024-", "").replace("SOP-2025-", "");

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* =========================================================================
          AKKHOR BREADCRUMB & BRAND SYSTEM IDENTIFIER
         ========================================================================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/dashboard" className="text-slate-600 hover:text-[#ffbc00] transition-colors">
            Home
          </Link>
          <span>-</span>
          <Link href="/students" className="text-slate-600 hover:text-[#ffbc00] transition-colors">
            Students
          </Link>
          <span>-</span>
          <span className="text-[#ffbc00] font-bold">Student Details</span>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          SOP School Management System
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link
          href="/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#042954] hover:text-[#ffbc00] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Students Directory</span>
        </Link>
      </div>

      {/* =========================================================================
          TOP SECTION: 1:1 REPLICATION OF THE AKKHOR SCREENSHOT LAYOUT
          Left: Student Dossier Card (Matching "My Children_01")
          Right: 4 Vibrant KPI Cards (Red, Green, Blue, Cyan)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Student Profile Dossier Card (5 cols on lg) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
            {/* Card Header with Akkhor Window Controls */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">
                Student Profile Dossier
              </h3>
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  type="button"
                  title="Refresh"
                  onClick={() => {
                    setToastMessage("Student records synchronized with SOP database.");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
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

            {/* Dossier Content: Photo on Left, Metadata Table on Right */}
            <div className="p-5">
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                {/* Photo & Quick Actions */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg bg-[#00acc1]/10 border-2 border-[#00acc1] p-1 flex items-center justify-center overflow-hidden shadow-xs relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.admissionNumber}`}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <span
                      className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white shadow-xs ${
                        student.status === "ACTIVE" ? "bg-[#52c41a]" : "bg-[#ffbc00] text-slate-950"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>

                  {/* 4 Icon Action Toolbar (Direct Match to Akkhor Screenshot) */}
                  <div className="flex items-center justify-center gap-3 mt-3 text-slate-500">
                    <button
                      type="button"
                      title="View Full Profile"
                      onClick={() => setActiveTab("overview")}
                      className="p-1.5 hover:text-[#042954] hover:bg-slate-100 rounded transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Print Student ID Card"
                      onClick={() => {
                        window.print();
                      }}
                      className="p-1.5 hover:text-[#042954] hover:bg-slate-100 rounded transition-colors"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Download Student Dossier"
                      onClick={() => {
                        setToastMessage(`Downloading official profile for ${student.firstName} ${student.lastName}...`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="p-1.5 hover:text-[#042954] hover:bg-slate-100 rounded transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Share Dossier"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                          setToastMessage("Student profile URL copied to clipboard.");
                          setTimeout(() => setToastMessage(null), 3000);
                        }
                      }}
                      className="p-1.5 hover:text-[#042954] hover:bg-slate-100 rounded transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 2-Column Metadata Attributes Table (1:1 Akkhor Layout) */}
                <div className="w-full text-xs">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-1.5 pr-2 text-slate-500 font-medium w-28">Name :</td>
                        <td className="py-1.5 font-bold text-slate-900">
                          {student.firstName} {student.middleName} {student.lastName}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 text-slate-500 font-medium">Gender :</td>
                        <td className="py-1.5 text-slate-700 font-semibold">{student.gender}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 text-slate-500 font-medium">Roll :</td>
                        <td className="py-1.5 font-mono text-slate-700 font-bold"># {rollNumber || "2901"}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 text-slate-500 font-medium">Admission ID :</td>
                        <td className="py-1.5 font-mono text-slate-800 font-bold">{student.admissionNumber}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 text-slate-500 font-medium">Admission Date:</td>
                        <td className="py-1.5 text-slate-700">{student.admissionDate}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 text-slate-500 font-medium">Class :</td>
                        <td className="py-1.5 text-slate-900 font-semibold">{student.className}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 text-slate-500 font-medium">Section / Stream :</td>
                        <td className="py-1.5 text-slate-900 font-semibold">{student.streamName}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 text-slate-500 font-medium">Curriculum :</td>
                        <td className="py-1.5">
                          <span className="bg-[#ffbc00]/20 text-[#042954] px-2 py-0.5 rounded font-bold text-[10px]">
                            {student.curriculum}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 Vibrant KPI Metric Blocks (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {/* KPI 1: Red Card - Due Fees */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200/90 p-4 flex items-center justify-between">
              <div className="w-14 h-14 rounded-md bg-[#ff4d4f] flex items-center justify-center text-white shrink-0 shadow-sm">
                <CreditCard className="h-7 w-7" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {student.fees.balance > 0 ? formatKES(student.fees.balance).replace("KES ", "") : "0"}
                </div>
                <div className="text-xs text-slate-500 font-medium">Due Fees (KES)</div>
              </div>
            </div>

            {/* KPI 2: Green Card - Upcoming Exams */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200/90 p-4 flex items-center justify-between">
              <div className="w-14 h-14 rounded-md bg-[#52c41a] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Edit className="h-7 w-7" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {student.academic.subjectGrades.length || 8}
                </div>
                <div className="text-xs text-slate-500 font-medium">Enrolled Subjects</div>
              </div>
            </div>

            {/* KPI 3: Blue Card - Result Published / Current Average */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200/90 p-4 flex items-center justify-between">
              <div className="w-14 h-14 rounded-md bg-[#1890ff] flex items-center justify-center text-white shrink-0 shadow-sm">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {student.academic.currentTermAverage}%
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Result Published (Rank: {student.academic.rank}/{student.academic.totalInClass})
                </div>
              </div>
            </div>

            {/* KPI 4: Cyan Card - Total Paid / Fees Completed */}
            <div className="bg-white rounded-md shadow-xs border border-slate-200/90 p-4 flex items-center justify-between">
              <div className="w-14 h-14 rounded-md bg-[#13c2c2] flex items-center justify-center text-white shrink-0 shadow-sm">
                <DollarSign className="h-7 w-7" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {student.attendance.rate}%
                </div>
                <div className="text-xs text-slate-500 font-medium">Attendance Rate</div>
              </div>
            </div>
          </div>

          {/* Quick AI Intelligence Bar */}
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-md ${isElevated ? "bg-rose-100 text-rose-700" : "bg-[#ffbc00]/20 text-[#042954]"}`}>
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800">SOP AI Diagnostic: </span>
                <span className="text-slate-600">
                  Status: <strong>{riskEval.overallRiskLevel} Risk</strong> ({riskEval.overallScore}/100) • Factor: {riskEval.primaryRiskCategory}
                </span>
              </div>
            </div>
            <Link href="/intelligence">
              <button
                type="button"
                className="px-3 py-1 bg-[#042954] hover:bg-[#073b75] text-white font-bold rounded text-[11px] transition-colors"
              >
                Intelligence Engine
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          AKKHOR NAVIGATION TABS (Golden Yellow #ffbc00 & Midnight Navy #042954)
         ========================================================================= */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto bg-white px-5 pt-3.5 rounded-t-md shadow-2xs">
        <button
          onClick={() => setActiveTab("academic")}
          className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "academic"
              ? "border-b-2 border-[#ffbc00] text-[#042954] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Subjects & Academic Results</span>
          <span className="bg-[#ffbc00] text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
            {student.academic.subjectGrades.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "border-b-2 border-[#ffbc00] text-[#042954] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Student Bio & Guardian
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`pb-3 transition-colors whitespace-nowrap ${
            activeTab === "attendance"
              ? "border-b-2 border-[#ffbc00] text-[#042954] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Attendance ({student.attendance.rate}%)
        </button>
        <button
          onClick={() => setActiveTab("fees")}
          className={`pb-3 transition-colors whitespace-nowrap ${
            activeTab === "fees"
              ? "border-b-2 border-[#ffbc00] text-[#042954] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Fees & Receipts ({student.fees.status})
        </button>
        <button
          onClick={() => setActiveTab("discipline")}
          className={`pb-3 transition-colors whitespace-nowrap ${
            activeTab === "discipline"
              ? "border-b-2 border-[#ffbc00] text-[#042954] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Discipline ({student.discipline.length})
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`pb-3 transition-colors whitespace-nowrap ${
            activeTab === "documents"
              ? "border-b-2 border-[#ffbc00] text-[#042954] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Documents ({student.documents.length})
        </button>
        <button
          onClick={() => setActiveTab("communication")}
          className={`pb-3 transition-colors whitespace-nowrap ${
            activeTab === "communication"
              ? "border-b-2 border-[#ffbc00] text-[#042954] font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Communication Trail
        </button>
      </div>

      {/* =========================================================================
          TAB 1: SUBJECTS & ACADEMIC EVALUATION (The Core Request)
          Features:
          - Akkhor 2-Column or Data Table Layout
          - Subject Performance Matrix with CAT, Mid-Term, Final, and Grade
          - Add / Record Subject Score Form
          - Akkhor Color-Coded Grade Badges
         ========================================================================= */}
      {activeTab === "academic" && (
        <div className="space-y-6 text-xs">
          {/* Top Academic Summary Banner */}
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#042954] text-base flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#ffbc00]" />
                  Curriculum Subject Performance & Evaluation Register
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Term 1 2026 Academic Records • Overall Term Average: <strong>{student.academic.currentTermAverage}%</strong> • Class Standing: <strong>Rank {student.academic.rank}</strong> of {student.academic.totalInClass}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(true)}
                  className="px-4 py-2 bg-[#ffbc00] hover:bg-[#e5a800] text-slate-950 font-bold rounded shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Record Subject Grade</span>
                </button>
              </div>
            </div>

            {/* Term Progression Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 mt-4">
              {student.academic.termTrends.map((t, idx) => (
                <div key={idx} className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{t.term}</span>
                  <div className="text-base font-bold text-slate-900">{t.average}%</div>
                  <div className="text-[10px] text-slate-500">Cohort Avg: {t.classAverage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects Table Card (Akkhor Themed Data Table) */}
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
            {/* Table Header Controls */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#042954]" />
                <h4 className="font-bold text-slate-800 text-sm">
                  Enrolled Subjects & Continuous Assessment Scores
                </h4>
                <span className="bg-[#042954] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {student.academic.subjectGrades.length} Subjects
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <span className="font-semibold text-slate-700">Grading Scale:</span>
                <span className="px-1.5 py-0.5 bg-[#52c41a]/15 text-[#52c41a] font-bold rounded">A (80%+)</span>
                <span className="px-1.5 py-0.5 bg-[#1890ff]/15 text-[#1890ff] font-bold rounded">B (65-79%)</span>
                <span className="px-1.5 py-0.5 bg-[#ffbc00]/25 text-amber-800 font-bold rounded">C (50-64%)</span>
                <span className="px-1.5 py-0.5 bg-[#ff4d4f]/15 text-[#ff4d4f] font-bold rounded">D/E (&lt;50%)</span>
              </div>
            </div>

            {/* Main Subjects Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#042954] text-white font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Subject Name</th>
                    <th className="py-3 px-3">Subject Code</th>
                    <th className="py-3 px-4">Subject Teacher</th>
                    <th className="py-3 px-3 text-center">CAT (30%)</th>
                    <th className="py-3 px-3 text-center">Mid-Term (30%)</th>
                    <th className="py-3 px-3 text-center">Final Exam (40%)</th>
                    <th className="py-3 px-3 text-center">Total</th>
                    <th className="py-3 px-3 text-center">Grade</th>
                    <th className="py-3 px-4">Teacher Remarks</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.academic.subjectGrades.map((sub, idx) => {
                    const totalScore = sub.term1Cat + sub.term1Mid + sub.term1Final;
                    const isGradeA = sub.grade.startsWith("A");
                    const isGradeB = sub.grade.startsWith("B");
                    const isGradeC = sub.grade.startsWith("C");

                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ffbc00]"></span>
                          <span>{sub.subjectName}</span>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-[#042954] text-[11px]">
                          {sub.subjectCode}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">{sub.teacher}</td>
                        <td className="py-3.5 px-3 text-center font-mono font-semibold">{sub.term1Cat}%</td>
                        <td className="py-3.5 px-3 text-center font-mono font-semibold">{sub.term1Mid}%</td>
                        <td className="py-3.5 px-3 text-center font-mono font-semibold">{sub.term1Final}%</td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                          {totalScore}%
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`inline-block font-bold px-2.5 py-0.5 rounded text-[11px] shadow-2xs ${
                              isGradeA
                                ? "bg-[#52c41a] text-white"
                                : isGradeB
                                ? "bg-[#1890ff] text-white"
                                : isGradeC
                                ? "bg-[#ffbc00] text-slate-950"
                                : "bg-[#ff4d4f] text-white"
                            }`}
                          >
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs">{sub.remarks}</td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setToastMessage(`Subject syllabus & learning plan for ${sub.subjectName} retrieved.`);
                              setTimeout(() => setToastMessage(null), 3000);
                            }}
                            className="text-[#042954] hover:text-[#ffbc00] font-bold text-[11px] hover:underline"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary Stats */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between text-slate-500 text-[11px] gap-2">
              <div>
                Showing <strong>{student.academic.subjectGrades.length}</strong> evaluated subjects for Term 1
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/students/subjects"
                  className="text-[#042954] hover:text-[#ffbc00] font-bold hover:underline"
                >
                  Manage Curriculum Subjects Database →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: OVERVIEW & GUARDIAN PROFILE
         ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6 text-xs">
          {/* AI Risk & Early Intervention Diagnostic Card */}
          <div
            className={`p-5 rounded-md border-2 space-y-3 ${
              riskEval.overallRiskLevel === "CRITICAL"
                ? "border-rose-400 bg-rose-50/40"
                : riskEval.overallRiskLevel === "HIGH"
                ? "border-rose-200 bg-rose-50/20"
                : isElevated
                ? "border-amber-200 bg-amber-50/20"
                : "border-[#52c41a]/40 bg-emerald-50/20"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-md ${
                    isElevated ? "bg-rose-100 text-rose-700" : "bg-[#52c41a]/20 text-[#52c41a]"
                  }`}
                >
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    AI Risk Engine Diagnostic
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        riskEval.overallRiskLevel === "CRITICAL"
                          ? "bg-[#ff4d4f] text-white"
                          : riskEval.overallRiskLevel === "HIGH"
                          ? "bg-rose-100 text-rose-800"
                          : isElevated
                          ? "bg-[#ffbc00] text-slate-950"
                          : "bg-[#52c41a] text-white"
                      }`}
                    >
                      {riskEval.overallRiskLevel} RISK (Score: {riskEval.overallScore}/100)
                    </span>
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    Primary Factor: <span className="font-semibold text-slate-700">{riskEval.primaryRiskCategory}</span> • Deterministic Multi-Factor Evaluation
                  </div>
                </div>
              </div>

              <Link href="/intelligence">
                <Button variant="outline" size="sm" className="text-xs h-7 gap-1 border-[#042954] text-[#042954] hover:bg-[#042954] hover:text-white">
                  <span>View School Intelligence</span>
                  <Sparkles className="h-3 w-3 text-[#ffbc00]" />
                </Button>
              </Link>
            </div>

            {isElevated ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Explainable Risk Factors:
                  </span>
                  <ul className="space-y-1 text-slate-700">
                    {riskEval.reasons.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#ff4d4f] font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-900 block">
                    Recommended Pedagogical Intervention:
                  </span>
                  <div className="text-amber-950 font-medium">
                    {riskEval.recommendedInterventions[0] || "Schedule teacher review"}
                  </div>
                  {riskEval.recommendedInterventions[1] && (
                    <div className="text-slate-600 text-[11px] mt-1">
                      Secondary: {riskEval.recommendedInterventions[1]}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#52c41a] flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#52c41a]" />
                <span>Student maintains sound academic progression, regular attendance, and compliant fee status.</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Parent & Emergency Details */}
            <div className="p-6 rounded-md bg-white border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-[#042954] flex items-center gap-2 text-sm border-b border-slate-100 pb-2">
                <Users className="h-4 w-4 text-[#ffbc00]" />
                Parent / Guardian Information
              </h3>
              <div className="space-y-2.5 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Full Name</span>
                  <span className="font-semibold text-slate-900">{student.parent.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Relationship</span>
                  <span className="font-semibold">{student.parent.relationship}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Primary Phone</span>
                  <span className="font-semibold">{student.parent.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Email Address</span>
                  <span className="font-semibold">{student.parent.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Occupation</span>
                  <span className="font-semibold">{student.parent.occupation}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Residential Address</span>
                  <span className="font-semibold">{student.parent.address}</span>
                </div>
              </div>
            </div>

            {/* Medical & Health Records */}
            <div className="p-6 rounded-md bg-white border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-[#042954] flex items-center gap-2 text-sm border-b border-slate-100 pb-2">
                <HeartPulse className="h-4 w-4 text-[#ff4d4f]" />
                Medical & Emergency Profile
              </h3>
              <div className="space-y-2.5 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Blood Group</span>
                  <span className="font-bold text-[#042954]">{student.medicalInfo.bloodGroup}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Allergies</span>
                  <span className="font-semibold text-amber-700">
                    {student.medicalInfo.allergies.length > 0
                      ? student.medicalInfo.allergies.join(", ")
                      : "None reported"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Chronic Conditions</span>
                  <span className="font-semibold">{student.medicalInfo.chronicConditions || "None"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Designated Doctor</span>
                  <span className="font-semibold">{student.medicalInfo.emergencyDoctor}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Emergency Phone</span>
                  <span className="font-bold text-[#ff4d4f]">{student.medicalInfo.emergencyPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ATTENDANCE REGISTER
         ========================================================================= */}
      {activeTab === "attendance" && (
        <div className="space-y-6 text-xs">
          {/* Attendance KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-md bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Attendance Rate</span>
              <div className="text-2xl font-bold text-[#52c41a]">{student.attendance.rate}%</div>
              <div className="text-slate-500 text-[11px]">{student.attendance.present} of {student.attendance.totalDays} Days</div>
            </div>

            <div className="p-4 rounded-md bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Absences</span>
              <div className="text-2xl font-bold text-[#ff4d4f]">{student.attendance.absent}</div>
              <div className="text-slate-500 text-[11px]">Unexcused absences</div>
            </div>

            <div className="p-4 rounded-md bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Lateness</span>
              <div className="text-2xl font-bold text-[#ffbc00]">{student.attendance.late}</div>
              <div className="text-slate-500 text-[11px]">Recorded late arrivals</div>
            </div>

            <div className="p-4 rounded-md bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Threshold Alert</span>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {student.attendance.warningThresholdTriggered ? (
                  <span className="text-[#ff4d4f] flex items-center gap-1 font-bold">
                    <AlertTriangle className="h-4 w-4" /> Triggered (&lt;90%)
                  </span>
                ) : (
                  <span className="text-[#52c41a] flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-4 w-4" /> Good Standing
                  </span>
                )}
              </div>
              <div className="text-slate-500 text-[11px]">Configured at 90%</div>
            </div>
          </div>

          {/* Daily Logs Table */}
          <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h4 className="font-bold text-slate-900">Recent Attendance Register</h4>
              <span className="text-slate-400 text-[11px]">Marked daily by Class Teacher</span>
            </div>

            <div className="divide-y divide-slate-100">
              {student.attendance.recentLogs.map((log, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-900">{log.date}</span>
                    {log.remarks && <span className="text-slate-400 text-[11px]">({log.remarks})</span>}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                      log.status === "PRESENT"
                        ? "bg-[#52c41a]/15 text-[#52c41a]"
                        : log.status === "ABSENT"
                        ? "bg-[#ff4d4f]/15 text-[#ff4d4f]"
                        : log.status === "LATE"
                        ? "bg-[#ffbc00]/25 text-amber-800"
                        : "bg-[#1890ff]/15 text-[#1890ff]"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: FEES & RECEIPTS
         ========================================================================= */}
      {activeTab === "fees" && (
        <div className="space-y-6 text-xs">
          {/* Fee Balance Card */}
          <div className="p-6 rounded-md bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-[#042954] text-sm">Term 1 2026 Fee Account</h3>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  student.fees.status === "PAID"
                    ? "bg-[#52c41a]/15 text-[#52c41a]"
                    : "bg-[#ff4d4f]/15 text-[#ff4d4f]"
                }`}
              >
                {student.fees.status.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Expected Fee</span>
                <div className="text-xl font-bold text-slate-900">{formatKES(student.fees.expectedAmount)}</div>
                <div className="text-slate-500 text-[11px]">Tuition + Meals + Transport</div>
              </div>

              <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Amount Paid</span>
                <div className="text-xl font-bold text-[#52c41a]">{formatKES(student.fees.paidAmount)}</div>
                <div className="text-slate-500 text-[11px]">Via Verified M-Pesa / Bank</div>
              </div>

              <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Outstanding Balance</span>
                <div className="text-xl font-bold text-[#ff4d4f]">{formatKES(student.fees.balance)}</div>
                <div className="text-slate-500 text-[11px]">Due Date: {student.fees.dueDate}</div>
              </div>
            </div>
          </div>

          {/* Transactions & Receipts */}
          <div className="bg-white rounded-md border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h4 className="font-bold text-slate-900">Recorded Receipts & Payments</h4>
              <span className="text-slate-400 text-[11px]">Official School Receipts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#042954] text-white uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Receipt No.</th>
                    <th className="py-2.5 px-4">Amount Paid</th>
                    <th className="py-2.5 px-4">Payment Method</th>
                    <th className="py-2.5 px-4">Reference</th>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Remaining Balance</th>
                    <th className="py-2.5 px-4 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {student.fees.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-[#042954]">{tx.receiptNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{formatKES(tx.amount)}</td>
                      <td className="py-3 px-4">{tx.method}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{tx.reference}</td>
                      <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                      <td className="py-3 px-4 font-semibold text-[#ff4d4f]">{formatKES(tx.balanceAfter)}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setToastMessage(`Official receipt ${tx.receiptNumber} downloaded.`);
                            setTimeout(() => setToastMessage(null), 3500);
                          }}
                          className="text-[#042954] hover:text-[#ffbc00] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: DISCIPLINE
         ========================================================================= */}
      {activeTab === "discipline" && (
        <div className="space-y-4 text-xs">
          <div className="p-6 rounded-md bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="font-bold text-[#042954] text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldAlert className="h-4 w-4 text-[#ffbc00]" />
              Behavioral & Discipline Incidents Log
            </h3>

            {student.discipline.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-md text-slate-500">
                <CheckCircle2 className="h-8 w-8 text-[#52c41a] mx-auto mb-2" />
                <p className="font-semibold text-slate-800">Exemplary Conduct Record</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No behavioral or pastoral incidents logged.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {student.discipline.map((item) => (
                  <div key={item.id} className="py-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.type}</span>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        Severity: {item.severity}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                    <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
                      <span>Action Taken: {item.actionTaken}</span>
                      <span>Reported by: {item.reportedBy} • {item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: DOCUMENTS
         ========================================================================= */}
      {activeTab === "documents" && (
        <div className="p-6 rounded-md bg-white border border-slate-200/90 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#042954] text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#ffbc00]" />
              Student Institutional Documents & Files
            </h3>
            <button
              type="button"
              onClick={() => setIsUploadDocOpen(true)}
              className="px-4 py-1.5 bg-[#ffbc00] hover:bg-[#e5a800] text-slate-950 font-bold rounded shadow-xs text-xs transition-colors"
            >
              Upload Document
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {student.documents.map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{doc.name}</div>
                  <div className="text-slate-400 text-[11px]">{doc.fileSize} • Uploaded on {doc.uploadedAt}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-slate-300 hover:border-[#042954] text-slate-700 hover:text-[#042954]"
                  onClick={() => {
                    setToastMessage(`Downloading official copy of "${doc.name}"...`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: COMMUNICATION TRAIL
         ========================================================================= */}
      {activeTab === "communication" && (
        <div className="p-6 rounded-md bg-white border border-slate-200/90 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#042954] text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#ffbc00]" />
              Parent Communication Trail
            </h3>
            <button
              type="button"
              onClick={() => setIsSendNoticeOpen(true)}
              className="px-4 py-1.5 bg-[#042954] hover:bg-[#073b75] text-white font-bold rounded shadow-xs text-xs transition-colors"
            >
              Send Direct Notice
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {student.communications.map((comm) => (
              <div key={comm.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{comm.subject}</span>
                  <span className="bg-[#042954]/10 text-[#042954] border border-[#042954]/20 px-2 py-0.5 rounded text-[10px] font-bold">
                    {comm.channel} • {comm.status}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{comm.body}</p>
                <div className="text-[10px] text-slate-400">
                  Recipient: {comm.recipient} • Sent: {comm.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RECORD SUBJECT GRADE
         ========================================================================= */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-md bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-[#042954] text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#ffbc00]" />
                Record Continuous Assessment / Subject Grade
              </h3>
              <button
                type="button"
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubjectGrade} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    value={subjectNameInput}
                    onChange={(e) => setSubjectNameInput(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. MAT-801"
                    value={subjectCodeInput}
                    onChange={(e) => setSubjectCodeInput(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900 uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Teacher</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. David Kamau"
                  value={subjectTeacherInput}
                  onChange={(e) => setSubjectTeacherInput(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">CAT (Max 30%)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    required
                    value={catMarksInput}
                    onChange={(e) => setCatMarksInput(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mid-Term (Max 30%)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    required
                    value={midMarksInput}
                    onChange={(e) => setMidMarksInput(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Final Exam (Max 40%)</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    required
                    value={finalMarksInput}
                    onChange={(e) => setFinalMarksInput(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Teacher Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent competency and exam performance."
                  value={subjectRemarksInput}
                  onChange={(e) => setSubjectRemarksInput(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ffbc00] hover:bg-[#e5a800] text-slate-950 font-bold rounded shadow-xs"
                >
                  Save Subject Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-md bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-[#042954] text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#ffbc00]" />
                Upload Student File
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadDocOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadStudentDoc} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Title / Type</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Immunization Certificate or Transfer Letter"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900"
                />
              </div>

              <div className="p-4 rounded border border-dashed border-slate-300 bg-slate-50 text-center space-y-1">
                <Download className="h-6 w-6 text-slate-400 mx-auto rotate-180" />
                <div className="font-semibold text-slate-700">Attach Document File</div>
                <div className="text-[10px] text-slate-400">PDF, JPG or PNG up to 10MB</div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadDocOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ffbc00] hover:bg-[#e5a800] text-slate-950 font-bold rounded shadow-xs"
                >
                  Attach to Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Direct Notice Modal */}
      {isSendNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-md bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-[#042954] text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#ffbc00]" />
                Send Notice to Guardian
              </h3>
              <button
                type="button"
                onClick={() => setIsSendNoticeOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded bg-slate-50 border border-slate-200 text-slate-700 space-y-0.5">
              <div><strong>Recipient:</strong> {student.parent.fullName}</div>
              <div className="text-[11px] text-slate-500">Phone: {student.parent.phone} • Email: {student.parent.email}</div>
            </div>

            <form onSubmit={handleSendStudentNotice} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Academic Consultation Follow-up"
                  value={noticeSubject}
                  onChange={(e) => setNoticeSubject(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Channel</label>
                <select
                  value={noticeChannel}
                  onChange={(e) => setNoticeChannel(e.target.value as any)}
                  className="w-full p-2.5 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900 font-medium"
                >
                  <option value="SMS">SMS Gateway (SOP SYSTEM)</option>
                  <option value="WHATSAPP">WhatsApp Business API</option>
                  <option value="EMAIL">Email</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Message Text</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type notice message..."
                  value={noticeBody}
                  onChange={(e) => setNoticeBody(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ffbc00] text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSendNoticeOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#042954] hover:bg-[#073b75] text-white font-bold rounded shadow-xs"
                >
                  Send Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
