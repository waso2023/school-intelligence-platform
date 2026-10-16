export interface StudentProfile {
  id: string;
  schoolId: string;
  admissionNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  photoUrl: string;
  admissionDate: string;
  status: "ACTIVE" | "GRADUATED" | "TRANSFERRED" | "SUSPENDED" | "INACTIVE";
  classId: string;
  className: string;
  streamId: string;
  streamName: string;
  curriculum: "CBC" | "Cambridge International";

  // Contact & Emergency
  address: string;
  county: string;
  medicalInfo: {
    bloodGroup: string;
    allergies: string[];
    chronicConditions?: string;
    emergencyDoctor: string;
    emergencyPhone: string;
  };

  // Parent / Guardian
  parent: {
    id: string;
    fullName: string;
    relationship: "Father" | "Mother" | "Guardian";
    phone: string;
    email: string;
    occupation: string;
    address: string;
  };

  // Academic Summary
  academic: {
    currentTermAverage: number;
    previousTermAverage: number;
    trend: "UP" | "DOWN" | "STABLE";
    rank: number;
    totalInClass: number;
    subjectGrades: Array<{
      subjectCode: string;
      subjectName: string;
      teacher: string;
      term1Cat: number;
      term1Mid: number;
      term1Final: number;
      grade: string;
      remarks: string;
    }>;
    termTrends: Array<{
      term: string;
      average: number;
      classAverage: number;
    }>;
  };

  // Attendance Summary
  attendance: {
    rate: number;
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    warningThresholdTriggered: boolean;
    recentLogs: Array<{
      date: string;
      status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
      remarks?: string;
    }>;
  };

  // Fees Summary
  fees: {
    expectedAmount: number;
    paidAmount: number;
    balance: number;
    status: "PAID" | "PARTIALLY_PAID" | "OUTSTANDING" | "OVERDUE";
    dueDate: string;
    transactions: Array<{
      id: string;
      receiptNumber: string;
      amount: number;
      method: "MPESA" | "BANK" | "CASH" | "CARD";
      reference: string;
      date: string;
      balanceAfter: number;
    }>;
  };

  // Discipline Records
  discipline: Array<{
    id: string;
    date: string;
    type: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    description: string;
    actionTaken: string;
    reportedBy: string;
    status: "RESOLVED" | "UNDER_REVIEW";
  }>;

  // Documents
  documents: Array<{
    id: string;
    name: string;
    type: string;
    fileSize: string;
    uploadedAt: string;
    url: string;
  }>;

  // Communication History
  communications: Array<{
    id: string;
    date: string;
    channel: "SMS" | "WHATSAPP" | "EMAIL";
    recipient: string;
    subject: string;
    body: string;
    status: "DELIVERED" | "SENT" | "READ";
  }>;
}

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: "std-001",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0082",
    firstName: "Kevin",
    middleName: "Mwangi",
    lastName: "Kimani",
    dateOfBirth: "2012-05-14",
    gender: "Male",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
    admissionDate: "2024-01-08",
    status: "ACTIVE",
    classId: "cls-2",
    className: "Grade 8",
    streamId: "st-east",
    streamName: "East",
    curriculum: "CBC",
    address: "Hardy Estate, Karen, Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "O+",
      allergies: ["Peanuts (Mild)"],
      chronicConditions: "None",
      emergencyDoctor: "Dr. Mutua (Karen Hospital)",
      emergencyPhone: "+254 722 999 111",
    },
    parent: {
      id: "par-1",
      fullName: "David Kimani",
      relationship: "Father",
      phone: "+254 722 500 005",
      email: "parent.david@sopacademy.ac.ke",
      occupation: "Senior Structural Engineer",
      address: "Hardy Estate, Karen, Nairobi",
    },
    academic: {
      currentTermAverage: 76.5,
      previousTermAverage: 78.0,
      trend: "STABLE",
      rank: 6,
      totalInClass: 38,
      subjectGrades: [
        {
          subjectCode: "MAT-101",
          subjectName: "Mathematics",
          teacher: "Sarah Wanjiku",
          term1Cat: 82,
          term1Mid: 78,
          term1Final: 79,
          grade: "A-",
          remarks: "Strong problem solving skills in algebra",
        },
        {
          subjectCode: "ENG-101",
          subjectName: "English Language & Lit",
          teacher: "Grace Kilonzo",
          term1Cat: 75,
          term1Mid: 74,
          term1Final: 76,
          grade: "B+",
          remarks: "Good composition structure and comprehension",
        },
        {
          subjectCode: "SCI-102",
          subjectName: "Integrated Science",
          teacher: "Sarah Wanjiku",
          term1Cat: 85,
          term1Mid: 80,
          term1Final: 82,
          grade: "A-",
          remarks: "Excellent grasp of laboratory experiments",
        },
        {
          subjectCode: "SST-103",
          subjectName: "Social Studies & CRE",
          teacher: "James Mutua",
          term1Cat: 70,
          term1Mid: 68,
          term1Final: 71,
          grade: "B",
          remarks: "Consistent effort shown",
        },
        {
          subjectCode: "KIS-104",
          subjectName: "Kiswahili",
          teacher: "Esther Chebet",
          term1Cat: 74,
          term1Mid: 72,
          term1Final: 74,
          grade: "B+",
          remarks: "Insha na Sarufi vizuri sana",
        },
      ],
      termTrends: [
        { term: "2025 Term 1", average: 74.0, classAverage: 69.5 },
        { term: "2025 Term 2", average: 77.2, classAverage: 70.1 },
        { term: "2025 Term 3", average: 78.0, classAverage: 71.4 },
        { term: "2026 Term 1 (Current)", average: 76.5, classAverage: 71.8 },
      ],
    },
    attendance: {
      rate: 96.8,
      totalDays: 31,
      present: 30,
      absent: 0,
      late: 1,
      excused: 1,
      warningThresholdTriggered: false,
      recentLogs: [
        { date: "08 Oct 2026", status: "PRESENT", remarks: "On time via Route 2 Bus" },
        { date: "07 Oct 2026", status: "PRESENT" },
        { date: "06 Oct 2026", status: "LATE", remarks: "Arrived at 08:15 AM due to traffic" },
        { date: "05 Oct 2026", status: "PRESENT" },
        { date: "02 Oct 2026", status: "EXCUSED", remarks: "Dental clinic visit" },
        { date: "01 Oct 2026", status: "PRESENT" },
      ],
    },
    fees: {
      expectedAmount: 85000,
      paidAmount: 60000,
      balance: 25000,
      status: "PARTIALLY_PAID",
      dueDate: "2026-10-25",
      transactions: [
        {
          id: "tx-1",
          receiptNumber: "REC-2026-0089",
          amount: 60000,
          method: "MPESA",
          reference: "QWE89284KL",
          date: "07 Oct 2026",
          balanceAfter: 25000,
        },
      ],
    },
    discipline: [
      {
        id: "disc-1",
        date: "12 Sep 2026",
        type: "Class Distraction",
        severity: "LOW",
        description: "Engaging in talking during private study period.",
        actionTaken: "Verbal reminder by Teacher Sarah Wanjiku. Remedial task assigned.",
        reportedBy: "Sarah Wanjiku",
        status: "RESOLVED",
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "Birth Certificate & Immunization Record.pdf",
        type: "application/pdf",
        fileSize: "1.4 MB",
        uploadedAt: "08 Jan 2024",
        url: "#",
      },
      {
        id: "doc-2",
        name: "Previous School Transfer Clearance.pdf",
        type: "application/pdf",
        fileSize: "850 KB",
        uploadedAt: "08 Jan 2024",
        url: "#",
      },
      {
        id: "doc-3",
        name: "Term 3 2025 Official Report Card.pdf",
        type: "application/pdf",
        fileSize: "520 KB",
        uploadedAt: "25 Nov 2025",
        url: "#",
      },
    ],
    communications: [
      {
        id: "comm-1",
        date: "07 Oct 2026, 14:25",
        channel: "SMS",
        recipient: "+254 722 500 005",
        subject: "Fee Receipt Confirmation",
        body: "Dear David, payment of KSh 60,000 for Kevin Kimani (Adm SOP-2024-0082) received via M-Pesa Ref QWE89284KL. Outstanding balance: KSh 25,000.",
        status: "DELIVERED",
      },
      {
        id: "comm-2",
        date: "01 Oct 2026, 09:00",
        channel: "EMAIL",
        recipient: "parent.david@sopacademy.ac.ke",
        subject: "Grade 8 Mid-Term Assessment Calendar",
        body: "Dear Mr. Kimani, please find the mid-term examination timetable attached for Grade 8 East.",
        status: "READ",
      },
    ],
  },
  {
    id: "std-002",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0083",
    firstName: "Amani",
    middleName: "Joy",
    lastName: "Otieno",
    dateOfBirth: "2012-08-20",
    gender: "Female",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    admissionDate: "2024-01-08",
    status: "ACTIVE",
    classId: "cls-2",
    className: "Grade 8",
    streamId: "st-east",
    streamName: "East",
    curriculum: "CBC",
    address: "Lavington Green, Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "A+",
      allergies: ["None known"],
      chronicConditions: "Asthma (Mild, uses Ventolin inhaler)",
      emergencyDoctor: "Dr. Omondi (Aga Khan Clinic)",
      emergencyPhone: "+254 722 888 222",
    },
    parent: {
      id: "par-2",
      fullName: "Grace Otieno",
      relationship: "Mother",
      phone: "+254 722 500 012",
      email: "grace.otieno@gmail.com",
      occupation: "Managing Director, Apex Law",
      address: "Lavington Green, Nairobi",
    },
    academic: {
      currentTermAverage: 84.2,
      previousTermAverage: 82.5,
      trend: "UP",
      rank: 2,
      totalInClass: 38,
      subjectGrades: [
        {
          subjectCode: "MAT-101",
          subjectName: "Mathematics",
          teacher: "Sarah Wanjiku",
          term1Cat: 88,
          term1Mid: 85,
          term1Final: 87,
          grade: "A",
          remarks: "Exceptional mathematical thinking",
        },
        {
          subjectCode: "ENG-101",
          subjectName: "English Language & Lit",
          teacher: "Grace Kilonzo",
          term1Cat: 86,
          term1Mid: 84,
          term1Final: 85,
          grade: "A",
          remarks: "Top-tier prose and oratory skills",
        },
        {
          subjectCode: "SCI-102",
          subjectName: "Integrated Science",
          teacher: "Sarah Wanjiku",
          term1Cat: 84,
          term1Mid: 82,
          term1Final: 83,
          grade: "A",
          remarks: "Meticulous lab reports and scientific curiosity",
        },
      ],
      termTrends: [
        { term: "2025 Term 1", average: 80.5, classAverage: 69.5 },
        { term: "2025 Term 2", average: 81.8, classAverage: 70.1 },
        { term: "2025 Term 3", average: 82.5, classAverage: 71.4 },
        { term: "2026 Term 1 (Current)", average: 84.2, classAverage: 71.8 },
      ],
    },
    attendance: {
      rate: 98.5,
      totalDays: 31,
      present: 31,
      absent: 0,
      late: 0,
      excused: 0,
      warningThresholdTriggered: false,
      recentLogs: [
        { date: "08 Oct 2026", status: "PRESENT" },
        { date: "07 Oct 2026", status: "PRESENT" },
        { date: "06 Oct 2026", status: "PRESENT" },
      ],
    },
    fees: {
      expectedAmount: 85000,
      paidAmount: 85000,
      balance: 0,
      status: "PAID",
      dueDate: "2026-10-25",
      transactions: [
        {
          id: "tx-2",
          receiptNumber: "REC-2026-0088",
          amount: 85000,
          method: "BANK",
          reference: "KCB-TXN-902188",
          date: "06 Oct 2026",
          balanceAfter: 0,
        },
      ],
    },
    discipline: [],
    documents: [],
    communications: [],
  },
  {
    id: "std-003",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0084",
    firstName: "Zawadi",
    middleName: "Nyambura",
    lastName: "Muthoni",
    dateOfBirth: "2012-11-03",
    gender: "Female",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
    admissionDate: "2024-01-08",
    status: "ACTIVE",
    classId: "cls-2",
    className: "Grade 8",
    streamId: "st-west",
    streamName: "West",
    curriculum: "CBC",
    address: "Kileleshwa, Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "B+",
      allergies: ["Penicillin"],
      chronicConditions: "Migraines",
      emergencyDoctor: "Dr. Kariuki (Nairobi Hospital)",
      emergencyPhone: "+254 722 777 333",
    },
    parent: {
      id: "par-3",
      fullName: "Joseph Muthoni",
      relationship: "Father",
      phone: "+254 722 500 019",
      email: "joseph.muthoni@yahoo.com",
      occupation: "Financial Analyst",
      address: "Kileleshwa, Nairobi",
    },
    academic: {
      currentTermAverage: 61.0,
      previousTermAverage: 74.0,
      trend: "DOWN", // Flagged by AI Risk Engine!
      rank: 29,
      totalInClass: 38,
      subjectGrades: [
        {
          subjectCode: "MAT-101",
          subjectName: "Mathematics",
          teacher: "Sarah Wanjiku",
          term1Cat: 64,
          term1Mid: 58,
          term1Final: 59,
          grade: "C",
          remarks: "Struggling with quadratic formulations. Needs remedial help.",
        },
        {
          subjectCode: "SCI-102",
          subjectName: "Integrated Science",
          teacher: "Sarah Wanjiku",
          term1Cat: 65,
          term1Mid: 62,
          term1Final: 63,
          grade: "C+",
          remarks: "Missed two lab sessions. Revision required.",
        },
      ],
      termTrends: [
        { term: "2025 Term 1", average: 75.0, classAverage: 69.5 },
        { term: "2025 Term 2", average: 73.5, classAverage: 70.1 },
        { term: "2025 Term 3", average: 74.0, classAverage: 71.4 },
        { term: "2026 Term 1 (Current)", average: 61.0, classAverage: 71.8 },
      ],
    },
    attendance: {
      rate: 87.4, // Warning threshold triggered!
      totalDays: 31,
      present: 27,
      absent: 3,
      late: 1,
      excused: 0,
      warningThresholdTriggered: true,
      recentLogs: [
        { date: "08 Oct 2026", status: "ABSENT", remarks: "Unexcused absence" },
        { date: "07 Oct 2026", status: "ABSENT", remarks: "Unexcused absence" },
        { date: "06 Oct 2026", status: "PRESENT" },
        { date: "05 Oct 2026", status: "LATE" },
      ],
    },
    fees: {
      expectedAmount: 85000,
      paidAmount: 40000,
      balance: 45000,
      status: "OUTSTANDING",
      dueDate: "2026-10-15",
      transactions: [],
    },
    discipline: [
      {
        id: "disc-2",
        date: "04 Oct 2026",
        type: "Unexcused Absence",
        severity: "MEDIUM",
        description: "Absent for 2 consecutive days without prior parental note.",
        actionTaken: "Parent called by Class Teacher Sarah. Conference requested.",
        reportedBy: "Sarah Wanjiku",
        status: "UNDER_REVIEW",
      },
    ],
    documents: [],
    communications: [
      {
        id: "comm-3",
        date: "08 Oct 2026, 09:15",
        channel: "SMS",
        recipient: "+254 722 500 019",
        subject: "Attendance Alert",
        body: "Dear Mr. Muthoni, Zawadi was recorded absent today without notification. Please contact the school reception.",
        status: "DELIVERED",
      },
    ],
  },
  {
    id: "std-004",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0085",
    firstName: "Jabari",
    middleName: "Kip",
    lastName: "Kiprono",
    dateOfBirth: "2013-02-17",
    gender: "Male",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    admissionDate: "2024-01-08",
    status: "ACTIVE",
    classId: "cls-1",
    className: "Grade 7",
    streamId: "st-north",
    streamName: "North",
    curriculum: "CBC",
    address: "Runda Estate, Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "O+",
      allergies: [],
      emergencyDoctor: "Dr. Kiptoo",
      emergencyPhone: "+254 722 111 444",
    },
    parent: {
      id: "par-4",
      fullName: "Faith Kiprono",
      relationship: "Mother",
      phone: "+254 722 500 033",
      email: "faith.kiprono@gmail.com",
      occupation: "Diplomat, UN-Habitat",
      address: "Runda Estate, Nairobi",
    },
    academic: {
      currentTermAverage: 79.8,
      previousTermAverage: 78.5,
      trend: "UP",
      rank: 4,
      totalInClass: 36,
      subjectGrades: [],
      termTrends: [
        { term: "2025 Term 3", average: 78.5, classAverage: 70.0 },
        { term: "2026 Term 1", average: 79.8, classAverage: 71.2 },
      ],
    },
    attendance: {
      rate: 95.1,
      totalDays: 31,
      present: 29,
      absent: 1,
      late: 1,
      excused: 0,
      warningThresholdTriggered: false,
      recentLogs: [],
    },
    fees: {
      expectedAmount: 85000,
      paidAmount: 85000,
      balance: 0,
      status: "PAID",
      dueDate: "2026-10-25",
      transactions: [],
    },
    discipline: [],
    documents: [],
    communications: [],
  },
  {
    id: "std-005",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0086",
    firstName: "Imani",
    middleName: "Cherono",
    lastName: "Chebet",
    dateOfBirth: "2010-09-11",
    gender: "Female",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    admissionDate: "2024-01-08",
    status: "ACTIVE",
    classId: "cls-4",
    className: "Year 10",
    streamId: "st-alpha",
    streamName: "Alpha",
    curriculum: "Cambridge International",
    address: "Muthaiga, Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "A-",
      allergies: ["Latex"],
      emergencyDoctor: "Dr. Evans (MP Shah Hospital)",
      emergencyPhone: "+254 722 666 555",
    },
    parent: {
      id: "par-5",
      fullName: "Samuel Chebet",
      relationship: "Father",
      phone: "+254 722 500 041",
      email: "samuel.chebet@safari.com",
      occupation: "Managing Director",
      address: "Muthaiga, Nairobi",
    },
    academic: {
      currentTermAverage: 68.4,
      previousTermAverage: 78.0,
      trend: "DOWN",
      rank: 18,
      totalInClass: 25,
      subjectGrades: [],
      termTrends: [
        { term: "2025 Term 2", average: 76.0, classAverage: 72.0 },
        { term: "2025 Term 3", average: 78.0, classAverage: 73.1 },
        { term: "2026 Term 1", average: 68.4, classAverage: 72.5 },
      ],
    },
    attendance: {
      rate: 92.0,
      totalDays: 31,
      present: 28,
      absent: 2,
      late: 1,
      excused: 0,
      warningThresholdTriggered: false,
      recentLogs: [],
    },
    fees: {
      expectedAmount: 95000,
      paidAmount: 65000,
      balance: 30000,
      status: "PARTIALLY_PAID",
      dueDate: "2026-10-20",
      transactions: [],
    },
    discipline: [],
    documents: [],
    communications: [],
  },
  {
    id: "std-006",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0087",
    firstName: "Neema",
    middleName: "Wanjiku",
    lastName: "Njeri",
    dateOfBirth: "2013-04-12",
    gender: "Female",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
    admissionDate: "2024-01-08",
    status: "ACTIVE",
    classId: "cls-1",
    className: "Grade 7",
    streamId: "st-north",
    streamName: "North",
    curriculum: "CBC",
    address: "Westlands, Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "B+",
      allergies: [],
      emergencyDoctor: "Dr. Kilonzo",
      emergencyPhone: "+254 722 111 222",
    },
    parent: {
      id: "par-6",
      fullName: "Agnes Njeri",
      relationship: "Mother",
      phone: "+254 722 500 055",
      email: "agnes.njeri@gmail.com",
      occupation: "Architect",
      address: "Westlands, Nairobi",
    },
    academic: {
      currentTermAverage: 82.5,
      previousTermAverage: 80.0,
      trend: "UP",
      rank: 2,
      totalInClass: 36,
      subjectGrades: [],
      termTrends: [],
    },
    attendance: {
      rate: 98.4,
      totalDays: 31,
      present: 31,
      absent: 0,
      late: 0,
      excused: 0,
      warningThresholdTriggered: false,
      recentLogs: [{ date: "08 Oct 2026", status: "PRESENT" }],
    },
    fees: {
      expectedAmount: 85000,
      paidAmount: 85000,
      balance: 0,
      status: "PAID",
      dueDate: "2026-10-25",
      transactions: [],
    },
    discipline: [],
    documents: [],
    communications: [],
  },
  {
    id: "std-007",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0088",
    firstName: "Brian",
    middleName: "Kipkoech",
    lastName: "Kimutai",
    dateOfBirth: "2013-06-25",
    gender: "Male",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    admissionDate: "2024-01-08",
    status: "ACTIVE",
    classId: "cls-1",
    className: "Grade 7",
    streamId: "st-north",
    streamName: "North",
    curriculum: "CBC",
    address: "Kitisuru, Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "O+",
      allergies: [],
      emergencyDoctor: "Dr. Mutiso",
      emergencyPhone: "+254 722 333 444",
    },
    parent: {
      id: "par-7",
      fullName: "Philip Kimutai",
      relationship: "Father",
      phone: "+254 722 500 066",
      email: "philip.kimutai@yahoo.com",
      occupation: "Commercial Pilot",
      address: "Kitisuru, Nairobi",
    },
    academic: {
      currentTermAverage: 71.0,
      previousTermAverage: 75.0,
      trend: "DOWN",
      rank: 16,
      totalInClass: 36,
      subjectGrades: [],
      termTrends: [],
    },
    attendance: {
      rate: 93.5,
      totalDays: 31,
      present: 28,
      absent: 2,
      late: 1,
      excused: 0,
      warningThresholdTriggered: false,
      recentLogs: [{ date: "08 Oct 2026", status: "PRESENT" }],
    },
    fees: {
      expectedAmount: 85000,
      paidAmount: 60000,
      balance: 25000,
      status: "PARTIALLY_PAID",
      dueDate: "2026-10-25",
      transactions: [],
    },
    discipline: [],
    documents: [],
    communications: [],
  },
  {
    id: "std-008",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0089",
    firstName: "Dennis",
    middleName: "Kamau",
    lastName: "Mwangi",
    dateOfBirth: "2012-09-18",
    gender: "Male",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    admissionDate: "2024-01-08",
    status: "ACTIVE",
    classId: "cls-2",
    className: "Grade 8",
    streamId: "st-west",
    streamName: "West",
    curriculum: "CBC",
    address: "Kilimani, Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "A+",
      allergies: [],
      emergencyDoctor: "Dr. Kibet",
      emergencyPhone: "+254 722 444 555",
    },
    parent: {
      id: "par-8",
      fullName: "Lucy Mwangi",
      relationship: "Mother",
      phone: "+254 722 500 077",
      email: "lucy.mwangi@gmail.com",
      occupation: "HR Director",
      address: "Kilimani, Nairobi",
    },
    academic: {
      currentTermAverage: 73.2,
      previousTermAverage: 72.0,
      trend: "UP",
      rank: 14,
      totalInClass: 36,
      subjectGrades: [],
      termTrends: [],
    },
    attendance: {
      rate: 96.0,
      totalDays: 31,
      present: 30,
      absent: 1,
      late: 0,
      excused: 0,
      warningThresholdTriggered: false,
      recentLogs: [{ date: "08 Oct 2026", status: "PRESENT" }],
    },
    fees: {
      expectedAmount: 85000,
      paidAmount: 85000,
      balance: 0,
      status: "PAID",
      dueDate: "2026-10-25",
      transactions: [],
    },
    discipline: [],
    documents: [],
    communications: [],
  },
  {
    id: "std-009",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0090",
    firstName: "Baraka",
    middleName: "Chacha",
    lastName: "Mwita",
    dateOfBirth: "2011-03-10",
    gender: "Male",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
    admissionDate: "2024-01-08",
    status: "ACTIVE",
    classId: "cls-3",
    className: "Grade 9",
    streamId: "st-east",
    streamName: "East",
    curriculum: "CBC",
    address: "Riverside Drive, Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "O+",
      allergies: [],
      emergencyDoctor: "Dr. Ochieng",
      emergencyPhone: "+254 722 555 666",
    },
    parent: {
      id: "par-9",
      fullName: "Geoffrey Mwita",
      relationship: "Father",
      phone: "+254 722 500 088",
      email: "geoffrey.mwita@gmail.com",
      occupation: "Tech Lead",
      address: "Riverside Drive, Nairobi",
    },
    academic: {
      currentTermAverage: 79.4,
      previousTermAverage: 76.5,
      trend: "UP",
      rank: 4,
      totalInClass: 32,
      subjectGrades: [],
      termTrends: [],
    },
    attendance: {
      rate: 97.2,
      totalDays: 31,
      present: 30,
      absent: 1,
      late: 0,
      excused: 0,
      warningThresholdTriggered: false,
      recentLogs: [{ date: "08 Oct 2026", status: "PRESENT" }],
    },
    fees: {
      expectedAmount: 88000,
      paidAmount: 88000,
      balance: 0,
      status: "PAID",
      dueDate: "2026-10-25",
      transactions: [],
    },
    discipline: [],
    documents: [],
    communications: [],
  },
  {
    id: "std-010",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0091",
    firstName: "Liam",
    middleName: "Kip",
    lastName: "Kipkemboi",
    dateOfBirth: "2010-05-19",
    gender: "Male",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    admissionDate: "2024-01-08",
    status: "ACTIVE",
    classId: "cls-4",
    className: "Year 10",
    streamId: "st-alpha",
    streamName: "Alpha",
    curriculum: "Cambridge International",
    address: "Spring Valley, Nairobi",
    county: "Nairobi",
    medicalInfo: {
      bloodGroup: "A+",
      allergies: [],
      emergencyDoctor: "Dr. Patel",
      emergencyPhone: "+254 722 666 777",
    },
    parent: {
      id: "par-10",
      fullName: "Eunice Kipkemboi",
      relationship: "Mother",
      phone: "+254 722 500 099",
      email: "eunice.kipkemboi@gmail.com",
      occupation: "Senior Economist, World Bank",
      address: "Spring Valley, Nairobi",
    },
    academic: {
      currentTermAverage: 88.0,
      previousTermAverage: 85.5,
      trend: "UP",
      rank: 1,
      totalInClass: 25,
      subjectGrades: [],
      termTrends: [],
    },
    attendance: {
      rate: 99.0,
      totalDays: 31,
      present: 31,
      absent: 0,
      late: 0,
      excused: 0,
      warningThresholdTriggered: false,
      recentLogs: [{ date: "08 Oct 2026", status: "PRESENT" }],
    },
    fees: {
      expectedAmount: 95000,
      paidAmount: 95000,
      balance: 0,
      status: "PAID",
      dueDate: "2026-10-20",
      transactions: [],
    },
    discipline: [],
    documents: [],
    communications: [],
  },
];

import { getPersistentCollection } from "@/lib/db/persistentStore";

// Persistent Student Collection with automatic disk synchronization
const studentCollection = getPersistentCollection<StudentProfile>("students", () => INITIAL_STUDENTS);

export function getStudents(): StudentProfile[] {
  return studentCollection.getAll();
}

export function getStudentById(id: string): StudentProfile | undefined {
  return studentCollection.find((s) => s.id === id || s.admissionNumber === id);
}

export function addStudent(newStudent: StudentProfile): StudentProfile {
  return studentCollection.insert(newStudent);
}

export function updateStudent(id: string, updates: Partial<StudentProfile>): StudentProfile | null {
  const existing = getStudentById(id);
  if (!existing) return null;
  return studentCollection.update(existing.id, updates);
}

export function deleteStudent(id: string): boolean {
  return studentCollection.deleteWhere((s) => s.id === id || s.admissionNumber === id) > 0;
}

export function deleteStudents(ids: string[]): number {
  const idSet = new Set(ids);
  return studentCollection.deleteWhere((s) => idSet.has(s.id) || idSet.has(s.admissionNumber));
}
