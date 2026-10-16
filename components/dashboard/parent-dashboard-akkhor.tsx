"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Eye,
  Printer,
  Download,
  Share2,
  RotateCw,
  Minus,
  X,
  CreditCard,
  GraduationCap,
  FileEdit,
  DollarSign,
  Search,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

export function ParentDashboardAkkhor() {
  const [expenseSearchId, setExpenseSearchId] = useState("");
  const [expenseSearchDate, setExpenseSearchDate] = useState("");

  const expenses = [
    {
      id: "# 3055",
      type: "Salary",
      amount: "$300.00",
      status: "Due",
      email: "kazifahim93@gmail.com",
      date: "20/06/2026",
    },
    {
      id: "# 3056",
      type: "Exam Fee",
      amount: "$500.00",
      status: "Paid",
      email: "kazifahim93@gmail.com",
      date: "20/06/2026",
    },
    {
      id: "# 3057",
      type: "Library Fee",
      amount: "$900.00",
      status: "Paid",
      email: "kazifahim93@gmail.com",
      date: "20/06/2026",
    },
    {
      id: "# 3058",
      type: "Class Test Fee",
      amount: "$300.00",
      status: "Due",
      email: "kazifahim93@gmail.com",
      date: "20/06/2026",
    },
    {
      id: "# 3059",
      type: "Exam Fee",
      amount: "$500.00",
      status: "Paid",
      email: "kazifahim93@gmail.com",
      date: "20/06/2026",
    },
  ];

  const filteredExpenses = expenses.filter((e) => {
    const matchesId = !expenseSearchId || e.id.toLowerCase().includes(expenseSearchId.toLowerCase());
    const matchesDate = !expenseSearchDate || e.date.includes(expenseSearchDate);
    return matchesId && matchesDate;
  });

  return (
    <div className="space-y-5">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/dashboard" className="text-slate-600 hover:text-amber-500 transition-colors">
          Home
        </Link>
        <span>-</span>
        <span className="text-amber-500 font-semibold">Parents</span>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================================
            LEFT COLUMN (5 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: My Children_01 */}
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
            {/* Card Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">My Children_01</h3>
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  type="button"
                  title="Refresh"
                  className="p-1 hover:text-emerald-500 transition-colors"
                >
                  <RotateCw className="h-3.5 w-3.5 text-emerald-500" />
                </button>
                <button
                  type="button"
                  title="Minimize"
                  className="p-1 hover:text-amber-500 transition-colors"
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

            {/* Card Body */}
            <div className="p-5 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              {/* Left: Avatar Block */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-32 h-32 rounded bg-[#00acc1] flex items-center justify-center overflow-hidden shadow-xs relative">
                  {/* High fidelity Female Student Vector Avatar */}
                  <svg
                    viewBox="0 0 120 120"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Soft Aura */}
                    <circle cx="60" cy="60" r="50" fill="#26c6da" />
                    {/* Hair Back */}
                    <circle cx="38" cy="38" r="16" fill="#3e2723" />
                    <circle cx="82" cy="38" r="16" fill="#3e2723" />
                    {/* Ponytail */}
                    <path
                      d="M32 30 C 20 40, 22 65, 34 75 C 38 65, 36 45, 42 35 Z"
                      fill="#3e2723"
                    />
                    {/* Neck */}
                    <rect x="52" y="66" width="16" height="16" fill="#ffccbc" />
                    {/* Shoulders & White Uniform Shirt */}
                    <path
                      d="M25 106 C 25 84, 45 80, 60 80 C 75 80, 95 84, 95 106 Z"
                      fill="#ffffff"
                    />
                    {/* Collar */}
                    <path d="M48 80 L60 94 L54 102 L42 84 Z" fill="#e0e0e0" />
                    <path d="M72 80 L60 94 L66 102 L78 84 Z" fill="#e0e0e0" />
                    {/* Face */}
                    <ellipse cx="60" cy="54" rx="22" ry="24" fill="#ffe0b2" />
                    {/* Hair Front Bangs */}
                    <path
                      d="M38 50 C 42 36, 52 32, 60 32 C 68 32, 78 36, 82 50 C 75 42, 65 42, 60 44 C 55 42, 45 42, 38 50 Z"
                      fill="#3e2723"
                    />
                    {/* Eyes */}
                    <circle cx="51" cy="54" r="2.5" fill="#424242" />
                    <circle cx="69" cy="54" r="2.5" fill="#424242" />
                    {/* Gentle Smile */}
                    <path
                      d="M54 64 Q60 69 66 64"
                      stroke="#e57373"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Quick Action Button Bar */}
                <div className="flex items-center gap-2 mt-3 text-slate-500">
                  <Link
                    href="/students/std-002"
                    title="View Profile"
                    className="p-1.5 hover:text-amber-500 hover:bg-slate-50 rounded transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    title="Print ID Card"
                    onClick={() => window.print()}
                    className="p-1.5 hover:text-amber-500 hover:bg-slate-50 rounded transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <Link
                    href="/students/std-002"
                    title="Download Dossier"
                    className="p-1.5 hover:text-amber-500 hover:bg-slate-50 rounded transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    title="Share Dossier"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: "Richi Hassan Student Dossier", url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Student Dossier link copied to clipboard!");
                      }
                    }}
                    className="p-1.5 hover:text-amber-500 hover:bg-slate-50 rounded transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right: Key-Value Attribute Table */}
              <div className="flex-1 w-full space-y-2 text-xs">
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Name :</span>
                  <span className="col-span-7 font-bold text-slate-700">Richi Hassan</span>
                </div>
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Gender :</span>
                  <span className="col-span-7 font-semibold text-slate-700">Female</span>
                </div>
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Roll :</span>
                  <span className="col-span-7 font-semibold text-slate-700"># 2901</span>
                </div>
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Admission ID :</span>
                  <span className="col-span-7 font-semibold text-slate-700"># 1250</span>
                </div>
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Admission Date:</span>
                  <span className="col-span-7 font-semibold text-slate-700">05/04/2026</span>
                </div>
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Class :</span>
                  <span className="col-span-7 font-semibold text-slate-700">2 (Grade 8)</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-5 text-slate-400 font-medium">Section:</span>
                  <span className="col-span-7 font-semibold text-slate-700">A (East)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: My Children_02 */}
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
            {/* Card Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">My Children_02</h3>
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  type="button"
                  title="Refresh"
                  className="p-1 hover:text-emerald-500 transition-colors"
                >
                  <RotateCw className="h-3.5 w-3.5 text-emerald-500" />
                </button>
                <button
                  type="button"
                  title="Minimize"
                  className="p-1 hover:text-amber-500 transition-colors"
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

            {/* Card Body */}
            <div className="p-5 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              {/* Left: Avatar Block */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-32 h-32 rounded bg-[#8bc34a] flex items-center justify-center overflow-hidden shadow-xs relative">
                  {/* High fidelity Male Student Vector Avatar */}
                  <svg
                    viewBox="0 0 120 120"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Soft Aura */}
                    <circle cx="60" cy="60" r="50" fill="#9ccc65" />
                    {/* Hair Back */}
                    <path
                      d="M36 46 C 36 28, 84 28, 84 46 C 88 52, 86 64, 82 66 L 38 66 C 34 64, 32 52, 36 46 Z"
                      fill="#5d4037"
                    />
                    {/* Neck */}
                    <rect x="52" y="68" width="16" height="14" fill="#ffccbc" />
                    {/* Shoulders & Red Uniform Shirt */}
                    <path
                      d="M25 106 C 25 84, 45 80, 60 80 C 75 80, 95 84, 95 106 Z"
                      fill="#e53935"
                    />
                    {/* Shirt Collar */}
                    <path d="M46 80 L60 96 L52 100 L40 84 Z" fill="#c62828" />
                    <path d="M74 80 L60 96 L68 100 L80 84 Z" fill="#c62828" />
                    {/* Face */}
                    <ellipse cx="60" cy="54" rx="22" ry="24" fill="#ffe0b2" />
                    {/* Male Hair Style */}
                    <path
                      d="M36 46 C 40 32, 54 28, 62 28 C 76 28, 84 34, 84 46 C 78 38, 68 36, 60 38 C 50 36, 42 38, 36 46 Z"
                      fill="#5d4037"
                    />
                    {/* Eyes */}
                    <circle cx="51" cy="54" r="2.5" fill="#424242" />
                    <circle cx="69" cy="54" r="2.5" fill="#424242" />
                    {/* Smile */}
                    <path
                      d="M54 65 Q60 70 66 65"
                      stroke="#d32f2f"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Quick Action Button Bar */}
                <div className="flex items-center gap-2 mt-3 text-slate-500">
                  <Link
                    href="/students/std-001"
                    title="View Profile"
                    className="p-1.5 hover:text-amber-500 hover:bg-slate-50 rounded transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    title="Print ID Card"
                    onClick={() => window.print()}
                    className="p-1.5 hover:text-amber-500 hover:bg-slate-50 rounded transition-colors"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <Link
                    href="/students/std-001"
                    title="Download Dossier"
                    className="p-1.5 hover:text-amber-500 hover:bg-slate-50 rounded transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    title="Share Dossier"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: "Mark Willy Student Dossier", url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Student Dossier link copied to clipboard!");
                      }
                    }}
                    className="p-1.5 hover:text-amber-500 hover:bg-slate-50 rounded transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right: Key-Value Attribute Table */}
              <div className="flex-1 w-full space-y-2 text-xs">
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Name :</span>
                  <span className="col-span-7 font-bold text-slate-700">Mark Willy</span>
                </div>
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Gender :</span>
                  <span className="col-span-7 font-semibold text-slate-700">Male</span>
                </div>
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Roll :</span>
                  <span className="col-span-7 font-semibold text-slate-700"># 2959</span>
                </div>
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Admission ID :</span>
                  <span className="col-span-7 font-semibold text-slate-700"># 1259</span>
                </div>
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Admission Date:</span>
                  <span className="col-span-7 font-semibold text-slate-700">15/04/2026</span>
                </div>
                <div className="grid grid-cols-12 gap-2 pb-1.5 border-b border-slate-50">
                  <span className="col-span-5 text-slate-400 font-medium">Class :</span>
                  <span className="col-span-7 font-semibold text-slate-700">6 (Grade 7)</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-5 text-slate-400 font-medium">Section:</span>
                  <span className="col-span-7 font-semibold text-slate-700">B (West)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Social / Community Channels (2x2 grid) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Facebook */}
            <div className="bg-[#3b5998] text-white p-4 rounded-md shadow-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <Facebook className="h-5 w-5 mb-1" />
                <div className="text-[11px] text-white/80 font-medium leading-tight">
                  Follower
                  <br />
                  on Facebook
                </div>
              </div>
              <div className="text-2xl font-bold tracking-tight border-l border-white/20 pl-4">
                1,000
              </div>
            </div>

            {/* Twitter */}
            <div className="bg-[#1da1f2] text-white p-4 rounded-md shadow-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <Twitter className="h-5 w-5 mb-1" />
                <div className="text-[11px] text-white/80 font-medium leading-tight">
                  Follower
                  <br />
                  on Twitter
                </div>
              </div>
              <div className="text-2xl font-bold tracking-tight border-l border-white/20 pl-4">
                1,000
              </div>
            </div>

            {/* Google+ / Portal */}
            <div className="bg-[#d34836] text-white p-4 rounded-md shadow-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-black text-lg leading-none mb-1">g+</div>
                <div className="text-[11px] text-white/80 font-medium leading-tight">
                  Circule
                  <br />
                  on google +
                </div>
              </div>
              <div className="text-2xl font-bold tracking-tight border-l border-white/20 pl-4">
                800
              </div>
            </div>

            {/* LinkedIn */}
            <div className="bg-[#0077b5] text-white p-4 rounded-md shadow-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <Linkedin className="h-5 w-5 mb-1" />
                <div className="text-[11px] text-white/80 font-medium leading-tight">
                  Follower
                  <br />
                  on Linkedin
                </div>
              </div>
              <div className="text-2xl font-bold tracking-tight border-l border-white/20 pl-4">
                9,000
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (7 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top 4 Vibrant KPI Metric Blocks (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Block 1: Due Fees (Red/Coral) */}
            <div className="bg-[#ff4d4f] text-white rounded-md p-5 flex items-center gap-5 shadow-xs">
              <div className="w-14 h-14 rounded border-2 border-white/70 flex items-center justify-center shrink-0">
                <CreditCard className="h-7 w-7 text-white stroke-[1.5]" />
              </div>
              <div>
                <div className="text-3xl font-extrabold tracking-tight">1,500</div>
                <div className="text-xs text-white/90 font-medium">Due Fees</div>
              </div>
            </div>

            {/* Block 2: Upcoming Exams (Grass Green) */}
            <div className="bg-[#52c41a] text-white rounded-md p-5 flex items-center gap-5 shadow-xs">
              <div className="w-14 h-14 rounded border-2 border-white/70 flex items-center justify-center shrink-0">
                <FileEdit className="h-7 w-7 text-white stroke-[1.5]" />
              </div>
              <div>
                <div className="text-3xl font-extrabold tracking-tight">15</div>
                <div className="text-xs text-white/90 font-medium">Upcoming Exams</div>
              </div>
            </div>

            {/* Block 3: Result Published (Sky Blue) */}
            <div className="bg-[#1890ff] text-white rounded-md p-5 flex items-center gap-5 shadow-xs">
              <div className="w-14 h-14 rounded border-2 border-white/70 flex items-center justify-center shrink-0">
                <GraduationCap className="h-7 w-7 text-white stroke-[1.5]" />
              </div>
              <div>
                <div className="text-3xl font-extrabold tracking-tight">08</div>
                <div className="text-xs text-white/90 font-medium">Result Published</div>
              </div>
            </div>

            {/* Block 4: Total Expenses (Vivid Turquoise/Cyan) */}
            <div className="bg-[#13c2c2] text-white rounded-md p-5 flex items-center gap-5 shadow-xs">
              <div className="w-14 h-14 rounded border-2 border-white/70 flex items-center justify-center shrink-0">
                <DollarSign className="h-7 w-7 text-white stroke-[1.5]" />
              </div>
              <div>
                <div className="text-3xl font-extrabold tracking-tight">10,000</div>
                <div className="text-xs text-white/90 font-medium">Total Expenses</div>
              </div>
            </div>
          </div>

          {/* Widget: Notice Board */}
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">Notice Board</h3>
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  type="button"
                  title="Refresh"
                  className="p-1 hover:text-emerald-500 transition-colors"
                >
                  <RotateCw className="h-3.5 w-3.5 text-emerald-500" />
                </button>
                <button
                  type="button"
                  title="Minimize"
                  className="p-1 hover:text-amber-500 transition-colors"
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

            {/* Notice Items */}
            <div className="p-5 space-y-4">
              {/* Notice 1 */}
              <div className="space-y-1 pb-3.5 border-b border-slate-100 relative pr-4">
                <div className="text-[11px] text-slate-400">16 May, 2026</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer">
                    Jennyfar Lopez
                  </span>
                  <span className="text-[10px] text-slate-400">5 min ago</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Great School managmene tssimply dummy text of the prsimply dummy text of the printing and typesetting industry.
                </p>
                {/* Active blue vertical right indicator */}
                <div className="absolute right-0 top-3 bottom-3 w-1 bg-sky-500 rounded-full" />
              </div>

              {/* Notice 2 */}
              <div className="space-y-1 pb-3.5 border-b border-slate-100">
                <div className="text-[11px] text-slate-400">16 May, 2026</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 hover:underline cursor-pointer">
                    Kazi Fahim
                  </span>
                  <span className="text-[10px] text-slate-400">10 min ago</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Great School managmene tssimply dummy text of the printing and typesetting industryom simply.
                </p>
              </div>

              {/* Notice 3 */}
              <div className="space-y-1">
                <div className="text-[11px] text-slate-400">16 May, 2026</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
                    Gizzar Awala
                  </span>
                  <span className="text-[10px] text-slate-400">50 min ago</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Great School managmene tssimply dummy text of the prsimply dummy text of the printing and typesetting industry.
                </p>
              </div>
            </div>
          </div>

          {/* Widget: All Expenses Table */}
          <div className="bg-white rounded-md shadow-xs border border-slate-200/90 overflow-hidden">
            {/* Header + Search Filter Controls */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight shrink-0">
                All Expenses
              </h3>

              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Search by ID ..."
                  value={expenseSearchId}
                  onChange={(e) => setExpenseSearchId(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-400 w-32"
                />
                <input
                  type="text"
                  placeholder="Search by Date ..."
                  value={expenseSearchDate}
                  onChange={(e) => setExpenseSearchDate(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-400 w-32"
                />
                <button
                  type="button"
                  className="px-4 py-1.5 bg-[#042954] hover:bg-[#073b75] text-white text-xs font-bold rounded transition-colors"
                >
                  SEARCH
                </button>

                <div className="flex items-center gap-1 text-slate-400 pl-1">
                  <button type="button" title="Refresh" className="p-1 hover:text-emerald-500">
                    <RotateCw className="h-3 w-3 text-emerald-500" />
                  </button>
                  <button type="button" title="Close" className="p-1 hover:text-rose-500">
                    <X className="h-3 w-3 text-rose-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expenses Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/70 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4">ID No</th>
                    <th className="py-2.5 px-4">Expense Type</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">E-mail</th>
                    <th className="py-2.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredExpenses.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.id}</td>
                      <td className="py-3 px-4 text-slate-600">{row.type}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.amount}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-white ${
                            row.status === "Paid" ? "bg-[#52c41a]" : "bg-[#ff4d4f]"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{row.email}</td>
                      <td className="py-3 px-4 text-slate-500">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <footer className="pt-4 text-xs text-slate-400 border-t border-slate-200/60 flex items-center justify-between">
        <span>© Copyrights SOP 2026. All rights reserved.</span>
        <span>Designed for SOP School Management System</span>
      </footer>
    </div>
  );
}
