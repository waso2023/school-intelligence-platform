import {
  NotificationChannel,
  NotificationDeliveryResult,
  NotificationMessage,
  NotificationProvider,
  MockNotificationProvider,
} from "./interfaces";
import { getStudentById } from "@/lib/data/students-store";
import { getPersistentCollection } from "@/lib/db/persistentStore";

export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  channel: string;
  targetRole: string; // ALL, PARENTS, TEACHERS, STUDENTS
  content: string;
  publishedAt: string;
  status: "PUBLISHED" | "SCHEDULED" | "DRAFT";
  author: string;
}

export interface DirectMessageLog {
  id: string;
  schoolId: string;
  recipientName: string;
  studentName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  status: "SENT" | "DELIVERED" | "FAILED";
  providerReference?: string;
  sentAt: string;
  sender: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  channel: string;
  tags: string[];
  template: string;
}

// Persistent Communication Collections
const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    schoolId: "school-sop-001",
    title: "Mid-Term Academic Progress Reports & Consultations",
    channel: "SMS & EMAIL",
    targetRole: "ALL PARENTS",
    content: "Term 1 mid-term assessment reports have been compiled. Individual parent-teacher conferences commence this Friday at 09:00 AM in the Main Hall.",
    publishedAt: "2026-10-08T08:30:00Z",
    status: "PUBLISHED",
    author: "Prof. Arthur Ochieng (Principal)",
  },
  {
    id: "ann-2",
    schoolId: "school-sop-001",
    title: "Term 1 School Fee Balance Payment Notice",
    channel: "SMS & WHATSAPP",
    targetRole: "PARENTS WITH ARREARS",
    content: "Notice to guardians: Term 1 fee balances must be cleared by October 31st via M-Pesa Paybill 522123, Account: [Admission Number].",
    publishedAt: "2026-10-06T14:00:00Z",
    status: "PUBLISHED",
    author: "Peter Kipkorir (Bursar)",
  },
  {
    id: "ann-3",
    schoolId: "school-sop-001",
    title: "Inter-School Swimming Gala & Athletics Trials",
    channel: "IN-APP",
    targetRole: "STUDENTS & STAFF",
    content: "The annual Karen Interschool Swimming Championship takes place at Brookhouse School Karen on Saturday, 18th October.",
    publishedAt: "2026-10-04T10:15:00Z",
    status: "PUBLISHED",
    author: "Coach Dennis Mutiso",
  },
];

const INITIAL_MESSAGE_LOGS: DirectMessageLog[] = [
  {
    id: "log-1",
    schoolId: "school-sop-001",
    recipientName: "David Kimani",
    studentName: "Kevin Kimani (Grade 8 East)",
    recipientPhone: "+254 722 400 001",
    channel: "SMS",
    subject: "Fee Payment Confirmation",
    body: "Payment received: KSh 60,000 for Kevin Kimani (SOP-2024-0082). Ref: QWE89284KL. Balance: KSh 25,000. Official receipt: REC-2026-0089. Thank you.",
    status: "DELIVERED",
    providerReference: "AT-SMS-9821731",
    sentAt: "2026-10-07T14:23:00Z",
    sender: "Finance Department",
  },
  {
    id: "log-2",
    schoolId: "school-sop-001",
    recipientName: "Lucy Muthoni",
    studentName: "Zawadi Muthoni (Grade 8 East)",
    recipientPhone: "+254 722 555 123",
    channel: "SMS",
    subject: "Attendance Alert",
    body: "Notice: Zawadi Muthoni (SOP-2024-0084) was marked absent today without prior notice. Kindly contact Homeroom Teacher Sarah Wanjiku.",
    status: "DELIVERED",
    providerReference: "AT-SMS-9820412",
    sentAt: "2026-10-08T08:45:00Z",
    sender: "Sarah Wanjiku (Homeroom Teacher)",
  },
];

const announcementsCollection = getPersistentCollection<Announcement>("announcements", () => INITIAL_ANNOUNCEMENTS);
const messageLogsCollection = getPersistentCollection<DirectMessageLog>("messages", () => INITIAL_MESSAGE_LOGS);

const TEMPLATES: MessageTemplate[] = [
  {
    id: "tpl-1",
    title: "Term Fee Balance Payment Reminder",
    channel: "SMS & WHATSAPP",
    tags: ["Finance", "Fees", "Urgent"],
    template: "Dear {parent_name}, kindly note that Term 1 fee balance of KSh {balance} for {student_name} ({adm_no}) is due on {due_date}. Pay via Paybill 522123, Acc: {adm_no}. Thank you.",
  },
  {
    id: "tpl-2",
    title: "Low Attendance Alert Warning",
    channel: "SMS",
    tags: ["Attendance", "Pastoral"],
    template: "Notice: {student_name} was marked absent on {date} without prior notice. Please contact {teacher_name} or school administration.",
  },
  {
    id: "tpl-3",
    title: "Mid-Term Academic Progress Reports",
    channel: "SMS & EMAIL",
    tags: ["Academics", "Reports"],
    template: "Dear {parent_name}, Mid-term academic performance reports for {student_name} have been published to the SOP Parent Portal. Log in to review marks.",
  },
];

