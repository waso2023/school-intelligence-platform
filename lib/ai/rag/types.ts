export interface DocumentChunk {
  id: string;
  documentId: string;
  schoolId: string;
  title: string;
  category: "ACADEMICS" | "ATTENDANCE" | "FINANCE" | "DISCIPLINE" | "ADMINISTRATION";
  section: string;
  content: string;
  keywords: string[];
  lastUpdated: string;
}

export interface RAGSearchResult {
  chunk: DocumentChunk;
  score: number; // 0 to 1
  matchedKeywords: string[];
}

export interface DocumentUploadPayload {
  title: string;
  category: "ACADEMICS" | "ATTENDANCE" | "FINANCE" | "DISCIPLINE" | "ADMINISTRATION";
  rawText: string;
  section?: string;
}
