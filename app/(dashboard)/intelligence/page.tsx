"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  BrainCircuit,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  CreditCard,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Database,
  ArrowRight,
  HelpCircle,
  Clock,
  Search,
  Filter,
  Users,
  Award,
  Layers,
  CalendarCheck,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StructuredAIAnalysis } from "@/lib/ai/types";
import { StudentRiskEvaluation } from "@/lib/intelligence/risk/riskEngine";

export default function SchoolIntelligencePage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "risks" | "academics" | "rag">("chat");

  // Live data states
  const [schoolSummary, setSchoolSummary] = useState<any | null>(null);
  const [atRiskList, setAtRiskList] = useState<StudentRiskEvaluation[]>([]);
  const [classMetrics, setClassMetrics] = useState<any[]>([]);
  const [subjectMetrics, setSubjectMetrics] = useState<any[]>([]);

  // AI query states
  const [isQuerying, setIsQuerying] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<StructuredAIAnalysis | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Risk filter states
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("ALL");
  const [riskSearchQuery, setRiskSearchQuery] = useState<string>("");

  // RAG search states
  const [ragQuery, setRagQuery] = useState("");
  const [ragCategory, setRagCategory] = useState("ALL");
  const [ragResults, setRagResults] = useState<any[]>([]);
  const [isSearchingRag, setIsSearchingRag] = useState(false);

  const samplePrompts = [
    "Which students are falling academically this term?",
    "Which classes have the highest fee arrears?",
    "Which students have persistent attendance problems?",
    "What does our student discipline policy say regarding suspension?",
    "Summarize this month's school performance into an executive report.",
  ];

  // Load baseline summary and at-risk rosters on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [sumRes, riskRes, acadRes] = await Promise.all([
          fetch("/api/intelligence/school-summary"),
          fetch("/api/intelligence/students-at-risk"),
          fetch("/api/intelligence/academic"),
        ]);

        if (sumRes.ok) {
          const sumJson = await sumRes.json();
          setSchoolSummary(sumJson.data);
        }

        if (riskRes.ok) {
          const riskJson = await riskRes.json();
          setAtRiskList(riskJson.data || []);
        }

        if (acadRes.ok) {
          const acadJson = await acadRes.json();
          setClassMetrics(acadJson.data?.classPerformances || []);
          setSubjectMetrics(acadJson.data?.subjectPerformances || []);
        }
      } catch (err) {
        console.error("Failed to load intelligence baseline:", err);
      }
    }

    loadInitialData();
  }, []);

  // Handle AI analysis query
  const handleRunQuery = async (customQuery?: string) => {
    const q = (customQuery || query).trim();
    if (!q) return;

    setIsQuerying(true);
    setQueryError(null);

    try {
      const res = await fetch("/api/intelligence/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      const json = await res.json();
      if (!res.ok) {
        setQueryError(json.error || "Failed to process inquiry");
      } else {
        setAiAnalysis(json.analysis);
      }
    } catch (err: any) {
      setQueryError(err?.message || "Network error processing AI query");
    } finally {
      setIsQuerying(false);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setQuery(promptText);
    handleRunQuery(promptText);
  };

  // Handle RAG search
  const handleSearchPolicies = async () => {
    if (!ragQuery.trim()) return;
    setIsSearchingRag(true);

    try {
      const res = await fetch("/api/intelligence/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `policy: ${ragQuery}`,
        }),
      });

      const json = await res.json();
      if (res.ok && json.analysis?.observedData?.records) {
        setRagResults(json.analysis.observedData.records);
      }
    } catch (err) {
      console.error("RAG search failed:", err);
    } finally {
      setIsSearchingRag(false);
    }
  };

  // Filtered at-risk roster
  const filteredAtRisk = atRiskList.filter((s) => {
    if (riskLevelFilter !== "ALL" && s.overallRiskLevel !== riskLevelFilter) {
      return false;
    }
    if (riskSearchQuery.trim()) {
      const term = riskSearchQuery.toLowerCase();
      return (
        s.studentName.toLowerCase().includes(term) ||
        s.admissionNumber.toLowerCase().includes(term) ||
        s.className.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Flagship Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-800/60 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
              <BrainCircuit className="h-3.5 w-3.5 text-emerald-400" />
              <span>Multi-Tenant Intelligence Engine • Relational Tool Calling & Policy RAG</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              SOP School Intelligence & Risk Detection
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Deterministic calculations, multi-factor risk diagnostics, and authorized data tools. The AI answers strictly from verified PostgreSQL school records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="emerald"
              size="sm"
              onClick={() => handleSelectPrompt("Summarize this month's school performance into an executive report.")}
              className="gap-2 shadow-md text-xs font-semibold"
            >
              <FileText className="h-4 w-4" />
              <span>Executive Briefing</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Macro Institutional KPIs */}
      {schoolSummary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Enrollment</span>
              <Users className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-black text-slate-900">{schoolSummary.totalStudents}</div>
            <span className="text-[11px] text-slate-500">Across {schoolSummary.classesCount} classes</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Academic Mean</span>
              <Award className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-600">
              {schoolSummary.academics.schoolMean}%
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              Pass Rate: {schoolSummary.academics.passRate}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Attendance Rate</span>
              <CalendarCheck className="h-3.5 w-3.5 text-teal-600" />
            </div>
            <div className="text-xl font-black text-teal-700">
              {schoolSummary.attendance.schoolAttendanceRate}%
            </div>
            <span className="text-[11px] text-slate-500">
              {schoolSummary.attendance.totalAbsences} absences logged
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Tuition Arrears</span>
              <CreditCard className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-700 font-mono">
              KSh {schoolSummary.finance.totalOutstanding.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">
              {schoolSummary.finance.collectionRate}% collected
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">At-Risk Learners</span>
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            </div>
            <div className="text-xl font-black text-rose-600">
              {schoolSummary.risks.totalAtRisk}
            </div>
            <span className="text-[11px] text-rose-600 font-semibold">
              {schoolSummary.risks.criticalCount} Critical • {schoolSummary.risks.highCount} High
            </span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("chat")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "chat"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          AI Assistant & Natural Language Analytics
        </button>
        <button
          onClick={() => setActiveTab("risks")}
          className={`pb-2.5 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "risks"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>Automated Risk Detection</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
            {atRiskList.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("academics")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "academics"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Academic & Departmental Breakdown
        </button>
        <button
          onClick={() => setActiveTab("rag")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "rag"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Policy Document RAG Search
        </button>
      </div>

      {/* TAB 1: AI ASSISTANT & TOOL CALLING */}
      {activeTab === "chat" && (
        <div className="space-y-6">
          {/* Natural Language Query Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="relative">
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask any question about academic performance, attendance anomalies, fee arrears, or policies..."
                className="w-full p-4 pr-28 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50 resize-none text-slate-900 placeholder:text-slate-400"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <Button
                  onClick={() => handleRunQuery()}
                  disabled={isQuerying || !query.trim()}
                  variant="emerald"
                  size="sm"
                  className="gap-2 shadow-sm text-xs font-semibold"
                >
                  <span>{isQuerying ? "Analyzing Data..." : "Execute Query"}</span>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Prompt Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Recommended Authorized Inquiries:
              </span>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPrompt(p)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-slate-700 transition-colors text-left"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {queryError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{queryError}</span>
            </div>
          )}

          {/* Structured Explainable AI Response */}
          {aiAnalysis && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 animate-in fade-in-50 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Intelligence Response &amp; Analysis
                    </h3>
                    <div className="text-[11px] text-slate-500 italic">
                      Query: &quot;{aiAnalysis.query}&quot;
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded font-bold border border-emerald-200">
                    Tools: {aiAnalysis.toolsInvoked.join(", ")}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                    Confidence: {Math.round(aiAnalysis.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* 1. OBSERVED DATA */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Database className="h-3.5 w-3.5 text-emerald-600" />
                  <span>1. Observed Data ({aiAnalysis.observedData.title})</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(aiAnalysis.observedData.metrics).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                        {key}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{String(val)}</span>
                    </div>
                  ))}
                </div>

                {/* Records Table if present */}
                {aiAnalysis.observedData.records && aiAnalysis.observedData.records.length > 0 && (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl mt-3">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr>
                          {Object.keys(aiAnalysis.observedData.records[0]).map((colKey) => (
                            <th key={colKey} className="py-2 px-3">
                              {colKey}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {aiAnalysis.observedData.records.map((rec, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            {Object.values(rec).map((val: any, cIdx) => (
                              <td key={cIdx} className="py-2 px-3 text-slate-700 font-medium">
                                {typeof val === "string" && val.includes("HIGH") ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                                    {val}
                                  </span>
                                ) : typeof val === "string" && val.includes("MEDIUM") ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                    {val}
                                  </span>
                                ) : (
                                  String(val)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 2. ROOT-CAUSE ANALYSIS */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Analytical Breakdown
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {aiAnalysis.analysis.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. INTERPRETATION */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  3. Governance &amp; Policy Interpretation
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {aiAnalysis.interpretation}
                </p>
              </div>

              {/* 4. RECOMMENDED INTERVENTIONS */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  4. Recommended Actionable Interventions
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aiAnalysis.recommendedAction.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Stamp */}
              <div className="flex items-center gap-2 pt-3 text-[11px] text-slate-400 border-t border-slate-100 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Deterministic query verified against PostgreSQL tenant database (school-sop-001). Zero hallucination.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MULTI-FACTOR RISK ROSTER */}
      {activeTab === "risks" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  Deterministic Multi-Factor Student Risk Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Explaining risk levels synthesized from Academic decline, Attendance truancy, Fee balances, and Disciplinary logs.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search learner..."
                    value={riskSearchQuery}
                    onChange={(e) => setRiskSearchQuery(e.target.value)}
                    className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44"
                  />
                </div>

                <select
                  value={riskLevelFilter}
                  onChange={(e) => setRiskLevelFilter(e.target.value)}
                  className="text-xs rounded-lg border border-slate-200 p-1.5 bg-slate-50 font-semibold"
                >
                  <option value="ALL">All Risk Levels</option>
                  <option value="CRITICAL">Critical Only</option>
                  <option value="HIGH">High Only</option>
                  <option value="MEDIUM">Medium Only</option>
                </select>
              </div>
            </div>

            {/* Student Risk Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAtRisk.map((student) => (
                <div
                  key={student.studentId}
                  className={`p-4 rounded-xl border-2 space-y-3 ${
                    student.overallRiskLevel === "CRITICAL"
                      ? "border-rose-400 bg-rose-50/30"
                      : student.overallRiskLevel === "HIGH"
                      ? "border-rose-200 bg-rose-50/20"
                      : "border-amber-200 bg-amber-50/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>{student.studentName}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ({student.admissionNumber})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {student.className} • Stream: {student.streamName}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.overallRiskLevel === "CRITICAL"
                            ? "bg-rose-600 text-white"
                            : student.overallRiskLevel === "HIGH"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {student.overallRiskLevel} RISK
                      </span>
                    </div>
                  </div>

                  {/* Primary Category & Observed Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-white/70 border border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Current Avg</span>
                      <span className="font-bold text-slate-800">
                        {student.observedMetrics.academicAverage}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Attendance</span>
                      <span
                        className={`font-bold ${
                          student.observedMetrics.attendanceRate < 90
                            ? "text-rose-600"
                            : "text-slate-800"
                        }`}
                      >
                        {student.observedMetrics.attendanceRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Fee Balance</span>
                      <span
                        className={`font-bold font-mono ${
                          student.observedMetrics.feeBalance > 20000
                            ? "text-amber-700"
                            : "text-slate-800"
                        }`}
                      >
                        KSh {student.observedMetrics.feeBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Reasons Breakdown */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Explainable Risk Reasons:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {student.reasons.map((r, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Interventions */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Recommended Action:
                    </span>
                    <div className="text-xs text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                      {student.recommendedInterventions[0] || "Review student dossier with guidance counselor"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC & DEPARTMENTAL BREAKDOWN */}
      {activeTab === "academics" && (
        <div className="space-y-6">
          {/* Class Comparisons */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Class Performance &amp; Attendance Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                    <th className="py-2.5 px-3">Class / Grade</th>
                    <th className="py-2.5 px-3">Curriculum</th>
                    <th className="py-2.5 px-3">Enrolled</th>
                    <th className="py-2.5 px-3">Academic Average</th>
                    <th className="py-2.5 px-3">Attendance Rate</th>
                    <th className="py-2.5 px-3">At-Risk Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classMetrics.map((cls) => (
                    <tr key={cls.classId} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{cls.className}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-600">{cls.curriculum}</td>
                      <td className="py-2.5 px-3 text-slate-700">{cls.enrolledCount} learners</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700 font-mono">
                        {cls.classAverage}%
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">
                        {cls.attendanceRate}%
                      </td>
                      <td className="py-2.5 px-3">
                        {cls.atRiskCount > 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            {cls.atRiskCount} flagged
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Departmental Subject Metrics */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Departmental Subject Performance vs Benchmark
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {subjectMetrics.map((sub) => {
                const diff = Math.round((sub.averageScore - sub.targetBenchmark) * 10) / 10;
                return (
                  <div
                    key={sub.subjectId}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">{sub.code}</span>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        {sub.department}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{sub.name}</div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-lg font-black text-slate-900">
                        {sub.averageScore}%
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          diff >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {diff >= 0 ? `+${diff}%` : `${diff}%`} vs Target ({sub.targetBenchmark}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POLICY DOCUMENT RAG KNOWLEDGE BASE */}
      {activeTab === "rag" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              Institutional Policy &amp; Regulatory RAG Knowledge Base
            </h3>
            <p className="text-xs text-slate-500">
              Search codified school policies, promotion requirements, and disciplinary procedures using semantic vector retrieval.
            </p>
          </div>

          {/* Search Box */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Ask about suspension rules, pass marks, CAT weightings, fee deadlines..."
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchPolicies()}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <Button
              variant="emerald"
              size="sm"
              onClick={handleSearchPolicies}
              disabled={isSearchingRag || !ragQuery.trim()}
              className="text-xs gap-1.5"
            >
              <span>{isSearchingRag ? "Searching..." : "Search Policies"}</span>
            </Button>
          </div>

          {/* Results Display */}
          {ragResults.length > 0 && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Top Matched Policy Excerpts:
              </span>
              <div className="space-y-3">
                {ragResults.map((rec: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rec.Document}</span>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Relevance: {rec.Relevance}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold">{rec.Section}</div>
                    <p className="text-slate-700 leading-relaxed italic">{rec.Excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
