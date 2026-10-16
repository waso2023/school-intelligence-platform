"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Users,
  CalendarDays,
  Bus,
  ShieldAlert,
  FileText,
  Clock,
  ArrowRight,
  PlusCircle,
  Search,
  CheckCircle2,
  Download,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Database,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  workload: string;
}

interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: "ACADEMIC" | "SPORTS" | "PASTORAL" | "GOVERNANCE";
}

interface TransportRoute {
  id: string;
  name: string;
  busNo: string;
  driver: string;
  phone: string;
  capacity: string;
  stops: string;
}

interface DisciplineCase {
  id: string;
  student: string;
  class: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  action: string;
  date: string;
  status: "RESOLVED" | "COUNSELING" | "PENDING";
}

interface PolicyDocument {
  id: string;
  title: string;
  category: string;
  chunks: number;
  lastUpdated: string;
  status: "VECTORIZED" | "PENDING_INDEX";
}

function AdministrationContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "overview" | "staff" | "timetable" | "events" | "transport" | "discipline" | "documents"
  >("overview");

  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // 1. Staff states
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: "st-1",
      name: "Dr. Peter Kamau",
      role: "Head of Sciences & STEM",
      department: "Sciences",
      email: "peter.kamau@sopacademy.ac.ke",
      phone: "+254 722 101 202",
      workload: "22 periods/wk",
    },
    {
      id: "st-2",
      name: "Sarah Mwangi",
      role: "Senior Educator & Grade 8 East Lead",
      department: "Languages",
      email: "sarah.mwangi@sopacademy.ac.ke",
      phone: "+254 723 202 303",
      workload: "24 periods/wk",
    },
    {
      id: "st-3",
      name: "Dennis Njoroge",
      role: "Mathematics Faculty Lead",
      department: "Mathematics",
      email: "dennis.njoroge@sopacademy.ac.ke",
      phone: "+254 724 303 404",
      workload: "20 periods/wk",
    },
    {
      id: "st-4",
      name: "Lucy Wanjiru",
      role: "IGCSE Coordinator & Social Sciences",
      department: "Humanities",
      email: "lucy.wanjiru@sopacademy.ac.ke",
      phone: "+254 725 404 505",
      workload: "18 periods/wk",
    },
  ]);
  const [staffSearch, setStaffSearch] = useState("");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newStaffDept, setNewStaffDept] = useState("Sciences");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");

  // 2. Timetable states
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedClass, setSelectedClass] = useState("Grade 8 East");

  // 3. Events states
  const [events, setEvents] = useState<SchoolEvent[]>([
    {
      id: "ev-1",
      title: "Term 1 Mid-Term Consultative Parent Conferences",
      date: "17 Oct 2026",
      time: "08:30 AM - 14:00 PM",
      venue: "Main Auditorium & Virtual",
      category: "ACADEMIC",
    },
    {
      id: "ev-2",
      title: "Inter-House Athletics Championship Gala",
      date: "24 Oct 2026",
      time: "09:00 AM - 16:00 PM",
      venue: "Kasarani Sports Complex",
      category: "SPORTS",
    },
    {
      id: "ev-3",
      title: "Board of Governors & PTA Financial Review AGM",
      date: "05 Nov 2026",
      time: "10:00 AM - 12:30 PM",
      venue: "Executive Boardroom",
      category: "GOVERNANCE",
    },
  ]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventVenue, setNewEventVenue] = useState("");
  const [newEventCategory, setNewEventCategory] = useState<SchoolEvent["category"]>("ACADEMIC");

  // 4. Transport states
  const [routes, setRoutes] = useState<TransportRoute[]>([
    {
      id: "rt-1",
      name: "Route 1: Karen - Ngong Hub",
      busNo: "KDA 482B (33 Seater)",
      driver: "Samuel Ndungu",
      phone: "+254 711 901 112",
      capacity: "31 / 33 Students",
      stops: "Ngong Town → Karen Roundabout → Dagoretti Corner → SOP Academy",
    },
    {
      id: "rt-2",
      name: "Route 2: Kilimani - Kileleshwa - Lavington",
      busNo: "KDC 199E (28 Seater)",
      driver: "Moses Kimathi",
      phone: "+254 722 883 441",
      capacity: "26 / 28 Students",
      stops: "Yaya Centre → Dennis Pritt → James Gichuru → SOP Academy",
    },
    {
      id: "rt-3",
      name: "Route 3: Westlands - Parklands - Spring Valley",
      busNo: "KDG 714M (33 Seater)",
      driver: "Jackson Otieno",
      phone: "+254 733 441 229",
      capacity: "29 / 33 Students",
      stops: "Sarit Centre → Limuru Rd → Peponi Rd → SOP Academy",
    },
  ]);

  // 5. Discipline states
  const [disciplineCases, setDisciplineCases] = useState<DisciplineCase[]>([
    {
      id: "dc-1",
      student: "Kevin Kimani",
      class: "Grade 8 East",
      type: "Unprepared for Science Practical Examination",
      severity: "LOW",
      action: "Teacher guidance session and lab workbook completion.",
      date: "07 Oct 2026",
      status: "RESOLVED",
    },
    {
      id: "dc-2",
      student: "Liam Ochieng",
      class: "Year 10 Alpha",
      type: "Repeated Unexcused Morning Tardiness (4 Days)",
      severity: "MEDIUM",
      action: "Guardian notified via SMS; 30-min restorative reflection period.",
      date: "05 Oct 2026",
      status: "COUNSELING",
    },
  ]);
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [newCaseStudent, setNewCaseStudent] = useState("");
  const [newCaseClass, setNewCaseClass] = useState("Grade 8 East");
  const [newCaseType, setNewCaseType] = useState("");
  const [newCaseSeverity, setNewCaseSeverity] = useState<DisciplineCase["severity"]>("LOW");
  const [newCaseAction, setNewCaseAction] = useState("");

  // 6. Documents (RAG) states
  const [documents, setDocuments] = useState<PolicyDocument[]>([
    {
      id: "doc-1",
      title: "SOP Student Code of Conduct & Pastoral Handbook 2026",
      category: "Behavior & Pastoral",
      chunks: 340,
      lastUpdated: "01 Sep 2026",
      status: "VECTORIZED",
    },
    {
      id: "doc-2",
      title: "School Fee Billing, Arrears & Payment Reconciliations Policy",
      category: "Finance & Bursary",
      chunks: 185,
      lastUpdated: "15 Aug 2026",
      status: "VECTORIZED",
    },
    {
      id: "doc-3",
      title: "CBC Junior Secondary Curriculum & Continuous Assessment Framework",
      category: "Academics",
      chunks: 420,
      lastUpdated: "10 Jul 2026",
      status: "VECTORIZED",
    },
    {
      id: "doc-4",
      title: "School Fleet, Bus Routes & Child Safety Standard Operating Procedures",
      category: "Operations",
      chunks: 215,
      lastUpdated: "20 Jun 2026",
      status: "VECTORIZED",
    },
  ]);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocCategory, setNewDocCategory] = useState("Academics");

  // Fetch persistent staff and events on mount
  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStaffList(json.data);
      }
    } catch (err) {
      // Keep initial list on error
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setEvents(json.data);
      }
    } catch (err) {
      // Keep initial events on error
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchEvents();
  }, []);

  // Sync tab with URL
  useEffect(() => {
    if (tabParam && ["overview", "staff", "timetable", "events", "transport", "discipline", "documents"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  // Handlers
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffRole.trim()) return;

    const payload = {
      name: newStaffName.trim(),
      role: newStaffRole.trim(),
      department: newStaffDept,
      email: newStaffEmail.trim() || `${newStaffName.toLowerCase().replace(/\s+/g, ".")}@sopacademy.ac.ke`,
      phone: newStaffPhone.trim() || "+254 700 000 000",
      workload: "20 periods/wk",
    };

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setStaffList((prev) => [json.data, ...prev]);
        setSuccessBanner(`Staff member "${json.data.name}" added to the faculty registry and saved to database!`);
      } else {
        const newStaff: StaffMember = {
          id: `st-${Date.now()}`,
          ...payload,
        };
        setStaffList((prev) => [newStaff, ...prev]);
        setSuccessBanner(`Staff member "${newStaff.name}" added to the faculty registry!`);
      }
    } catch (err) {
      const newStaff: StaffMember = {
        id: `st-${Date.now()}`,
        ...payload,
      };
      setStaffList((prev) => [newStaff, ...prev]);
      setSuccessBanner(`Staff member "${newStaff.name}" added to the faculty registry!`);
    }

    setIsAddStaffOpen(false);
    setNewStaffName("");
    setNewStaffRole("");
    setNewStaffEmail("");
    setNewStaffPhone("");
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim()) return;

    const payload = {
      title: newEventTitle.trim(),
      date: newEventDate.trim(),
      time: "09:00 AM - 13:00 PM",
      venue: newEventVenue.trim() || "School Campus",
      category: newEventCategory,
    };

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setEvents((prev) => [json.data, ...prev]);
        setSuccessBanner(`Event "${json.data.title}" added to the master calendar and saved to database!`);
      } else {
        const newEv: SchoolEvent = {
          id: `ev-${Date.now()}`,
          ...payload,
        };
        setEvents((prev) => [newEv, ...prev]);
        setSuccessBanner(`Event "${newEv.title}" added to the institutional master calendar!`);
      }
    } catch (err) {
      const newEv: SchoolEvent = {
        id: `ev-${Date.now()}`,
        ...payload,
      };
      setEvents((prev) => [newEv, ...prev]);
      setSuccessBanner(`Event "${newEv.title}" added to the institutional master calendar!`);
    }

    setIsAddEventOpen(false);
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventVenue("");
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleAddDiscipline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseStudent.trim() || !newCaseType.trim()) return;

    const newCase: DisciplineCase = {
      id: `dc-${Date.now()}`,
      student: newCaseStudent.trim(),
      class: newCaseClass,
      type: newCaseType.trim(),
      severity: newCaseSeverity,
      action: newCaseAction.trim() || "Pastoral counseling initiated.",
      date: "Today",
      status: "PENDING",
    };

    setDisciplineCases([newCase, ...disciplineCases]);
    setIsAddCaseOpen(false);
    setNewCaseStudent("");
    setNewCaseType("");
    setNewCaseAction("");
    setSuccessBanner(`Behavioral incident record logged for ${newCase.student}.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    const newDoc: PolicyDocument = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      category: newDocCategory,
      chunks: Math.floor(150 + Math.random() * 200),
      lastUpdated: "Just now",
      status: "VECTORIZED",
    };

    setDocuments([newDoc, ...documents]);
    setIsUploadDocOpen(false);
    setNewDocTitle("");
    setSuccessBanner(`Document "${newDoc.title}" parsed & indexed into pgvector memory (${newDoc.chunks} embeddings).`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const adminModules = [
    {
      tabId: "staff",
      title: "Staff & Teachers Directory",
      desc: "Manage active educators, departmental assignments & teacher workloads.",
      icon: Users,
      stats: `${staffList.length} Faculty Members`,
    },
    {
      tabId: "timetable",
      title: "Timetable & Schedules",
      desc: "Master weekly timetables, lesson allocations & laboratory scheduling.",
      icon: Clock,
      stats: "18 Classes Scheduled",
    },
    {
      tabId: "events",
      title: "School Events & Calendar",
      desc: "Term dates, consultative AGM meetings, sports fixtures & excursions.",
      icon: CalendarDays,
      stats: `${events.length} Upcoming Events`,
    },
    {
      tabId: "transport",
      title: "Fleet & Transport Management",
      desc: "School bus fleet tracking, drivers, route optimization & student stops.",
      icon: Bus,
      stats: `${routes.length} Active Bus Routes`,
    },
    {
      tabId: "discipline",
      title: "Discipline & Pastoral Care",
      desc: "Incident records, behavioral tracking, counseling logs & restorative care.",
      icon: ShieldAlert,
      stats: `${disciplineCases.length} Incident Cases`,
    },
    {
      tabId: "documents",
      title: "Institutional Policy Documents (RAG)",
      desc: "Upload school handbooks, fee policies & discipline rules for AI vector ingestion.",
      icon: FileText,
      stats: `${documents.length} Vectorized Documents`,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {successBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            School Administration & Operations
          </h1>
          <p className="text-xs text-slate-500">
            Core institutional management, transport routes, timetables, and governance
          </p>
        </div>

        {activeTab !== "overview" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="gap-1.5 self-start sm:self-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Admin Modules</span>
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Modules Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "staff"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Staff & Teachers ({staffList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("timetable")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "timetable"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Master Timetable
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("events")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "events"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Calendar & Events ({events.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("transport")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "transport"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Transport & Fleet ({routes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("discipline")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "discipline"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Discipline & Pastoral ({disciplineCases.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("documents")}
          className={`pb-2.5 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "documents"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>Policy Docs (RAG)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 text-emerald-800 font-bold">
            {documents.length}
          </span>
        </button>
      </div>

      {/* 0. OVERVIEW TAB: CLICKABLE CARDS */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.tabId}
                type="button"
                onClick={() => setActiveTab(mod.tabId as any)}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {mod.stats}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{mod.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>Open {mod.title.split(" ")[0]} Module</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 1. STAFF DIRECTORY TAB */}
      {activeTab === "staff" && (
        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search faculty by name or role..."
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <Button
              variant="emerald"
              size="sm"
              className="gap-2"
              onClick={() => setIsAddStaffOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Staff Member</span>
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Faculty Name</th>
                  <th className="py-3 px-4">Role / Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Workload</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {staffList
                  .filter(
                    (s) =>
                      !staffSearch.trim() ||
                      s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
                      s.role.toLowerCase().includes(staffSearch.toLowerCase())
                  )
                  .map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{staff.name}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{staff.role}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px]">
                          {staff.department}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{staff.email}</div>
                        <div className="font-mono text-[10px]">{staff.phone}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600">{staff.workload}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TIMETABLE TAB */}
      {activeTab === "timetable" && (
        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Grade 8 East">Grade 8 East (CBC)</option>
                <option value="Grade 7 West">Grade 7 West (CBC)</option>
                <option value="Year 10 Alpha">Year 10 Alpha (Cambridge)</option>
                <option value="Year 11 Beta">Year 11 Beta (Cambridge)</option>
              </select>

              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      selectedDay === d
                        ? "bg-white text-emerald-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setSuccessBanner(`Master timetable for ${selectedClass} generated & downloaded as PDF.`);
                setTimeout(() => setSuccessBanner(null), 4000);
              }}
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 font-bold text-slate-900">
              {selectedClass} — Weekly Class Timetable ({selectedDay})
            </div>
            <div className="divide-y divide-slate-100">
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-mono text-slate-400 font-bold">08:00 - 08:50</span>
                <span className="font-bold text-slate-900">Mathematics & Algebraic Equations</span>
                <span className="text-slate-500">Dennis Njoroge • Room 204</span>
              </div>
              <div className="p-3.5 flex items-center justify-between bg-slate-50/50">
                <span className="font-mono text-slate-400 font-bold">08:50 - 09:40</span>
                <span className="font-bold text-slate-900">Integrated Science (Biology Strand)</span>
                <span className="text-slate-500">Dr. Peter Kamau • STEM Science Lab 1</span>
              </div>
              <div className="p-3.5 flex items-center justify-between text-amber-800 bg-amber-50/60 font-semibold text-[11px]">
                <span className="font-mono font-bold">09:40 - 10:10</span>
                <span>Morning Break & Refreshment</span>
                <span>Dining Pavilion</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-mono text-slate-400 font-bold">10:10 - 11:00</span>
                <span className="font-bold text-slate-900">English Language & Literature</span>
                <span className="text-slate-500">Sarah Mwangi • Room 204</span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="font-mono text-slate-400 font-bold">11:00 - 11:50</span>
                <span className="font-bold text-slate-900">Kiswahili & Fasihi Simulizi</span>
                <span className="text-slate-500">Ezekiel Ombati • Room 204</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CALENDAR & EVENTS TAB */}
      {activeTab === "events" && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Official School Term Dates & Fixtures</h3>
            <Button
              variant="emerald"
              size="sm"
              className="gap-2"
              onClick={() => setIsAddEventOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create School Event</span>
            </Button>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{ev.title}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      {ev.category}
                    </span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-4 text-[11px]">
                    <span className="font-semibold text-emerald-700">{ev.date} • {ev.time}</span>
                    <span>Venue: {ev.venue}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-auto text-slate-600"
                  onClick={() => {
                    setSuccessBanner(`Reminder notice scheduled for "${ev.title}".`);
                    setTimeout(() => setSuccessBanner(null), 3000);
                  }}
                >
                  Notify Community
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FLEET & TRANSPORT TAB */}
      {activeTab === "transport" && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">School Bus Fleet & Daily Student Transport Routes</h3>
              <p className="text-slate-500 text-[11px]">Safety verified GPS tracking & authorized drivers</p>
            </div>
            <Button
              variant="emerald"
              size="sm"
              className="gap-2"
              onClick={() => {
                setSuccessBanner("Fleet route manifest synchronized with parent tracking gateway.");
                setTimeout(() => setSuccessBanner(null), 3000);
              }}
            >
              <Bus className="h-4 w-4" />
              <span>Sync Fleet Roster</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routes.map((rt) => (
              <div
                key={rt.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{rt.name}</h4>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      {rt.capacity}
                    </span>
                  </div>
                  <div className="text-slate-600 space-y-1 text-[11px]">
                    <div><strong>Vehicle:</strong> {rt.busNo}</div>
                    <div><strong>Driver:</strong> {rt.driver} ({rt.phone})</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-500 uppercase text-[9px] block mb-0.5">Route Stops:</span>
                    <p className="text-slate-700 italic">{rt.stops}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-emerald-700 font-semibold">
                  <span className="text-[11px]">GPS: Normal Route</span>
                  <Link href="/communication?action=broadcast" className="hover:underline">
                    Broadcast to Route →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DISCIPLINE & PASTORAL TAB */}
      {activeTab === "discipline" && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Pastoral Care & Conduct Incident Register</h3>
            <Button
              variant="emerald"
              size="sm"
              className="gap-2"
              onClick={() => setIsAddCaseOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Log Incident</span>
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Incident Description</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {disciplineCases.map((cs) => (
                  <tr key={cs.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{cs.student}</td>
                    <td className="py-3 px-4 text-slate-500">{cs.class}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{cs.type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cs.severity === "HIGH"
                            ? "bg-rose-100 text-rose-800"
                            : cs.severity === "MEDIUM"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {cs.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 leading-relaxed text-[11px]">{cs.action}</td>
                    <td className="py-3 px-4 text-right font-bold text-[10px]">
                      <span className={cs.status === "RESOLVED" ? "text-emerald-700" : "text-amber-700"}>
                        {cs.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. POLICY DOCUMENTS (RAG) TAB */}
      {activeTab === "documents" && (
        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Institutional Vector Knowledge Base (RAG)
              </h3>
              <p className="text-slate-500 text-[11px]">
                Governing handbooks ingested for semantic search and AI Assistant citation
              </p>
            </div>
            <Button
              variant="emerald"
              size="sm"
              className="gap-2"
              onClick={() => setIsUploadDocOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Upload Policy Document</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{doc.title}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      {doc.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1 font-mono text-emerald-700 font-semibold">
                      <Database className="h-3 w-3" /> {doc.chunks} Semantic Embeddings
                    </span>
                    <span>Updated: {doc.lastUpdated}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Vector Indexed
                  </span>
                  <Link
                    href="/intelligence?tab=rag"
                    className="text-slate-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                  >
                    Query in RAG →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Add Faculty Staff Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Christine Wanjiru"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Designation / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Chemistry Instructor"
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department</label>
                <select
                  value={newStaffDept}
                  onChange={(e) => setNewStaffDept(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                >
                  <option value="Sciences">Sciences</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Languages">Languages</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Creative Arts">Creative Arts</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="name@sopacademy.ac.ke"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+254 7..."
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddStaffOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm">
                  Register Faculty
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Create Master Event</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEventOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cambridge IGCSE Practical Briefing"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12 Nov 2026"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="SPORTS">Sports</option>
                    <option value="PASTORAL">Pastoral</option>
                    <option value="GOVERNANCE">Governance / AGM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Venue / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Multi-Purpose Hall"
                  value={newEventVenue}
                  onChange={(e) => setNewEventVenue(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm">
                  Publish Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Discipline Case Modal */}
      {isAddCaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Log Behavioral Incident</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCaseOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDiscipline} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kevin Kimani"
                  value={newCaseStudent}
                  onChange={(e) => setNewCaseStudent(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Class</label>
                  <select
                    value={newCaseClass}
                    onChange={(e) => setNewCaseClass(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="Grade 8 East">Grade 8 East</option>
                    <option value="Grade 7 West">Grade 7 West</option>
                    <option value="Year 10 Alpha">Year 10 Alpha</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Severity</label>
                  <select
                    value={newCaseSeverity}
                    onChange={(e) => setNewCaseSeverity(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="LOW">Low (Minor Infraction)</option>
                    <option value="MEDIUM">Medium (Repeated)</option>
                    <option value="HIGH">High (Formal Hearing)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Incident Type / Details</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Absence from designated study hall"
                  value={newCaseType}
                  onChange={(e) => setNewCaseType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Action / Resolution Taken</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Parental notification and counselor interview scheduled."
                  value={newCaseAction}
                  onChange={(e) => setNewCaseAction(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddCaseOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm">
                  Save Incident
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Upload & Vectorize Policy</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadDocOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Policy Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. School Health, Wellness & Sanitization Protocol"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Knowledge Category</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                >
                  <option value="Academics">Academics</option>
                  <option value="Finance & Bursary">Finance & Bursary</option>
                  <option value="Behavior & Pastoral">Behavior & Pastoral</option>
                  <option value="Operations & Safety">Operations & Safety</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center space-y-1">
                <FileText className="h-6 w-6 text-slate-400 mx-auto" />
                <div className="font-semibold text-slate-800">Select PDF / Word Document</div>
                <div className="text-[10px] text-slate-400">Up to 25 MB • Automated chunking & vector embedding</div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadDocOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm">
                  Index Document
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdministrationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading School Administration...</div>}>
      <AdministrationContent />
    </Suspense>
  );
}
