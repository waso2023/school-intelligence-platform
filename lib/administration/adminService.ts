import { getPersistentCollection } from "@/lib/db/persistentStore";

export interface TimetableSlot {
  id: string;
  schoolId: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  period: number;
  startTime: string; // "08:00 AM"
  endTime: string;   // "08:45 AM"
  className: string; // "Grade 8"
  streamName: string; // "East"
  subject: string;   // "Mathematics"
  teacherName: string; // "Sarah Wanjiku"
  room: string;      // "Room 14"
}

export interface TransportRouteItem {
  id: string;
  schoolId: string;
  name: string;
  busReg: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  stops: string[];
  enrolledStudents: number;
}

export interface DisciplineCaseItem {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  className: string;
  incidentType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  description: string;
  actionTaken: string;
  reportedBy: string;
  date: string;
  status: "OPEN" | "INVESTIGATING" | "COUNSELING" | "RESOLVED";
}

export interface StaffMember {
  id: string;
  schoolId: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  workload: string;
}

export interface SchoolEventItem {
  id: string;
  schoolId: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: "ACADEMIC" | "SPORTS" | "PASTORAL" | "GOVERNANCE";
}

// Persistent Administration Collections
const INITIAL_TIMETABLE_SLOTS: TimetableSlot[] = [
  {
    id: "tt-1",
    schoolId: "school-sop-001",
    dayOfWeek: "Monday",
    period: 1,
    startTime: "08:00 AM",
    endTime: "08:45 AM",
    className: "Grade 8",
    streamName: "East",
    subject: "Mathematics",
    teacherName: "Sarah Wanjiku",
    room: "Room 14",
  },
  {
    id: "tt-2",
    schoolId: "school-sop-001",
    dayOfWeek: "Monday",
    period: 2,
    startTime: "08:45 AM",
    endTime: "09:30 AM",
    className: "Grade 8",
    streamName: "East",
    subject: "Integrated Science",
    teacherName: "Sarah Wanjiku",
    room: "Science Lab 2",
  },
  {
    id: "tt-3",
    schoolId: "school-sop-001",
    dayOfWeek: "Monday",
    period: 3,
    startTime: "09:45 AM",
    endTime: "10:30 AM",
    className: "Grade 7",
    streamName: "North",
    subject: "Integrated Science",
    teacherName: "James Mutua",
    room: "Science Lab 1",
  },
  {
    id: "tt-4",
    schoolId: "school-sop-001",
    dayOfWeek: "Monday",
    period: 4,
    startTime: "10:30 AM",
    endTime: "11:15 AM",
    className: "Year 10",
    streamName: "Alpha",
    subject: "Cambridge Physics",
    teacherName: "Brian Odhiambo",
    room: "Senior Physics Lab",
  },
];

const INITIAL_TRANSPORT_ROUTES: TransportRouteItem[] = [
  {
    id: "rt-1",
    schoolId: "school-sop-001",
    name: "Route 1: Kilimani - Kileleshwa - Lavington",
    busReg: "KDF 432B",
    capacity: 33,
    driverName: "Mwangi Karanja",
    driverPhone: "+254 722 789 012",
    stops: ["Yaya Centre", "Valley Arcade", "QuickMart Lavington", "School Gate"],
    enrolledStudents: 28,
  },
  {
    id: "rt-2",
    schoolId: "school-sop-001",
    name: "Route 2: Karen - Langata - Hardy",
    busReg: "KCP 891Z",
    capacity: 33,
    driverName: "Joseph Otieno",
    driverPhone: "+254 733 456 789",
    stops: ["Hardy Shopping Centre", "Galleria Mall", "Langata Road Total", "School Gate"],
    enrolledStudents: 31,
  },
  {
    id: "rt-3",
    schoolId: "school-sop-001",
    name: "Route 3: Westlands - Spring Valley - Parklands",
    busReg: "KDG 102M",
    capacity: 25,
    driverName: "Francis Chege",
    driverPhone: "+254 710 234 567",
    stops: ["Sarit Centre", "Westgate Mall", "Parklands Highridge", "School Gate"],
    enrolledStudents: 22,
  },
];

