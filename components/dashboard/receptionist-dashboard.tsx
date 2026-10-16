"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Clock,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Bus,
  Package,
  Plus,
  LogOut,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VisitorEntry {
  id: string;
  badgeNumber: string;
  fullName: string;
  phone: string;
  purpose: string;
  hostStaff: string;
  timeIn: string;
  timeOut?: string;
  status: "CHECKED_IN" | "CHECKED_OUT";
}

interface LateArrivalEntry {
  id: string;
  slipNumber: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  arrivalTime: string;
  reason: string;
  status: "ISSUED" | "ACKNOWLEDGED";
}

interface DropoffItem {
  id: string;
  recipientStudent: string;
  className: string;
  itemDescription: string;
  droppedBy: string;
  time: string;
  status: "PENDING_COLLECTION" | "COLLECTED";
}

export function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState<"visitors" | "lateSlips" | "dropoffs" | "directory">("visitors");

  // Live Visitors State
  const [visitors, setVisitors] = useState<VisitorEntry[]>([
    {
      id: "vis-1",
      badgeNumber: "V-101",
      fullName: "Eng. Peter Ndegwa",
      phone: "+254 722 112 233",
      purpose: "Campus Tour & Grade 8 Admission Inquiry",
      hostStaff: "Grace Auma (Admissions)",
      timeIn: "08:45 AM",
      status: "CHECKED_IN",
    },
    {
      id: "vis-2",
      badgeNumber: "V-102",
      fullName: "Mrs. Claire Mutiso",
      phone: "+254 723 445 566",
      purpose: "Parent Consultation regarding Science Project",
      hostStaff: "Sarah Wanjiku (Grade 8 Teacher)",
      timeIn: "09:15 AM",
      status: "CHECKED_IN",
    },
    {
      id: "vis-3",
      badgeNumber: "V-103",
      fullName: "Dr. Hassan Omar",
      phone: "+254 733 998 877",
      purpose: "Curriculum Advisory & Cambridge Verification",
      hostStaff: "Prof. Arthur Ochieng (Principal)",
      timeIn: "09:30 AM",
      status: "CHECKED_IN",
    },
    {
      id: "vis-4",
      badgeNumber: "V-098",
      fullName: "John Kamau (Apex Lab Supplies)",
      phone: "+254 721 887 766",
      purpose: "Delivery of Chemistry Lab Consumables",
      hostStaff: "Brian Odhiambo (Science Dept)",
      timeIn: "08:10 AM",
      timeOut: "08:40 AM",
      status: "CHECKED_OUT",
    },
  ]);

  // Late Arrivals Gate Slips State
  const [lateSlips, setLateSlips] = useState<LateArrivalEntry[]>([
    {
      id: "late-1",
      slipNumber: "GATE-2026-042",
      studentName: "Zawadi Muthoni",
      admissionNumber: "SOP-2024-0084",
      className: "Grade 8 West",
      arrivalTime: "08:25 AM",
      reason: "Severe traffic congestion along Karen Roundabout",
      status: "ISSUED",
    },
    {
      id: "late-2",
      slipNumber: "GATE-2026-043",
      studentName: "Dennis Mwangi",
      admissionNumber: "SOP-2024-0089",
      className: "Grade 8 West",
      arrivalTime: "08:35 AM",
      reason: "Parent vehicle mechanical issue",
      status: "ISSUED",
    },
    {
      id: "late-3",
      slipNumber: "GATE-2026-044",
      studentName: "Tariq Al-Mansoor",
      admissionNumber: "SOP-2024-0092",
      className: "Grade 7 East",
      arrivalTime: "08:40 AM",
      reason: "Scheduled morning medical appointment at Karen Hospital",
      status: "ACKNOWLEDGED",
    },
  ]);

  // Front Desk Parcel Drop-offs
  const [dropoffs, setDropoffs] = useState<DropoffItem[]>([
    {
      id: "drop-1",
      recipientStudent: "Amani Otieno",
      className: "Grade 8 East",
      itemDescription: "Prescribed Ventolin inhaler (Deliver to School Nurse)",
      droppedBy: "Grace Otieno (Mother)",
      time: "08:20 AM",
      status: "PENDING_COLLECTION",
    },
    {
      id: "drop-2",
      recipientStudent: "Kevin Kimani",
      className: "Grade 8 East",
      itemDescription: "Forgotten Swimming & Sports Kit bag",
      droppedBy: "David Kimani (Father)",
      time: "09:05 AM",
      status: "PENDING_COLLECTION",
    },
    {
      id: "drop-3",
      recipientStudent: "Liam Kipkemboi",
      className: "Year 10 Alpha",
      itemDescription: "Physics practical workbook & project binder",
      droppedBy: "Eunice Kipkemboi (Mother)",
      time: "07:55 AM",
      status: "COLLECTED",
    },
  ]);

  // Modal / Form States
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [newVisitorName, setNewVisitorName] = useState("");
  const [newVisitorPhone, setNewVisitorPhone] = useState("");
  const [newVisitorPurpose, setNewVisitorPurpose] = useState("");
  const [newVisitorHost, setNewVisitorHost] = useState("Grace Auma (Admissions)");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCheckOutVisitor = (id: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: "CHECKED_OUT", timeOut: timeNow } : v
      )
    );
    setToastMessage("Visitor checked out successfully. Badge returned.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitorName.trim() || !newVisitorPurpose.trim()) return;

    const badgeNum = `V-${100 + visitors.length + 1}`;
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newEntry: VisitorEntry = {
      id: `vis-${Date.now()}`,
      badgeNumber: badgeNum,
      fullName: newVisitorName.trim(),
      phone: newVisitorPhone.trim() || "+254 700 000 000",
      purpose: newVisitorPurpose.trim(),
      hostStaff: newVisitorHost,
      timeIn: timeNow,
      status: "CHECKED_IN",
    };

    setVisitors([newEntry, ...visitors]);
    setIsVisitorModalOpen(false);
    setNewVisitorName("");
    setNewVisitorPhone("");
    setNewVisitorPurpose("");
    setToastMessage(`Visitor logged! Badge ${badgeNum} issued.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleDropoff = (id: string) => {
    setDropoffs((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: d.status === "PENDING_COLLECTION" ? "COLLECTED" : "PENDING_COLLECTION",
            }
          : d
      )
    );
  };

  const activeVisitorsCount = visitors.filter((v) => v.status === "CHECKED_IN").length;
  const pendingDropoffsCount = dropoffs.filter((d) => d.status === "PENDING_COLLECTION").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Front Desk Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Visitors on Campus</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeVisitorsCount} Active</div>
          <div className="text-[11px] text-indigo-600 font-medium">
            Badges checked in at Karen Main Gate
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Gate Late Slips Today</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700">{lateSlips.length} Students</div>
          <div className="text-[11px] text-slate-500">
            Recorded after 08:00 AM homeroom bell
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Parcel & Item Drop-offs</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingDropoffsCount} Awaiting</div>
          <div className="text-[11px] text-rose-600 font-medium">
            Items awaiting student/nurse collection
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Admissions Inquiries</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">14 Active</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            Campus tours & intake assessments
          </div>
        </div>
      </div>

      {/* Reception Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("visitors")}
          className={`pb-2.5 transition-all whitespace-nowrap ${
            activeTab === "visitors"
              ? "border-b-2 border-emerald-600 text-emerald-700 font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Gate Visitors & Badges ({activeVisitorsCount} On Campus)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("lateSlips")}
          className={`pb-2.5 transition-all whitespace-nowrap ${
            activeTab === "lateSlips"
              ? "border-b-2 border-emerald-600 text-emerald-700 font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Gate Late Arrival Slips ({lateSlips.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("dropoffs")}
          className={`pb-2.5 transition-all whitespace-nowrap ${
            activeTab === "dropoffs"
              ? "border-b-2 border-emerald-600 text-emerald-700 font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Item & Medication Drop-offs ({pendingDropoffsCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("directory")}
          className={`pb-2.5 transition-all whitespace-nowrap ${
            activeTab === "directory"
              ? "border-b-2 border-emerald-600 text-emerald-700 font-bold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Front Desk Staff Extension Directory
        </button>
      </div>

      {/* TAB 1: CAMPUS VISITORS & GATE LOG */}
      {activeTab === "visitors" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Live Visitor Gate Log & Badge Management
              </h2>
              <p className="text-xs text-slate-500">
                Security-controlled campus entry protocol for parents, suppliers, and guests
              </p>
            </div>
            <Button
              variant="emerald"
              size="sm"
              onClick={() => setIsVisitorModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Log New Visitor / Issue Badge</span>
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Badge</th>
                    <th className="py-3 px-4">Visitor Name</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Purpose of Visit</th>
                    <th className="py-3 px-4">Staff Host</th>
                    <th className="py-3 px-4">Time In</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Gate Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {visitors.map((vis) => (
                    <tr key={vis.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                        {vis.badgeNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {vis.fullName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {vis.phone}
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                        {vis.purpose}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {vis.hostStaff}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {vis.timeIn}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            vis.status === "CHECKED_IN"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {vis.status === "CHECKED_IN" ? "On Campus" : "Checked Out"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {vis.status === "CHECKED_IN" ? (
                          <button
                            type="button"
                            onClick={() => handleCheckOutVisitor(vis.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
                          >
                            <LogOut className="h-3 w-3" />
                            <span>Check Out</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Out: {vis.timeOut}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GATE LATE SLIPS */}
      {activeTab === "lateSlips" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Student Gate Arrival Slips & Roll Call Exceptions
              </h2>
              <p className="text-xs text-slate-500">
                Gate log for learners arriving after the 08:00 AM homeroom bell
              </p>
            </div>
            <Link
              href="/students/attendance"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              View Full School Attendance Sheet →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 text-xs">
              {lateSlips.map((slip) => (
                <div key={slip.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{slip.studentName}</span>
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200 text-[10px]">
                        {slip.admissionNumber}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700">{slip.className}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      <span className="font-medium text-slate-700">Reason Stated:</span> {slip.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-700">{slip.arrivalTime}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{slip.slipNumber}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[10px]">
                      Gate Slip Issued
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PARCEL & MEDICATION DROPOFFS */}
      {activeTab === "dropoffs" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Front Desk Item & Medication Drop-offs
            </h2>
            <p className="text-xs text-slate-500">
              Items brought by guardians during school hours for student collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dropoffs.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border space-y-3 transition-all ${
                  item.status === "PENDING_COLLECTION"
                    ? "bg-white border-amber-200 shadow-xs"
                    : "bg-slate-50 border-slate-200 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    {item.recipientStudent} ({item.className})
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                      item.status === "PENDING_COLLECTION"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-emerald-100 text-emerald-900"
                    }`}
                  >
                    {item.status === "PENDING_COLLECTION" ? "At Front Desk" : "Handed Over"}
                  </span>
                </div>

                <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {item.itemDescription}
                </p>

                <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
                  <span>From: {item.droppedBy}</span>
                  <span className="font-mono">{item.time}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleDropoff(item.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
                    item.status === "PENDING_COLLECTION"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {item.status === "PENDING_COLLECTION" ? "Mark Handed Over" : "Mark Pending"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FRONT DESK EXTENSION DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Front Desk Staff Extension & Intercom Lookup
            </h2>
            <p className="text-xs text-slate-500">
              Quick intercom and direct phone extensions for internal routing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Principal&apos;s Office</span>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ext 101</span>
              </div>
              <div className="text-slate-500">Prof. Arthur Ochieng • Executive Wing</div>
              <div className="font-mono text-slate-700 flex items-center gap-1 pt-1">
                <Phone className="h-3 w-3 text-emerald-600" /> +254 722 200 002
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Bursar & Accounts</span>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ext 104</span>
              </div>
              <div className="text-slate-500">Peter Kipkorir • Finance Block B</div>
              <div className="font-mono text-slate-700 flex items-center gap-1 pt-1">
                <Phone className="h-3 w-3 text-emerald-600" /> +254 722 400 004
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>School Infirmary & Nurse</span>
                <span className="font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Ext 108</span>
              </div>
              <div className="text-slate-500">Sister Mary Kemunto • Health Center</div>
              <div className="font-mono text-slate-700 flex items-center gap-1 pt-1">
                <Phone className="h-3 w-3 text-rose-600" /> +254 722 999 111
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Transport & Bus Fleet</span>
                <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Ext 112</span>
              </div>
              <div className="text-slate-500">Kariuki Mwangi • Transport Depot</div>
              <div className="font-mono text-slate-700 flex items-center gap-1 pt-1">
                <Phone className="h-3 w-3 text-blue-600" /> +254 722 700 008
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Grade 8 Senior Teacher</span>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ext 114</span>
              </div>
              <div className="text-slate-500">Sarah Wanjiku • Faculty Room 2</div>
              <div className="font-mono text-slate-700 flex items-center gap-1 pt-1">
                <Phone className="h-3 w-3 text-emerald-600" /> +254 722 300 003
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Main Security & Gate 1</span>
                <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Ext 100</span>
              </div>
              <div className="text-slate-500">SOP Security Guard Post • Karen Gate</div>
              <div className="font-mono text-slate-700 flex items-center gap-1 pt-1">
                <Phone className="h-3 w-3 text-amber-600" /> +254 722 100 000
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Visitor Modal */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                <span>Log New Campus Visitor & Issue Badge</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsVisitorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterVisitor} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Daniel Njoroge"
                  value={newVisitorName}
                  onChange={(e) => setNewVisitorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Visitor Phone Number</label>
                <input
                  type="tel"
                  placeholder="+254 712 345 678"
                  value={newVisitorPhone}
                  onChange={(e) => setNewVisitorPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Purpose of Visit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 7 CBC Admissions Assessment"
                  value={newVisitorPurpose}
                  onChange={(e) => setNewVisitorPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Host Staff Member / Department</label>
                <select
                  value={newVisitorHost}
                  onChange={(e) => setNewVisitorHost(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Grace Auma (Admissions)">Grace Auma (Admissions & Front Desk)</option>
                  <option value="Prof. Arthur Ochieng (Principal)">Prof. Arthur Ochieng (Principal)</option>
                  <option value="Peter Kipkorir (Bursar)">Peter Kipkorir (Bursar & Accounts)</option>
                  <option value="Sarah Wanjiku (Grade 8 Teacher)">Sarah Wanjiku (Grade 8 Teacher)</option>
                  <option value="James Mutua (Grade 7 Teacher)">James Mutua (Grade 7 Teacher)</option>
                  <option value="Brian Odhiambo (Cambridge Coordinator)">Brian Odhiambo (Cambridge Coordinator)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVisitorModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <Button type="submit" variant="emerald">
                  Register & Issue Badge
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
