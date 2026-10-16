export interface ClassItem {
  id: string;
  name: string; // "Grade 8", "Year 10", etc.
  gradeLevel: number;
  academicYear: string;
  term: string;
  classTeacher: string;
  curriculum: "CBC" | "Cambridge International";
  streams: Array<{
    id: string;
    name: string; // "East", "West", "North"
    capacity: number;
    currentEnrolled: number;
    streamTeacher: string;
  }>;
}

export interface SubjectItem {
  id: string;
  code: string; // "MAT-101", "ENG-101", "SCI-102"
  name: string;
  department: "Mathematics" | "Languages" | "Sciences" | "Humanities" | "Creative Arts & Tech";
  curriculum: "CBC" | "Cambridge International";
  gradeLevels: string[];
  headTeacher: string;
  periodsPerWeek: number;
  description: string;
  syllabusOverview: string;
}

export interface ExamRecord {
  id: string;
  name: string; // "Term 1 Mid-Term 2026", "Term 1 CAT 1"
  examType: "CAT" | "MIDTERM" | "FINALS" | "MOCK";
  academicYear: string;
  term: string;
  classId: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  maxMarks: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalStudentsSat: number;
}

export const CLASSES_DATA: ClassItem[] = [
  {
    id: "cls-1",
    name: "Grade 7",
    gradeLevel: 7,
    academicYear: "2026",
    term: "Term 1",
    classTeacher: "James Mutua",
    curriculum: "CBC",
    streams: [
      { id: "st-7-east", name: "East", capacity: 35, currentEnrolled: 28, streamTeacher: "James Mutua" },
      { id: "st-7-west", name: "West", capacity: 35, currentEnrolled: 30, streamTeacher: "Beatrice Wanjala" },
      { id: "st-7-north", name: "North", capacity: 35, currentEnrolled: 26, streamTeacher: "Paul Koech" },
    ],
  },
  {
    id: "cls-2",
    name: "Grade 8",
    gradeLevel: 8,
    academicYear: "2026",
    term: "Term 1",
    classTeacher: "Sarah Wanjiku",
    curriculum: "CBC",
    streams: [
      { id: "st-8-east", name: "East", capacity: 35, currentEnrolled: 32, streamTeacher: "Sarah Wanjiku" },
      { id: "st-8-west", name: "West", capacity: 35, currentEnrolled: 29, streamTeacher: "Dennis Njoroge" },
      { id: "st-8-north", name: "North", capacity: 35, currentEnrolled: 28, streamTeacher: "Faith Ndinda" },
    ],
  },
  {
    id: "cls-3",
    name: "Grade 9",
    gradeLevel: 9,
    academicYear: "2026",
    term: "Term 1",
    classTeacher: "Grace Kilonzo",
    curriculum: "CBC",
    streams: [
      { id: "st-9-east", name: "East", capacity: 35, currentEnrolled: 31, streamTeacher: "Grace Kilonzo" },
      { id: "st-9-west", name: "West", capacity: 35, currentEnrolled: 31, streamTeacher: "Kevin Oduor" },
    ],
  },
  {
    id: "cls-4",
    name: "Year 10",
    gradeLevel: 10,
    academicYear: "2026",
    term: "Term 1",
    classTeacher: "Brian Odhiambo",
    curriculum: "Cambridge International",
    streams: [
      { id: "st-10-alpha", name: "Alpha", capacity: 25, currentEnrolled: 23, streamTeacher: "Brian Odhiambo" },
      { id: "st-10-beta", name: "Beta", capacity: 25, currentEnrolled: 22, streamTeacher: "Lucy Mwende" },
    ],
  },
  {
    id: "cls-5",
    name: "Year 11 (IGCSE)",
    gradeLevel: 11,
    academicYear: "2026",
    term: "Term 1",
    classTeacher: "Esther Chebet",
    curriculum: "Cambridge International",
    streams: [
      { id: "st-11-alpha", name: "Alpha", capacity: 25, currentEnrolled: 21, streamTeacher: "Esther Chebet" },
      { id: "st-11-beta", name: "Beta", capacity: 25, currentEnrolled: 21, streamTeacher: "Victor Kiprono" },
    ],
  },
];

