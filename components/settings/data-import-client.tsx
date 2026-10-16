"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Download,
  RefreshCw,
  Database,
  Users,
  Briefcase,
  CalendarCheck,
  Award,
  CreditCard,
  FileText,
  Check,
  Trash2,
  RotateCcw,
  FileCode,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DATASET_SCHEMAS } from "@/lib/migration/migrationService";
import {
  DatasetType,
  ColumnMapping,
  MigrationValidationResult,
  DuplicateStrategy,
  DataImportBatchLog,
} from "@/lib/migration/types";

const STEPS = [
  { id: 1, title: "Dataset Selection" },
  { id: 2, title: "Upload Data" },
  { id: 3, title: "Column Mapping" },
  { id: 4, title: "Data Validation" },
  { id: 5, title: "Preview Records" },
  { id: 6, title: "Execute Import" },
  { id: 7, title: "Audit & Complete" },
];

export function DataImportClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>("STUDENTS");
  const [csvContent, setCsvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("students_batch_2026.xlsx");
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number; type: string } | null>(null);
  const [uploadMode, setUploadMode] = useState<"FILE" | "PASTE">("FILE");

  const [duplicateStrategy, setDuplicateStrategy] = useState<DuplicateStrategy>("SKIP");
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [validationResult, setValidationResult] = useState<MigrationValidationResult | null>(null);

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importSummary, setImportSummary] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Past Import Batches & History
  const [importHistory, setImportHistory] = useState<DataImportBatchLog[]>([]);
  const [isRollingBack, setIsRollingBack] = useState<string | null>(null);
  const [historyFeedback, setHistoryFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentSchema = DATASET_SCHEMAS[selectedDataset];

  // Fetch import history on component mount
  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/migration/import");
      const json = await res.json();
      if (json.success && Array.isArray(json.history)) {
        setImportHistory(json.history);
      }
    } catch {
      // Ignore background history fetch errors
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle template download
  const handleDownloadTemplate = () => {
    const blob = new Blob([currentSchema.sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${selectedDataset.toLowerCase()}_import_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Populate sample data for instant testing
  const handleLoadSampleData = () => {
    setUploadMode("PASTE");
    setCsvContent(currentSchema.sampleCsv);
    setFileBase64(null);
    setFileName(`${selectedDataset.toLowerCase()}_sample_data.csv`);
    setFileMeta(null);
  };

  // Handle disk file selection (.xlsx, .xls, .csv)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setFileName(file.name);
    setFileMeta({
      name: file.name,
      size: file.size,
      type: file.type || (file.name.endsWith(".csv") ? "text/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    });

    const reader = new FileReader();

    if (file.name.toLowerCase().endsWith(".csv")) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvContent(text);
        setFileBase64(null);
      };
      reader.readAsText(file);
    } else {
      // Excel workbooks (.xlsx, .xls)
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64Data = result.includes(",") ? result.split(",")[1] : result;
        setFileBase64(base64Data);
        setCsvContent("");
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 2 -> 3: Parse headers from server to guarantee 100% XLSX & RFC 4180 compatibility
  const handleProceedToMapping = async () => {
    if (!csvContent.trim() && !fileBase64) {
      setErrorMsg("Please upload an Excel (.xlsx) file, select a CSV, or load sample data before continuing.");
      return;
    }
    setErrorMsg(null);
    setIsValidating(true);

    try {
      // Perform initial header extraction via validate endpoint
      const res = await fetch("/api/migration/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetType: selectedDataset,
          csvText: csvContent || undefined,
          fileBase64: fileBase64 || undefined,
          mappings: [], // empty mappings triggers initial header extraction
          duplicateStrategy,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Failed to parse spreadsheet headers");
        return;
      }

      const headers: string[] = json.headers || [];
      if (headers.length === 0) {
        setErrorMsg("The uploaded file does not contain any detected header columns.");
        return;
      }

      setParsedHeaders(headers);

      // Auto-match headers to schema keys or labels
      const initialMap: ColumnMapping[] = currentSchema.columns.map((col) => {
        const match = headers.find(
          (h) =>
            h.toLowerCase() === col.key.toLowerCase() ||
            h.toLowerCase() === col.label.toLowerCase() ||
            h.toLowerCase().replace(/[^a-z0-9]/g, "") === col.key.toLowerCase().replace(/[^a-z0-9]/g, "")
        );
        return {
          sourceColumn: match || "",
          targetField: col.key,
        };
      });

      setColumnMappings(initialMap);
      setCurrentStep(3);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to read spreadsheet contents.");
    } finally {
      setIsValidating(false);
    }
  };

  // Step 3 -> 4: Validate against API with active duplicate strategy
  const handleRunValidation = async () => {
    setIsValidating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/migration/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetType: selectedDataset,
          csvText: csvContent || undefined,
          fileBase64: fileBase64 || undefined,
          mappings: columnMappings,
          duplicateStrategy,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Validation failed");
      } else {
        setValidationResult(json.validation);
        setCurrentStep(4);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error occurred during validation");
    } finally {
      setIsValidating(false);
    }
  };

  // Step 5 -> 6: Execute Import with Real Entity Persistence
  const handleExecuteImport = async () => {
    if (!validationResult) return;
    setIsImporting(true);
    setErrorMsg(null);

    try {
      const validRows = validationResult.previewRows.filter((r) => !r._hasError);

      const res = await fetch("/api/migration/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetType: selectedDataset,
          fileName,
          fileSize: fileMeta?.size || csvContent.length,
          validRows,
          duplicateStrategy,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Import failed");
      } else {
        setImportSummary(json.result);
        setCurrentStep(7);
        fetchHistory(); // Refresh audit history
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Import execution error");
    } finally {
      setIsImporting(false);
    }
  };

  // Rollback / Undo a past batch import
  const handleRollback = async (importId: string) => {
    if (!confirm(`Are you sure you want to rollback import batch '${importId}'? This will safely remove the imported student records created by this batch.`)) {
      return;
    }

    setIsRollingBack(importId);
    setHistoryFeedback(null);

    try {
      const res = await fetch(`/api/migration/import?importId=${encodeURIComponent(importId)}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        setHistoryFeedback(`Rollback failed: ${json.error}`);
      } else {
        setHistoryFeedback(json.result.message);
        fetchHistory(); // Refresh history list
      }
    } catch (err: any) {
      setHistoryFeedback(`Network error during rollback: ${err?.message}`);
    } finally {
      setIsRollingBack(null);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCsvContent("");
    setFileBase64(null);
    setFileMeta(null);
    setValidationResult(null);
    setImportSummary(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
            <Database className="h-5 w-5 text-emerald-600" />
            Institutional Data Migration & Import Center
          </h1>
          <p className="text-xs text-slate-500">
            Super Administrator wizard to import Excel (.xlsx) and CSV spreadsheets into live tenant records with duplicate detection and rollback safety.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="text-xs gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Restart Wizard</span>
        </Button>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center min-w-[650px] justify-between">
          {STEPS.map((s, idx) => {
            const isCompleted = s.id < currentStep;
            const isCurrent = s.id === currentStep;

            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : s.id}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium ${
                      isCurrent
                        ? "text-emerald-900 font-bold"
                        : isCompleted
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-8 mx-2 ${
                      isCompleted ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Select Dataset */}
      {currentStep === 1 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Step 1: Select Target Dataset</h2>
            <p className="text-xs text-slate-500">
              Choose the category of institutional records you are importing from your school spreadsheet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(
              [
                { type: "STUDENTS", icon: Users, title: "Students & Admissions", desc: "Bio data, admission number, class, stream, parent contacts" },
                { type: "STAFF", icon: Briefcase, title: "Staff & Faculty", desc: "Teachers, roles, departments, employment numbers, contacts" },
                { type: "ATTENDANCE", icon: CalendarCheck, title: "Attendance Registers", desc: "Daily class registers & historical absence logs" },
                { type: "GRADES", icon: Award, title: "Exam Scores & CATs", desc: "Continuous assessments, mid-terms & final marks" },
                { type: "FEES", icon: CreditCard, title: "Fee Ledgers & Arrears", desc: "Billed tuition, payments, M-Pesa receipts, balances" },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const isSelected = selectedDataset === item.type;
              return (
                <div
                  key={item.type}
                  onClick={() => setSelectedDataset(item.type)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              variant="emerald"
              onClick={() => setCurrentStep(2)}
              className="gap-2 text-xs"
            >
              <span>Continue to Upload</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Upload Data (Native Excel & CSV Support) */}
      {currentStep === 2 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Step 2: Upload Spreadsheet for {currentSchema.title}
              </h2>
              <p className="text-xs text-slate-500">Supports Microsoft Excel (.xlsx, .xls) and RFC 4180 CSV files.</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="text-xs gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Sample CSV</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSampleData}
                className="text-xs gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Load Demo Dataset</span>
              </Button>
            </div>
          </div>

          {/* Mode Tabs: File Upload vs Raw Paste */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <button
              onClick={() => setUploadMode("FILE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                uploadMode === "FILE"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              📁 Upload Excel or CSV File
            </button>
            <button
              onClick={() => setUploadMode("PASTE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                uploadMode === "PASTE"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              📝 Paste Raw CSV Text
            </button>
          </div>

          {uploadMode === "FILE" ? (
            /* File Drag & Drop Dropzone */
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/20 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
              >
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    Click to select your school file, or drag and drop here
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Accepts <strong>.xlsx</strong>, <strong>.xls</strong>, and <strong>.csv</strong> files (Up to 10MB)
                  </p>
                </div>
              </div>

              {/* Uploaded File Confirmation Badge */}
              {fileMeta && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <FileSpreadsheet className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{fileMeta.name}</div>
                      <span className="text-[10px] text-slate-500">
                        Size: {Math.round(fileMeta.size / 1024)} KB • Ready for extraction
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                    Loaded
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Paste Raw CSV Area */
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Paste or Edit Raw CSV Data
              </label>
              <textarea
                rows={8}
                value={csvContent}
                onChange={(e) => {
                  setCsvContent(e.target.value);
                  setFileBase64(null);
                  setFileMeta(null);
                }}
                placeholder="admissionNumber,firstName,lastName,className,..."
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                SheetJS parses cells with commas in quotes safely without column displacement.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(1)}
              className="text-xs gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button
              variant="emerald"
              size="sm"
              onClick={handleProceedToMapping}
              disabled={isValidating || (!csvContent.trim() && !fileBase64)}
              className="text-xs gap-1.5"
            >
              <span>{isValidating ? "Reading File..." : "Proceed to Column Mapping"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Column Mapping & Duplicate Resolution Policy */}
      {currentStep === 3 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Step 3: Map Columns & Set Conflict Rules</h2>
              <p className="text-xs text-slate-500">
                Pair spreadsheet headers with system fields, and configure how existing students should be handled.
              </p>
            </div>

            {/* Duplicate Strategy Policy Card */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Duplicate ID Conflict Strategy:
              </label>
              <select
                value={duplicateStrategy}
                onChange={(e) => setDuplicateStrategy(e.target.value as DuplicateStrategy)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="SKIP">🛡️ Skip Existing (Only add new learners)</option>
                <option value="UPDATE">🔄 Update Existing (Upsert matching records)</option>
                <option value="REJECT">🛑 Strict Reject (Halt import if duplicates found)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">System Field</th>
                  <th className="py-2.5 px-3">Requirement</th>
                  <th className="py-2.5 px-3">Expected Type</th>
                  <th className="py-2.5 px-3">Source Column in Your File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentSchema.columns.map((col) => {
                  const currentMapping = columnMappings.find((m) => m.targetField === col.key);

                  return (
                    <tr key={col.key} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {col.label}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {col.description}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {col.required ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Required
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        {col.type}
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          value={currentMapping?.sourceColumn || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setColumnMappings((prev) =>
                              prev.map((m) =>
                                m.targetField === col.key ? { ...m, sourceColumn: val } : m
                              )
                            );
                          }}
                          className="w-full max-w-xs text-xs rounded-lg border border-slate-200 p-1.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-medium"
                        >
                          <option value="">-- Do Not Import --</option>
                          {parsedHeaders.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(2)}
              className="text-xs gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button
              variant="emerald"
              size="sm"
              onClick={handleRunValidation}
              disabled={isValidating}
              className="text-xs gap-1.5"
            >
              <span>{isValidating ? "Validating Constraints..." : "Validate Data"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Validation Results */}
      {currentStep === 4 && validationResult && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Step 4: Data Validation Report</h2>
            <p className="text-xs text-slate-500">
              Deterministic validation of data types, constraints, and duplicate detection.
            </p>
          </div>

          {/* Validation Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Total Rows</span>
              <span className="text-2xl font-black text-slate-900">{validationResult.totalRows}</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[11px] text-emerald-700 font-semibold block uppercase">Valid Rows</span>
              <span className="text-2xl font-black text-emerald-700">
                {validationResult.validRowsCount}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[11px] text-amber-700 font-semibold block uppercase">Skipped / Duplicates</span>
              <span className="text-2xl font-black text-amber-700">
                {validationResult.skippedDuplicatesCount || 0}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[11px] text-rose-700 font-semibold block uppercase">Errors Detected</span>
              <span className="text-2xl font-black text-rose-700">
                {validationResult.errorRowsCount}
              </span>
            </div>
          </div>

          {/* Validation Errors Table if any */}
          {validationResult.errors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800">Validation Flags Detected</h3>
              <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl p-2 text-xs bg-slate-50">
                {validationResult.errors.map((err, idx) => (
                  <div key={idx} className="py-1.5 px-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          err.severity === "error"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        Row {err.rowNumber}
                      </span>
                      <span className="font-semibold text-slate-700">{err.field}:</span>
                      <span className="text-slate-600">{err.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(3)}
              className="text-xs gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Mappings</span>
            </Button>
            <Button
              variant="emerald"
              size="sm"
              onClick={() => setCurrentStep(5)}
              className="text-xs gap-1.5"
            >
              <span>Preview Data</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: Preview Records */}
      {currentStep === 5 && validationResult && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Step 5: Preview Transformed Records</h2>
            <p className="text-xs text-slate-500">
              Review records prior to applying database transaction commit.
            </p>
          </div>

          <div className="overflow-x-auto max-h-72 border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2 px-3">Row</th>
                  <th className="py-2 px-3">Status</th>
                  {currentSchema.columns.slice(0, 5).map((col) => (
                    <th key={col.key} className="py-2 px-3">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {validationResult.previewRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={row._hasError ? "bg-rose-50/50 hover:bg-rose-50" : row._isDuplicate ? "bg-amber-50/40" : "hover:bg-slate-50/50"}
                  >
                    <td className="py-2 px-3 font-mono text-slate-400">#{row._rowNum}</td>
                    <td className="py-2 px-3">
                      {row._hasError ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Error
                        </span>
                      ) : row._isDuplicate ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Skip
                        </span>
                      ) : row._isUpdate ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Update
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          New
                        </span>
                      )}
                    </td>
                    {currentSchema.columns.slice(0, 5).map((col) => (
                      <td key={col.key} className="py-2 px-3 text-slate-700 font-medium">
                        {String(row[col.key] || "-")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(4)}
              className="text-xs gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
            <Button
              variant="emerald"
              size="sm"
              onClick={handleExecuteImport}
              disabled={isImporting || validationResult.validRowsCount === 0}
              className="text-xs gap-1.5"
            >
              <span>{isImporting ? "Importing Records into Store..." : `Execute Batch Import (${validationResult.validRowsCount} rows)`}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 7: Completed Audit Summary */}
      {currentStep === 7 && importSummary && (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 text-center animate-in fade-in">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">Data Import Completed & Persisted Successfully</h2>
            <p className="text-xs text-slate-500 mt-1">
              Dataset has been validated, saved into tenant active records, and recorded in the audit trail.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Import Batch ID:</span>
              <span className="font-mono font-semibold text-slate-800">{importSummary.importId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target Dataset:</span>
              <span className="font-semibold text-slate-800">{importSummary.datasetType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">New Records Enrolled:</span>
              <span className="font-bold text-emerald-700">{importSummary.importedCount}</span>
            </div>
            {importSummary.updatedCount !== undefined && importSummary.updatedCount > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Existing Records Updated:</span>
                <span className="font-bold text-blue-700">{importSummary.updatedCount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Timestamp:</span>
              <span className="font-mono text-slate-600">{new Date(importSummary.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs"
            >
              Import Another File
            </Button>
            <Link href="/students">
              <Button variant="emerald" size="sm" className="text-xs">
                View Enrolled Students Directory
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* =========================================================================
          AUDIT & HISTORICAL BATCHES LEDGER WITH 1-CLICK ROLLBACK
         ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Historical Import Batches & Audit Trail</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHistory}
            className="text-[11px] h-7 gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Refresh History
          </Button>
        </div>

        {historyFeedback && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <span>{historyFeedback}</span>
            <button onClick={() => setHistoryFeedback(null)} className="text-xs text-slate-500 hover:text-slate-800">
              Dismiss
            </button>
          </div>
        )}

        {importHistory.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No historical import batches found for this tenant.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2 px-3">Batch ID</th>
                  <th className="py-2 px-3">File Name</th>
                  <th className="py-2 px-3">Dataset</th>
                  <th className="py-2 px-3">Records</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {importHistory.map((batch) => {
                  const isRolledBack = batch.status === "ROLLED_BACK";

                  return (
                    <tr key={batch.importId} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-700">
                        {batch.importId}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-900">
                        {batch.fileName}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-700">
                        {batch.datasetType}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-emerald-700">{batch.importedCount}</span> imported
                        {batch.updatedCount > 0 && ` • ${batch.updatedCount} updated`}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isRolledBack
                              ? "bg-slate-100 text-slate-600 border border-slate-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {isRolledBack ? "ROLLED BACK" : "COMPLETED"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                        {new Date(batch.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {!isRolledBack && batch.createdEntityIds.length > 0 && (
                          <button
                            onClick={() => handleRollback(batch.importId)}
                            disabled={isRollingBack === batch.importId}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors inline-flex items-center gap-1"
                            title="Rollback this batch and delete imported student records"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>{isRollingBack === batch.importId ? "Rolling back..." : "Rollback"}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
