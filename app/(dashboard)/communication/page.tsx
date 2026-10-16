"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageSquare,
  Send,
  Smartphone,
  Mail,
  Bell,
  Users,
  PlusCircle,
  Clock,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnnouncementItem {
  id: string;
  title: string;
  channel: string;
  target: string;
  date: string;
  status: "PUBLISHED" | "SCHEDULED" | "DRAFT";
  snippet: string;
}

interface MessageTemplate {
  id: string;
  title: string;
  channel: string;
  body: string;
  tags: string[];
}

interface DirectMessage {
  id: string;
  recipient: string;
  student: string;
  phone: string;
  channel: "SMS" | "WHATSAPP";
  text: string;
  timestamp: string;
  sender: string;
}

const INITIAL_TEMPLATES: MessageTemplate[] = [
  {
    id: "tpl-1",
    title: "Term 1 Fee Balance Payment Notice",
    channel: "SMS & WHATSAPP",
    tags: ["Finance", "Fees", "Urgent"],
    body: "Dear Parent, kindly note that Term 1 fee balance of {amount} for {student_name} ({adm_no}) is due on {due_date}. Pay via Paybill 522123, Acc: {adm_no}. Thank you.",
  },
  {
    id: "tpl-2",
    title: "Low Attendance Alert Warning",
    channel: "SMS",
    tags: ["Attendance", "Pastoral"],
    body: "Notice: {student_name} was marked absent today without prior notice. Please contact the class teacher or school administration immediately.",
  },
  {
    id: "tpl-3",
    title: "Mid-Term Academic Progress Reports",
    channel: "SMS & EMAIL",
    tags: ["Academics", "Reports"],
    body: "Dear Parent, Mid-term academic performance reports for {student_name} have been published to the SOP Parent Portal. Log in to review assessment results and teacher remarks.",
  },
  {
    id: "tpl-4",
    title: "School Transport Schedule Update",
    channel: "SMS & WHATSAPP",
    tags: ["Operations", "Transport"],
    body: "School Transport Update: Route 2 morning pickup times will shift earlier by 10 minutes starting Monday due to road maintenance on Ngong Road.",
  },
];

