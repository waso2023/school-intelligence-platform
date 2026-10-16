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
  >("overview");

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [isSendNoticeOpen, setIsSendNoticeOpen] = useState(false);
  const [noticeSubject, setNoticeSubject] = useState("");
  const [noticeBody, setNoticeBody] = useState("");
  const [noticeChannel, setNoticeChannel] = useState<"SMS" | "WHATSAPP" | "EMAIL">("SMS");

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
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
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

  const riskEval = evaluateStudentRisk(student);
  const isElevated = riskEval.overallRiskLevel !== "LOW";

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link
          href="/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Students Directory</span>
        </Link>
      </div>

      {/* Student Profile Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={student.photoUrl}
              alt={`${student.firstName} ${student.lastName}`}
              className="h-24 w-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
            />
            <span
              className={`absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white shadow-xs ${
                student.status === "ACTIVE" ? "bg-emerald-600" : "bg-amber-600"
              }`}
            >
              {student.status}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">
                {student.firstName} {student.middleName} {student.lastName}
              </h1>
              <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                {student.admissionNumber}
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">
                {student.curriculum}
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-3">
              <span>{student.className} • Stream: {student.streamName}</span>
              <span>•</span>
              <span>Gender: {student.gender}</span>
              <span>•</span>
              <span>DOB: {student.dateOfBirth}</span>
            </p>

            <p className="text-[11px] text-slate-400">
              Admitted: {student.admissionDate} • Parent: {student.parent.fullName} ({student.parent.phone})
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div className="text-center px-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Term Avg</span>
            <span className="text-lg font-bold text-slate-900">{student.academic.currentTermAverage}%</span>
          </div>
          <div className="text-center px-3 border-l border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance</span>
            <span className="text-lg font-bold text-emerald-600">{student.attendance.rate}%</span>
          </div>
          <div className="text-center px-3 border-l border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee Balance</span>
            <span className={`text-lg font-bold ${student.fees.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {formatKES(student.fees.balance)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (7 Required Tabs) */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("academic")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "academic"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Academic & Results
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "attendance"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Attendance ({student.attendance.rate}%)
        </button>
        <button
          onClick={() => setActiveTab("fees")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "fees"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Fees & Receipts
        </button>
        <button
          onClick={() => setActiveTab("discipline")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "discipline"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Discipline ({student.discipline.length})
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "documents"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Documents ({student.documents.length})
        </button>
        <button
          onClick={() => setActiveTab("communication")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "communication"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Communication Log
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
            {/* AI Risk & Early Intervention Diagnostic Card */}
            <div
              className={`p-5 rounded-2xl border-2 space-y-3 ${
                riskEval.overallRiskLevel === "CRITICAL"
                  ? "border-rose-400 bg-rose-50/40"
                  : riskEval.overallRiskLevel === "HIGH"
                  ? "border-rose-200 bg-rose-50/20"
                  : isElevated
                  ? "border-amber-200 bg-amber-50/20"
                  : "border-emerald-200 bg-emerald-50/20"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-xl ${
                      isElevated ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    <BrainCircuit className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      AI Risk Engine Diagnostic
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          riskEval.overallRiskLevel === "CRITICAL"
                            ? "bg-rose-600 text-white"
                            : riskEval.overallRiskLevel === "HIGH"
                            ? "bg-rose-100 text-rose-800"
                            : isElevated
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
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
                  <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                    <span>View School Intelligence</span>
                    <Sparkles className="h-3 w-3 text-emerald-600" />
                  </Button>
                </Link>
              </div>

              {isElevated ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Explainable Risk Factors:
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {riskEval.reasons.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                      Recommended Pedagogical Intervention:
                    </span>
                    <div className="text-emerald-900 font-medium">
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
                <div className="text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Student maintains sound academic progression, regular attendance, and compliant fee status.</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Parent & Emergency Details */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-emerald-600" />
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
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <HeartPulse className="h-4 w-4 text-emerald-600" />
              Medical & Emergency Profile
            </h3>
            <div className="space-y-2.5 text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Blood Group</span>
                <span className="font-bold text-emerald-700">{student.medicalInfo.bloodGroup}</span>
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
                <span className="font-bold text-rose-600">{student.medicalInfo.emergencyPhone}</span>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACADEMIC & RESULTS TAB */}
      {activeTab === "academic" && (
        <div className="space-y-6 text-xs">
          {/* Academic Banner & Trends */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" />
                  Academic Performance & Term Progress
                </h3>
                <p className="text-slate-500">
                  Current Term Average: {student.academic.currentTermAverage}% • Rank: {student.academic.rank} of {student.academic.totalInClass}
                </p>
              </div>

              {student.academic.trend === "DOWN" ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                  <TrendingDown className="h-4 w-4" />
                  <span>Academic Decline Flagged by AI</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  <TrendingUp className="h-4 w-4" />
                  <span>Positive Academic Trajectory</span>
                </div>
              )}
            </div>

            {/* Term Progression Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {student.academic.termTrends.map((t, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">{t.term}</span>
                  <div className="text-base font-bold text-slate-900">{t.average}%</div>
                  <div className="text-[10px] text-slate-500">Class Avg: {t.classAverage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Term Subjects Grade Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-900">Current Term Subject Evaluation</h4>
              <span className="text-slate-400 text-[11px]">Term 1 2026 CBC Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Subject</th>
                    <th className="py-2.5 px-4">Teacher</th>
                    <th className="py-2.5 px-3">CAT (30%)</th>
                    <th className="py-2.5 px-3">Mid (30%)</th>
                    <th className="py-2.5 px-3">Final (40%)</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {student.academic.subjectGrades.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {sub.subjectName}
                        <span className="text-[10px] text-slate-400 font-mono ml-1.5">[{sub.subjectCode}]</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{sub.teacher}</td>
                      <td className="py-3 px-3">{sub.term1Cat}%</td>
                      <td className="py-3 px-3">{sub.term1Mid}%</td>
                      <td className="py-3 px-3 font-semibold">{sub.term1Final}%</td>
                      <td className="py-3 px-3">
                        <span className="font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{sub.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ATTENDANCE TAB */}
      {activeTab === "attendance" && (
        <div className="space-y-6 text-xs">
          {/* Attendance KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Attendance Rate</span>
              <div className="text-2xl font-bold text-emerald-600">{student.attendance.rate}%</div>
              <div className="text-slate-500 text-[11px]">{student.attendance.present} of {student.attendance.totalDays} Days</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Absences</span>
              <div className="text-2xl font-bold text-rose-600">{student.attendance.absent}</div>
              <div className="text-slate-500 text-[11px]">Unexcused absences</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Lateness</span>
              <div className="text-2xl font-bold text-amber-600">{student.attendance.late}</div>
              <div className="text-slate-500 text-[11px]">Recorded late arrivals</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Threshold Alert</span>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {student.attendance.warningThresholdTriggered ? (
                  <span className="text-rose-600 flex items-center gap-1 font-bold">
                    <AlertTriangle className="h-4 w-4" /> Triggered (&lt;90%)
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-4 w-4" /> Good Standing
                  </span>
                )}
              </div>
              <div className="text-slate-500 text-[11px]">Configured at 90%</div>
            </div>
          </div>

          {/* Daily Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
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
                    className={`px-2.5 py-0.5 rounded font-semibold text-[10px] ${
                      log.status === "PRESENT"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : log.status === "ABSENT"
                        ? "bg-rose-50 text-rose-800 border border-rose-200"
                        : log.status === "LATE"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-blue-50 text-blue-800 border border-blue-200"
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

      {/* 4. FEES & RECEIPTS TAB */}
      {activeTab === "fees" && (
        <div className="space-y-6 text-xs">
          {/* Fee Balance Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Term 1 2026 Fee Account</h3>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  student.fees.status === "PAID"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-amber-50 text-amber-900 border border-amber-200"
                }`}
              >
                {student.fees.status.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Expected Fee</span>
                <div className="text-xl font-bold text-slate-900">{formatKES(student.fees.expectedAmount)}</div>
                <div className="text-slate-500 text-[11px]">Tuition + Meals + Transport</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Amount Paid</span>
                <div className="text-xl font-bold text-emerald-600">{formatKES(student.fees.paidAmount)}</div>
                <div className="text-slate-500 text-[11px]">Via Verified M-Pesa / Bank</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Outstanding Balance</span>
                <div className="text-xl font-bold text-rose-600">{formatKES(student.fees.balance)}</div>
                <div className="text-slate-500 text-[11px]">Due Date: {student.fees.dueDate}</div>
              </div>
            </div>
          </div>

          {/* Transactions & Receipts */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-900">Recorded Receipts & Payments</h4>
              <span className="text-slate-400 text-[11px]">Official School Receipts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
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
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{tx.receiptNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{formatKES(tx.amount)}</td>
                      <td className="py-3 px-4">{tx.method}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{tx.reference}</td>
                      <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                      <td className="py-3 px-4 font-semibold text-rose-600">{formatKES(tx.balanceAfter)}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setToastMessage(`Official receipt ${tx.receiptNumber} downloaded.`);
                            setTimeout(() => setToastMessage(null), 3500);
                          }}
                          className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
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

      {/* 5. DISCIPLINE TAB */}
      {activeTab === "discipline" && (
        <div className="space-y-4 text-xs">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-600" />
              Behavioral & Discipline Incidents Log
            </h3>

            {student.discipline.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
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

      {/* 6. DOCUMENTS TAB */}
      {activeTab === "documents" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              Student Institutional Documents & Files
            </h3>
            <Button
              variant="emerald"
              size="sm"
              onClick={() => setIsUploadDocOpen(true)}
            >
              Upload Document
            </Button>
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
                  className="gap-1.5"
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

      {/* 7. COMMUNICATION TAB */}
      {activeTab === "communication" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              Parent Communication Trail
            </h3>
            <Button
              variant="emerald"
              size="sm"
              onClick={() => setIsSendNoticeOpen(true)}
            >
              Send Direct Notice
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {student.communications.map((comm) => (
              <div key={comm.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{comm.subject}</span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
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

      {/* Upload Document Modal */}
      {isUploadDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
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
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center space-y-1">
                <Download className="h-6 w-6 text-slate-400 mx-auto rotate-180" />
                <div className="font-semibold text-slate-700">Attach Document File</div>
                <div className="text-[10px] text-slate-400">PDF, JPG or PNG up to 10MB</div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadDocOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm">
                  Attach to Student
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Direct Notice Modal */}
      {isSendNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
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

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-0.5">
              <div><strong>Recipient:</strong> {student.parent.fullName}</div>
              <div className="text-[11px] text-slate-500">Phone: {student.parent.phone} • Email: {student.parent.email}</div>
            </div>

            <form onSubmit={handleSendStudentNotice} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pastoral Consultation Follow-up"
                  value={noticeSubject}
                  onChange={(e) => setNoticeSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Channel</label>
                <select
                  value={noticeChannel}
                  onChange={(e) => setNoticeChannel(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                >
                  <option value="SMS">SMS Gateway (SOPACADEMY)</option>
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
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsSendNoticeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm">
                  Send Notice
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