const INITIAL_DISCIPLINE_CASES: DisciplineCaseItem[] = [
  {
    id: "disc-1",
    schoolId: "school-sop-001",
    studentId: "std-003",
    studentName: "Zawadi Muthoni",
    className: "Grade 8 East",
    incidentType: "Late Arrival to Homeroom",
    severity: "LOW",
    description: "Repeated late arrival past the 08:00 AM registration bell without medical note.",
    actionTaken: "Verbal counseling & homeroom late slip GATE-2026-042 issued",
    reportedBy: "Sarah Wanjiku (Homeroom Teacher)",
    date: "08 Oct 2026",
    status: "RESOLVED",
  },
  {
    id: "disc-2",
    schoolId: "school-sop-001",
    studentId: "std-004",
    studentName: "Brian Kiprono",
    className: "Grade 8 East",
    incidentType: "Incomplete Prep Assignment",
    severity: "LOW",
    description: "Missed continuous assessment homework submission twice consecutively.",
    actionTaken: "Lunchtime remedial study session assigned",
    reportedBy: "Sarah Wanjiku (Homeroom Teacher)",
    date: "06 Oct 2026",
    status: "COUNSELING",
  },
];

const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: "st-1",
    schoolId: "school-sop-001",
    name: "Dr. Peter Kamau",
    role: "Head of Sciences & STEM",
    department: "Sciences",
    email: "peter.kamau@sopacademy.ac.ke",
    phone: "+254 722 101 202",
    workload: "22 periods/wk",
  },
  {
    id: "st-2",
    schoolId: "school-sop-001",
    name: "Sarah Mwangi",
    role: "Senior Educator & Grade 8 East Lead",
    department: "Languages",
    email: "sarah.mwangi@sopacademy.ac.ke",
    phone: "+254 723 202 303",
    workload: "24 periods/wk",
  },
  {
    id: "st-3",
    schoolId: "school-sop-001",
    name: "Dennis Njoroge",
    role: "Mathematics Faculty Lead",
    department: "Mathematics",
    email: "dennis.njoroge@sopacademy.ac.ke",
    phone: "+254 724 303 404",
    workload: "20 periods/wk",
  },
  {
    id: "st-4",
    schoolId: "school-sop-001",
    name: "Lucy Wanjiru",
    role: "IGCSE Coordinator & Social Sciences",
    department: "Humanities",
    email: "lucy.wanjiru@sopacademy.ac.ke",
    phone: "+254 725 404 505",
    workload: "18 periods/wk",
  },
];

const INITIAL_EVENTS: SchoolEventItem[] = [
  {
    id: "ev-1",
    schoolId: "school-sop-001",
    title: "Term 1 Mid-Term Consultative Parent Conferences",
    date: "17 Oct 2026",
    time: "08:30 AM - 14:00 PM",
    venue: "Main Auditorium & Virtual",
    category: "ACADEMIC",
  },
  {
    id: "ev-2",
    schoolId: "school-sop-001",
    title: "Inter-House Athletics Championship Gala",
    date: "24 Oct 2026",
    time: "09:00 AM - 16:00 PM",
    venue: "Kasarani Sports Complex",
    category: "SPORTS",
  },
  {
    id: "ev-3",
    schoolId: "school-sop-001",
    title: "Board of Governors & PTA Financial Review AGM",
    date: "05 Nov 2026",
    time: "10:00 AM - 12:30 PM",
    venue: "Executive Boardroom",
    category: "GOVERNANCE",
  },
];

const timetableCollection = getPersistentCollection<TimetableSlot>("timetable", () => INITIAL_TIMETABLE_SLOTS);
const transportCollection = getPersistentCollection<TransportRouteItem>("transport", () => INITIAL_TRANSPORT_ROUTES);
const disciplineCollection = getPersistentCollection<DisciplineCaseItem>("discipline", () => INITIAL_DISCIPLINE_CASES);
const staffCollection = getPersistentCollection<StaffMember>("staff", () => INITIAL_STAFF_MEMBERS);
const eventsCollection = getPersistentCollection<SchoolEventItem>("events", () => INITIAL_EVENTS);

export class AdministrationService {
  /**
   * Retrieves timetable slots for a school tenant, with optional class filter
   */
  static async getTimetable(schoolId: string, className?: string): Promise<TimetableSlot[]> {
    let slots = timetableCollection.getAll().filter((s) => s.schoolId === schoolId);
    if (className) {
      slots = slots.filter((s) => s.className === className);
    }
    return slots;
  }