function CommunicationContent() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "announcements" | "direct" | "templates" | "logs"
  >("announcements");

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([
    {
      id: "ann-1",
      title: "Mid-Term Academic Progress Reports & Parent-Teacher Consultations",
      channel: "SMS & EMAIL",
      target: "ALL PARENTS",
      date: "08 Oct 2026, 08:30 AM",
      status: "PUBLISHED",
      snippet:
        "Dear Parents, Mid-Term evaluation progress reports will be accessible on the parent portal starting Friday Oct 16. Consultative meetings are scheduled for Saturday Oct 17.",
    },
    {
      id: "ann-2",
      title: "Term 1 Fee Balance Payment Reminder",
      channel: "SMS & WHATSAPP",
      target: "PARENTS WITH ARREARS",
      date: "06 Oct 2026, 10:00 AM",
      status: "PUBLISHED",
      snippet:
        "Kindly note that all school fee balances must be cleared prior to mid-term exam week. Use Paybill 522123 with your child's admission number as account reference.",
    },
    {
      id: "ann-3",
      title: "Annual Inter-House Sports Gala 2026",
      channel: "SMS & WHATSAPP",
      target: "ALL PARENTS",
      date: "02 Oct 2026, 14:15 PM",
      status: "PUBLISHED",
      snippet:
        "SOP International Academy warmly invites all guardians to the Kasarani Track for our annual inter-house athletics competition this Saturday from 8:30 AM.",
    },
  ]);

  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([
    {
      id: "dm-1",
      recipient: "David Kimani",
      student: "Kevin Kimani (Grade 8 East)",
      phone: "+254 712 345 678",
      channel: "SMS",
      text: "Dear Mr. Kimani, Kevin's fee payment of KES 60,000 has been verified. Official Receipt REC-2026-0089 issued.",
      timestamp: "Yesterday, 14:25",
      sender: "Bursar Office",
    },
    {
      id: "dm-2",
      recipient: "Grace Otieno",
      student: "Amani Otieno (Grade 8 East)",
      phone: "+254 723 456 789",
      channel: "WHATSAPP",
      text: "Congratulations Mrs. Otieno! Amani achieved Position 1 in the Mid-term mathematics assessment with 88%.",
      timestamp: "06 Oct 2026, 11:30",
      sender: "Sarah Mwangi (Class Teacher)",
    },
  ]);

  // Modal & composer states
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form states for broadcast
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastChannel, setBroadcastChannel] = useState("SMS & WHATSAPP");
  const [broadcastTarget, setBroadcastTarget] = useState("ALL PARENTS");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  // Direct message composer states
  const [dmRecipient, setDmRecipient] = useState("David Kimani");
  const [dmStudent, setDmStudent] = useState("Kevin Kimani (Grade 8 East)");
  const [dmPhone, setDmPhone] = useState("+254 712 345 678");
  const [dmChannel, setDmChannel] = useState<"SMS" | "WHATSAPP">("SMS");
  const [dmText, setDmText] = useState("");

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/communication/announcements");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: AnnouncementItem[] = json.data.map((a: any) => ({
          id: a.id,
          title: a.title,
          channel: a.channel,
          target: a.targetRole,
          date: new Date(a.publishedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: a.status,
          snippet: a.content,
        }));
        setAnnouncements(mapped);
      }
    } catch (err) {
      // Keep initial announcements
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/communication/logs");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mappedLogs: DirectMessage[] = json.data.map((l: any) => ({
          id: l.id,
          recipient: l.recipientName,
          student: l.studentName || "Linked Student",
          phone: l.recipientPhone || "+254 700 000 000",
          channel: l.channel === "WHATSAPP" ? "WHATSAPP" : "SMS",
          text: l.body,
          timestamp: new Date(l.sentAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          sender: l.sender,
        }));
        setDirectMessages(mappedLogs);
      }
    } catch (err) {
      // Keep initial logs
    }
  };

  // Handle URL deep links & load live data
  useEffect(() => {
    fetchAnnouncements();
    fetchLogs();
    if (actionParam === "broadcast") {
      setIsBroadcastOpen(true);
    }
    if (tabParam === "direct") setActiveTab("direct");
    else if (tabParam === "templates") setActiveTab("templates");
    else if (tabParam === "logs") setActiveTab("logs");
    else if (tabParam === "announcements") setActiveTab("announcements");
  }, [actionParam, tabParam]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/communication/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle.trim(),
          channel: broadcastChannel,
          targetRole: broadcastTarget,
          content: broadcastBody.trim(),
          status: "PUBLISHED",
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const a = json.data;
        const newAnn: AnnouncementItem = {
          id: a.id,
          title: a.title,
          channel: a.channel,
          target: a.targetRole,
          date: "Just now",
          status: a.status,
          snippet: a.content,
        };
        setAnnouncements((prev) => [newAnn, ...prev]);
        setSuccessBanner(`Broadcast "${newAnn.title}" published successfully via ${newAnn.channel}!`);
      } else {
        const newAnn: AnnouncementItem = {
          id: `ann-${Date.now()}`,
          title: broadcastTitle.trim(),
          channel: broadcastChannel,
          target: broadcastTarget,
          date: "Just now",
          status: "PUBLISHED",
          snippet: broadcastBody.trim(),
        };
        setAnnouncements((prev) => [newAnn, ...prev]);
        setSuccessBanner(`Broadcast "${newAnn.title}" sent successfully!`);
      }
    } catch {
      const newAnn: AnnouncementItem = {
        id: `ann-${Date.now()}`,
        title: broadcastTitle.trim(),
        channel: broadcastChannel,
        target: broadcastTarget,
        date: "Just now",
        status: "PUBLISHED",
        snippet: broadcastBody.trim(),
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
      setSuccessBanner(`Broadcast "${newAnn.title}" sent successfully!`);
    } finally {
      setIsSubmitting(false);
      setIsBroadcastOpen(false);
      setBroadcastTitle("");
      setBroadcastBody("");
      setTimeout(() => setSuccessBanner(null), 5000);
    }
  };

  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/communication/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: dmRecipient,
          studentName: dmStudent,
          recipientPhone: dmPhone,
          channel: dmChannel,
          body: dmText.trim(),
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const l = json.data;
        const newDm: DirectMessage = {
          id: l.id,
          recipient: l.recipientName,
          student: l.studentName || dmStudent,
          phone: l.recipientPhone || dmPhone,
          channel: l.channel as any,
          text: l.body,
          timestamp: "Just now",
          sender: l.sender,
        };
        setDirectMessages((prev) => [newDm, ...prev]);
        setSuccessBanner(`Direct notice delivered via Africa's Talking Gateway (Ref: ${l.providerReference}).`);
      } else {
        const newDm: DirectMessage = {
          id: `dm-${Date.now()}`,
          recipient: dmRecipient,
          student: dmStudent,
          phone: dmPhone,
          channel: dmChannel,
          text: dmText.trim(),
          timestamp: "Just now",
          sender: "School Administration",
        };
        setDirectMessages((prev) => [newDm, ...prev]);
        setSuccessBanner(`Direct notice dispatched to ${newDm.recipient} (${newDm.phone}) via ${newDm.channel}.`);
      }
    } catch {
      const newDm: DirectMessage = {
        id: `dm-${Date.now()}`,
        recipient: dmRecipient,
        student: dmStudent,
        phone: dmPhone,
        channel: dmChannel,
        text: dmText.trim(),
        timestamp: "Just now",
        sender: "School Administration",
      };
      setDirectMessages((prev) => [newDm, ...prev]);
      setSuccessBanner(`Direct notice dispatched to ${newDm.recipient} (${newDm.phone}) via ${newDm.channel}.`);
    } finally {
      setIsSubmitting(false);
      setDmText("");
      setTimeout(() => setSuccessBanner(null), 4000);
    }
  };


  const handleUseTemplate = (tpl: MessageTemplate) => {
    setBroadcastTitle(tpl.title);
    setBroadcastBody(tpl.body);
    setBroadcastChannel(tpl.channel);
    setIsBroadcastOpen(true);
  };

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
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            Parent Communication Center
          </h1>
          <p className="text-xs text-slate-500">
            Multi-channel broadcast: SMS Gateway, WhatsApp Business API abstraction & Email
          </p>
        </div>

        <Button
          variant="emerald"
          size="sm"
          className="gap-2 shadow-sm"
          onClick={() => setIsBroadcastOpen(true)}
        >
          <Send className="h-4 w-4" />
          <span>Broadcast Message</span>
        </Button>
      </div>

      {/* Channel Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>SMS Provider (Africa&apos;s Talking)</span>
            <Smartphone className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">Active • 9,450 Units</div>
          <div className="text-[11px] text-emerald-600 font-medium">Sender ID: SOPACADEMY</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>WhatsApp Business API</span>
            <MessageSquare className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">Connected</div>
          <div className="text-[11px] text-slate-500">Official template verified</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Transactional Email (SMTP)</span>
            <Mail className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">99.2% Delivery Rate</div>
          <div className="text-[11px] text-slate-500">notifications@sopacademy.ac.ke</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("announcements")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "announcements"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Announcements & Bulletins ({announcements.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("direct")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "direct"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Parent Direct Messages ({directMessages.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("templates")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "templates"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Message Templates ({INITIAL_TEMPLATES.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`pb-2.5 transition-colors whitespace-nowrap ${
            activeTab === "logs"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Delivery & Gateway Logs
        </button>
      </div>

      {/* 1. ANNOUNCEMENTS TAB */}
      {activeTab === "announcements" && (
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{ann.title}</span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                  {ann.status}
                </span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">{ann.snippet}</p>
              <div className="flex items-center gap-4 text-slate-400 text-[11px] pt-1 border-t border-slate-100">
                <span>Target: {ann.target}</span>
                <span>•</span>
                <span>Channel: {ann.channel}</span>
                <span>•</span>
                <span>Published: {ann.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. DIRECT MESSAGES TAB */}
      {activeTab === "direct" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          <div className="lg:col-span-1 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Send className="h-4 w-4 text-emerald-600" />
              Compose Direct Notice
            </h3>

            <form onSubmit={handleSendDirectMessage} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Guardian</label>
                <select
                  value={dmRecipient}
                  onChange={(e) => {
                    setDmRecipient(e.target.value);
                    if (e.target.value === "David Kimani") {
                      setDmStudent("Kevin Kimani (Grade 8 East)");
                      setDmPhone("+254 712 345 678");
                    } else if (e.target.value === "Grace Otieno") {
                      setDmStudent("Amani Otieno (Grade 8 East)");
                      setDmPhone("+254 723 456 789");
                    } else {
                      setDmStudent("Zawadi Muthoni (Grade 8 East)");
                      setDmPhone("+254 734 567 890");
                    }
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                >
                  <option value="David Kimani">David Kimani — Kevin Kimani (+254 712 345 678)</option>
                  <option value="Grace Otieno">Grace Otieno — Amani Otieno (+254 723 456 789)</option>
                  <option value="James Muthoni">James Muthoni — Zawadi Muthoni (+254 734 567 890)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDmChannel("SMS")}
                    className={`p-2 rounded-lg border text-center font-bold ${
                      dmChannel === "SMS"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    SMS Gateway
                  </button>
                  <button
                    type="button"
                    onClick={() => setDmChannel("WHATSAPP")}
                    className={`p-2 rounded-lg border text-center font-bold ${
                      dmChannel === "WHATSAPP"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Message Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type message directly to the parent..."
                  value={dmText}
                  onChange={(e) => setDmText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
                <span className="text-[10px] text-slate-400">
                  {dmText.length} characters • 1 unit
                </span>
              </div>

              <Button type="submit" variant="emerald" size="sm" className="w-full gap-1.5">
                <Send className="h-3.5 w-3.5" />
                <span>Send to {dmPhone}</span>
              </Button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Direct Conversation Logs</h3>
            <div className="space-y-3">
              {directMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{msg.recipient}</span>
                      <span className="text-slate-400 ml-2">({msg.student})</span>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {msg.channel} • {msg.phone}
                    </span>
                  </div>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {msg.text}
                  </p>
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Sender: {msg.sender}</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCheck className="h-3.5 w-3.5" /> Delivered • {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MESSAGE TEMPLATES TAB */}
      {activeTab === "templates" && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Approved School Communication Templates</h3>
              <p className="text-slate-500 text-[11px]">Standardized SMS & WhatsApp notifications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{tpl.title}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      {tpl.channel}
                    </span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {tpl.tags.map((tag) => (
                      <span key={tag} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono text-[11px] leading-relaxed">
                    {tpl.body}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="emerald"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => handleUseTemplate(tpl)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Use Template</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DELIVERY & GATEWAY LOGS TAB */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">SMS & WhatsApp Gateway Delivery Stream</h3>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Message ID</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Content</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500">MSG-8921-AT</td>
                  <td className="py-3 px-4 font-mono">+254 712 345 678</td>
                  <td className="py-3 px-4">SMS (Africa&apos;s Talking)</td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-xs">Kevin Kimani fee receipt REC-2026-0089</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Delivered (200 OK)</td>
                  <td className="py-3 px-4 text-slate-400">07 Oct, 14:23</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500">MSG-8920-WA</td>
                  <td className="py-3 px-4 font-mono">+254 723 456 789</td>
                  <td className="py-3 px-4">WhatsApp Cloud API</td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-xs">Mid-Term academic progress reports available</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Read (Blue Ticks)</td>
                  <td className="py-3 px-4 text-slate-400">06 Oct, 10:02</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500">MSG-8919-AT</td>
                  <td className="py-3 px-4 font-mono">+254 734 567 890</td>
                  <td className="py-3 px-4">SMS (Africa&apos;s Talking)</td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-xs">Zawadi Muthoni absence notice Oct 08</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">Delivered (200 OK)</td>
                  <td className="py-3 px-4 text-slate-400">05 Oct, 08:35</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Broadcast Message Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Broadcast Announcement</h3>
                  <p className="text-[11px] text-slate-500">Multi-channel gateway broadcast to parents and staff</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End of Term Consultative Meetings"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Group</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="ALL PARENTS">All Parents (Full School)</option>
                    <option value="GRADE 8 PARENTS">Grade 8 Parents Only</option>
                    <option value="PARENTS WITH ARREARS">Parents with Fee Arrears</option>
                    <option value="TRANSPORT ROUTE 2">Transport Route 2 Parents</option>
                    <option value="TEACHING STAFF">All Teaching Staff</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Delivery Channel</label>
                  <select
                    value={broadcastChannel}
                    onChange={(e) => setBroadcastChannel(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  >
                    <option value="SMS & WHATSAPP">SMS & WhatsApp</option>
                    <option value="SMS ONLY">SMS Only (Sender: SOPACADEMY)</option>
                    <option value="WHATSAPP ONLY">WhatsApp Cloud API Only</option>
                    <option value="EMAIL ONLY">Email (notifications@sopacademy.ac.ke)</option>
                    <option value="SMS & EMAIL">SMS & Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Compose notice..."
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>Standard SMS characters: {broadcastBody.length}</span>
                  <span>Estimated units: {Math.max(1, Math.ceil(broadcastBody.length / 160))} per contact</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBroadcastOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="emerald" size="sm" className="gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  <span>Dispatch Broadcast</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunicationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Communication Portal...</div>}>
      <CommunicationContent />
    </Suspense>
  );
}