export const SUBJECTS_DATA: SubjectItem[] = [
  {
    id: "sub-1",
    code: "MAT-101",
    name: "Mathematics",
    department: "Mathematics",
    curriculum: "CBC",
    gradeLevels: ["Grade 7", "Grade 8", "Grade 9"],
    headTeacher: "Sarah Wanjiku",
    periodsPerWeek: 6,
    description: "Core numerical concepts, algebraic equations, geometry, statistics and financial literacy.",
    syllabusOverview: "CBC Strand 1: Numbers & Operations; Strand 2: Algebra & Functions; Strand 3: Measurements & Geometry.",
  },
  {
    id: "sub-2",
    code: "ENG-101",
    name: "English Language & Literature",
    department: "Languages",
    curriculum: "CBC",
    gradeLevels: ["Grade 7", "Grade 8", "Grade 9"],
    headTeacher: "Grace Kilonzo",
    periodsPerWeek: 5,
    description: "Creative writing, grammar mechanics, literary analysis, public speaking and poetry.",
    syllabusOverview: "CBC Strand 1: Listening & Speaking; Strand 2: Reading Comprehension; Strand 3: Writing Composition.",
  },
  {
    id: "sub-3",
    code: "SCI-102",
    name: "Integrated Science",
    department: "Sciences",
    curriculum: "CBC",
    gradeLevels: ["Grade 7", "Grade 8", "Grade 9"],
    headTeacher: "Sarah Wanjiku",
    periodsPerWeek: 5,
    description: "Foundational biology, physical chemistry, physics fundamentals and experimental laboratory techniques.",
    syllabusOverview: "CBC Strand 1: Living Things & Environment; Strand 2: Matter & Energy; Strand 3: Earth & Space.",
  },
  {
    id: "sub-4",
    code: "KIS-104",
    name: "Kiswahili",
    department: "Languages",
    curriculum: "CBC",
    gradeLevels: ["Grade 7", "Grade 8", "Grade 9"],
    headTeacher: "Esther Chebet",
    periodsPerWeek: 4,
    description: "Sarufi, Insha, Fasihi simulizi na ufahamu wa kina.",
    syllabusOverview: "CBC Strand 1: Kusikiliza na Kuzungumza; Strand 2: Kusoma; Strand 3: Kuandika.",
  },
  {
    id: "sub-5",
    code: "SST-103",
    name: "Social Studies & Life Skills",
    department: "Humanities",
    curriculum: "CBC",
    gradeLevels: ["Grade 7", "Grade 8", "Grade 9"],
    headTeacher: "James Mutua",
    periodsPerWeek: 4,
    description: "East African geography, Kenyan civic history, global governance and ethics.",
    syllabusOverview: "CBC Strand 1: Natural Environment; Strand 2: People & Population; Strand 3: Governance & Citizenship.",
  },
  {
    id: "sub-6",
    code: "CAM-PHY",
    name: "Cambridge IGCSE Physics (0625)",
    department: "Sciences",
    curriculum: "Cambridge International",
    gradeLevels: ["Year 10", "Year 11 (IGCSE)"],
    headTeacher: "Victor Kiprono",
    periodsPerWeek: 5,
    description: "Classical mechanics, thermal physics, wave mechanics, electricity and nuclear physics.",
    syllabusOverview: "Cambridge Assessment International Education: Core and Extended syllabus for papers 2, 4, and 6.",
  },
  {
    id: "sub-7",
    code: "CAM-CHM",
    name: "Cambridge IGCSE Chemistry (0620)",
    department: "Sciences",
    curriculum: "Cambridge International",
    gradeLevels: ["Year 10", "Year 11 (IGCSE)"],
    headTeacher: "Brian Odhiambo",
    periodsPerWeek: 5,
    description: "States of matter, stoichiometry, organic chemistry, electrochemistry, and experimental analysis.",
    syllabusOverview: "Cambridge Assessment International Education: Papers 2, 4, and 6.",
  },
];

export const EXAMS_DATA: ExamRecord[] = [
  {
    id: "ex-1",
    name: "Term 1 Mid-Term Examination 2026",
    examType: "MIDTERM",
    academicYear: "2026",
    term: "Term 1",
    classId: "cls-2",
    className: "Grade 8",
    subjectCode: "MAT-101",
    subjectName: "Mathematics",
    date: "02 Oct 2026",
    maxMarks: 100,
    averageScore: 71.4,
    highestScore: 94.0,
    lowestScore: 42.0,
    totalStudentsSat: 79,
  },
  {
    id: "ex-2",
    name: "Term 1 Mid-Term Examination 2026",
    examType: "MIDTERM",
    academicYear: "2026",
    term: "Term 1",
    classId: "cls-2",
    className: "Grade 8",
    subjectCode: "SCI-102",
    subjectName: "Integrated Science",
    date: "03 Oct 2026",
    maxMarks: 100,
    averageScore: 74.2,
    highestScore: 96.0,
    lowestScore: 48.0,
    totalStudentsSat: 79,
  },
  {
    id: "ex-3",
    name: "Term 1 CAT 1 Evaluation 2026",
    examType: "CAT",
    academicYear: "2026",
    term: "Term 1",
    classId: "cls-2",
    className: "Grade 8",
    subjectCode: "ENG-101",
    subjectName: "English Language & Lit",
    date: "18 Sep 2026",
    maxMarks: 50,
    averageScore: 38.6,
    highestScore: 48.0,
    lowestScore: 24.0,
    totalStudentsSat: 79,
  },
];