  /**
   * Adds or updates a timetable slot with strict conflict / clash detection.
   * Prevents teacher double-booking and room overlap.
   */
  static async scheduleTimetableSlot(
    slotData: Omit<TimetableSlot, "id"> & { id?: string }
  ): Promise<TimetableSlot> {
    const slotId = slotData.id || `tt-${Date.now()}`;
    const allSlots = timetableCollection.getAll();

    // 1. Check Teacher Conflict (Teacher double-booked at same day + period)
    const teacherConflict = allSlots.find(
      (s) =>
        s.schoolId === slotData.schoolId &&
        s.dayOfWeek === slotData.dayOfWeek &&
        s.period === slotData.period &&
        s.teacherName.toLowerCase() === slotData.teacherName.toLowerCase() &&
        s.id !== slotId
    );

    if (teacherConflict) {
      throw new Error(
        `TIMETABLE_TEACHER_CONFLICT: Teacher '${slotData.teacherName}' is already scheduled for ${teacherConflict.className} ${teacherConflict.streamName} (${teacherConflict.subject}) in ${teacherConflict.room} on ${slotData.dayOfWeek} Period ${slotData.period}.`
      );
    }

    // 2. Check Room Conflict (Room double-booked at same day + period)
    const roomConflict = allSlots.find(
      (s) =>
        s.schoolId === slotData.schoolId &&
        s.dayOfWeek === slotData.dayOfWeek &&
        s.period === slotData.period &&
        s.room.toLowerCase() === slotData.room.toLowerCase() &&
        s.id !== slotId
    );

    if (roomConflict) {
      throw new Error(
        `TIMETABLE_ROOM_CONFLICT: Room '${slotData.room}' is already allocated to ${roomConflict.className} ${roomConflict.streamName} (${roomConflict.subject}) with ${roomConflict.teacherName} on ${slotData.dayOfWeek} Period ${slotData.period}.`
      );
    }

    const newSlot: TimetableSlot = {
      id: slotId,
      ...slotData,
    };

    const existing = timetableCollection.getById(slotId);
    if (existing) {
      timetableCollection.update(slotId, newSlot);
    } else {
      timetableCollection.insert(newSlot);
    }

    return newSlot;
  }

  /**
   * Removes a timetable slot by ID
   */
  static async deleteTimetableSlot(id: string): Promise<boolean> {
    return timetableCollection.delete(id);
  }

  /**
   * Retrieves school bus routes and vehicle capacity data
   */
  static async getTransportRoutes(schoolId: string): Promise<TransportRouteItem[]> {
    return transportCollection.getAll().filter((r) => r.schoolId === schoolId);
  }

  /**
   * Retrieves pastoral care and discipline cases
   */
  static async getDisciplineCases(schoolId: string, status?: string): Promise<DisciplineCaseItem[]> {
    let cases = disciplineCollection.getAll().filter((c) => c.schoolId === schoolId);
    if (status && status !== "ALL") {
      cases = cases.filter((c) => c.status === status);
    }
    return cases;
  }

  /**
   * Logs a new pastoral/disciplinary incident
   */
  static async logDisciplineCase(
    data: Omit<DisciplineCaseItem, "id" | "date"> & { date?: string }
  ): Promise<DisciplineCaseItem> {
    const newCase: DisciplineCaseItem = {
      id: `disc-${Date.now()}`,
      ...data,
      date: data.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };

    disciplineCollection.insert(newCase);
    return newCase;
  }

  /**
   * Retrieves all staff/faculty members for a school tenant
   */
  static async getStaff(schoolId: string): Promise<StaffMember[]> {
    return staffCollection.getAll().filter((s) => s.schoolId === schoolId);
  }

  /**
   * Adds a new staff member to the persistent faculty directory
   */
  static async addStaff(
    data: Omit<StaffMember, "id"> & { id?: string }
  ): Promise<StaffMember> {
    const newStaff: StaffMember = {
      id: data.id || `st-${Date.now()}`,
      ...data,
    };
    staffCollection.insert(newStaff);
    return newStaff;
  }

  /**
   * Retrieves all school calendar events for a school tenant
   */
  static async getEvents(schoolId: string): Promise<SchoolEventItem[]> {
    return eventsCollection.getAll().filter((e) => e.schoolId === schoolId);
  }

  /**
   * Adds an event to the school master calendar
   */
  static async addEvent(
    data: Omit<SchoolEventItem, "id"> & { id?: string }
  ): Promise<SchoolEventItem> {
    const newEv: SchoolEventItem = {
      id: data.id || `ev-${Date.now()}`,
      ...data,
    };
    eventsCollection.insert(newEv);
    return newEv;
  }
}
