"use client";

import { useState, useEffect } from "react";
import {
  Sliders,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  HelpCircle,
  Percent,
  Calendar,
  Layers,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_CBC_BOUNDARIES,
  DEFAULT_CAMBRIDGE_BOUNDARIES,
  DEFAULT_ASSESSMENT_WEIGHTINGS,
  AcademicConfigData,
} from "@/lib/academics/config";

export default function AcademicSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [curriculum, setCurriculum] = useState<"CBC" | "Cambridge" | "Dual" | "Custom">("Dual");
  const [passMark, setPassMark] = useState<number>(50);
  const [rankingEnabled, setRankingEnabled] = useState<boolean>(true);
  const [attendanceThreshold, setAttendanceThreshold] = useState<number>(90);
  const [termCount, setTermCount] = useState<number>(3);

  const [weightings, setWeightings] = useState([
    { type: "CAT", name: "Continuous Assessment Tests (CATs)", weightPercentage: 30 },
    { type: "MIDTERM", name: "Mid-Term Examination", weightPercentage: 30 },
    { type: "FINALS", name: "End-of-Term Examination", weightPercentage: 40 },
  ]);

  const [boundaries, setBoundaries] = useState(DEFAULT_CBC_BOUNDARIES);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/academics/config");
        if (res.ok) {
          const json = await res.json();
          if (json.config) {
            setCurriculum(json.config.curriculum);
            setPassMark(json.config.passMark);
            setRankingEnabled(json.config.rankingEnabled);
            setAttendanceThreshold(json.config.attendanceThreshold);
            setTermCount(json.config.termCount || 3);
            if (json.config.assessmentWeightings?.length) {
              setWeightings(json.config.assessmentWeightings);
            }
            if (json.config.gradeBoundaries?.length) {
              setBoundaries(json.config.gradeBoundaries);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load academic settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const totalWeight = weightings.reduce((sum, w) => sum + (Number(w.weightPercentage) || 0), 0);
  const isWeightValid = Math.round(totalWeight) === 100;

  const handleWeightChange = (index: number, val: number) => {
    const next = [...weightings];
    next[index].weightPercentage = Number(val);
    setWeightings(next);
  };

  const applyPreset = (preset: "CBC" | "Cambridge") => {
    if (preset === "CBC") {
      setBoundaries(DEFAULT_CBC_BOUNDARIES);
    } else {
      setBoundaries(DEFAULT_CAMBRIDGE_BOUNDARIES);
    }
  };

  const handleSave = async () => {
    if (!isWeightValid) {
      setErrorMessage(`Total assessment weighting must equal exactly 100%. Current total: ${totalWeight}%`);
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/academics/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          curriculum,
          passMark: Number(passMark),
          rankingEnabled,
          attendanceThreshold: Number(attendanceThreshold),
          termCount: Number(termCount),
          assessmentWeightings: weightings,
          gradeBoundaries: boundaries,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.error || "Failed to save settings");
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Network error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        Loading institutional academic configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back button and title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/settings"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Settings</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="h-5 w-5 text-emerald-600" />
            Configurable Academic Engine & Assessment Governance
          </h1>
          <p className="text-xs text-slate-500">
            Define curriculum weighting frameworks, CBC/Cambridge grading boundaries, and ranking rules.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || !isWeightValid}
          variant="emerald"
          className="gap-2 shadow-sm"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Academic Configuration"}</span>
        </Button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Academic configuration successfully saved and applied school-wide.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Curriculum & Framework */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Curriculum Structure</h2>
          </div>
          <p className="text-xs text-slate-500">
            Select the pedagogical structure active at your institution.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Institutional Curriculum Model
              </label>
              <select
                value={curriculum}
                onChange={(e) => setCurriculum(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Dual">Dual Curriculum (CBC & Cambridge International)</option>
                <option value="CBC">Competency-Based Curriculum (CBC Kenya)</option>
                <option value="Cambridge">Cambridge International Assessment (CAIE)</option>
                <option value="Custom">Custom Institutional Syllabus</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Terms Per Academic Year
                </label>
                <input
                  type="number"
                  min="2"
                  max="4"
                  value={termCount}
                  onChange={(e) => setTermCount(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-200 p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pass Mark Threshold (%)
                </label>
                <input
                  type="number"
                  min="30"
                  max="70"
                  value={passMark}
                  onChange={(e) => setPassMark(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-200 p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Attendance Warning Alert Threshold (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="75"
                  max="95"
                  value={attendanceThreshold}
                  onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="text-xs font-mono font-bold text-emerald-700 w-12 text-right">
                  {attendanceThreshold}%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Students dropping below this percentage trigger automated chronic absenteeism alerts.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Enable Class Position / Ranking
                </span>
                <span className="text-[11px] text-slate-400">
                  Allow student rankings (1st, 2nd, etc.) on report forms
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rankingEnabled}
                  onChange={(e) => setRankingEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 2. Assessment Weightings */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Assessment Term Weightings</h2>
            </div>
            <div
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                isWeightValid
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              Total: {totalWeight}%
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Define how continuous assessments, mid-terms, and final examinations are aggregated for term marks. Total must equal 100%.
          </p>

          <div className="space-y-3 pt-2">
            {weightings.map((item, idx) => (
              <div
                key={item.type}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Code: {item.type}</div>
                </div>
                <div className="flex items-center gap-1.5 w-28">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.weightPercentage}
                    onChange={(e) => handleWeightChange(idx, Number(e.target.value))}
                    className="w-16 text-center text-xs font-bold rounded border border-slate-300 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-500">%</span>
                </div>
              </div>
            ))}

            {!isWeightValid && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>
                  The sum of assessment weights is {totalWeight}%. Please adjust weights to total exactly 100%.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Grading Scales & Grade Boundaries */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              Grading Scales & Performance Bands
            </h2>
            <p className="text-xs text-slate-500">
              Customize grade descriptors, cut-off percentages, and points used for institutional report generation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Load Template:</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => applyPreset("CBC")}
              className="text-xs h-7 gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              CBC Bands
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => applyPreset("Cambridge")}
              className="text-xs h-7 gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Cambridge A*-U
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50/75">
                <th className="py-2.5 px-3">Grade Code</th>
                <th className="py-2.5 px-3">Score Range (%)</th>
                <th className="py-2.5 px-3">Grade Points</th>
                <th className="py-2.5 px-3">Institutional Remark / Descriptor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {boundaries.map((b, idx) => (
                <tr key={b.grade} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {b.grade}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">
                    {b.min}% – {b.max}%
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                    {b.points} pts
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {b.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