// In-Memory Sent Messages Hasher for Duplicate-Send Prevention (10-minute window)
const RECENT_SEND_HASHES = new Map<string, number>();

export class CommunicationService {
  /**
   * Interpolates named variables inside template strings
   * Example: "Hello {name}" with { name: "David" } => "Hello David"
   */
  static renderTemplate(template: string, variables: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
      return variables[key] !== undefined ? String(variables[key]) : `{${key}}`;
    });
  }

  /**
   * Generates a deduplication key for preventing double-send accidents
   */
  static generateDeduplicationKey(recipient: string, body: string): string {
    return `${recipient.trim().toLowerCase()}::${body.trim()}`;
  }

  /**
   * Checks if message was dispatched recently (prevents accidental duplicate button clicks)
   */
  static isDuplicateSend(recipient: string, body: string, windowSeconds: number = 300): boolean {
    const key = this.generateDeduplicationKey(recipient, body);
    const lastSent = RECENT_SEND_HASHES.get(key);
    const now = Date.now();

    if (lastSent && now - lastSent < windowSeconds * 1000) {
      return true;
    }
    return false;
  }

  /**
   * Retrieves all published announcements for a school tenant
   */
  static async getAnnouncements(schoolId: string): Promise<Announcement[]> {
    return announcementsCollection.getAll().filter((a) => a.schoolId === schoolId);
  }

  /**
   * Creates and publishes a new announcement
   */
  static async createAnnouncement(data: Omit<Announcement, "id" | "publishedAt">): Promise<Announcement> {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      schoolId: data.schoolId,
      title: data.title,
      channel: data.channel,
      targetRole: data.targetRole,
      content: data.content,
      publishedAt: new Date().toISOString(),
      status: data.status,
      author: data.author,
    };

    announcementsCollection.insert(newAnn);
    return newAnn;
  }

  /**
   * Retrieves direct message dispatch logs for a school tenant
   */
  static async getMessageLogs(schoolId: string): Promise<DirectMessageLog[]> {
    return messageLogsCollection.getAll().filter((m) => m.schoolId === schoolId);
  }

  /**
   * Retrieves available message templates
   */
  static getTemplates(): MessageTemplate[] {
    return TEMPLATES;
  }

  /**
   * Dispatches a direct message (SMS/WhatsApp/Email) with duplicate prevention
   */
  static async sendMessage(data: {
    schoolId: string;
    recipientName: string;
    studentName?: string;
    recipientPhone?: string;
    recipientEmail?: string;
    channel: NotificationChannel;
    subject?: string;
    body: string;
    sender: string;
    bypassDuplicateCheck?: boolean;
  }): Promise<DirectMessageLog> {
    const recipientAddr = data.channel === "EMAIL" ? data.recipientEmail : data.recipientPhone;
    if (!recipientAddr) {
      throw new Error(`MISSING_RECIPIENT_ADDRESS: Destination address missing for channel ${data.channel}`);
    }

    // 1. Duplicate-Send Prevention
    if (!data.bypassDuplicateCheck && this.isDuplicateSend(recipientAddr, data.body)) {
      throw new Error("DUPLICATE_MESSAGE_DETECTED: An identical notification was already sent to this recipient within the last 5 minutes.");
    }

    // 2. Mark hash in deduplication window
    const key = this.generateDeduplicationKey(recipientAddr, data.body);
    RECENT_SEND_HASHES.set(key, Date.now());

    // 3. Provider Reference (simulated Africa's Talking or SMTP gateway)
    const providerRef = `AT-${data.channel}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const log: DirectMessageLog = {
      id: `log-${Date.now()}`,
      schoolId: data.schoolId,
      recipientName: data.recipientName,
      studentName: data.studentName,
      recipientPhone: data.recipientPhone,
      recipientEmail: data.recipientEmail,
      channel: data.channel,
      subject: data.subject,
      body: data.body,
      status: "DELIVERED",
      providerReference: providerRef,
      sentAt: new Date().toISOString(),
      sender: data.sender,
    };

    messageLogsCollection.insert(log);
    return log;
  }

  /**
   * Automated helper: Sends a fee balance reminder to a student's parent
   */
  static async sendFeeReminder(schoolId: string, studentId: string, sender: string = "Finance Department") {
    const student = getStudentById(studentId);
    if (!student) throw new Error("Student not found");

    const template = TEMPLATES.find((t) => t.id === "tpl-1")?.template || "";
    const body = this.renderTemplate(template, {
      parent_name: student.parent.fullName,
      student_name: `${student.firstName} ${student.lastName}`,
      adm_no: student.admissionNumber,
      balance: student.fees.balance.toLocaleString(),
      due_date: "31 Oct 2026",
    });

    return this.sendMessage({
      schoolId,
      recipientName: student.parent.fullName,
      studentName: `${student.firstName} ${student.lastName} (${student.className})`,
      recipientPhone: student.parent.phone,
      channel: "SMS",
      subject: "Fee Balance Reminder",
      body,
      sender,
    });
  }
}
