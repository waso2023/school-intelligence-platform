import { DocumentChunk, RAGSearchResult } from "./types";

// Pre-seeded institutional knowledge base for SOP International Academy
const INITIAL_POLICY_DOCUMENTS: DocumentChunk[] = [
  {
    id: "chunk-acad-1",
    documentId: "pol-acad-2026",
    schoolId: "school-sop-001",
    title: "SOP Academic Assessment & Promotion Policy (2026)",
    category: "ACADEMICS",
    section: "Section 3.2: Assessment Weightings & Aggregation",
    content:
      "All academic term marks at SOP International Academy are calculated based on three components: Continuous Assessment Tests (CATs) contributing 30%, Mid-Term Examination contributing 30%, and End-of-Term Examination contributing 40%. The minimum pass mark for progression is 50%. Students scoring below 50% must be placed on an Academic Improvement Plan (AIP).",
    keywords: ["assessment", "weighting", "cat", "midterm", "finals", "pass mark", "50%", "promotion", "aip"],
    lastUpdated: "2026-01-15",
  },
  {
    id: "chunk-acad-2",
    documentId: "pol-acad-2026",
    schoolId: "school-sop-001",
    title: "SOP Academic Assessment & Promotion Policy (2026)",
    category: "ACADEMICS",
    section: "Section 4.1: CBC Performance Descriptors",
    content:
      "For junior secondary (Grades 7, 8, 9), learners are evaluated against CBC standards: Exceeding Expectations (EE, 80-100%), Meeting Expectations (ME, 60-79%), Approaching Expectations (AE, 40-59%), and Below Expectations (BE, 0-39%). Individual learner portfolios and project assessments form part of the CAT aggregate.",
    keywords: ["cbc", "exceeding expectations", "meeting expectations", "approaching", "below", "descriptors", "grade 7", "grade 8", "grade 9"],
    lastUpdated: "2026-01-15",
  },
  {
    id: "chunk-att-1",
    documentId: "pol-att-2026",
    schoolId: "school-sop-001",
    title: "SOP Attendance & Truancy Enforcement Guidelines",
    category: "ATTENDANCE",
    section: "Section 2.1: Minimum Attendance Threshold & Absence Protocols",
    content:
      "Students must maintain a minimum attendance rate of 90% per academic term to remain in good standing. Any student falling below 90% is classified as chronically absent. Unexcused consecutive absences exceeding 3 days require a mandatory formal parent conference with the Deputy Principal.",
    keywords: ["attendance", "truancy", "90%", "absent", "unexcused", "chronic absenteeism", "parent conference", "deputy principal"],
    lastUpdated: "2026-01-10",
  },
  {
    id: "chunk-fin-1",
    documentId: "pol-fin-2026",
    schoolId: "school-sop-001",
    title: "SOP Tuition Fees & Arrears Collection Policy",
    category: "FINANCE",
    section: "Section 5.3: Payment Deadlines & Clearance Cards",
    content:
      "Tuition fees must be paid in full or via an approved three-installment payment plan by the 5th week of the term. Accounts with outstanding arrears exceeding KSh 25,000 after Mid-Term break require financial clearance authorization from the Bursar/Finance Office before examination cards are issued.",
    keywords: ["fees", "arrears", "tuition", "clearance", "installment", "bursar", "examination card", "deadline", "25000"],
    lastUpdated: "2026-01-20",
  },
  {
    id: "chunk-disc-1",
    documentId: "pol-disc-2026",
    schoolId: "school-sop-001",
    title: "SOP Student Code of Conduct & Disciplinary Procedures",
    category: "DISCIPLINE",
    section: "Section 7.4: Progressive Discipline & Suspension Guidelines",
    content:
      "Disciplinary infractions are categorized into Minor (lateness, uniform violation), Moderate (defiance, repeated homework failure), and Major (bullying, substance possession, fighting). A student accumulating 3 moderate infractions within a term receives a formal warning letter. Major infractions require an immediate disciplinary committee hearing. Suspensions may only be authorized by the Principal or School Board.",
    keywords: ["discipline", "conduct", "suspension", "infraction", "bullying", "warning letter", "principal", "hearing", "committee"],
    lastUpdated: "2026-01-18",
  },
];

let chunksStore: DocumentChunk[] = [...INITIAL_POLICY_DOCUMENTS];

export class RAGDocumentService {
  /**
   * Retrieves all document chunks for a tenant
   */
  static async getDocuments(schoolId: string): Promise<DocumentChunk[]> {
    return chunksStore.filter((c) => c.schoolId === schoolId);
  }

  /**
   * Ingests a new document and chunks it
   */
  static async ingestDocument(
    schoolId: string,
    payload: {
      title: string;
      category: "ACADEMICS" | "ATTENDANCE" | "FINANCE" | "DISCIPLINE" | "ADMINISTRATION";
      rawText: string;
      section?: string;
    }
  ): Promise<DocumentChunk[]> {
    // Simple paragraph-based chunker
    const paragraphs = payload.rawText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 30);

    const newChunks: DocumentChunk[] = paragraphs.map((text, idx) => {
      const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3);
      const uniqueKeywords = Array.from(new Set(words)).slice(0, 15);

      return {
        id: `chunk-${Date.now()}-${idx}`,
        documentId: `doc-${Date.now()}`,
        schoolId,
        title: payload.title,
        category: payload.category,
        section: payload.section || `Section ${idx + 1}`,
        content: text,
        keywords: uniqueKeywords,
        lastUpdated: new Date().toISOString().split("T")[0],
      };
    });

    chunksStore.push(...newChunks);
    return newChunks;
  }

  /**
   * Performs semantic / keyword vector search against school policy chunks
   */
  static async searchPolicyKnowledge(
    schoolId: string,
    query: string,
    category?: string
  ): Promise<RAGSearchResult[]> {
    const schoolChunks = chunksStore.filter((c) => {
      if (c.schoolId !== schoolId) return false;
      if (category && category !== "ALL" && c.category !== category) return false;
      return true;
    });

    const queryTerms = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const scoredResults: RAGSearchResult[] = [];

    for (const chunk of schoolChunks) {
      let score = 0;
      const matchedKeywords: string[] = [];
      const contentLower = chunk.content.toLowerCase();
      const titleLower = chunk.title.toLowerCase();

      for (const term of queryTerms) {
        if (titleLower.includes(term)) {
          score += 0.4;
          matchedKeywords.push(term);
        }
        if (chunk.keywords.some((kw) => kw.includes(term))) {
          score += 0.35;
          matchedKeywords.push(term);
        }
        if (contentLower.includes(term)) {
          score += 0.25;
          matchedKeywords.push(term);
        }
      }

      if (score > 0.2) {
        scoredResults.push({
          chunk,
          score: Math.min(1.0, Math.round(score * 100) / 100),
          matchedKeywords: Array.from(new Set(matchedKeywords)),
        });
      }
    }

    return scoredResults.sort((a, b) => b.score - a.score);
  }
}
